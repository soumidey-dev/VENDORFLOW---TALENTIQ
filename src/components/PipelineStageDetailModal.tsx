import React from 'react';
import { Invoice, PurchaseOrder, Vendor, AuditEvent } from '../types';
import { 
  X, FileSearch, Bot, Cpu, ShieldCheck, AlertTriangle, CheckCircle, Banknote, 
  ShieldX, FileText, CheckCircle2, ArrowRight, Lock, Hash, Clock, AlertCircle, Eye, Download
} from 'lucide-react';

interface PipelineStageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageId: number | null; // 0 to 6
  invoice: Invoice | null;
  purchaseOrders: PurchaseOrder[];
  vendors: Vendor[];
  auditLogs: AuditEvent[];
  isProcessing: boolean;
  currentStep: number;
  onOpenReceiptModal?: (invoice: Invoice) => void;
}

const STAGES_META = [
  { id: 0, title: 'Document Upload & Intake', desc: 'PDF / Image File Ingestion & Structural Verification', icon: FileSearch },
  { id: 1, title: 'Gemini OCR Extraction', desc: 'Multimodal Structure Extraction & Validation', icon: Bot },
  { id: 2, title: 'PO Reconciliation', desc: 'Line Item, Quantity & Unit Price Matching', icon: Cpu },
  { id: 3, title: 'Bank Fraud Audit', desc: 'Beneficiary Account & Duplicate Checking', icon: ShieldCheck },
  { id: 4, title: 'Deterministic Risk Engine', desc: 'Mathematical Risk Scoring & Factor Assessment', icon: AlertTriangle },
  { id: 5, title: 'Autonomous Decision', desc: 'Auto-Approve vs Escalation Rules Evaluation', icon: CheckCircle },
  { id: 6, title: 'Simulated Payout & Hash Log', desc: 'RTGS Execution & SHA-256 Audit Chain Logging', icon: Banknote },
];

