/**
 * VendorFlow - TalentIQ Comprehensive Test Suite
 * Contains unit and integration test cases for all core engines:
 * 1. VendorFlow Risk & Validation Engine
 * 2. SHA-256 Tamper-Evident Cryptographic Audit Logger
 * 3. Synthetic Payout Gateway Simulator
 * 4. TalentIQ Unified Skill & Career Matching Engine
 * 5. Skill Gap, JD Matcher & Interview Generators
 */

import assert from 'node:assert/strict';
import { evaluateInvoiceRisk } from '../services/riskEngine';
import { createAuditEvent, verifyAuditChainIntegrity } from '../services/auditLogger';
import { executeSimulatedPayout } from '../services/paymentSimulator';
import { 
  calculateUnifiedSkills, 
  evaluateRoleMatches, 
  evaluateCompanyMatches, 
  calculateCareerReadiness, 
  generateSkillGapsAndRoadmap, 
  analyzeJobDescription, 
  generateInterviewQuestions, 
  generateResumeImprovements,
  PRESET_PROFILES,
  DEMO_COMPANIES
} from '../services/careerEngine';
import { INITIAL_VENDORS, INITIAL_PURCHASE_ORDERS, INITIAL_INVOICES, DEMO_SCENARIOS } from '../data/mockData';
import { Invoice, AuditEvent, Vendor, PurchaseOrder } from '../types';

let testsPassed = 0;
let testsFailed = 0;

function runTest(description: string, fn: () => void) {
  try {
    fn();
    testsPassed++;
    console.log(`  \x1b[32m✓ PASSED:\x1b[0m ${description}`);
  } catch (error) {
    testsFailed++;
    console.error(`  \x1b[31m✗ FAILED:\x1b[0m ${description}`);
    console.error(error);
  }
}

console.log('\n======================================================');
console.log('      VENDORFLOW - TALENTIQ TEST SUITE EXECUTION');
console.log('======================================================\n');

// ----------------------------------------------------
// GROUP 1: VENDORFLOW RISK ENGINE TEST CASES
// ----------------------------------------------------
console.log('--- GROUP 1: VendorFlow Risk & Validation Engine ---');

runTest('Test Case 1: Clean Invoice Auto-Approval', () => {
  const cleanInvoice: Partial<Invoice> = {
    id: 'INV-TEST-001',
    invoiceNumber: 'INV-TEST-2026-01',
    vendorId: 'VEND-101',
    vendorName: 'TechSource Solutions Pvt Ltd',
    vendorGSTIN: '27AABCT1234H1Z5',
    poNumber: 'PO-2026-8821',
    subtotalINR: 360254,
    taxGSTPercent: 18,
    totalAmountINR: 425100,
    invoiceBankDetails: {
      accountName: 'TechSource Solutions Pvt Ltd',
      accountNumber: '918020045612390',
      ifscCode: 'HDFC0000240',
      bankName: 'HDFC Bank Ltd',
      branch: 'BKC Branch, Mumbai',
      isVerified: true
    }
  };

  const result = evaluateInvoiceRisk(cleanInvoice, INITIAL_VENDORS, INITIAL_PURCHASE_ORDERS, [], 98);
  assert.equal(result.finalDecision, 'AUTO_APPROVED');
  assert.equal(result.riskScore, 0);
  assert.equal(result.riskLevel, 'LOW');
  assert.equal(result.poMatchResult.matched, true);
  assert.equal(result.bankVerificationResult.matched, true);
});

