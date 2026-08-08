import React from 'react';
import { DemoScenario } from '../types';
import { DEMO_SCENARIOS } from '../data/mockData';
import { X, Sparkles, CheckCircle2, AlertTriangle, ShieldX, Play, ArrowRight } from 'lucide-react';

interface DemoScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunScenario: (scenario: DemoScenario) => void;
  isProcessing: boolean;
}

export const DemoScenariosModal: React.FC<DemoScenariosModalProps> = ({
  isOpen,
  onClose,
  onRunScenario,
  isProcessing
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#121826] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 rounded-xl">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                INTERACTIVE DEMO SCENARIOS
              </h3>
              <p className="text-xs text-slate-400">
                Select a preset B2B test scenario to trigger VendorFlow's Gemini AI Agent and Risk Engine.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Scenario Cards */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {DEMO_SCENARIOS.map((scenario) => {
            return (
              <div
                key={scenario.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition-all group flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <span>{scenario.title}</span>
                    </h4>
                    
                    {scenario.tag === 'AUTO_APPROVED' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> AUTO-APPROVED
                      </span>
                    ) : scenario.tag === 'HUMAN_REVIEW' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> HUMAN REVIEW
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                        <ShieldX className="w-3 h-3" /> BLOCKED HIGH RISK
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mb-2 font-sans">{scenario.description}</p>

                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-indigo-300">
                    <strong>Expected Result:</strong> {scenario.expectedOutcome}
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    disabled={isProcessing}
                    onClick={() => {
                      onRunScenario(scenario);
                      onClose();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-md ${
                      scenario.tag === 'AUTO_APPROVED'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : scenario.tag === 'HUMAN_REVIEW'
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run This Scenario</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111827] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
