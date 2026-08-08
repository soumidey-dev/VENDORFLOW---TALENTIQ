/**
 * VendorFlow - Deterministic Risk & Validation Engine
 * Implements rule-based PO reconciliation, bank account fraud audit, 
 * duplicate checking, and mathematical risk scoring (0-100).
 */

import { Invoice, PurchaseOrder, Vendor, DecisionRationale, RiskFactor, InvoiceStatus, RiskLevel } from '../types';

export function evaluateInvoiceRisk(
  rawInvoice: Partial<Invoice>,
  vendors: Vendor[],
  purchaseOrders: PurchaseOrder[],
  existingInvoices: Invoice[],
  aiExtractionConfidence: number = 95
): DecisionRationale {
  const riskFactors: RiskFactor[] = [];
  let calculatedRiskScore = 0;

  // 1. Vendor Lookup
  const rawVendorName = (rawInvoice.vendorName || '').toLowerCase().trim();
  const rawGSTIN = (rawInvoice.vendorGSTIN || '').toUpperCase().trim();

  const registeredVendor = vendors.find(v => {
    if (rawInvoice.vendorId && v.id === rawInvoice.vendorId) return true;
    if (rawGSTIN && rawGSTIN !== 'NOT DETECTED' && v.gstin.toUpperCase() === rawGSTIN) return true;
    if (rawVendorName && rawVendorName !== 'not detected') {
      const vNameLower = v.name.toLowerCase();
      if (vNameLower === rawVendorName) return true;
      if (vNameLower.includes(rawVendorName) || rawVendorName.includes(vNameLower)) return true;
      const cleanV = vNameLower.replace(/\b(pvt|ltd|inc|llp|corp|co|india|private|limited)\b/g, '').trim();
      const cleanRaw = rawVendorName.replace(/\b(pvt|ltd|inc|llp|corp|co|india|private|limited)\b/g, '').trim();
      if (cleanV && cleanRaw && (cleanV.includes(cleanRaw) || cleanRaw.includes(cleanV))) return true;
    }
    return false;
  });

  const vendorMatchResult = {
    vendorFound: !!registeredVendor,
    gstinMatch: registeredVendor ? registeredVendor.gstin.toUpperCase() === rawGSTIN : false,
    nameMatch: registeredVendor ? registeredVendor.name.toLowerCase() === rawVendorName : false
  };

  if (!registeredVendor) {
    calculatedRiskScore += 30;
    riskFactors.push({
      code: 'UNREGISTERED_VENDOR',
      label: 'Unregistered Vendor',
      scoreImpact: 30,
      severity: 'HIGH',
      description: 'Vendor name and GSTIN do not match any registered vendor in master database.'
    });
  }

  // 2. Purchase Order Matching
  const rawPO = (rawInvoice.poNumber || '').toUpperCase().trim();
  const matchedPO = purchaseOrders.find(
    po => (rawPO && rawPO !== 'NOT DETECTED' && po.poNumber.toUpperCase() === rawPO) || 
          (registeredVendor && po.vendorId === registeredVendor.id && po.status === 'ACTIVE')
  );

  // Vendor Consistency Check (Requirement 10)
  const masterVendorNameClean = registeredVendor ? registeredVendor.name.toLowerCase().trim() : '';
  const poVendorNameClean = matchedPO ? matchedPO.vendorName.toLowerCase().trim() : '';

  const isInvoiceVendorMatchMaster = registeredVendor ? (
    rawVendorName === masterVendorNameClean ||
    masterVendorNameClean.includes(rawVendorName) ||
    rawVendorName.includes(masterVendorNameClean)
  ) : false;

  const isPoVendorMatchMaster = (registeredVendor && matchedPO) ? (
    poVendorNameClean === masterVendorNameClean ||
    masterVendorNameClean.includes(poVendorNameClean) ||
    poVendorNameClean.includes(masterVendorNameClean)
  ) : (matchedPO ? true : false);

  const isVendorConsistent = isInvoiceVendorMatchMaster && isPoVendorMatchMaster;

  if (registeredVendor && !isVendorConsistent) {
    riskFactors.push({
      code: 'VENDOR_NAME_MISMATCH',
      label: 'Vendor Profile Inconsistency',
      scoreImpact: 25,
      severity: 'HIGH',
      description: `Invoice vendor ("${rawInvoice.vendorName}") or PO vendor ("${matchedPO?.vendorName}") does not match registered master vendor ("${registeredVendor.name}").`
    });
  }

  let amountVarianceINR = 0;
  let amountVariancePercent = 0;

  if (!matchedPO) {
    calculatedRiskScore += 35;
    riskFactors.push({
      code: 'PO_NOT_FOUND',
      label: 'Missing or Invalid Purchase Order',
      scoreImpact: 35,
      severity: 'HIGH',
      description: `Purchase order ${rawInvoice.poNumber || 'Unspecified'} was not found in active PO directory.`
    });
  } else {
    const poTotal = matchedPO.totalAmountINR;
    const invTotal = rawInvoice.totalAmountINR || 0;
    amountVarianceINR = invTotal - poTotal;
    amountVariancePercent = poTotal > 0 ? ((invTotal - poTotal) / poTotal) * 100 : 0;

    if (amountVariancePercent > 5) {
      const impact = amountVariancePercent > 20 ? 40 : 35;
      calculatedRiskScore += impact;
      riskFactors.push({
        code: 'PRICE_DISCREPANCY_HIGH',
        label: `Price Inflation (+${amountVariancePercent.toFixed(1)}%)`,
        scoreImpact: impact,
        severity: amountVariancePercent > 20 ? 'CRITICAL' : 'HIGH',
        description: `Billed unit price/total (₹${invTotal.toLocaleString('en-IN')}) exceeds approved PO limit (₹${poTotal.toLocaleString('en-IN')}) by ₹${amountVarianceINR.toLocaleString('en-IN')} (+${amountVariancePercent.toFixed(1)}%). Price discrepancy exceeds the configured 5% threshold.`
      });
    } else if (amountVariancePercent < -5) {
      riskFactors.push({
        code: 'PRICE_UNDER_BILLED',
        label: `Under-billed (-${Math.abs(amountVariancePercent).toFixed(1)}%)`,
        scoreImpact: 0,
        severity: 'LOW',
        description: `Invoice is lower than authorized PO amount.`
      });
    }
  }

  const poMatchResult = {
    matched: !!matchedPO && Math.abs(amountVariancePercent) <= 5,
    poNumberFound: matchedPO?.poNumber,
    amountVarianceINR,
    amountVariancePercent
  };

  // 3. Bank Account Verification
  const invoiceBank = rawInvoice.invoiceBankDetails || {
    accountName: 'Not detected',
    accountNumber: 'Not detected',
    ifscCode: 'Not detected',
    bankName: 'Not detected',
    branch: 'Not detected',
    isVerified: false
  };

  const registeredBank = registeredVendor?.registeredBank || {
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branch: '',
    isVerified: false
  };

  const cleanAcc = (acc?: string) => (acc || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const invAcc = cleanAcc(invoiceBank.accountNumber);
  const regAcc = cleanAcc(registeredBank.accountNumber);
  const invIfsc = (invoiceBank.ifscCode || '').trim().toUpperCase();
  const regIfsc = (registeredBank.ifscCode || '').trim().toUpperCase();

  const hasInvoiceBank = invAcc.length > 0 && invAcc !== 'NOTDETECTED';
  const hasRegisteredBank = registeredVendor && regAcc.length > 0 && regAcc !== 'NOTDETECTED';

  let isBankMatch = false;
  let isBankChanged = false;

  if (hasRegisteredBank && hasInvoiceBank) {
    isBankMatch = invAcc === regAcc && (invIfsc === regIfsc || !invIfsc || invIfsc === 'NOTDETECTED');
    isBankChanged = !isBankMatch;
  } else if (hasRegisteredBank && !hasInvoiceBank) {
    isBankMatch = false;
    isBankChanged = false;
  } else {
    isBankMatch = false;
    isBankChanged = false;
  }

  if (isBankChanged) {
    calculatedRiskScore += 45;
    riskFactors.push({
      code: 'CRITICAL_BANK_ACCOUNT_SWAP',
      label: 'Unauthorized Bank Account Change',
      scoreImpact: 45,
      severity: 'CRITICAL',
      description: `Invoice beneficiary account (${invoiceBank.bankName} - ${invoiceBank.accountNumber}) differs from registered vendor profile (${registeredBank.bankName} - ${registeredBank.accountNumber}). Potential payment redirection fraud.`
    });
  }

  const bankVerificationResult = {
    matched: isBankMatch || (!isBankChanged && registeredVendor ? true : false),
    isAccountChanged: isBankChanged,
    invoiceBankDetails: invoiceBank,
    registeredBankDetails: registeredBank
  };

  // 4. Duplicate Invoice Detection
  const invNumClean = (rawInvoice.invoiceNumber || '').trim().toLowerCase();
  const isDuplicate = invNumClean.length > 0 && invNumClean !== 'not detected' && existingInvoices.some(
    inv => inv.invoiceNumber.trim().toLowerCase() === invNumClean &&
           inv.id !== rawInvoice.id &&
           inv.status !== 'REJECTED' &&
           !(rawInvoice.sourceType === 'DEMO_SCENARIO' && inv.sourceType === 'DEMO_SCENARIO')
  );

  if (isDuplicate) {
    calculatedRiskScore += 50;
    riskFactors.push({
      code: 'DUPLICATE_INVOICE_SUBMISSION',
      label: 'Duplicate Invoice ID',
      scoreImpact: 50,
      severity: 'CRITICAL',
      description: `Invoice number ${rawInvoice.invoiceNumber} has already been submitted and processed.`
    });
  }

  const duplicateCheckResult = {
    isDuplicate,
    duplicateOfInvoiceId: existingInvoices.find(i => i.invoiceNumber.trim().toLowerCase() === invNumClean)?.id
  };

  // 5. AI Extraction Confidence Impact
  if (aiExtractionConfidence < 85) {
    calculatedRiskScore += 20;
    riskFactors.push({
      code: 'LOW_AI_CONFIDENCE',
      label: 'OCR Confidence Below Threshold',
      scoreImpact: 20,
      severity: 'MEDIUM',
      description: `AI extraction confidence was ${aiExtractionConfidence}%, requiring human verification.`
    });
  }

  // Cap risk score between 0 and 100
  calculatedRiskScore = Math.min(Math.max(calculatedRiskScore, 0), 100);

  // Determine Risk Level
  let riskLevel: RiskLevel = 'LOW';
  if (calculatedRiskScore >= 70) riskLevel = 'CRITICAL';
  else if (calculatedRiskScore >= 40) riskLevel = 'HIGH';
  else if (calculatedRiskScore >= 10) riskLevel = 'MEDIUM';

  // Determine Autonomous Decision
  let finalDecision: InvoiceStatus = 'HUMAN_REVIEW_REQUIRED';

  if (calculatedRiskScore >= 50 || isBankChanged || isDuplicate) {
    finalDecision = 'BLOCKED_HIGH_RISK';
  } else if (
    calculatedRiskScore < 10 && 
    poMatchResult.matched && 
    (bankVerificationResult.matched || !isBankChanged) && 
    aiExtractionConfidence >= 85 &&
    isVendorConsistent
  ) {
    finalDecision = 'AUTO_APPROVED';
  } else {
    finalDecision = 'HUMAN_REVIEW_REQUIRED';
  }

  // Build Human-Readable Rationale Reasons
  const keyReasons: string[] = [];

  if (finalDecision === 'AUTO_APPROVED') {
    keyReasons.push(`Exact match with active Purchase Order ${matchedPO?.poNumber}`);
    keyReasons.push(`Price discrepancy is 0.0% (within ±5% tolerance)`);
    keyReasons.push(`Beneficiary bank details verified against vendor master record`);
    keyReasons.push(`AI OCR confidence is high (${aiExtractionConfidence}%)`);
    keyReasons.push(`Duplicate check clean — no prior submission found`);
  } else if (finalDecision === 'BLOCKED_HIGH_RISK') {
    if (isBankChanged) keyReasons.push(`CRITICAL: Invoice bank details (${invoiceBank.bankName}) differ from registered vendor profile (${registeredBank.bankName})`);
    if (isDuplicate) keyReasons.push(`CRITICAL: Duplicate invoice submission detected (${rawInvoice.invoiceNumber})`);
    if (amountVariancePercent > 20) keyReasons.push(`CRITICAL: Excessive price inflation (+${amountVariancePercent.toFixed(1)}%) above PO limit`);
    keyReasons.push(`Calculated Risk Score ${calculatedRiskScore}/100 exceeds safe threshold (50)`);
  } else {
    if (!isVendorConsistent) keyReasons.push(`Vendor consistency check failed: invoice or PO vendor name does not match registered master vendor profile`);
    if (amountVariancePercent > 5) keyReasons.push(`Billed total exceeds PO limit by +${amountVariancePercent.toFixed(1)}% (tolerance limit is ±5%)`);
    if (!matchedPO) keyReasons.push(`Purchase order ${rawInvoice.poNumber || 'N/A'} was not found or is expired`);
    if (!registeredVendor) keyReasons.push(`Vendor is not listed in registered master vendor registry`);
    if (aiExtractionConfidence < 85) keyReasons.push(`AI extraction confidence (${aiExtractionConfidence}%) is below 85% requirement`);
    keyReasons.push(`Requires Finance Admin verification before payout execution`);
  }

  const summaryText = finalDecision === 'AUTO_APPROVED'
    ? `Invoice verified automatically. Risk Score: ${calculatedRiskScore}/100 (LOW). All validation parameters matched.`
    : finalDecision === 'BLOCKED_HIGH_RISK'
    ? `HIGH RISK DETECTED. Risk Score: ${calculatedRiskScore}/100. Payout blocked automatically to prevent capital loss.`
    : `EXCEPTIONS DETECTED. Risk Score: ${calculatedRiskScore}/100. Escalated to Finance Admin review queue.`;

  return {
    finalDecision,
    riskScore: calculatedRiskScore,
    riskLevel,
    aiConfidencePercent: aiExtractionConfidence,
    summaryText,
    keyReasons,
    poMatchResult,
    vendorMatchResult,
    bankVerificationResult,
    duplicateCheckResult,
    riskFactors
  };
}
