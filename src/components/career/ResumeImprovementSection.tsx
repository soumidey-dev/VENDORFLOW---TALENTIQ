import React, { useState } from 'react';
import { ExtractedResumeData, ResumeImprovementSuggestion } from '../../types/career';
import { generateResumeImprovements } from '../../services/careerEngine';
import { FileEdit, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';

interface ResumeImprovementSectionProps {
  resumeData: ExtractedResumeData;
  isDark?: boolean;
}

export const ResumeImprovementSection: React.FC<ResumeImprovementSectionProps> = ({
  resumeData,
  isDark = true
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<ResumeImprovementSuggestion[]>([]);

  const handleAnalyzeResume = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const results = generateResumeImprovements(resumeData);
      setSuggestions(results);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDark ? 'bg-[#0B0F19] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono">
          <div>
            <div className="flex items-center space-x-2">
              <FileEdit className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-extrabold tracking-tight">Resume Improvement Assistant</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              AI-driven feedback to optimize resume impact, highlight missing industry keywords, and rewrite bullet points with quantifiable metrics.
            </p>
          </div>

          <button
            onClick={handleAnalyzeResume}
            disabled={isAnalyzing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow text-amber-300" />
            <span>{isAnalyzing ? 'Analyzing Resume Structure...' : 'Improve My Resume'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Output Container */}
      {suggestions.length === 0 ? (
        <div className={`p-10 rounded-2xl border text-center font-mono space-y-3 ${
          isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
        }`}>
          <Lightbulb className="w-8 h-8 text-indigo-400 mx-auto" />
          <h4 className="font-bold text-sm text-white">Click "Improve My Resume" to run analysis</h4>
          <p className="text-xs max-w-md mx-auto text-slate-400">
            Evaluates your extracted resume content for weak bullet points, action verb strength, and ATS keyword visibility.
          </p>
        </div>
      ) : (
        <div className="space-y-4 font-mono">
          
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
            <span>Resume Quality Score: <strong className="text-emerald-400">{resumeData.qualityScore || 85}/100</strong></span>
            <span className="text-[10px] text-slate-400">Never fabricates experience • Real optimization</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {suggestions.map((sug, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border space-y-3 transition-all ${
                  isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">
                    {sug.category}
                  </span>
                </div>

                {sug.currentTextSnippet && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Current Weak Bullet / Text:</span>
                    <p className="text-rose-200 italic">"{sug.currentTextSnippet}"</p>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Suggested High-Impact Rewrite:</span>
                  <p className="text-emerald-200 font-semibold">{sug.suggestedImprovement}</p>
                </div>

                <div className="text-xs text-slate-400 flex items-start space-x-2">
                  <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Why it matters:</strong> {sug.rationale}</span>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
