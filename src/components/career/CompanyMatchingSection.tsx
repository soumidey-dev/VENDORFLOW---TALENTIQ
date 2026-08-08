import React from 'react';
import { DemoCompanyMatchResult } from '../../types/career';
import { Building2, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface CompanyMatchingSectionProps {
  companyMatches: DemoCompanyMatchResult[];
  isDark?: boolean;
}

export const CompanyMatchingSection: React.FC<CompanyMatchingSectionProps> = ({
  companyMatches,
  isDark = true
}) => {
  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      
      {/* Header with Mandatory Synthetic Data Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Company Requirement Matching
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full animate-pulse">
                DEMO COMPANY DATA — SYNTHETIC BENCHMARKS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Compares candidate skill profile against synthetic enterprise job criteria.
            </p>
          </div>
        </div>
      </div>

      {/* Synthetic Disclaimer */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Notice:</strong> These company profiles are synthetic demo benchmarks used to evaluate requirement readiness. They do not represent real active job postings or hiring guarantees.
        </span>
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {companyMatches.map((res, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border space-y-3 relative transition-all ${
              isDark ? 'bg-[#080B12] border-slate-800 hover:border-amber-500/40' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{res.company.companyName}</h4>
                <span className="text-[10px] text-amber-400 font-bold block">{res.company.role}</span>
                <span className="text-[10px] text-slate-400">{res.company.location} • Min CGPA: {res.company.minCGPA}</span>
              </div>
              <div className="text-right">
                <span className={`text-xl font-extrabold block ${
                  res.matchScore >= 85 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {res.matchScore}%
                </span>
                <span className="text-[9px] text-slate-500 uppercase">Demo Match</span>
              </div>
            </div>

            {/* Why It Matches */}
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-emerald-400 block">Match Rationale:</span>
              <p>{res.whyItMatches}</p>
            </div>

            {/* Required Skills */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400">Required Skills:</span>
              <div className="flex flex-wrap gap-1">
                {res.company.requiredSkills.map((s, i) => {
                  const isMatched = res.matchedSkills.includes(s);
                  return (
                    <span
                      key={i}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isMatched
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {s} {isMatched ? '✓' : '✗'}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Recommended Prep */}
            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-start space-x-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Preparation Step:</strong> {res.recommendedPrep}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
