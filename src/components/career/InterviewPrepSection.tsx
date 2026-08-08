import React, { useState } from 'react';
import { InterviewQuestion, UnifiedSkill, CandidateProject } from '../../types/career';
import { generateInterviewQuestions } from '../../services/careerEngine';
import { HelpCircle, Sparkles, MessageSquare, Code, User, ChevronDown, ChevronUp } from 'lucide-react';

interface InterviewPrepSectionProps {
  targetRole: string;
  unifiedSkills: UnifiedSkill[];
  projects: CandidateProject[];
  isDark?: boolean;
}

export const InterviewPrepSection: React.FC<InterviewPrepSectionProps> = ({
  targetRole,
  unifiedSkills,
  projects,
  isDark = true
}) => {
  const questions = generateInterviewQuestions(targetRole, unifiedSkills, projects);
  const [expandedId, setExpandedId] = useState<string | null>('iq-1');

  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Role & Resume AI Interview Practice
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full">
                PRACTICE QUESTIONS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Custom generated interview questions tailored to candidate's projects, skills, and target role.
            </p>
          </div>
        </div>
      </div>

      {/* Questions Accordion */}
      <div className="space-y-3 font-mono text-xs">
        {questions.map((q) => {
          const isExpanded = expandedId === q.id;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl border space-y-2 transition-all ${
                isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    q.category === 'Technical'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : q.category === 'Project'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  }`}>
                    {q.category}
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{q.question}</span>
                </div>

                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>

              {isExpanded && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400 block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Sample Answer Structure Hint:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{q.sampleAnswerHint}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
