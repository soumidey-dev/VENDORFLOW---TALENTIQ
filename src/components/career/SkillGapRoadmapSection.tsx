import React from 'react';
import { SkillGap, RoadmapMilestone } from '../../types/career';
import { Compass, AlertCircle, CheckCircle2, Calendar, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface SkillGapRoadmapSectionProps {
  skillGaps: SkillGap[];
  roadmap: RoadmapMilestone[];
  targetRoleName: string;
  isDark?: boolean;
}

export const SkillGapRoadmapSection: React.FC<SkillGapRoadmapSectionProps> = ({
  skillGaps,
  roadmap,
  targetRoleName,
  isDark = true
}) => {
  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Skill Gap Analysis & 30-Day Personalized Roadmap
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                TARGET: {targetRoleName.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Prioritized technical deficiencies and weekly preparation milestones.
            </p>
          </div>
        </div>
      </div>

      {/* Skill Gaps Priorities Grid */}
      <div className="space-y-3 font-mono text-xs">
        <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Detected Technical Deficiencies
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {skillGaps.map((gap, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border space-y-2 relative transition-all ${
                gap.priority === 'HIGH'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : gap.priority === 'MEDIUM'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-800/40 border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{gap.skill}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  gap.priority === 'HIGH'
                    ? 'bg-rose-500 text-white'
                    : gap.priority === 'MEDIUM'
                    ? 'bg-amber-500 text-black'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {gap.priority} PRIORITY
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">{gap.recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 30-Day Personalized Roadmap Timelines */}
      <div className="space-y-4 font-mono text-xs pt-4 border-t border-slate-800">
        <h4 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Calendar className="w-4 h-4 text-emerald-400" />
          30-Day Actionable Preparation Roadmap
        </h4>

        <div className="space-y-4">
          {roadmap.map((milestone, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border space-y-3 relative transition-all ${
                isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{milestone.week}</span>
                <div className="flex flex-wrap gap-1">
                  {milestone.targetSkills.map((ts, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px]">
                      {ts}
                    </span>
                  ))}
                </div>
              </div>

              <h5 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{milestone.title}</h5>
              <p className="text-slate-400 text-[11px]">{milestone.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <span className="font-bold text-slate-300 text-[11px] block">Weekly Action Items:</span>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {milestone.actionItems.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
