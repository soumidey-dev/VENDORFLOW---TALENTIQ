import React, { useState } from 'react';
import { StudentProfile, JobDomain } from '../../types/career';
import { PRESET_PROFILES } from '../../services/careerEngine';
import { User, GraduationCap, Building, Calendar, Award, MapPin, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProfileInputSectionProps {
  profile: StudentProfile;
  onChangeProfile: (profile: StudentProfile) => void;
  onLoadPreset: (presetId: string) => void;
  isDark?: boolean;
}

const JOB_DOMAINS: JobDomain[] = [
  'Software Development',
  'Cybersecurity',
  'AI/ML',
  'Data Science',
  'Cloud',
  'DevOps',
  'Data Analytics'
];

export const ProfileInputSection: React.FC<ProfileInputSectionProps> = ({
  profile,
  onChangeProfile,
  onLoadPreset,
  isDark = true
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  const handlePresetClick = (id: string) => {
    setSelectedPresetId(id);
    onLoadPreset(id);
  };

  const updateField = (field: keyof StudentProfile, value: string | number | JobDomain) => {
    onChangeProfile({
      ...profile,
      [field]: value
    });
  };

  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      
      {/* Header & Quick Preset Loaders */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-indigo-400" />
            <h3 className={`text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Candidate Academic & Professional Profile
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Provide student details or load a sample profile for instant 1-click evaluation.
          </p>
        </div>

        {/* 1-Click Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Quick Demo Profiles:
          </span>
          {PRESET_PROFILES.map(p => (
            <button
              key={p.id}
              onClick={() => handlePresetClick(p.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedPresetId === p.id
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                  : isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {p.label.split('—')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-slate-400 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
              isDark ? 'bg-[#080B12] border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* Degree */}
        <div className="space-y-1.5">
          <label className="text-slate-400 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Degree / Program
          </label>
          <input
            type="text"
            value={profile.degree}
            onChange={(e) => updateField('degree', e.target.value)}
            placeholder="e.g. B.Tech"
            className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
              isDark ? 'bg-[#080B12] border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* Branch / Specialization */}
        <div className="space-y-1.5">
          <label className="text-slate-400 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Branch / Department
          </label>
          <input
            type="text"
            value={profile.branch}
            onChange={(e) => updateField('branch', e.target.value)}
            placeholder="e.g. Computer Science & Engg"
            className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
              isDark ? 'bg-[#080B12] border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* College / Institution */}
        <div className="space-y-1.5">
          <label className="text-slate-400 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-indigo-400" /> College / University
          </label>
          <input
            type="text"
            value={profile.college}
            onChange={(e) => updateField('college', e.target.value)}
            placeholder="e.g. NIT Karnataka"
            className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
              isDark ? 'bg-[#080B12] border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* Graduation Year */}
        <div className="space-y-1.5">
          <label className="text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Graduation Year
          </label>
          <input
            type="text"
            value={profile.graduationYear}
            onChange={(e) => updateField('graduationYear', e.target.value)}
            placeholder="e.g. 2026"
            className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
              isDark ? 'bg-[#080B12] border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* CGPA */}
        <div className="space-y-1.5">
          <label className="text-slate-400 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-indigo-400" /> CGPA / Score (Out of 10)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={profile.cgpa}
            onChange={(e) => updateField('cgpa', parseFloat(e.target.value) || 0)}
            placeholder="e.g. 8.51"
            className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
              isDark ? 'bg-[#080B12] border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* Preferred Location */}
        <div className="space-y-1.5">
          <label className="text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Preferred Location
          </label>
          <input
            type="text"
            value={profile.preferredLocation}
            onChange={(e) => updateField('preferredLocation', e.target.value)}
            placeholder="e.g. Bengaluru / Hybrid"
            className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
              isDark ? 'bg-[#080B12] border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* Preferred Job Domain */}
        <div className="space-y-1.5">
          <label className="text-slate-400 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Preferred Job Domain
          </label>
          <select
            value={profile.preferredDomain}
            onChange={(e) => updateField('preferredDomain', e.target.value as JobDomain)}
            className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
              isDark ? 'bg-[#080B12] border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          >
            {JOB_DOMAINS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Profile Active Summary Bar */}
      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-wrap items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-200">Active Candidate: <strong className="text-white">{profile.name || 'Unnamed Candidate'}</strong> ({profile.degree} {profile.branch}, {profile.college})</span>
        </div>
        <span className="text-emerald-400 font-bold">Target Role: {profile.preferredRole || profile.preferredDomain}</span>
      </div>

    </div>
  );
};
