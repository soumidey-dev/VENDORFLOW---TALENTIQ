import React from 'react';
import { Invoice } from '../types';
import { CheckCircle2, ShieldAlert, Zap, Clock, IndianRupee, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface KPIDashboardProps {
  invoices: Invoice[];
  onSelectFilter: (status: string) => void;
  activeFilter: string;
}

export const KPIDashboard: React.FC<KPIDashboardProps> = ({ invoices, onSelectFilter, activeFilter }) => {
  const totalCount = invoices.length;
  
  const totalAmountINR = invoices.reduce((sum, inv) => sum + inv.totalAmountINR, 0);
  
  const autoApprovedInvoices = invoices.filter(inv => inv.status === 'AUTO_APPROVED' || (inv.status === 'PAID' && inv.decisionRationale?.finalDecision === 'AUTO_APPROVED'));
  const autoApprovalRate = totalCount > 0 ? ((autoApprovedInvoices.length / totalCount) * 100).toFixed(1) : '100.0';

  const pendingReviewCount = invoices.filter(inv => inv.status === 'HUMAN_REVIEW_REQUIRED').length;
  const blockedHighRiskCount = invoices.filter(inv => inv.status === 'BLOCKED_HIGH_RISK').length;

  const capitalProtectedINR = invoices
    .filter(inv => inv.status === 'BLOCKED_HIGH_RISK' || inv.decisionRationale?.riskLevel === 'CRITICAL')
    .reduce((sum, inv) => sum + inv.totalAmountINR, 0);

  const totalPaidINR = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.totalAmountINR, 0);

  const formatRupees = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      
      {/* 1. Total Volume Processed */}
      <div 
        onClick={() => onSelectFilter('ALL')}
        className={`p-4 rounded-xl bg-[#121826] border transition-all cursor-pointer hover:border-slate-600 ${
          activeFilter === 'ALL' ? 'border-indigo-500 ring-1 ring-indigo-500/50 bg-[#172033]' : 'border-slate-800'
        }`}
        id="kpi-card-total"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Total Invoices Audited</span>
          <IndianRupee className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-white tracking-tight">
          {formatRupees(totalAmountINR)}
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 font-mono">
          <span>{totalCount} total submissions</span>
          <span className="text-indigo-400 font-semibold">{formatRupees(totalPaidINR)} settled</span>
        </div>
      </div>

      {/* 2. Autonomous Approval Rate */}
      <div 
        onClick={() => onSelectFilter('AUTO_APPROVED')}
        className={`p-4 rounded-xl bg-[#121826] border transition-all cursor-pointer hover:border-slate-600 ${
          activeFilter === 'AUTO_APPROVED' ? 'border-emerald-500 ring-1 ring-emerald-500/50 bg-[#132328]' : 'border-slate-800'
        }`}
        id="kpi-card-autoapproved"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Autonomous Approval Rate</span>
          <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight flex items-baseline gap-1">
          <span>{autoApprovalRate}%</span>
          <span className="text-xs text-emerald-500 font-sans font-normal">auto-payout</span>
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 font-mono">
          <span>{autoApprovedInvoices.length} invoices cleared</span>
          <span className="text-emerald-400 font-semibold">Zero human clicks</span>
        </div>
      </div>

      {/* 3. Average Processing Speed */}
      <div className="p-4 rounded-xl bg-[#121826] border border-slate-800">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Avg Autonomous Speed</span>
          <Clock className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-cyan-300 tracking-tight flex items-baseline gap-1">
          <span>2.1s</span>
          <span className="text-xs text-slate-400 font-sans font-normal">per invoice</span>
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 font-mono">
          <span>vs 4.5 days manual</span>
          <span className="text-cyan-400 font-semibold">99.9% faster</span>
        </div>
      </div>

      {/* 4. Protected Capital / Fraud Blocked */}
      <div 
        onClick={() => onSelectFilter('BLOCKED_HIGH_RISK')}
        className={`p-4 rounded-xl bg-[#121826] border transition-all cursor-pointer hover:border-slate-600 ${
          activeFilter === 'BLOCKED_HIGH_RISK' ? 'border-rose-500 ring-1 ring-rose-500/50 bg-[#26151c]' : 'border-slate-800'
        }`}
        id="kpi-card-protected"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Capital Protected</span>
          <ShieldAlert className="w-4 h-4 text-rose-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-rose-400 tracking-tight">
          {formatRupees(capitalProtectedINR)}
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 font-mono">
          <span>{blockedHighRiskCount} fraud attacks blocked</span>
          <span className="text-rose-400 font-semibold">100% demo accuracy</span>
        </div>
      </div>

      {/* 5. Human Review Exception Queue */}
      <div 
        onClick={() => onSelectFilter('HUMAN_REVIEW_REQUIRED')}
        className={`p-4 rounded-xl bg-[#121826] border transition-all cursor-pointer hover:border-slate-600 ${
          activeFilter === 'HUMAN_REVIEW_REQUIRED' ? 'border-amber-500 ring-1 ring-amber-500/50 bg-[#261d12]' : 'border-slate-800'
        }`}
        id="kpi-card-review"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Pending Human Review</span>
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-amber-400 tracking-tight flex items-baseline gap-2">
          <span>{pendingReviewCount}</span>
          <span className="text-xs text-amber-300 font-sans font-normal">exceptions</span>
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 font-mono">
          <span>Human-in-the-Loop</span>
          <span className="text-amber-400 font-semibold">Requires action</span>
        </div>
      </div>

    </div>
  );
};
