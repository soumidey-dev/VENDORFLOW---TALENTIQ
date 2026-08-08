import React from 'react';
import { Bot, FileSearch, ShieldCheck, Cpu, Banknote, CheckCircle, AlertTriangle, ShieldX, Eye } from 'lucide-react';
import { InvoiceStatus, Invoice } from '../types';

interface AgentWorkflowProgressProps {
  currentStep: number; // 0 to 6
  invoiceNumber?: string;
  vendorName?: string;
  status?: InvoiceStatus;
  riskScore?: number;
  isCompleted?: boolean;
  onSelectStage?: (stageId: number) => void;
  selectedStageId?: number | null;
  activeInvoice?: Invoice | null;
}

const STEPS = [
  { id: 0, title: 'Document Upload', desc: 'PDF / Image Received', icon: FileSearch },
  { id: 1, title: 'Gemini OCR Extraction', desc: 'Multimodal Structure Extraction', icon: Bot },
  { id: 2, title: 'PO Reconciliation', desc: 'Line Item & Price Matching', icon: Cpu },
  { id: 3, title: 'Bank Fraud Audit', desc: 'Beneficiary Account Audit', icon: ShieldCheck },
  { id: 4, title: 'Deterministic Risk Engine', desc: 'Calculated Risk Score 0-100', icon: AlertTriangle },
  { id: 5, title: 'Autonomous Decision', desc: 'Auto-Payout vs Human Review', icon: CheckCircle },
  { id: 6, title: 'Simulated Payout & Hash Log', desc: 'RTGS Execution & Hash Chain', icon: Banknote },
];

