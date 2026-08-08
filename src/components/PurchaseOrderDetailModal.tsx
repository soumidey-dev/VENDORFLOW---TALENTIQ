import React from 'react';
import { PurchaseOrder, Vendor, Invoice } from '../types';
import { 
  X, 
  FileCheck, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  FileText, 
  UserCheck, 
  Calendar, 
  ExternalLink,
  Clock
} from 'lucide-react';

interface PurchaseOrderDetailModalProps {
  po: PurchaseOrder | null;
  vendor: Vendor | null;
  invoices: Invoice[];
  onClose: () => void;
  onOpenInvoiceDrawer?: (invoice: Invoice) => void;
}

export const PurchaseOrderDetailModal: React.FC<PurchaseOrderDetailModalProps> = ({
  po,
  vendor,
  invoices,
  onClose,
  onOpenInvoiceDrawer
}) => {
  if (!po) return null;

  const formatRupees = (val: number = 0) => `₹${val.toLocaleString('en-IN')}`;

  // Find all invoices linked to this PO number
  const matchingInvoices = invoices.filter(
    inv => inv.poNumber?.trim().toUpperCase() === po.poNumber.trim().toUpperCase()
  );

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ACTIVE</span>
          </span>
        );
      case 'FULFILLED':
        return (
          <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>FULFILLED</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>EXPIRED</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono font-bold">
            {status}
          </span>
        );
    }
  };

  const renderDecisionBadge = (decision?: string) => {
    switch (decision) {
      case 'AUTO_APPROVED':
      case 'PAID':
        return (
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{decision === 'PAID' ? 'PAID & SETTLED' : 'AUTO-APPROVED'}</span>
          </span>
        );
      case 'BLOCKED_HIGH_RISK':
        return (
          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded text-[10px] font-mono font-bold flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>BLOCKED HIGH RISK</span>
          </span>
        );
      case 'HUMAN_REVIEW_REQUIRED':
        return (
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[10px] font-mono font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>HUMAN REVIEW</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded text-[10px] font-mono font-bold">
            {decision || 'PROCESSED'}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      
      {/* Modal Card */}
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#0d121f] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{po.poNumber}</h3>
                <span className="text-xs text-slate-400 font-mono">({po.vendorName})</span>
                {renderStatusBadge(po.status)}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Authorized Total: <span className="text-emerald-400 font-bold">{formatRupees(po.totalAmountINR)}</span> • Approved by: {po.approvedBy}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            id="po-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Vendor Verification Status Panel */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-400" /> VENDOR VERIFICATION STATUS
                </span>
                {vendor ? (
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold">
                    UNREGISTERED
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vendor Name:</span>
                  <span className="font-bold text-white font-sans">{po.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vendor ID:</span>
                  <span className="text-indigo-300">{po.vendorId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GSTIN:</span>
                  <span className="text-white font-bold">{vendor?.gstin || '27AAACT8812P1Z8'}</span>
                </div>
                {vendor?.registeredBank && (
                  <div className="pt-2 border-t border-slate-800 text-[11px]">
                    <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Registered Beneficiary Bank A/C:</div>
                    <div className="text-emerald-300 font-bold">{vendor.registeredBank.bankName} - {vendor.registeredBank.accountNumber}</div>
                    <div className="text-slate-400">IFSC: {vendor.registeredBank.ifscCode} ({vendor.registeredBank.branch})</div>
                  </div>
                )}
              </div>
            </div>

            {/* PO Approval & Validity Metadata */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> AUTHORIZATION METADATA
                </span>
                <span className="text-slate-400 text-[10px]">PO Ref: {po.poNumber}</span>
              </div>

              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Authorized By:</span>
                  <span className="text-white font-bold font-sans">{po.approvedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issue Date:</span>
                  <span className="text-slate-200 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {po.issueDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expiry Date:</span>
                  <span className="text-slate-200 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {po.expiryDate}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Authorized Total (INR):</span>
                  <span className="text-emerald-400 font-bold text-sm">{formatRupees(po.totalAmountINR)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Authorized Line Items Table */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> AUTHORIZED LINE ITEMS & CAP LIMITS ({po.items.length})
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price (₹)</th>
                    <th className="py-2.5 px-3 text-right">Authorized Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {po.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-sans font-medium text-white">{item.description}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-300">{item.quantity}</td>
                      <td className="py-3 px-3 text-right text-slate-300">{formatRupees(item.unitPriceINR)}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">{formatRupees(item.totalINR)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subtotal and Tax Breakdown */}
            <div className="pt-3 border-t border-slate-800 flex flex-col items-end space-y-1 text-slate-300">
              <div className="flex justify-between w-64 text-[11px]">
                <span className="text-slate-400">Line Items Subtotal:</span>
                <span className="font-bold text-white">{formatRupees(po.subtotalINR)}</span>
              </div>
              <div className="flex justify-between w-64 text-[11px]">
                <span className="text-slate-400">GST Tax ({po.taxGSTPercent}%):</span>
                <span className="font-bold text-white">{formatRupees(po.totalAmountINR - po.subtotalINR)}</span>
              </div>
              <div className="flex justify-between w-64 text-xs font-bold text-emerald-400 pt-1 border-t border-slate-800">
                <span>Grand Authorized Total:</span>
                <span>{formatRupees(po.totalAmountINR)}</span>
              </div>
            </div>
          </div>

          {/* Reconciled / Matching Invoices Section */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> INVOICES MATCHED AGAINST THIS PURCHASE ORDER ({matchingInvoices.length})
              </h4>
              {matchingInvoices.length > 0 && (
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                  RECONCILED
                </span>
              )}
            </div>

            {matchingInvoices.length > 0 ? (
              <div className="space-y-3">
                {matchingInvoices.map((inv) => {
                  const variance = inv.decisionRationale?.priceVariancePercent ?? 0;
                  const riskScore = inv.decisionRationale?.riskScore ?? 0;
                  const matchResult = inv.decisionRationale?.poMatchResult;

                  return (
                    <div 
                      key={inv.id} 
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-indigo-300 font-mono">{inv.invoiceNumber}</span>
                          <span className="text-slate-400 font-sans text-xs">({inv.vendorName})</span>
                          {inv.sourceType === 'REAL_UPLOAD' ? (
                            <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                              SOURCE: REAL UPLOAD
                            </span>
                          ) : inv.sourceType === 'DEMO_SCENARIO' ? (
                            <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                              SOURCE: DEMO SCENARIO
                            </span>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-2">
                          {renderDecisionBadge(inv.status)}
                          {onOpenInvoiceDrawer && (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenInvoiceDrawer(inv);
                              }}
                              className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Audit Drawer</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Reconciliation & Risk Metrics Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                        <div>
                          <div className="text-slate-500 text-[9px] uppercase font-bold">Billed Total</div>
                          <div className="font-bold text-emerald-400">{formatRupees(inv.totalAmountINR)}</div>
                        </div>

                        <div>
                          <div className="text-slate-500 text-[9px] uppercase font-bold">Price Variance</div>
                          <div className={`font-bold ${variance === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {variance.toFixed(1)}% {variance === 0 ? '(0% Match)' : 'Variance'}
                          </div>
                        </div>

                        <div>
                          <div className="text-slate-500 text-[9px] uppercase font-bold">PO Line Item Match</div>
                          <div className="font-bold text-slate-200">
                            {matchResult?.matched ? '100% Match' : 'Mismatch Detected'}
                          </div>
                        </div>

                        <div>
                          <div className="text-slate-500 text-[9px] uppercase font-bold">Risk Engine Score</div>
                          <div className={`font-bold ${riskScore < 30 ? 'text-emerald-400' : riskScore < 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {riskScore}/100 ({inv.decisionRationale?.riskLevel || 'LOW'})
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-slate-400 font-mono space-y-1 py-6">
                <Clock className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                <div className="text-white font-bold">No Invoices Submitted Against This PO Yet</div>
                <div className="text-[11px] text-slate-400">
                  Invoices submitted with PO reference <span className="text-indigo-300 font-bold">{po.poNumber}</span> and ≤5% price variance will automatically reconcile and auto-approve.
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#111827] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