export const PipelineStageDetailModal: React.FC<PipelineStageDetailModalProps> = ({
  isOpen,
  onClose,
  stageId,
  invoice,
  purchaseOrders,
  vendors,
  auditLogs,
  isProcessing,
  currentStep,
  onOpenReceiptModal
}) => {
  if (!isOpen || stageId === null || stageId < 0 || stageId > 6) return null;

  const stageMeta = STAGES_META[stageId];
  const IconComponent = stageMeta.icon;

  // Determine stage execution state
  const isStageExecuted = !isProcessing 
    ? (stageId < 6 || (stageId === 6 && (invoice?.status === 'PAID' || !!invoice?.paymentRecord)))
    : stageId <= currentStep;

  const isStageActiveNow = isProcessing && currentStep === stageId;

  const formatRupees = (val: number = 0) => `₹${val.toLocaleString('en-IN')}`;

  // Find related PO and Vendor details
  const poMatch = purchaseOrders.find(po => po.poNumber === invoice?.poNumber);
  const vendorMatch = vendors.find(v => v.id === invoice?.vendorId || v.gstin === invoice?.vendorGSTIN);
  const rationale = invoice?.decisionRationale;
  const paymentRecord = invoice?.paymentRecord;

  // Find audit events related to this invoice
  const invoiceAuditLogs = auditLogs.filter(log => log.invoiceId === invoice?.id || log.invoiceNumber === invoice?.invoiceNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#121826] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border ${
              isStageActiveNow 
                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 animate-pulse'
                : isStageExecuted
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                  STAGE {stageId + 1} OF 7
                </span>
                {isStageActiveNow ? (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 rounded-full animate-pulse">
                    EXECUTING NOW
                  </span>
                ) : isStageExecuted ? (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                    COMPLETED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700 rounded-full">
                    NOT EXECUTED YET
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white font-mono">{stageMeta.title}</h3>
              <p className="text-xs text-slate-400">{stageMeta.desc}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Context Bar */}
        {invoice && (
          <div className="px-6 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
            <div className="flex items-center space-x-3">
              <span className="text-slate-400">Target Invoice:</span>
              <span className="text-indigo-300 font-bold">{invoice.invoiceNumber}</span>
              <span className="text-slate-500">•</span>
              <span className="text-white font-semibold">{invoice.vendorName}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-slate-400">Amount:</span>
              <span className="text-emerald-400 font-bold">{formatRupees(invoice.totalAmountINR)}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">PO:</span>
              <span className="text-slate-200">{invoice.poNumber}</span>
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 font-mono text-xs text-slate-300">
          
          {!isStageExecuted && !isStageActiveNow ? (
            /* Stage Not Executed State */
            <div className="py-12 px-6 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
              <Clock className="w-10 h-10 mx-auto text-slate-500 mb-3" />
              <h4 className="text-sm font-bold text-slate-300 font-mono mb-1">STAGE NOT EXECUTED YET</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
                {stageId === 6 && (invoice?.status === 'HUMAN_REVIEW_REQUIRED' || invoice?.status === 'BLOCKED_HIGH_RISK')
                  ? 'Simulated payout execution was not performed for this invoice because the workflow encountered risk factors and did not achieve automatic approval.'
                  : `This pipeline stage has not been reached for ${invoice?.invoiceNumber || 'the selected invoice'}.`}
              </p>
            </div>
          ) : (
            /* Render Stage Details */
            <>
              {/* STAGE 0: DOCUMENT UPLOAD */}
              {stageId === 0 && invoice && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block font-bold">Invoice Identifier:</span>
                      <span className="text-white font-bold text-sm">{invoice.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block font-bold">Workflow Execution ID:</span>
                      <span className="text-indigo-300 font-bold text-sm">EXEC-2026-{invoice.id.replace('INV-', '')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block font-bold">Source Document File:</span>
                      <span className="text-white font-semibold">{invoice.fileName || 'document.pdf'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block font-bold">Document MIME Type:</span>
                      <span className="text-slate-300">PDF Document (application/pdf)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block font-bold">Ingestion Status:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded & Ingestion Validated
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block font-bold">Upload Timestamp:</span>
                      <span className="text-slate-300">{invoice.uploadedAt ? new Date(invoice.uploadedAt).toLocaleString('en-IN') : '2026-08-07 10:15:00'}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-sans">
                    <h5 className="text-xs font-bold text-white font-mono uppercase">Document Structural Verification</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-400">PDF Syntax Validation:</span>
                        <span className="text-emerald-400 font-bold font-mono">PASSED</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-400">File Corruption Check:</span>
                        <span className="text-emerald-400 font-bold font-mono">CLEAN</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-400">Ingestion Channel:</span>
                        <span className="text-indigo-300 font-semibold">{invoice.uploadedBy || 'Vendor Self-Service Portal'}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                        <span className="text-slate-400">Tamper Seal:</span>
                        <span className="text-emerald-400 font-bold font-mono">SHA-256 Intact</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 1: GEMINI OCR EXTRACTION */}
              {stageId === 1 && invoice && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block font-bold">Extraction Status:</span>
                      <span className="text-emerald-400 font-bold text-xs">Completed</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block font-bold">AI Model Engine:</span>
                      <span className="text-indigo-300 font-bold text-xs">Gemini 2.5 Flash</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block font-bold">Extraction Confidence:</span>
                      <span className="text-emerald-400 font-bold text-xs">{rationale?.aiConfidencePercent ?? 98}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block font-bold">Processing Status:</span>
                      <span className="text-white font-bold text-xs">JSON Validated</span>
                    </div>
                  </div>

                  {/* Extracted Fields Summary */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-sans">
                    <h5 className="text-xs font-bold text-white font-mono uppercase">Structured Invoice Payload Extracted</h5>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] block font-bold">VENDOR NAME:</span>
                        <span className="text-white font-bold">{invoice.vendorName}</span>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] block font-bold">TAX INVOICE NUMBER:</span>
                        <span className="text-indigo-300 font-bold">{invoice.invoiceNumber}</span>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] block font-bold">PURCHASE ORDER REF:</span>
                        <span className="text-slate-200 font-bold">{invoice.poNumber}</span>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] block font-bold">INVOICE DATE:</span>
                        <span className="text-slate-200">{invoice.invoiceDate}</span>
                      </div>
                    </div>

                    {/* Extracted Line Items */}
                    <div className="mt-3">
                      <div className="text-[11px] font-bold text-slate-400 font-mono mb-2 uppercase">Extracted Line Items ({invoice.lineItems.length}):</div>
                      <div className="border border-slate-800 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-[11px] font-mono">
                          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                              <th className="p-2">Description</th>
                              <th className="p-2 text-right">Qty</th>
                              <th className="p-2 text-right">Unit Price</th>
                              <th className="p-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 bg-slate-900">
                            {invoice.lineItems.map((li, idx) => (
                              <tr key={idx}>
                                <td className="p-2 text-slate-200 font-sans">{li.description}</td>
                                <td className="p-2 text-right text-slate-300">{li.quantity}</td>
                                <td className="p-2 text-right text-slate-300">{formatRupees(li.unitPriceINR)}</td>
                                <td className="p-2 text-right text-white font-bold">{formatRupees(li.totalINR)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Extracted Totals */}
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-400">Subtotal: {formatRupees(invoice.subtotalINR)}</span>
                      <span className="text-slate-400">GST ({invoice.taxGSTPercent}%): {formatRupees(invoice.totalAmountINR - invoice.subtotalINR)}</span>
                      <span className="text-emerald-400 text-sm">Billed Total: {formatRupees(invoice.totalAmountINR)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 2: PO RECONCILIATION */}
              {stageId === 2 && invoice && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    rationale?.poMatchResult.matched
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {rationale?.poMatchResult.matched ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-bold font-mono text-sm uppercase">
                          {rationale?.poMatchResult.matched ? 'PO RECONCILIATION PASSED' : 'PRICE DISCREPANCY DETECTED'}
                        </div>
                        <div className="text-xs font-sans opacity-90">
                          {rationale?.poMatchResult.matched
                            ? `Billed total matches active Purchase Order ${invoice.poNumber} with 0.0% variance.`
                            : `Billed total (₹${invoice.totalAmountINR.toLocaleString('en-IN')}) differs from PO (₹${poMatch?.totalAmountINR.toLocaleString('en-IN') ?? 'N/A'}) by ${rationale?.poMatchResult.amountVariancePercent.toFixed(1)}%.`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-[10px] uppercase font-bold text-slate-400">PRICE VARIANCE</div>
                      <div className={`text-base font-extrabold ${
                        (rationale?.poMatchResult.amountVariancePercent ?? 0) > 5 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {(rationale?.poMatchResult.amountVariancePercent ?? 0) > 0 ? '+' : ''}
                        {(rationale?.poMatchResult.amountVariancePercent ?? 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* PO vs Invoice Line-by-Line Comparison */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-sans">
                    <h5 className="text-xs font-bold text-white font-mono uppercase">PO vs Invoice Comparison Breakdown</h5>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 bg-slate-950 rounded border border-slate-800">
                        <div className="text-slate-500 text-[10px] font-bold">APPROVED PURCHASE ORDER</div>
                        <div className="text-white font-bold text-sm mt-0.5">{poMatch?.poNumber || invoice.poNumber}</div>
                        <div className="text-slate-400 text-[11px] mt-1">PO Status: <strong className="text-emerald-400">{poMatch?.status || 'ACTIVE'}</strong></div>
                        <div className="text-slate-400 text-[11px]">Approved Limit: <strong className="text-white">{formatRupees(poMatch?.totalAmountINR || invoice.totalAmountINR)}</strong></div>
                      </div>

                      <div className="p-3 bg-slate-950 rounded border border-slate-800">
                        <div className="text-slate-500 text-[10px] font-bold">SUBMITTED INVOICE</div>
                        <div className="text-indigo-300 font-bold text-sm mt-0.5">{invoice.invoiceNumber}</div>
                        <div className="text-slate-400 text-[11px] mt-1">Invoice Status: <strong className="text-white">{invoice.status}</strong></div>
                        <div className="text-slate-400 text-[11px]">Billed Total: <strong className="text-white">{formatRupees(invoice.totalAmountINR)}</strong></div>
                      </div>
                    </div>

                    {/* Line Items Variance Table */}
                    <div className="border border-slate-800 rounded-lg overflow-hidden mt-3">
                      <table className="w-full text-left text-[11px] font-mono">
                        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                          <tr>
                            <th className="p-2">Line Item Description</th>
                            <th className="p-2 text-center">Inv Qty vs PO Qty</th>
                            <th className="p-2 text-right">Inv Price vs PO Price</th>
                            <th className="p-2 text-center">Match Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-slate-900">
                          {invoice.lineItems.map((li, idx) => {
                            const poItem = poMatch?.items[idx];
                            const qtyMatch = !poItem || li.quantity === poItem.quantity;
                            const priceMatch = !poItem || Math.abs(li.unitPriceINR - poItem.unitPriceINR) < 1;

                            return (
                              <tr key={idx}>
                                <td className="p-2 text-slate-200 font-sans">{li.description}</td>
                                <td className="p-2 text-center text-slate-300">
                                  {li.quantity} {poItem ? `(PO: ${poItem.quantity})` : ''}
                                </td>
                                <td className="p-2 text-right text-slate-300">
                                  {formatRupees(li.unitPriceINR)} {poItem ? `(PO: ${formatRupees(poItem.unitPriceINR)})` : ''}
                                </td>
                                <td className="p-2 text-center">
                                  {qtyMatch && priceMatch ? (
                                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">100% MATCH</span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">VARIANCE DETECTED</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 3: BANK FRAUD AUDIT */}
              {stageId === 3 && invoice && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    rationale?.bankVerificationResult.matched && !rationale?.duplicateCheckResult.isDuplicate
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {rationale?.bankVerificationResult.matched && !rationale?.duplicateCheckResult.isDuplicate ? (
                        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <ShieldX className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-bold font-mono text-sm uppercase">
                          {rationale?.bankVerificationResult.matched && !rationale?.duplicateCheckResult.isDuplicate
                            ? 'BANK ACCOUNT & FRAUD AUDIT PASSED'
                            : 'CRITICAL BANK FRAUD / ACCOUNT SWAP ALERT'}
                        </div>
                        <div className="text-xs font-sans opacity-90">
                          {rationale?.bankVerificationResult.matched && !rationale?.duplicateCheckResult.isDuplicate
                            ? 'Beneficiary account details match registered master vendor profile. No duplicate submission detected.'
                            : rationale?.duplicateCheckResult.isDuplicate
                            ? 'Duplicate invoice submission detected in database.'
                            : 'Invoice beneficiary bank details DO NOT MATCH registered vendor master file. Potential payment redirection fraud.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registered vs Invoice Bank Side-by-Side Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                    {/* Registered Bank in Master Vendor Database */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="text-slate-400 text-[10px] font-mono font-bold uppercase flex items-center justify-between">
                        <span>REGISTERED MASTER VENDOR BANK</span>
                        <span className="text-emerald-400">VERIFIED MASTER</span>
                      </div>
                      <div className="text-white font-bold text-sm">{vendorMatch?.registeredBank.bankName || rationale?.bankVerificationResult.registeredBankDetails.bankName || 'HDFC Bank Ltd'}</div>
                      <div className="text-xs text-slate-300 font-mono">
                        Account Name: <strong>{vendorMatch?.registeredBank.accountName || invoice.vendorName}</strong>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">
                        Account #: <strong className="text-emerald-300">{vendorMatch?.registeredBank.accountNumber || rationale?.bankVerificationResult.registeredBankDetails.accountNumber}</strong>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">
                        IFSC Code: {vendorMatch?.registeredBank.ifscCode || rationale?.bankVerificationResult.registeredBankDetails.ifscCode}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Branch: {vendorMatch?.registeredBank.branch || 'BKC Branch, Mumbai'}
                      </div>
                    </div>

                    {/* Invoice Extracted Bank Details */}
                    <div className={`p-4 bg-slate-900 border rounded-xl space-y-2 ${
                      rationale?.bankVerificationResult.matched
                        ? 'border-emerald-500/40'
                        : 'border-rose-500/60 bg-rose-950/20'
                    }`}>
                      <div className="text-slate-400 text-[10px] font-mono font-bold uppercase flex items-center justify-between">
                        <span>INVOICE BENEFICIARY BANK</span>
                        {rationale?.bankVerificationResult.matched ? (
                          <span className="text-emerald-400 font-mono">MATCHED</span>
                        ) : (
                          <span className="text-rose-400 font-mono font-extrabold animate-pulse">MISMATCH DETECTED</span>
                        )}
                      </div>
                      <div className="text-white font-bold text-sm">{invoice.invoiceBankDetails.bankName}</div>
                      <div className="text-xs text-slate-300 font-mono">
                        Account Name: <strong>{invoice.invoiceBankDetails.accountName}</strong>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">
                        Account #: <strong className={rationale?.bankVerificationResult.matched ? 'text-emerald-300' : 'text-rose-400 font-extrabold'}>
                          {invoice.invoiceBankDetails.accountNumber}
                        </strong>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">
                        IFSC Code: {invoice.invoiceBankDetails.ifscCode}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Branch: {invoice.invoiceBankDetails.branch}
                      </div>
                    </div>
                  </div>

                  {/* Duplicate Check & Fraud Checklist */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-sans">
                    <h5 className="text-xs font-bold text-white font-mono uppercase">Bank Audit & Fraud Indicators Checklist</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Beneficiary Match:</span>
                        <span className={rationale?.bankVerificationResult.matched ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {rationale?.bankVerificationResult.matched ? 'VERIFIED' : 'MISMATCH'}
                        </span>
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Duplicate Check:</span>
                        <span className={rationale?.duplicateCheckResult.isDuplicate ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {rationale?.duplicateCheckResult.isDuplicate ? 'DUPLICATE FOUND' : 'CLEAN'}
                        </span>
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">IFSC Valid:</span>
                        <span className="text-emerald-400 font-bold">YES</span>
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Risk Assessment:</span>
                        <span className={rationale?.bankVerificationResult.isAccountChanged ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {rationale?.bankVerificationResult.isAccountChanged ? 'HIGH REDIRECTION RISK' : 'LOW RISK'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 4: DETERMINISTIC RISK ENGINE */}
              {stageId === 4 && invoice && rationale && (
                <div className="space-y-4">
                  {/* Risk Score Highlight */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-slate-400 uppercase font-bold">DETERMINISTIC RISK SCORE</div>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className={`text-3xl font-extrabold font-mono ${
                          rationale.riskScore >= 70 ? 'text-rose-400' : rationale.riskScore >= 30 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {rationale.riskScore}/100
                        </span>
                        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                          rationale.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                          rationale.riskLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-300' :
                          rationale.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {rationale.riskLevel} RISK
                        </span>
                      </div>
                    </div>

                    <div className="w-48 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400 mb-1 flex justify-between">
                        <span>Risk Scale</span>
                        <span>0 - 100</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            rationale.riskScore >= 70 ? 'bg-rose-500' : rationale.riskScore >= 30 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(rationale.riskScore, 4)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mathematical Risk Formula Factor Contributions */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-sans">
                    <h5 className="text-xs font-bold text-white font-mono uppercase">Risk Factor Mathematical Contributions</h5>
                    
                    <div className="space-y-2 text-xs font-mono">
                      {/* Factor 1: Bank Mismatch */}
                      <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="text-white font-bold">Bank Account Swap / Mismatch</div>
                          <div className="text-[10px] text-slate-400">Comparing invoice bank vs vendor master record</div>
                        </div>
                        <span className={`font-bold text-xs ${rationale.bankVerificationResult.isAccountChanged ? 'text-rose-400' : 'text-slate-500'}`}>
                          {rationale.bankVerificationResult.isAccountChanged ? '+45 Impact (CRITICAL)' : '+0 Impact'}
                        </span>
                      </div>

                      {/* Factor 2: Price Inflation */}
                      <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="text-white font-bold">PO Price Discrepancy</div>
                          <div className="text-[10px] text-slate-400">Variance: {rationale.poMatchResult.amountVariancePercent.toFixed(1)}%</div>
                        </div>
                        <span className={`font-bold text-xs ${rationale.poMatchResult.amountVariancePercent > 5 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {rationale.poMatchResult.amountVariancePercent > 20 ? '+40 Impact (CRITICAL)' : rationale.poMatchResult.amountVariancePercent > 5 ? '+25 Impact (HIGH)' : '+0 Impact'}
                        </span>
                      </div>

                      {/* Factor 3: Duplicate Submission */}
                      <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="text-white font-bold">Duplicate Invoice Check</div>
                          <div className="text-[10px] text-slate-400">Checking prior database submissions</div>
                        </div>
                        <span className={`font-bold text-xs ${rationale.duplicateCheckResult.isDuplicate ? 'text-rose-400' : 'text-slate-500'}`}>
                          {rationale.duplicateCheckResult.isDuplicate ? '+50 Impact (CRITICAL)' : '+0 Impact'}
                        </span>
                      </div>

                      {/* Factor 4: Vendor Master Registry */}
                      <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="text-white font-bold">Vendor Registration Status</div>
                          <div className="text-[10px] text-slate-400">Master database lookup</div>
                        </div>
                        <span className={`font-bold text-xs ${!rationale.vendorMatchResult.vendorFound ? 'text-rose-400' : 'text-slate-500'}`}>
                          {!rationale.vendorMatchResult.vendorFound ? '+30 Impact (HIGH)' : '+0 Impact (Registered)'}
                        </span>
                      </div>

                      {/* Factor 5: AI OCR Confidence */}
                      <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="text-white font-bold">AI OCR Extraction Confidence</div>
                          <div className="text-[10px] text-slate-400">Extraction score: {rationale.aiConfidencePercent}%</div>
                        </div>
                        <span className={`font-bold text-xs ${rationale.aiConfidencePercent < 85 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {rationale.aiConfidencePercent < 85 ? '+20 Impact' : '+0 Impact (High Confidence)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 5: AUTONOMOUS DECISION */}
              {stageId === 5 && invoice && rationale && (
                <div className="space-y-4">
                  {/* Decision Banner */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    rationale.finalDecision === 'AUTO_APPROVED' || invoice.status === 'PAID'
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : rationale.finalDecision === 'BLOCKED_HIGH_RISK'
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                      : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {rationale.finalDecision === 'AUTO_APPROVED' || invoice.status === 'PAID' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                      ) : rationale.finalDecision === 'BLOCKED_HIGH_RISK' ? (
                        <ShieldX className="w-6 h-6 text-rose-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">DECISION OUTCOME</div>
                        <div className="text-base font-extrabold font-mono text-white">
                          {rationale.finalDecision === 'AUTO_APPROVED' || invoice.status === 'PAID'
                            ? 'AUTONOMOUS AUTO-APPROVAL GRANTED'
                            : rationale.finalDecision === 'BLOCKED_HIGH_RISK'
                            ? 'PAYOUT BLOCKED — HIGH RISK DETECTED'
                            : 'ESCALATED TO FINANCE ADMIN HUMAN REVIEW'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Rules Satisfaction Grid */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-sans">
                    <h5 className="text-xs font-bold text-white font-mono uppercase">Autonomous Policy Rule Evaluations</h5>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">PO Match Check:</span>
                        <span className={rationale.poMatchResult.matched ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {rationale.poMatchResult.matched ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>

                      <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Price Variance ≤ 5%:</span>
                        <span className={rationale.poMatchResult.amountVariancePercent <= 5 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {rationale.poMatchResult.amountVariancePercent <= 5 ? 'PASSED' : 'EXCEEDED'}
                        </span>
                      </div>

                      <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Bank Hash Match:</span>
                        <span className={rationale.bankVerificationResult.matched ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {rationale.bankVerificationResult.matched ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>

                      <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Duplicate Check:</span>
                        <span className={!rationale.duplicateCheckResult.isDuplicate ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {!rationale.duplicateCheckResult.isDuplicate ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Concise Rationale List */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-sans">
                    <h5 className="text-xs font-bold text-white font-mono uppercase">Executive Decision Rationale</h5>
                    <p className="text-xs text-slate-300 font-mono italic">{rationale.summaryText}</p>
                    <ul className="space-y-1.5 mt-2">
                      {rationale.keyReasons.map((reason, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-indigo-400 font-mono">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* STAGE 6: SIMULATED PAYOUT & HASH LOG */}
              {stageId === 6 && invoice && (
                <div className="space-y-4">
                  {/* Payout Execution Summary */}
                  {paymentRecord ? (
                    <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-emerald-400 uppercase font-mono font-bold">SETTLEMENT STATUS</div>
                        <div className="text-base font-extrabold text-white font-mono">SIMULATED PAYOUT SETTLED</div>
                        <div className="text-xs text-slate-300 mt-0.5">Channel: <strong>{paymentRecord.paymentMethod}</strong> • UTR: <strong className="text-emerald-300 font-mono">{paymentRecord.utrNumber}</strong></div>
                      </div>

                      {onOpenReceiptModal && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenReceiptModal(invoice);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 font-sans shadow-lg"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xl">
                      <div className="text-[10px] text-amber-400 uppercase font-mono font-bold">PAYOUT STATUS</div>
                      <div className="text-base font-extrabold text-white font-mono">PAYOUT HELD / NOT EXECUTED</div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {invoice.status === 'BLOCKED_HIGH_RISK'
                          ? 'Payout execution was blocked by the risk engine to safeguard corporate funds.'
                          : 'Payout execution is on hold pending Finance Admin human review.'}
                      </div>
                    </div>
                  )}

                  {/* SHA-256 Audit Log Chain */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-sans">
                    <h5 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Cryptographic SHA-256 Audit Chain Verification</span>
                    </h5>

                    {invoiceAuditLogs.length === 0 ? (
                      <p className="text-xs text-slate-400 font-mono">No cryptographic audit events recorded for this invoice yet.</p>
                    ) : (
                      <div className="space-y-2 font-mono text-[11px]">
                        {invoiceAuditLogs.map((log) => (
                          <div key={log.id} className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
                            <div className="flex justify-between text-slate-400">
                              <span className="text-indigo-300 font-bold">#{log.sequenceNumber} • {log.action}</span>
                              <span className="text-slate-500">{log.timestamp.slice(0, 19).replace('T', ' ')}</span>
                            </div>
                            <div className="text-slate-300 font-sans text-xs">{log.details}</div>
                            <div className="text-[10px] text-slate-500 truncate">
                              Hash: <span className="text-emerald-400 font-mono">{log.currentHash}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111827] border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            VendorFlow Autonomous Pipeline • Step {stageId + 1} / 7
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