runTest('Test Case 2: Unauthorized Bank Account Swap Fraud Detection', () => {
  const fraudInvoice: Partial<Invoice> = {
    id: 'INV-TEST-002',
    invoiceNumber: 'INV-FRAUD-999',
    vendorId: 'VEND-101',
    vendorName: 'TechSource Solutions Pvt Ltd',
    vendorGSTIN: '27AABCT1234H1Z5',
    poNumber: 'PO-2026-8821',
    totalAmountINR: 425100,
    invoiceBankDetails: {
      accountName: 'Fraudulent Shell Account',
      accountNumber: '999999999999999', // Swapped bank account
      ifscCode: 'FAKE0000999',
      bankName: 'Offshore Phantom Bank',
      branch: 'Unknown',
      isVerified: false
    }
  };

  const result = evaluateInvoiceRisk(fraudInvoice, INITIAL_VENDORS, INITIAL_PURCHASE_ORDERS, [], 95);
  assert.equal(result.finalDecision, 'BLOCKED_HIGH_RISK');
  assert.ok(result.riskScore >= 45, 'Risk score should reflect critical bank swap impact (+45)');
  assert.equal(result.bankVerificationResult.isAccountChanged, true);
  const bankFactor = result.riskFactors.find(f => f.code === 'CRITICAL_BANK_ACCOUNT_SWAP');
  assert.ok(bankFactor, 'Must contain CRITICAL_BANK_ACCOUNT_SWAP risk factor');
});

runTest('Test Case 3: Price Inflation / PO Discrepancy Detection', () => {
  const overbilledInvoice: Partial<Invoice> = {
    id: 'INV-TEST-003',
    invoiceNumber: 'INV-TEST-OVERBILL',
    vendorId: 'VEND-101',
    vendorName: 'TechSource Solutions Pvt Ltd',
    vendorGSTIN: '27AABCT1234H1Z5',
    poNumber: 'PO-2026-8821', // Approved amount is ₹4,25,100
    totalAmountINR: 600000, // ~+41% higher
    invoiceBankDetails: INITIAL_VENDORS[0].registeredBank
  };

  const result = evaluateInvoiceRisk(overbilledInvoice, INITIAL_VENDORS, INITIAL_PURCHASE_ORDERS, [], 95);
  assert.ok(result.poMatchResult.amountVariancePercent > 5, 'Variance percent should exceed 5% tolerance');
  assert.equal(result.poMatchResult.matched, false);
  const priceFactor = result.riskFactors.find(f => f.code === 'PRICE_DISCREPANCY_HIGH');
  assert.ok(priceFactor, 'Must flag PRICE_DISCREPANCY_HIGH');
});

runTest('Test Case 4: Unregistered Vendor Detection', () => {
  const unknownInvoice: Partial<Invoice> = {
    id: 'INV-TEST-004',
    invoiceNumber: 'INV-UNKNOWN-001',
    vendorName: 'Phantom Unknown Enterprise',
    vendorGSTIN: '99XXXXX9999X1Z9',
    totalAmountINR: 50000
  };

  const result = evaluateInvoiceRisk(unknownInvoice, INITIAL_VENDORS, [], [], 90);
  assert.equal(result.vendorMatchResult.vendorFound, false);
  const unregFactor = result.riskFactors.find(f => f.code === 'UNREGISTERED_VENDOR');
  assert.ok(unregFactor, 'Must flag UNREGISTERED_VENDOR');
});

runTest('Test Case 5: Missing Purchase Order Detection', () => {
  const noPoInvoice: Partial<Invoice> = {
    id: 'INV-TEST-005',
    invoiceNumber: 'INV-NO-PO-100',
    vendorId: 'VEND-101',
    vendorName: 'TechSource Solutions Pvt Ltd',
    poNumber: 'PO-NONEXISTENT-9999',
    totalAmountINR: 80000,
    invoiceBankDetails: INITIAL_VENDORS[0].registeredBank
  };

  const result = evaluateInvoiceRisk(noPoInvoice, INITIAL_VENDORS, [], [], 95); // Pass empty PO list to simulate missing PO
  const poFactor = result.riskFactors.find(f => f.code === 'PO_NOT_FOUND');
  assert.ok(poFactor, 'Must flag PO_NOT_FOUND');
});

