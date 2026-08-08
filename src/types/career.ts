/**
 * AI Career Intelligence Module Type Definitions
 * VendorFlow Autonomous Document Intelligence Platform
 */

export type JobDomain = 
  | 'Software Development'
  | 'Cybersecurity'
  | 'AI/ML'
  | 'Data Science'
  | 'Cloud'
  | 'DevOps'
  | 'Data Analytics';

export interface StudentProfile {
  name: string;
  degree: string;
  branch: string;
  college: string;
  graduationYear: string;
  cgpa: number;
  preferredLocation: string;
  preferredDomain: JobDomain;
  preferredRole: string;
}

export interface WorkExperienceItem {
  company: string;
  role: string;
  duration: string;
  summary: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingOrganization: string;
  year: string;
  skillsCovered: string[];
}

export interface CandidateProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  relevanceScore: number; // 0-100
  targetRoleRelevance: string;
}

export interface ExtractedResumeData {
  education: string[];
  skills: string[];
  programmingLanguages: string[];
  frameworks: string[];
  tools: string[];
  experience: WorkExperienceItem[];
  projects: CandidateProject[];
  certifications: string[];
  qualityScore: number; // 0-100
  summary: string;
  extractedAt: string;
}

export interface MarksheetSubject {
  name: string;
  marks: number;
  maxMarks: number;
  grade?: string;
}

export interface MarksheetData {
  semester: string;
  cgpa: number;
  percentage?: number;
  subjects: MarksheetSubject[];
  strongSubjects: string[];
  moderateSubjects: string[];
  academicTrend: 'Stable' | 'Improving' | 'Declining';
  backlogsCount: number;
}

export interface LinkedInProfile {
  aboutText: string;
  skillsText: string;
  experienceText: string;
  projectsText: string;
  profileUrl: string;
}

export interface UnifiedSkill {
  name: string;
  level: 'Strong' | 'Intermediate' | 'Beginner';
  sources: ('Resume' | 'Marksheet' | 'Projects' | 'LinkedIn' | 'Certifications')[];
  confidenceScore: number; // 0-100
}

export interface RoleMatch {
  roleName: string;
  domain: JobDomain;
  matchScore: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
  relevantProjects: string[];
  academicAlignment: string;
  experienceAlignment: string;
}

export interface DemoCompany {
  id: string;
  companyName: string;
  role: string;
  domain: JobDomain;
  location: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minCGPA: number;
  experienceRequirement: string;
  salaryPackageINR?: string;
}

export interface DemoCompanyMatchResult {
  company: DemoCompany;
  matchScore: number; // 0-100
  matchedSkills: string[];
  missingRequirements: string[];
  whyItMatches: string;
  recommendedPrep: string;
}

export interface CareerReadinessScore {
  overallScore: number; // 0-100
  academicScore: number;
  technicalSkillScore: number;
  projectScore: number;
  experienceScore: number;
  resumeQualityScore: number;
  roleAlignmentScore: number;
  contributingFactors: string[];
}

export interface SkillGap {
  skill: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  recommendation: string;
}

export interface RoadmapMilestone {
  week: string;
  title: string;
  description: string;
  actionItems: string[];
  targetSkills: string[];
}

export interface JDMatchResult {
  jdTitle: string;
  jdCompany?: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  confidenceExplanation: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'Project' | 'Behavioral';
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  relatedSkillOrProject: string;
  sampleAnswerHint: string;
}

export interface ResumeImprovementSuggestion {
  category: 'Impact Words' | 'Structure' | 'Quantifiable Results' | 'Missing Keywords';
  currentTextSnippet?: string;
  suggestedImprovement: string;
  rationale: string;
}
