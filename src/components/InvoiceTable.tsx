import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '../types';
import { Search, Eye, CheckCircle2, AlertTriangle, ShieldX, Clock, FileText, ArrowUpDown, ExternalLink, Download } from 'lucide-react';

interface InvoiceTableProps {
  invoices: Invoice[];
  activeFilter: string;
  onFilterChange: (status: string) => void;
  onOpenAuditDrawer: (invoice: Invoice) => void;
  onOpenReceiptModal: (invoice: Invoice) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  activeFilter,
  onFilterChange,
  onOpenAuditDrawer,
  onOpenReceiptModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = 
      activeFilter === 'ALL' ||
      inv.status === activeFilter ||
      (activeFilter === 'AUTO_APPROVED' && inv.decisionRationale?.finalDecision === 'AUTO_APPROVED');

    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.vendorGSTIN.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const formatRupees = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const renderStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'AUTO_APPROVED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> AUTO APPROVED
          </span>
        );
      case 'PAID':
        return (
          <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-mono font-semibold flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> PAID / SETTLED
          </span>
        );
      case 'HUMAN_REVIEW_REQUIRED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-semibold flex items-center gap-1 w-fit animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> HUMAN REVIEW
          </span>
        );
      case 'BLOCKED_HIGH_RISK':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-semibold flex items-center gap-1 w-fit">
            <ShieldX className="w-3.5 h-3.5 text-rose-400" /> BLOCKED HIGH RISK
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1 w-fit">
            REJECTED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1 w-fit">
            <Clock className="w-3.5 h-3.5" /> PENDING AUDIT
          </span>
        );
    }
  };

  const renderRiskMeter = (score: number = 0) => {
    let colorClass = 'bg-emerald-500 text-emerald-400';
    if (score >= 70) colorClass = 'bg-rose-500 text-rose-400';
    else if (score >= 30) colorClass = 'bg-amber-500 text-amber-400';

    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colorClass.split(' ')[0]} transition-all duration-500`} 
            style={{ width: `${Math.max(score, 5)}%` }}
          ></div>
        </div>
        <span className={`text-xs font-mono font-bold ${colorClass.split(' ')[1]}`}>
          {score}/100
        </span>
      </div>
    );
  };

  return (
    <div className="bg-[#121826] border border-slate-800 rounded-2xl p-5 shadow-xl">
      
      {/* Controls Bar: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice #, vendor name, GSTIN, PO..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
            id="invoice-search-input"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Invoices' },
            { id: 'AUTO_APPROVED', label: 'Auto Approved' },
            { id: 'HUMAN_REVIEW_REQUIRED', label: 'Human Review' },
            { id: 'PAID', label: 'Paid / Settled' },
            { id: 'BLOCKED_HIGH_RISK', label: 'Blocked High Risk' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
              id={`filter-tab-${tab.id.toLowerCase()}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Table Content */}
      {filteredInvoices.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          <FileText className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-medium">No invoices found matching your filter parameters.</p>
          <p className="text-xs text-slate-600 mt-1">Try resetting search or clicking "Run Demo Scenarios" above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Invoice / File</th>
                <th className="py-3 px-4">Vendor & GSTIN</th>
                <th className="py-3 px-4">PO Ref</th>
                <th className="py-3 px-4 text-right">Billed Amount (₹)</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Decision Outcome</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredInvoices.map((inv) => {
                const riskScore = inv.decisionRationale?.riskScore ?? 0;

                return (
                  <tr 
                    key={inv.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onOpenAuditDrawer(inv)}
                    id={`invoice-row-${inv.id}`}
                  >
                    {/* Invoice ID & Date */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-indigo-300 group-hover:text-indigo-200 flex items-center gap-1.5">
                        <span>{inv.invoiceNumber}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{inv.invoiceDate}</span>
                        <span>•</span>
                        <span className="truncate max-w-[120px]">{inv.fileName || 'document.pdf'}</span>
                        {inv.sourceType === 'REAL_UPLOAD' ? (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                            REAL UPLOAD
                          </span>
                        ) : inv.sourceType === 'DEMO_SCENARIO' ? (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
                            DEMO
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Vendor Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{inv.vendorName}</div>
                      <div className="text-[10px] font-mono text-slate-500">
                        GSTIN: {inv.vendorGSTIN}
                      </div>
                    </td>

                    {/* Purchase Order */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                        {inv.poNumber}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                      {formatRupees(inv.totalAmountINR)}
                    </td>

                    {/* Risk Score */}
                    <td className="py-3.5 px-4">
                      {renderRiskMeter(riskScore)}
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        AI Conf: {inv.decisionRationale?.aiConfidencePercent ?? 95}%
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(inv.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        
                        {/* Audit Drawer Trigger */}
                        <button
                          onClick={() => onOpenAuditDrawer(inv)}
                          className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold transition-all flex items-center gap-1"
                          title="Open Deep Audit Drawer"
                          id={`audit-btn-${inv.id}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Audit</span>
                        </button>

                        {/* Receipt Button if Paid */}
                        {inv.status === 'PAID' && (
                          <button
                            onClick={() => onOpenReceiptModal(inv)}
                            className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-all flex items-center gap-1"
                            title="View GST Payment Receipt"
                            id={`receipt-btn-${inv.id}`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