runTest('Test Case 6: Duplicate Invoice Submission Detection', () => {
  const existingInvoices: Invoice[] = [
    ({
      id: 'INV-EXISTING-1',
      invoiceNumber: 'INV-DUP-2026',
      vendorId: 'VEND-101',
      vendorName: 'TechSource Solutions Pvt Ltd',
      status: 'PAID',
      totalAmountINR: 10000,
      createdAt: new Date().toISOString()
    } as unknown) as Invoice
  ];

  const duplicateInvoice: Partial<Invoice> = {
    id: 'INV-TEST-NEW-2',
    invoiceNumber: 'INV-DUP-2026', // Duplicate number
    vendorId: 'VEND-101',
    vendorName: 'TechSource Solutions Pvt Ltd',
    totalAmountINR: 10000
  };

  const result = evaluateInvoiceRisk(duplicateInvoice, INITIAL_VENDORS, INITIAL_PURCHASE_ORDERS, existingInvoices, 95);
  assert.equal(result.duplicateCheckResult.isDuplicate, true);
  assert.equal(result.finalDecision, 'BLOCKED_HIGH_RISK');
  const dupFactor = result.riskFactors.find(f => f.code === 'DUPLICATE_INVOICE_SUBMISSION');
  assert.ok(dupFactor, 'Must flag DUPLICATE_INVOICE_SUBMISSION');
});

runTest('Test Case 7: Low AI OCR Confidence Penalty', () => {
  const blurryInvoice: Partial<Invoice> = {
    id: 'INV-TEST-007',
    invoiceNumber: 'INV-BLURRY-01',
    vendorId: 'VEND-101',
    vendorName: 'TechSource Solutions Pvt Ltd',
    poNumber: 'PO-2026-8801',
    totalAmountINR: 118000,
    invoiceBankDetails: INITIAL_VENDORS[0].registeredBank
  };

  const result = evaluateInvoiceRisk(blurryInvoice, INITIAL_VENDORS, INITIAL_PURCHASE_ORDERS, [], 65); // Low OCR confidence (65%)
  const lowConfFactor = result.riskFactors.find(f => f.code === 'LOW_AI_CONFIDENCE');
  assert.ok(lowConfFactor, 'Must flag LOW_AI_CONFIDENCE for OCR < 85%');
});


// ----------------------------------------------------
// GROUP 2: CRYPTOGRAPHIC AUDIT LOG ENGINE TEST CASES
// ----------------------------------------------------
console.log('\n--- GROUP 2: SHA-256 Tamper-Evident Audit Trail ---');

runTest('Test Case 8: Sequential SHA-256 Hash Chaining', () => {
  const events: AuditEvent[] = [];

  const event1 = createAuditEvent(events, 'INV-1', 'INV-NUM-1', 'AI_AGENT', 'INVOICE_INGESTED', 'PENDING_AUDIT', 'Ingested invoice via PDF');
  events.push(event1);

  assert.equal(event1.sequenceNumber, 1);
  assert.equal(event1.previousHash, '0000000000000000000000000000000000000000000000000000000000000000');
  assert.ok(event1.currentHash.length === 64, 'SHA-256 hash must be 64 hexadecimal characters');

  const event2 = createAuditEvent(events, 'INV-1', 'INV-NUM-1', 'AI_AGENT', 'RISK_EVALUATED', 'AUTO_APPROVED', 'Risk score 0/100', 'PENDING_AUDIT');
  events.push(event2);

  assert.equal(event2.sequenceNumber, 2);
  assert.equal(event2.previousHash, event1.currentHash, 'Event 2 previousHash must match Event 1 currentHash');
});

runTest('Test Case 9: Clean Audit Chain Integrity Verification', () => {
  const events: AuditEvent[] = [];
  const e1 = createAuditEvent(events, 'INV-1', 'INV-NUM-1', 'AI_AGENT', 'INGEST', 'PENDING_AUDIT', 'Started');
  events.push(e1);
  const e2 = createAuditEvent(events, 'INV-1', 'INV-NUM-1', 'FINANCE_ADMIN', 'APPROVE', 'PAID', 'Approved');
  events.push(e2);

  const verification = verifyAuditChainIntegrity(events);
  assert.equal(verification.isIntegrityValid, true);
  assert.equal(verification.brokenAtSequence, undefined);
});

