import React from 'react';
import { UnifiedSkill } from '../../types/career';
import { Cpu, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface UnifiedSkillMatrixProps {
  unifiedSkills: UnifiedSkill[];
  isDark?: boolean;
}

export const UnifiedSkillMatrix: React.FC<UnifiedSkillMatrixProps> = ({
  unifiedSkills,
  isDark = true
}) => {
  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Unified Candidate Skill Intelligence Matrix
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                CROSS-VERIFIED FACTS ONLY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Synthesized from Resume + Marksheet Transcript + GitHub Repositories + Certifications.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span>{unifiedSkills.length} Verified Skills Detected</span>
        </div>
      </div>

      {/* Skills Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
        {unifiedSkills.map((skill, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
              isDark ? 'bg-[#080B12] border-slate-800 hover:border-emerald-500/50' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{skill.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                skill.level === 'Strong'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : skill.level === 'Intermediate'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {skill.level}
              </span>
            </div>

            {/* Confidence Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Verification Confidence</span>
                <span className="font-bold text-slate-200">{skill.confidenceScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    skill.confidenceScore >= 80 ? 'bg-emerald-500' : skill.confidenceScore >= 65 ? 'bg-indigo-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${skill.confidenceScore}%` }}
                />
              </div>
            </div>

            {/* Sources Tag */}
            <div className="flex flex-wrap items-center gap-1 pt-1 text-[10px] text-slate-500">
              <span className="text-slate-400">Verified in:</span>
              {skill.sources.map((src, i) => (
                <span key={i} className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {src}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
