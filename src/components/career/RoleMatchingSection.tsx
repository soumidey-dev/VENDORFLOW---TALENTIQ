import React from 'react';
import { RoleMatch } from '../../types/career';
import { Target, CheckCircle2, XCircle, ArrowUpRight, Award, FolderGit2 } from 'lucide-react';

interface RoleMatchingSectionProps {
  roleMatches: RoleMatch[];
  isDark?: boolean;
}

export const RoleMatchingSection: React.FC<RoleMatchingSectionProps> = ({
  roleMatches,
  isDark = true
}) => {
  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Role Matching Engine
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full">
                TRANSPARENT MATCH SCORING
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Evaluates candidate skill evidence against target tech roles.
            </p>
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {roleMatches.map((match, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border space-y-3 relative transition-all ${
              idx === 0
                ? isDark
                  ? 'bg-gradient-to-br from-indigo-950/40 via-[#080B12] to-teal-950/20 border-indigo-500/50 shadow-lg'
                  : 'bg-indigo-50/50 border-indigo-300'
                : isDark
                ? 'bg-[#080B12] border-slate-800 hover:border-indigo-500/30'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {/* Top Badge */}
            {idx === 0 && (
              <span className="absolute -top-2.5 right-3 px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500 text-white rounded-full uppercase tracking-wider shadow-md">
                TOP ROLE MATCH
              </span>
            )}

            {/* Title & Score */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{match.roleName}</h4>
                <span className="text-[10px] text-slate-400">{match.domain}</span>
              </div>
              <div className="text-right">
                <span className={`text-xl font-extrabold block ${
                  match.matchScore >= 85 ? 'text-emerald-400' : match.matchScore >= 70 ? 'text-indigo-400' : 'text-amber-400'
                }`}>
                  {match.matchScore}%
                </span>
                <span className="text-[9px] text-slate-500 uppercase">Match Score</span>
              </div>
            </div>

            {/* Matched vs Missing Skills */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Matched Skills ({match.matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {match.matchedSkills.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {match.missingSkills.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-amber-400" /> Missing / Skill Gaps ({match.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {match.missingSkills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Alignments */}
            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3 text-indigo-400" />
                <span>{match.academicAlignment}</span>
              </div>
              <div className="flex items-center gap-1">
                <FolderGit2 className="w-3 h-3 text-teal-400" />
                <span>Projects: {match.relevantProjects.join(', ')}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