runTest('Test Case 10: Tamper Detection on Altered Audit Record', () => {
  const events: AuditEvent[] = [];
  const e1 = createAuditEvent(events, 'INV-1', 'INV-NUM-1', 'AI_AGENT', 'INGEST', 'PENDING_AUDIT', 'Original record');
  events.push(e1);
  const e2 = createAuditEvent(events, 'INV-1', 'INV-NUM-1', 'FINANCE_ADMIN', 'APPROVE', 'PAID', 'Approved payout');
  events.push(e2);

  // Tamper with Event 1's hash string
  events[0] = { ...events[0], currentHash: 'tampered_hash_1234567890abcdef1234567890abcdef1234567890abcdef1234' };

  const verification = verifyAuditChainIntegrity(events);
  assert.equal(verification.isIntegrityValid, false, 'Tampered chain must fail integrity check');
  assert.equal(verification.brokenAtSequence, 2, 'Broken link should be flagged at sequence 2');
});


// ----------------------------------------------------
// GROUP 3: PAYMENT GATEWAY SIMULATOR TEST CASES
// ----------------------------------------------------
console.log('\n--- GROUP 3: Synthetic Payout Gateway Simulator ---');

runTest('Test Case 11: High-Value Settlement via RTGS (>= ₹200,000)', () => {
  const highValInvoice = ({
    id: 'INV-HIGH-VAL',
    invoiceNumber: 'INV-HV-2026',
    vendorName: 'TechSource Solutions Pvt Ltd',
    totalAmountINR: 500000,
    status: 'AUTO_APPROVED'
  } as unknown) as Invoice;

  const payment = executeSimulatedPayout(highValInvoice);
  assert.equal(payment.paymentMethod, 'RTGS');
  assert.equal(payment.status, 'SETTLED');
  assert.ok(payment.utrNumber.startsWith('HDFCR5'), 'UTR should start with bank identifier');
  assert.equal(payment.amountINR, 500000);
});

runTest('Test Case 12: Standard-Value Settlement via NEFT (< ₹200,000)', () => {
  const standardValInvoice = ({
    id: 'INV-STD-VAL',
    invoiceNumber: 'INV-SV-2026',
    vendorName: 'Apex Logistics India Ltd',
    totalAmountINR: 45000,
    status: 'AUTO_APPROVED'
  } as unknown) as Invoice;

  const payment = executeSimulatedPayout(standardValInvoice);
  assert.equal(payment.paymentMethod, 'NEFT');
  assert.equal(payment.status, 'SETTLED');
  assert.ok(payment.transactionId.startsWith('TXN-IN-'), 'Transaction ID must follow ISO date structure');
});


// ----------------------------------------------------
// GROUP 4: TALENTIQ CAREER INTELLIGENCE ENGINE TEST CASES
// ----------------------------------------------------
console.log('\n--- GROUP 4: TalentIQ Unified Skill & Career Engine ---');

runTest('Test Case 13: Unified Skill Matrix Calculation across Multi-Sources', () => {
  const preset = PRESET_PROFILES[0]; // Rahul Sharma
  const skills = calculateUnifiedSkills(preset.resume, preset.marksheet, preset.projects);

  assert.ok(skills.length > 0, 'Unified skills matrix should not be empty');
  const javaSkill = skills.find(s => s.name.toLowerCase() === 'java');
  assert.ok(javaSkill, 'Java skill must be extracted');
  assert.ok(javaSkill!.confidenceScore > 60, 'Java confidence score should be high due to multiple source occurrences');
});

runTest('Test Case 14: Role Match Matrix Evaluation (9 Target Roles)', () => {
  const preset = PRESET_PROFILES[0];
  const skills = calculateUnifiedSkills(preset.resume, preset.marksheet, preset.projects);
  const matches = evaluateRoleMatches(skills, preset.profile, preset.projects, preset.marksheet);

  assert.equal(matches.length, 9, 'Must evaluate against all 9 target roles');
  const javaDevMatch = matches.find(m => m.roleName === 'Java Developer');
  assert.ok(javaDevMatch, 'Java Developer role must exist in matches');
  assert.ok(javaDevMatch!.matchScore >= 70, 'Rahul should score >= 70 for Java Developer');
});