export const AgentWorkflowProgress: React.FC<AgentWorkflowProgressProps> = ({
  currentStep,
  invoiceNumber,
  vendorName,
  status,
  riskScore,
  isCompleted,
  onSelectStage,
  selectedStageId,
  activeInvoice
}) => {
  const rationale = activeInvoice?.decisionRationale;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-indigo-500/30 shadow-2xl mb-6 relative overflow-hidden font-sans">
      
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono tracking-tight flex flex-wrap items-center gap-2">
              <span>AUTONOMOUS AGENT PIPELINE</span>
              {(invoiceNumber || activeInvoice) && (
                <span className="text-xs font-mono text-indigo-400 font-medium flex items-center gap-2">
                  • Active: {invoiceNumber || activeInvoice?.invoiceNumber} ({vendorName || activeInvoice?.vendorName})
                  {activeInvoice?.sourceType === 'REAL_UPLOAD' ? (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                      SOURCE: REAL UPLOAD
                    </span>
                  ) : activeInvoice?.sourceType === 'DEMO_SCENARIO' ? (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                      SOURCE: DEMO SCENARIO
                    </span>
                  ) : null}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Click any stage card below to inspect live OCR, PO matching, bank fraud audit, or risk math details.
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        {(isCompleted || activeInvoice) && (status || activeInvoice?.status) && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-xs font-mono text-slate-400">Outcome:</span>
            {(status === 'AUTO_APPROVED' || status === 'PAID' || activeInvoice?.status === 'PAID' || activeInvoice?.status === 'AUTO_APPROVED') ? (
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> AUTO-APPROVED (Risk: {riskScore ?? rationale?.riskScore ?? 2}/100)
              </span>
            ) : (status === 'BLOCKED_HIGH_RISK' || activeInvoice?.status === 'BLOCKED_HIGH_RISK') ? (
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg flex items-center gap-1">
                <ShieldX className="w-3.5 h-3.5 text-rose-400" /> BLOCKED HIGH RISK (Risk: {riskScore ?? rationale?.riskScore ?? 88}/100)
              </span>
            ) : (
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> HUMAN REVIEW REQUIRED (Risk: {riskScore ?? rationale?.riskScore ?? 38}/100)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progress Steps Grid - Clickable & Interactive */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {STEPS.map((step) => {
          const IconComponent = step.icon;
          const isActiveExecuting = !isCompleted && currentStep === step.id;
          const isSelected = selectedStageId === step.id;

          // Determine stage specific status for coloring
          let stepBorderColor = 'border-slate-800 bg-slate-950/40 text-slate-500';
          let iconBg = 'bg-slate-800 text-slate-500';

          if (isActiveExecuting) {
            stepBorderColor = 'bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-500/40 text-white animate-pulse';
            iconBg = 'bg-indigo-500 text-white';
          } else if (isCompleted || currentStep > step.id) {
            // Stage execution color depending on result
            if (step.id === 2 && rationale && !rationale.poMatchResult.matched) {
              // PO discrepancy -> Amber
              stepBorderColor = 'bg-amber-950/20 border-amber-500/50 text-amber-300';
              iconBg = 'bg-amber-500/20 text-amber-400 border border-amber-500/50';
            } else if (step.id === 3 && rationale && (!rationale.bankVerificationResult.matched || rationale.duplicateCheckResult.isDuplicate)) {
              // Bank fraud alert -> Red
              stepBorderColor = 'bg-rose-950/20 border-rose-500/60 text-rose-300';
              iconBg = 'bg-rose-500/20 text-rose-400 border border-rose-500/50';
            } else if (step.id === 4 && rationale && rationale.riskScore >= 70) {
              // High Risk Math -> Red
              stepBorderColor = 'bg-rose-950/20 border-rose-500/60 text-rose-300';
              iconBg = 'bg-rose-500/20 text-rose-400 border border-rose-500/50';
            } else if (step.id === 4 && rationale && rationale.riskScore >= 30) {
              // Medium Risk Math -> Amber
              stepBorderColor = 'bg-amber-950/20 border-amber-500/50 text-amber-300';
              iconBg = 'bg-amber-500/20 text-amber-400 border border-amber-500/50';
            } else if (step.id === 5 && activeInvoice?.status === 'BLOCKED_HIGH_RISK') {
              // Blocked -> Red
              stepBorderColor = 'bg-rose-950/20 border-rose-500/60 text-rose-300';
              iconBg = 'bg-rose-500/20 text-rose-400 border border-rose-500/50';
            } else if (step.id === 5 && activeInvoice?.status === 'HUMAN_REVIEW_REQUIRED') {
              // Human review -> Amber
              stepBorderColor = 'bg-amber-950/20 border-amber-500/50 text-amber-300';
              iconBg = 'bg-amber-500/20 text-amber-400 border border-amber-500/50';
            } else if (step.id === 6 && activeInvoice && activeInvoice.status !== 'PAID' && !activeInvoice.paymentRecord) {
              // Payout not executed yet -> Muted amber/slate
              stepBorderColor = 'bg-slate-900/60 border-slate-800 text-slate-400';
              iconBg = 'bg-slate-800 text-slate-500';
            } else {
              // Success green
              stepBorderColor = 'bg-slate-900/90 border-emerald-500/40 text-slate-200';
              iconBg = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50';
            }
          }

          return (
            <button
              key={step.id}
              onClick={() => onSelectStage && onSelectStage(step.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col items-center text-center cursor-pointer group relative hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-950/50 hover:border-indigo-400 ${stepBorderColor} ${
                isSelected ? 'ring-2 ring-indigo-400 border-indigo-400 bg-indigo-950/30' : ''
              }`}
              id={`pipeline-card-stage-${step.id}`}
              type="button"
            >
              {/* Click to Inspect Overlay Hint */}
              <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-3 h-3 text-indigo-300" />
              </div>

              <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1.5 transition-all ${iconBg}`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>

              <span className="text-[11px] font-bold tracking-tight text-slate-200 leading-tight mb-0.5 group-hover:text-white">
                {step.title}
              </span>

              <span className="text-[9px] text-slate-400 font-mono line-clamp-1 group-hover:text-slate-300">
                {step.desc}
              </span>

              <div className="mt-1.5 text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-950/60 text-indigo-300 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                Inspect Details →
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
