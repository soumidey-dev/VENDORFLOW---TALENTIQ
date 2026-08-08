import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '../types';
import { X, CheckCircle2, ShieldAlert, AlertTriangle, Building2, CreditCard, FileText, Check, ShieldCheck, Banknote, ArrowUpRight } from 'lucide-react';

interface InvoiceDetailDrawerProps {
  invoice: Invoice | null;
  onClose: () => void;
  onApproveAndPayout: (invoiceId: string, notes: string) => void;
  onRejectInvoice: (invoiceId: string, notes: string) => void;
  onOpenReceiptModal: (invoice: Invoice) => void;
}

export const InvoiceDetailDrawer: React.FC<InvoiceDetailDrawerProps> = ({
  invoice,
  onClose,
  onApproveAndPayout,
  onRejectInvoice,
  onOpenReceiptModal
}) => {
  if (!invoice) return null;

  const [reviewNotes, setReviewNotes] = useState('');
  const rationale = invoice.decisionRationale;
  const riskScore = rationale?.riskScore ?? 0;

  const formatRupees = (val: number = 0) => `₹${val.toLocaleString('en-IN')}`;

  const bankResult = rationale?.bankVerificationResult;
  const poResult = rationale?.poMatchResult;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in">
      
      {/* Drawer Container */}
      <div className="w-full max-w-3xl bg-[#0d121f] border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{invoice.invoiceNumber}</h3>
                <span className="text-xs text-slate-400 font-mono">({invoice.vendorName})</span>
                {invoice.sourceType === 'REAL_UPLOAD' ? (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                    SOURCE: REAL UPLOAD
                  </span>
                ) : invoice.sourceType === 'DEMO_SCENARIO' ? (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                    SOURCE: DEMO SCENARIO
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Billed Total: <span className="text-emerald-400 font-bold">{formatRupees(invoice.totalAmountINR)}</span> • PO Ref: {invoice.poNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            id="drawer-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Banner: Decision Rationale */}
          <div className={`p-4 rounded-xl border ${
            invoice.status === 'AUTO_APPROVED' || invoice.status === 'PAID'
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : invoice.status === 'BLOCKED_HIGH_RISK'
              ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                {invoice.status === 'AUTO_APPROVED' || invoice.status === 'PAID' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : invoice.status === 'BLOCKED_HIGH_RISK' ? (
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span>AUTONOMOUS AUDIT DECISION: {invoice.status.replace(/_/g, ' ')}</span>
              </span>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-slate-300">Risk Score:</span>
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                  riskScore >= 50 ? 'bg-rose-500 text-white' : riskScore >= 10 ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black'
                }`}>
                  {riskScore}/100 ({rationale?.riskLevel || 'LOW'})
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans mb-3">
              {rationale?.summaryText || 'Invoice passed all pre-configured business rules.'}
            </p>

            {/* Bulleted Rationale Reasons */}
            {rationale?.keyReasons && rationale.keyReasons.length > 0 && (
              <div className="space-y-1 bg-black/30 p-3 rounded-lg border border-white/10 font-mono text-[11px]">
                <div className="text-slate-400 font-bold mb-1">EXPLAINABLE RATIONALE BREAKDOWN:</div>
                {rationale.keyReasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-200">
                    <span className="text-emerald-400">•</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 1: Line-by-Line PO Reconciliation Table */}
          <div className="bg-[#121826] border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>1. LINE-ITEM PO RECONCILIATION</span>
              <span className="text-[11px] text-indigo-400 font-normal">
                PO: {invoice.poNumber} {poResult?.matched ? '✅ Matched' : '⚠️ Discrepancy'}
              </span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">PO Unit Price</th>
                    <th className="py-2 px-3 text-right">Invoice Unit Price</th>
                    <th className="py-2 px-3 text-right">Total (₹)</th>
                    <th className="py-2 px-3 text-center">Variance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {invoice.lineItems.map((item) => {
                    const variance = item.priceVariancePercent ?? 0;
                    const poPrice = (variance !== 0)
                      ? Math.round(item.unitPriceINR / (1 + variance / 100))
                      : item.unitPriceINR;

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-sans text-white">{item.description}</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{formatRupees(poPrice)}</td>
                        <td className="py-2.5 px-3 text-right text-slate-200 font-bold">{formatRupees(item.unitPriceINR)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-white">{formatRupees(item.totalINR)}</td>
                        <td className="py-2.5 px-3 text-center">
                          {variance > 5 ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                              +{variance.toFixed(1)}%
                            </span>
                          ) : variance < -5 ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                              {variance.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              0.0%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {poResult && (
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between text-xs font-mono">
                <span className="text-slate-400">Total Billed Variance:</span>
                <span className={poResult.amountVariancePercent > 5 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {poResult.amountVariancePercent > 0 ? `+${poResult.amountVariancePercent.toFixed(1)}%` : '0.0%'} 
                  ({formatRupees(poResult.amountVarianceINR)})
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Beneficiary Bank Audit */}
          <div className="bg-[#121826] border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>2. BENEFICIARY BANK ACCOUNT FRAUD AUDIT</span>
              {bankResult?.isAccountChanged ? (
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded text-[10px] font-bold font-mono">
                  🚨 CRITICAL BANK MISMATCH
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-bold font-mono">
                  ✅ Bank Profile Verified
                </span>
              )}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              {/* Invoice Bank Details */}
              <div className={`p-3 rounded-lg border ${bankResult?.isAccountChanged ? 'bg-rose-950/20 border-rose-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Beneficiary on Invoice:</div>
                <div className="text-white font-bold">{invoice.invoiceBankDetails.accountName}</div>
                <div className="text-slate-300">A/C: {invoice.invoiceBankDetails.accountNumber}</div>
                <div className="text-slate-400">IFSC: {invoice.invoiceBankDetails.ifscCode}</div>
                <div className="text-slate-500 text-[10px]">{invoice.invoiceBankDetails.bankName}</div>
              </div>

              {/* Master Registered Vendor Bank Details */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Master Registered Vendor Profile:</div>
                <div className="text-white font-bold">{bankResult?.registeredBankDetails.accountName || invoice.vendorName}</div>
                <div className="text-slate-300">A/C: {bankResult?.registeredBankDetails.accountNumber || 'N/A'}</div>
                <div className="text-slate-400">IFSC: {bankResult?.registeredBankDetails.ifscCode || 'N/A'}</div>
                <div className="text-slate-500 text-[10px]">{bankResult?.registeredBankDetails.bankName || 'Registered Master Bank'}</div>
              </div>
            </div>
          </div>

          {/* Section 3: Risk Factors Identified */}
          {rationale?.riskFactors && rationale.riskFactors.length > 0 && (
            <div className="bg-[#121826] border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3">
                3. IDENTIFIED RISK SIGNALS ({rationale.riskFactors.length})
              </h4>
              <div className="space-y-2">
                {rationale.riskFactors.map((factor, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start justify-between text-xs">
                    <div>
                      <div className="font-bold text-rose-300 font-mono flex items-center gap-1.5">
                        <span>{factor.label}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{factor.description}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold rounded">
                      +{factor.scoreImpact} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Completed Payment Record if Paid */}
          {invoice.paymentRecord && (
            <div className="bg-teal-950/20 border border-teal-500/40 rounded-xl p-4 text-xs font-mono">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-teal-400" /> SIMULATED PAYOUT SETTLED
                </span>
                <button
                  onClick={() => onOpenReceiptModal(invoice)}
                  className="px-2.5 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 rounded text-xs transition-colors flex items-center gap-1"
                >
                  <span>Download GST Receipt</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Txn Ref: <span className="text-white font-bold">{invoice.paymentRecord.transactionId}</span></div>
                <div>Method: <span className="text-white font-bold">{invoice.paymentRecord.paymentMethod}</span></div>
                <div>UTR Number: <span className="text-white font-bold">{invoice.paymentRecord.utrNumber}</span></div>
                <div>Settled At: <span className="text-slate-400">{invoice.paymentRecord.paidAt.slice(0, 19).replace('T', ' ')}</span></div>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer / Human Review Control Actions */}
        <div className="p-6 bg-[#111827] border-t border-slate-800 space-y-3">
          
          {/* Notes Input */}
          {invoice.status !== 'PAID' && invoice.status !== 'REJECTED' && (
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Finance Auditor Notes / Override Reason:
              </label>
              <input
                type="text"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Optional notes for audit trail log..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
                id="drawer-notes-input"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Close
            </button>

            {invoice.status !== 'PAID' && invoice.status !== 'REJECTED' && (
              <div className="flex items-center space-x-2">
                
                {/* Reject Button */}
                <button
                  onClick={() => onRejectInvoice(invoice.id, reviewNotes)}
                  className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  id="drawer-reject-btn"
                >
                  Reject Invoice
                </button>

                {/* Approve & Execute Payout Button */}
                <button
                  onClick={() => onApproveAndPayout(invoice.id, reviewNotes)}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-1.5 active:scale-95"
                  id="drawer-approve-btn"
                >
                  <Banknote className="w-4 h-4" />
                  <span>Approve & Execute Payout</span>
                </button>

              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
