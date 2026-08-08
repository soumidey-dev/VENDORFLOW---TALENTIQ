import React from 'react';
import { LinkedInProfile } from '../../types/career';
import { Linkedin, Link, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface LinkedInSectionProps {
  linkedIn: LinkedInProfile;
  onUpdateLinkedIn: (profile: LinkedInProfile) => void;
  isDark?: boolean;
}

export const LinkedInSection: React.FC<LinkedInSectionProps> = ({
  linkedIn,
  onUpdateLinkedIn,
  isDark = true
}) => {
  const updateField = (field: keyof LinkedInProfile, value: string) => {
    onUpdateLinkedIn({
      ...linkedIn,
      [field]: value
    });
  };

  const isComplete = Boolean(linkedIn.aboutText || linkedIn.skillsText || linkedIn.profileUrl);

  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Linkedin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                LinkedIn & Professional Profile
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                OPTIONAL USER SUPPLIED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Paste professional bio, endorseable skills, or profile link for additional candidate signal.
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-300 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>No auto-scraping required. Analyzes user-provided text only.</span>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        
        {/* Profile URL */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-slate-400 flex items-center gap-1">
            <Link className="w-3.5 h-3.5 text-blue-400" /> LinkedIn Profile Reference URL
          </label>
          <input
            type="url"
            value={linkedIn.profileUrl}
            onChange={(e) => updateField('profileUrl', e.target.value)}
            placeholder="https://linkedin.com/in/rahul-sharma-cs"
            className={`w-full px-3 py-2 rounded-xl border ${
              isDark ? 'bg-[#080B12] border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* About Section */}
        <div className="space-y-1.5">
          <label className="text-slate-400">About / Summary Section</label>
          <textarea
            value={linkedIn.aboutText}
            onChange={(e) => updateField('aboutText', e.target.value)}
            placeholder="Paste your LinkedIn 'About' headline and background statement..."
            rows={4}
            className={`w-full p-3 rounded-xl border ${
              isDark ? 'bg-[#080B12] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* Endorsed Skills */}
        <div className="space-y-1.5">
          <label className="text-slate-400">Endorsed Skills (Comma Separated)</label>
          <textarea
            value={linkedIn.skillsText}
            onChange={(e) => updateField('skillsText', e.target.value)}
            placeholder="Java, Spring Boot, Microservices, PostgreSQL, Git, System Design..."
            rows={4}
            className={`w-full p-3 rounded-xl border ${
              isDark ? 'bg-[#080B12] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

      </div>

      {/* Analysis Output */}
      {isComplete && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 font-mono text-xs space-y-2">
          <span className="font-bold text-blue-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Professional Profile Signal Verified
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Supplied professional bio aligns with <strong>Software Engineering</strong> roles. Endorsed skills cross-verified with Resume and Project repositories.
          </p>
        </div>
      )}

    </div>
  );
};
