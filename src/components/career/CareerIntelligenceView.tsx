import React, { useState, useEffect, useMemo } from 'react';
import { 
  StudentProfile, 
  ExtractedResumeData, 
  MarksheetData, 
  LinkedInProfile, 
  CandidateProject,
  CertificationItem
} from '../../types/career';
import { 
  PRESET_PROFILES, 
  calculateUnifiedSkills, 
  evaluateRoleMatches, 
  evaluateCompanyMatches, 
  calculateCareerReadiness, 
  generateSkillGapsAndRoadmap 
} from '../../services/careerEngine';

import { ProfileInputSection } from './ProfileInputSection';
import { ResumeAnalyzerSection } from './ResumeAnalyzerSection';
import { MarksheetAnalyzerSection } from './MarksheetAnalyzerSection';
import { LinkedInSection } from './LinkedInSection';
import { ProjectAnalyzerSection } from './ProjectAnalyzerSection';
import { CertificationsSection } from './CertificationsSection';
import { UnifiedSkillMatrix } from './UnifiedSkillMatrix';
import { RoleMatchingSection } from './RoleMatchingSection';
import { CompanyMatchingSection } from './CompanyMatchingSection';
import { CareerDashboardSection } from './CareerDashboardSection';
import { SkillGapRoadmapSection } from './SkillGapRoadmapSection';
import { JDMatcherSection } from './JDMatcherSection';
import { InterviewPrepSection } from './InterviewPrepSection';
import { ResumeImprovementSection } from './ResumeImprovementSection';

