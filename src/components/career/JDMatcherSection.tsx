import React, { useState } from 'react';
import { JDMatchResult, UnifiedSkill, StudentProfile } from '../../types/career';
import { analyzeJobDescription } from '../../services/careerEngine';
import { FileSearch, Sparkles, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface JDMatcherSectionProps {
  unifiedSkills: UnifiedSkill[];
  profile: StudentProfile;
  isDark?: boolean;
}

export const JDMatcherSection: React.FC<JDMatcherSectionProps> = ({
  unifiedSkills,
  profile,
  isDark = true
}) => {
  const [jdText, setJdText] = useState('');
  const [matchResult, setMatchResult] = useState<JDMatchResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeJD = () => {
    if (!jdText.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeJobDescription(jdText, unifiedSkills, profile);
      setMatchResult(res);
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Job Description (JD) Keyword Matcher
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full">
                CUSTOM JOB REQUIREMENT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Paste any job post description to analyze keyword coverage and role fit.
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-3 font-mono text-xs">
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste Job Description text here (e.g. 'We are seeking a Java Backend Developer with 0-2 years experience in Spring Boot, PostgreSQL, Docker, and REST APIs...')"
          rows={5}
          className={`w-full p-3.5 rounded-xl border ${
            isDark ? 'bg-[#080B12] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
          }`}
        />

        <button
          onClick={handleAnalyzeJD}
          disabled={!jdText.trim() || isAnalyzing}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold font-mono text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-md"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>{isAnalyzing ? 'Matching Keywords...' : 'Calculate JD Match Score'}</span>
        </button>
      </div>

      {/* Result Output */}
      {matchResult && (
        <div className={`p-5 rounded-2xl border space-y-4 font-mono text-xs ${
          isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{matchResult.jdTitle}</h4>
              <p className="text-[11px] text-slate-400">{matchResult.confidenceExplanation}</p>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-extrabold block ${
                matchResult.matchScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {matchResult.matchScore}%
              </span>
              <span className="text-[9px] text-slate-500 uppercase">JD Match Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Matched */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Matched Keywords
              </span>
              <div className="flex flex-wrap gap-1">
                {matchResult.matchedSkills.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
              <span className="font-bold text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Missing Keywords
              </span>
              <div className="flex flex-wrap gap-1">
                {matchResult.missingSkills.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Recommendations */}
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <span className="font-bold text-slate-200 block">Preparation Recommendations:</span>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              {matchResult.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
};