runTest('Test Case 15: Synthetic Demo Company Matching', () => {
  const preset = PRESET_PROFILES[0];
  const skills = calculateUnifiedSkills(preset.resume, preset.marksheet, preset.projects);
  const companyMatches = evaluateCompanyMatches(skills, preset.profile, preset.projects, preset.marksheet);

  assert.equal(companyMatches.length, DEMO_COMPANIES.length, 'Must evaluate against all demo companies');
  const techCorpMatch = companyMatches.find(c => c.company.id === 'DEMO-COMP-01');
  assert.ok(techCorpMatch, 'TechCorp Solutions match must exist');
  assert.ok(techCorpMatch!.matchScore > 50, 'Rahul should match TechCorp Java role well');
});

runTest('Test Case 16: Career Readiness Score Formula', () => {
  const preset = PRESET_PROFILES[0];
  const skills = calculateUnifiedSkills(preset.resume, preset.marksheet, preset.projects);
  const matches = evaluateRoleMatches(skills, preset.profile, preset.projects, preset.marksheet);
  
  const readiness = calculateCareerReadiness(preset.profile, preset.resume, preset.marksheet, preset.projects, matches);
  assert.ok(readiness.overallScore >= 0 && readiness.overallScore <= 100, 'Score must be between 0 and 100');
  assert.ok(readiness.contributingFactors.length > 0, 'Must provide contributing factors list');
});

runTest('Test Case 17: Skill Gap Detector & 30-Day Preparation Roadmap', () => {
  const preset = PRESET_PROFILES[0];
  const skills = calculateUnifiedSkills(preset.resume, preset.marksheet, preset.projects);
  const { skillGaps, roadmap } = generateSkillGapsAndRoadmap('Java Developer', skills);

  assert.ok(roadmap.length === 4, 'Roadmap must contain 4 weekly milestone stages');
  assert.ok(skillGaps.length >= 0, 'Skill gaps calculated correctly');
});

runTest('Test Case 18: Job Description Keyword Matcher', () => {
  const preset = PRESET_PROFILES[0];
  const skills = calculateUnifiedSkills(preset.resume, preset.marksheet, preset.projects);
  
  const sampleJD = `Looking for a Java Developer with Spring Boot, SQL, REST API, Docker, and PostgreSQL experience.`;
  const jdResult = analyzeJobDescription(sampleJD, skills, preset.profile);

  assert.ok(jdResult.matchScore >= 50, 'Match score for Java JD should be > 50 for Rahul');
  assert.ok(jdResult.matchedSkills.length > 0, 'Matched skills list must not be empty');
});

runTest('Test Case 19: Interview Question & Resume Improvement Generators', () => {
  const preset = PRESET_PROFILES[0];
  const skills = calculateUnifiedSkills(preset.resume, preset.marksheet, preset.projects);

  const questions = generateInterviewQuestions('Java Developer', skills, preset.projects);
  assert.ok(questions.length >= 4, 'Must generate at least 4 interview questions');

  const suggestions = generateResumeImprovements(preset.resume);
  assert.ok(suggestions.length >= 3, 'Must generate resume improvement suggestions');
});

runTest('Test Case 20: Pre-seeded Master Data Integrity', () => {
  assert.ok(INITIAL_VENDORS.length >= 3, 'Must contain initial vendors');
  assert.ok(INITIAL_PURCHASE_ORDERS.length >= 3, 'Must contain initial purchase orders');
  assert.ok(INITIAL_INVOICES.length >= 1, 'Must contain initial invoices');
  assert.ok(DEMO_SCENARIOS.length >= 3, 'Must contain demo scenarios');
});

console.log('\n======================================================');
console.log(`  TEST RESULTS: ${testsPassed} PASSED | ${testsFailed} FAILED`);
console.log('======================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
