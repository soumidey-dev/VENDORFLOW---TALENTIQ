import React from 'react';
import { CareerReadinessScore, RoleMatch, DemoCompanyMatchResult, SkillGap } from '../../types/career';
import { Award, Target, Building2, FileText, ArrowRight, CheckCircle2, ShieldAlert, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface CareerDashboardSectionProps {
  readiness: CareerReadinessScore;
  topRole?: RoleMatch;
  topCompanyMatch?: DemoCompanyMatchResult;
  resumeQualityScore: number;
  topSkillGaps: SkillGap[];
  hasAnalyzedProfile?: boolean;
  onAnalyzeProfile?: () => void;
  onLoadDemo?: () => void;
  isDark?: boolean;
}

export const CareerDashboardSection: React.FC<CareerDashboardSectionProps> = ({
  readiness,
  topRole,
  topCompanyMatch,
  resumeQualityScore,
  topSkillGaps,
  hasAnalyzedProfile = true,
  onAnalyzeProfile,
  onLoadDemo,
  isDark = true
}) => {
  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      
      {!hasAnalyzedProfile && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="font-extrabold text-sm text-white">Complete your profile and upload your documents to begin.</span>
          </div>
          <p className="text-slate-300">
            Upload your resume, marksheets, projects, and certifications or load the demo student profile to view real calculated career readiness scores.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {onAnalyzeProfile && (
              <button
                onClick={onAnalyzeProfile}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold cursor-pointer"
              >
                Analyze My Profile
              </button>
            )}
            {onLoadDemo && (
              <button
                onClick={onLoadDemo}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold cursor-pointer"
              >
                Load Demo Student Profile
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        {/* Readiness Score Card */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-emerald-950/40 via-[#080B12] to-teal-950/20 border-emerald-500/50 shadow-lg' 
            : 'bg-emerald-50/60 border-emerald-300'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CAREER READINESS INDICATOR</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-emerald-400">{readiness.overallScore}</span>
              <span className="text-sm text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Multi-signal placement indicator</span>
          </div>
        </div>

        {/* Top Role Match */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
          isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">TOP ROLE MATCH</span>
            <Target className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className={`text-lg font-extrabold block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {topRole?.roleName || (hasAnalyzedProfile ? 'Java Developer' : 'No Profile Loaded')}
            </span>
            <span className="text-sm font-bold text-indigo-400">
              {hasAnalyzedProfile ? `${topRole?.matchScore || 0}% Alignment` : 'Pending Analysis'}
            </span>
          </div>
        </div>

        {/* Top Demo Company Match */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
          isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">BEST DEMO MATCH</span>
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className={`text-sm font-bold block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {topCompanyMatch?.company.companyName || (hasAnalyzedProfile ? 'TechCorp (DEMO)' : 'No Profile Loaded')}
            </span>
            <span className="text-sm font-bold text-amber-400">
              {hasAnalyzedProfile ? `${topCompanyMatch?.matchScore || 0}% Criteria Fit` : 'Pending Analysis'}
            </span>
          </div>
        </div>

        {/* Resume Score */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
          isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">RESUME QUALITY</span>
            <FileText className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-teal-400">{resumeQualityScore} / 100</span>
            <span className="text-[10px] text-slate-400 block mt-1">ATS & structure score</span>
          </div>
        </div>

      </div>

      {/* Readiness Dimension Breakdown */}
      <div className="space-y-4 font-mono text-xs">
        <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Readiness Multi-Dimension Breakdown
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          <div className={`p-3.5 rounded-xl border space-y-1.5 ${isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex justify-between font-bold">
              <span className="text-slate-400">Academic CGPA (20%)</span>
              <span className="text-teal-400">{readiness.academicScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400" style={{ width: `${readiness.academicScore}%` }} />
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1.5 ${isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex justify-between font-bold">
              <span className="text-slate-400">Technical Skills (25%)</span>
              <span className="text-indigo-400">{readiness.technicalSkillScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${readiness.technicalSkillScore}%` }} />
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1.5 ${isDark ? 'bg-[#080B12] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex justify-between font-bold">
              <span className="text-slate-400">Projects Portfolio (20%)</span>
              <span className="text-purple-400">{readiness.projectScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${readiness.projectScore}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* Recommended Next Action */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500 text-white shrink-0 mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block text-sm">Recommended High-Impact Action:</span>
            <p className="text-slate-300 text-[11px] mt-0.5">
              {topSkillGaps.length > 0 
                ? `Master '${topSkillGaps[0].skill}' by building a 1-week microservice project.` 
                : 'Build a production multi-service backend with Docker and OpenAPI specs.'}
            </p>
          </div>
        </div>

        <span className="text-[10px] text-indigo-300 bg-indigo-950 px-3 py-1.5 rounded-lg border border-indigo-700/50 whitespace-nowrap self-start md:self-auto">
          30-Day Preparation Strategy Ready
        </span>
      </div>

      {/* AI Safety Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center space-x-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Disclaimer:</strong> AI Career Intelligence provides analytical guidance and readiness metrics based on user-supplied documents and open criteria. It does not guarantee placement, hiring outcomes, or official company selection.
        </span>
      </div>

    </div>
  );
};