import { 
  GraduationCap, 
  Sparkles, 
  LayoutDashboard, 
  User, 
  FileText, 
  BookOpen, 
  Linkedin, 
  FolderGit2, 
  Award,
  Cpu, 
  Target, 
  Building2, 
  Compass, 
  FileSearch, 
  HelpCircle, 
  FileEdit,
  RefreshCw,
  Info,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';

interface CareerIntelligenceViewProps {
  isDark?: boolean;
  onNavigateToPlatformChooser?: () => void;
  onToggleTheme?: () => void;
}

export type CareerTab = 
  | 'DASHBOARD'
  | 'PROFILE'
  | 'RESUME'
  | 'MARKSHEET'
  | 'LINKEDIN'
  | 'PROJECTS'
  | 'CERTIFICATIONS'
  | 'SKILLS'
  | 'ROLE_MATCH'
  | 'COMPANY_MATCH'
  | 'ROADMAP'
  | 'JD_MATCHER'
  | 'INTERVIEW_PREP'
  | 'RESUME_IMPROVEMENT';

const STORAGE_KEY = 'careermatch_student_data';

export const CareerIntelligenceView: React.FC<CareerIntelligenceViewProps> = ({
  isDark = true,
  onNavigateToPlatformChooser,
  onToggleTheme
}) => {
  const [activeTab, setActiveTab] = useState<CareerTab>('DASHBOARD');
  const [hasAnalyzedProfile, setHasAnalyzedProfile] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Core Candidate State (Defaults to clean empty state until user creates profile or loads demo)
  const [profile, setProfile] = useState<StudentProfile>({
    name: '',
    degree: '',
    branch: '',
    college: '',
    graduationYear: '',
    cgpa: 0,
    preferredLocation: '',
    preferredDomain: 'Software Development',
    preferredRole: ''
  });
  const [resumeData, setResumeData] = useState<ExtractedResumeData>({
    education: [],
    skills: [],
    programmingLanguages: [],
    frameworks: [],
    tools: [],
    experience: [],
    projects: [],
    certifications: [],
    qualityScore: 0,
    summary: '',
    extractedAt: ''
  });
  const [marksheetData, setMarksheetData] = useState<MarksheetData>({
    semester: '',
    cgpa: 0,
    percentage: 0,
    backlogsCount: 0,
    subjects: [],
    strongSubjects: [],
    moderateSubjects: [],
    academicTrend: 'N/A'
  });
  const [linkedIn, setLinkedIn] = useState<LinkedInProfile>({
    aboutText: '',
    skillsText: '',
    experienceText: '',
    projectsText: '',
    profileUrl: ''
  });
  const [projects, setProjects] = useState<CandidateProject[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string | null>(null);

  // Load state from localStorage on mount if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.resumeData) setResumeData(parsed.resumeData);
        if (parsed.marksheetData) setMarksheetData(parsed.marksheetData);
        if (parsed.linkedIn) setLinkedIn(parsed.linkedIn);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.certifications) setCertifications(parsed.certifications);
        if (typeof parsed.hasAnalyzedProfile === 'boolean') setHasAnalyzedProfile(parsed.hasAnalyzedProfile);
        if (typeof parsed.isDemoMode === 'boolean') setIsDemoMode(parsed.isDemoMode);
      }
    } catch (e) {
      console.error('Failed to parse localStorage candidate data:', e);
    }
  }, []);

  // Save state to localStorage on updates
  useEffect(() => {
    try {
      const dataToSave = {
        profile,
        resumeData,
        marksheetData,
        linkedIn,
        projects,
        certifications,
        hasAnalyzedProfile,
        isDemoMode
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to save candidate data to localStorage:', e);
    }
  }, [profile, resumeData, marksheetData, linkedIn, projects, certifications, hasAnalyzedProfile, isDemoMode]);

  // Load Demo Student
  const handleLoadDemoStudent = () => {
    const preset = PRESET_PROFILES[0];
    setProfile(preset.profile);
    setResumeData(preset.resume);
    setMarksheetData(preset.marksheet);
    setProjects(preset.projects);
    setCertifications([
      {
        id: 'cert-1',
        name: 'Oracle Certified Associate, Java SE 11',
        issuingOrganization: 'Oracle',
        year: '2024',
        skillsCovered: ['Java', 'OOP', 'Data Structures']
      },
      {
        id: 'cert-2',
        name: 'AWS Certified Cloud Practitioner',
        issuingOrganization: 'Amazon Web Services',
        year: '2025',
        skillsCovered: ['AWS', 'Cloud Architecture', 'Linux']
      }
    ]);
    setIsDemoMode(true);
    setHasAnalyzedProfile(true);
    setActiveTab('DASHBOARD');
  };

  // Load Preset by ID
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_PROFILES.find(p => p.id === presetId);
    if (!preset) return;

    setProfile(preset.profile);
    setResumeData(preset.resume);
    setMarksheetData(preset.marksheet);
    setProjects(preset.projects);
    setIsDemoMode(true);
    setHasAnalyzedProfile(true);
  };

  // Reset Demo / Clear Profile
  const handleResetDemo = () => {
    setProfile({
      name: '',
      degree: '',
      branch: '',
      college: '',
      graduationYear: '',
      cgpa: 0,
      preferredLocation: '',
      preferredDomain: 'Software Development',
      preferredRole: ''
    });
    setResumeData({
      education: [],
      skills: [],
      programmingLanguages: [],
      frameworks: [],
      tools: [],
      experience: [],
      projects: [],
      certifications: [],
      qualityScore: 0,
      summary: '',
      extractedAt: ''
    });
    setMarksheetData({
      semester: 'Semester I',
      cgpa: 0,
      percentage: 0,
      backlogsCount: 0,
      subjects: [],
      strongSubjects: [],
      moderateSubjects: [],
      academicTrend: 'Stable'
    });
    setProjects([]);
    setCertifications([]);
    setIsDemoMode(false);
    setHasAnalyzedProfile(false);
    localStorage.removeItem(STORAGE_KEY);
    setActiveTab('PROFILE');
  };

  // Recalculate Evaluation Engine Signals
  const unifiedSkills = useMemo(() => {
    return calculateUnifiedSkills(resumeData, marksheetData, projects, linkedIn);
  }, [resumeData, marksheetData, projects, linkedIn]);

  const roleMatches = useMemo(() => {
    return evaluateRoleMatches(unifiedSkills, profile, projects, marksheetData);
  }, [unifiedSkills, profile, projects, marksheetData]);

  const companyMatches = useMemo(() => {
    return evaluateCompanyMatches(unifiedSkills, profile, projects, marksheetData);
  }, [unifiedSkills, profile, projects, marksheetData]);

  const readinessScore = useMemo(() => {
    return calculateCareerReadiness(profile, resumeData, marksheetData, projects, roleMatches);
  }, [profile, resumeData, marksheetData, projects, roleMatches]);

  const { skillGaps, roadmap } = useMemo(() => {
    return generateSkillGapsAndRoadmap(profile.preferredRole || 'Java Developer', unifiedSkills);
  }, [profile.preferredRole, unifiedSkills]);

  // Primary CTA: Analyze My Profile (Pipeline execution with progress steps)
  const handleAnalyzeProfile = async () => {
    setIsAnalyzing(true);
    
    setAnalysisStep('Profile & Documents Ingestion...');
    await new Promise(r => setTimeout(r, 300));

    setAnalysisStep('AI Skill Intelligence Extraction...');
    await new Promise(r => setTimeout(r, 350));

    setAnalysisStep('Evaluating Role & Company Matching...');
    await new Promise(r => setTimeout(r, 350));

    setAnalysisStep('Generating Skill Gap & 30-Day Roadmap...');
    await new Promise(r => setTimeout(r, 300));

    setIsAnalyzing(false);
    setAnalysisStep(null);
    setHasAnalyzedProfile(true);
    setActiveTab('DASHBOARD');
  };

  return (
    <div className="space-y-6">
      
      {/* CAREERMATCH TOP APPLICATION HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 px-4 lg:px-8 py-3.5 -mx-4 lg:-mx-8 -mt-6 mb-6 ${
        isDark 
          ? 'bg-[#0B0F19]/90 border-slate-800/80 text-white' 
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center shadow-lg ${
              isDark 
                ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300' 
                : 'bg-purple-50 border-purple-200 text-purple-700'
            }`}>
              <GraduationCap className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className={`text-xl font-extrabold tracking-tight font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Career<span className="text-purple-400">Match</span> Intelligence
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-full">
                  PLACEMENT AI
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Understand Your Profile. Discover Your Best-Fit Career.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onNavigateToPlatformChooser && (
              <button
                onClick={onNavigateToPlatformChooser}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
                id="careermatch-back-platform-btn"
              >
                <ArrowLeft className="w-4 h-4 text-purple-400" />
                <span>Back to Platform</span>
              </button>
            )}

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-indigo-600 border-slate-300'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>

        </div>
      </header>
      
      {/* Top Hero Banner */}
      <div className={`p-6 md:p-8 rounded-3xl border transition-all relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-[#0F172A] via-[#0B0F19] to-[#1E1B4B] border-indigo-500/30 text-white shadow-xl' 
          : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200 text-slate-900 shadow-md'
      }`}>
        <div className="max-w-4xl space-y-4 relative z-10 font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              CAREERMATCH INTELLIGENCE
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              DOCUMENT INTELLIGENCE
            </span>
            {isDemoMode && (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                DEMO PROFILE
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CareerMatch Intelligence
          </h2>

          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            "Understand Your Profile. Discover Your Best-Fit Career." Analyzes resumes, transcript marksheets, projects, and target role criteria deterministically.
          </p>

          {/* Workflow Pipeline Diagram */}
          <div className="pt-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">INTELLIGENCE WORKFLOW PIPELINE:</span>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
              {['Profile', 'Documents', 'AI Analysis', 'Skills', 'Role Matching', 'Recommendations'].map((step, idx, arr) => (
                <React.Fragment key={step}>
                  <span className={`px-2.5 py-1 rounded-lg border ${
                    analysisStep?.includes(step)
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold animate-pulse'
                      : 'bg-indigo-900/60 border-indigo-700/50 text-indigo-200'
                  }`}>
                    {step}
                  </span>
                  {idx < arr.length - 1 && <span className="text-slate-500">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Action Buttons: Analyze My Profile & Load Demo Student */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={handleAnalyzeProfile}
              disabled={isAnalyzing}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold font-mono text-xs shadow-lg shadow-emerald-950/50 flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>{isAnalyzing ? (analysisStep || 'Analyzing Candidate Intelligence...') : 'Analyze My Profile'}</span>
            </button>

            <button
              onClick={handleLoadDemoStudent}
              className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold font-mono text-xs shadow-md flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
            >
              <User className="w-4 h-4" />
              <span>Load Demo Student</span>
            </button>

            <button
              onClick={handleResetDemo}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold font-mono text-xs border border-slate-700 flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Demo</span>
            </button>
          </div>

        </div>
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>DEMO PROFILE:</strong> Rahul Sharma (Java / Software Development). Synthetic candidate data for preview.</span>
          </div>
          <button
            onClick={handleResetDemo}
            className="text-[10px] underline hover:text-white font-bold cursor-pointer ml-2"
          >
            Clear / Create Custom Profile
          </button>
        </div>
      )}

      {/* Module Navigation Sub-Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 font-mono text-xs overflow-x-auto">
        
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'DASHBOARD'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'PROFILE'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Student Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('RESUME')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'RESUME'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume Analyzer</span>
        </button>

        <button
          onClick={() => setActiveTab('MARKSHEET')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'MARKSHEET'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Marksheet Analyzer</span>
        </button>

        <button
          onClick={() => setActiveTab('LINKEDIN')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'LINKEDIN'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <Linkedin className="w-4 h-4" />
          <span>Professional Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('PROJECTS')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'PROJECTS'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CERTIFICATIONS')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'CERTIFICATIONS'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certifications ({certifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SKILLS')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'SKILLS'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Skill Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('ROLE_MATCH')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'ROLE_MATCH'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Role Match</span>
        </button>

        <button
          onClick={() => setActiveTab('COMPANY_MATCH')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'COMPANY_MATCH'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company Match</span>
        </button>

        <button
          onClick={() => setActiveTab('ROADMAP')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'ROADMAP'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Skill Gap & Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab('JD_MATCHER')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'JD_MATCHER'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <FileSearch className="w-4 h-4" />
          <span>JD Matcher</span>
        </button>

        <button
          onClick={() => setActiveTab('INTERVIEW_PREP')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'INTERVIEW_PREP'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Interview Prep</span>
        </button>

        <button
          onClick={() => setActiveTab('RESUME_IMPROVEMENT')}
          className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'RESUME_IMPROVEMENT'
              ? 'bg-purple-600 text-white shadow-md'
              : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <FileEdit className="w-4 h-4" />
          <span>Improve Resume</span>
        </button>

      </div>

      {/* Active Tab View Content */}
      {activeTab === 'DASHBOARD' && (
        <CareerDashboardSection
          readiness={readinessScore}
          topRole={roleMatches[0]}
          topCompanyMatch={companyMatches[0]}
          resumeQualityScore={resumeData.qualityScore}
          topSkillGaps={skillGaps}
          hasAnalyzedProfile={hasAnalyzedProfile}
          onAnalyzeProfile={handleAnalyzeProfile}
          onLoadDemo={handleLoadDemoStudent}
          isDark={isDark}
        />
      )}

      {activeTab === 'PROFILE' && (
        <ProfileInputSection
          profile={profile}
          onChangeProfile={setProfile}
          onLoadPreset={handleLoadPreset}
          isDark={isDark}
        />
      )}

      {activeTab === 'RESUME' && (
        <ResumeAnalyzerSection
          resumeData={resumeData}
          onUpdateResumeData={setResumeData}
          isDark={isDark}
        />
      )}

      {activeTab === 'MARKSHEET' && (
        <MarksheetAnalyzerSection
          marksheet={marksheetData}
          onUpdateMarksheet={setMarksheetData}
          isDark={isDark}
        />
      )}

      {activeTab === 'LINKEDIN' && (
        <LinkedInSection
          linkedIn={linkedIn}
          onUpdateLinkedIn={setLinkedIn}
          isDark={isDark}
        />
      )}

      {activeTab === 'PROJECTS' && (
        <ProjectAnalyzerSection
          projects={projects}
          onUpdateProjects={setProjects}
          isDark={isDark}
        />
      )}

      {activeTab === 'CERTIFICATIONS' && (
        <CertificationsSection
          certifications={certifications}
          onUpdateCertifications={setCertifications}
          isDark={isDark}
        />
      )}

      {activeTab === 'SKILLS' && (
        <UnifiedSkillMatrix
          unifiedSkills={unifiedSkills}
          isDark={isDark}
        />
      )}

      {activeTab === 'ROLE_MATCH' && (
        <RoleMatchingSection
          roleMatches={roleMatches}
          isDark={isDark}
        />
      )}

      {activeTab === 'COMPANY_MATCH' && (
        <CompanyMatchingSection
          companyMatches={companyMatches}
          isDark={isDark}
        />
      )}

      {activeTab === 'ROADMAP' && (
        <SkillGapRoadmapSection
          skillGaps={skillGaps}
          roadmap={roadmap}
          targetRoleName={profile.preferredRole || 'Java Developer'}
          isDark={isDark}
        />
      )}

      {activeTab === 'JD_MATCHER' && (
        <JDMatcherSection
          unifiedSkills={unifiedSkills}
          profile={profile}
          isDark={isDark}
        />
      )}

      {activeTab === 'INTERVIEW_PREP' && (
        <InterviewPrepSection
          targetRole={profile.preferredRole || 'Java Developer'}
          unifiedSkills={unifiedSkills}
          projects={projects}
          isDark={isDark}
        />
      )}

      {activeTab === 'RESUME_IMPROVEMENT' && (
        <ResumeImprovementSection
          resumeData={resumeData}
          isDark={isDark}
        />
      )}

    </div>
  );
};

