import React, { useState } from 'react';
import { PurchaseOrder, Vendor, Invoice } from '../types';
import { FileCheck, Building2, ExternalLink, ChevronRight, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PurchaseOrderDetailModal } from './PurchaseOrderDetailModal';

interface PurchaseOrdersViewProps {
  purchaseOrders: PurchaseOrder[];
  vendors: Vendor[];
  invoices?: Invoice[];
  onOpenInvoiceDrawer?: (invoice: Invoice) => void;
}

export const PurchaseOrdersView: React.FC<PurchaseOrdersViewProps> = ({ 
  purchaseOrders, 
  vendors,
  invoices = [],
  onOpenInvoiceDrawer
}) => {
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const formatRupees = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const selectedVendor = selectedPO ? (
    vendors.find(v => 
      v.id === selectedPO.vendorId || 
      v.name.toLowerCase().trim() === selectedPO.vendorName.toLowerCase().trim() ||
      v.name.toLowerCase().includes(selectedPO.vendorName.toLowerCase()) ||
      selectedPO.vendorName.toLowerCase().includes(v.name.toLowerCase())
    ) || null
  ) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Purchase Orders Section */}
      <div className="bg-[#121826] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-indigo-400" /> REGISTERED ACTIVE PURCHASE ORDERS ({purchaseOrders.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            💡 Click any Purchase Order row to view authorized caps, line items, and matched invoices
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Line Items</th>
                <th className="py-3 px-4 text-right">Authorized Total (₹)</th>
                <th className="py-3 px-4">Approved By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {purchaseOrders.map((po) => {
                const matchedInvoicesCount = invoices.filter(
                  inv => inv.poNumber?.trim().toUpperCase() === po.poNumber.trim().toUpperCase()
                ).length;

                return (
                  <tr 
                    key={po.poNumber} 
                    onClick={() => setSelectedPO(po)}
                    id={`po-row-${po.poNumber}`}
                    className="hover:bg-indigo-950/20 cursor-pointer transition-all group"
                  >
                    <td className="py-3.5 px-4 font-bold text-indigo-300 group-hover:text-indigo-200 flex items-center gap-1.5">
                      <span>{po.poNumber}</span>
                      {matchedInvoicesCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                          {matchedInvoicesCount} MATCHED
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-semibold text-white group-hover:text-indigo-100">{po.vendorName}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans max-w-[240px] truncate">
                      {po.items.map(i => i.description).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400 text-sm">
                      {formatRupees(po.totalAmountINR)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-sans text-[11px]">{po.approvedBy}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPO(po);
                        }}
                        className="px-2.5 py-1 bg-indigo-500/10 group-hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 group-hover:border-indigo-400 rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Master Vendor Registry */}
      <div className="bg-[#121826] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-400" /> MASTER REGISTERED VENDORS ({vendors.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((v) => {
            const vendorPO = purchaseOrders.find(
              po => po.vendorId === v.id || po.vendorName.toLowerCase().includes(v.name.toLowerCase()) || v.name.toLowerCase().includes(po.vendorName.toLowerCase())
            );

            return (
              <div 
                key={v.id} 
                onClick={() => {
                  if (vendorPO) setSelectedPO(vendorPO);
                }}
                className={`p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2.5 transition-all ${
                  vendorPO ? 'hover:border-teal-500/50 hover:bg-slate-900/90 cursor-pointer group' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-sans text-sm group-hover:text-teal-200 transition-colors">{v.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {v.status}
                    </span>
                  </div>
                </div>

                <div className="text-slate-400 text-[11px] flex flex-wrap items-center justify-between gap-1">
                  <span>GSTIN: <strong className="text-slate-200">{v.gstin}</strong></span>
                  <span>Rating: ⭐ {v.rating}</span>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-0.5">
                  <div className="text-slate-400 uppercase text-[9px] font-bold flex items-center justify-between">
                    <span>Registered Beneficiary Bank A/C:</span>
                    <span className="text-emerald-400 font-mono text-[9px]">Verified</span>
                  </div>
                  <div className="font-bold text-white">{v.registeredBank.bankName} - {v.registeredBank.accountNumber}</div>
                  <div className="text-slate-400">IFSC: {v.registeredBank.ifscCode} ({v.registeredBank.branch})</div>
                </div>

                {vendorPO && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-indigo-400 font-bold">
                      Linked Active PO: {vendorPO.poNumber} ({formatRupees(vendorPO.totalAmountINR)})
                    </span>
                    <span className="text-teal-400 text-[10px] font-bold group-hover:underline flex items-center gap-0.5">
                      <span>View PO</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase Order Detail Modal */}
      <PurchaseOrderDetailModal
        po={selectedPO}
        vendor={selectedVendor}
        invoices={invoices}
        onClose={() => setSelectedPO(null)}
        onOpenInvoiceDrawer={onOpenInvoiceDrawer}
      />

    </div>
  );
};
