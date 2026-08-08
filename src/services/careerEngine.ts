import { 
  StudentProfile, 
  ExtractedResumeData, 
  MarksheetData, 
  LinkedInProfile, 
  CandidateProject, 
  UnifiedSkill, 
  RoleMatch, 
  DemoCompany, 
  DemoCompanyMatchResult, 
  CareerReadinessScore, 
  SkillGap, 
  RoadmapMilestone, 
  JDMatchResult, 
  InterviewQuestion, 
  ResumeImprovementSuggestion 
} from '../types/career';

// DEMO COMPANY DATASET (Explicitly labeled as synthetic)
export const DEMO_COMPANIES: DemoCompany[] = [
  {
    id: 'DEMO-COMP-01',
    companyName: 'TechCorp Solutions (DEMO)',
    role: 'Java Backend Developer',
    domain: 'Software Development',
    location: 'Bengaluru / Hybrid',
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'REST API'],
    preferredSkills: ['Docker', 'Microservices', 'Git'],
    minCGPA: 7.5,
    experienceRequirement: '0-1 Years / Freshers',
    salaryPackageINR: '₹8,50,000 - ₹12,00,000 LPA'
  },
  {
    id: 'DEMO-COMP-02',
    companyName: 'CloudPulse Enterprise (DEMO)',
    role: 'Cloud & DevOps Engineer',
    domain: 'Cloud',
    location: 'Hyderabad / Remote',
    requiredSkills: ['Linux', 'AWS', 'Docker', 'Python'],
    preferredSkills: ['Kubernetes', 'Terraform', 'CI/CD'],
    minCGPA: 7.0,
    experienceRequirement: 'Freshers Welcome',
    salaryPackageINR: '₹9,00,000 - ₹14,00,000 LPA'
  },
  {
    id: 'DEMO-COMP-03',
    companyName: 'CyberGuard Systems (DEMO)',
    role: 'Cybersecurity Analyst',
    domain: 'Cybersecurity',
    location: 'Pune / On-site',
    requiredSkills: ['Network Security', 'Linux', 'Python', 'SIEM'],
    preferredSkills: ['Ethical Hacking', 'OWASP Top 10', 'Wireshark'],
    minCGPA: 7.2,
    experienceRequirement: '0-2 Years',
    salaryPackageINR: '₹7,50,000 - ₹11,00,000 LPA'
  },
  {
    id: 'DEMO-COMP-04',
    companyName: 'DataFlex Analytics (DEMO)',
    role: 'Data Scientist / AI Engineer',
    domain: 'AI/ML',
    location: 'Mumbai / Hybrid',
    requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Pandas'],
    preferredSkills: ['PyTorch', 'TensorFlow', 'NLP', 'Scikit-Learn'],
    minCGPA: 8.0,
    experienceRequirement: 'Freshers / Final Year',
    salaryPackageINR: '₹10,00,000 - ₹15,00,000 LPA'
  },
  {
    id: 'DEMO-COMP-05',
    companyName: 'InnoApp Labs (DEMO)',
    role: 'Full Stack Web Developer',
    domain: 'Software Development',
    location: 'Gurugram / Hybrid',
    requiredSkills: ['React', 'Node.js', 'JavaScript', 'SQL'],
    preferredSkills: ['TypeScript', 'Tailwind CSS', 'MongoDB', 'Next.js'],
    minCGPA: 7.0,
    experienceRequirement: '0-1 Years',
    salaryPackageINR: '₹8,00,000 - ₹12,50,000 LPA'
  }
];

// PRESET STUDENT DEMO PROFILES FOR 1-CLICK TESTING
export const PRESET_PROFILES: {
  id: string;
  label: string;
  profile: StudentProfile;
  resume: ExtractedResumeData;
  marksheet: MarksheetData;
  projects: CandidateProject[];
}[] = [
  {
    id: 'PRESET-RAHUL',
    label: 'Rahul Sharma — CS Senior (Backend/Java)',
    profile: {
      name: 'Rahul Sharma',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      college: 'National Institute of Technology, Karnataka',
      graduationYear: '2026',
      cgpa: 8.51,
      preferredLocation: 'Bengaluru / Remote',
      preferredDomain: 'Software Development',
      preferredRole: 'Java Backend Developer'
    },
    resume: {
      education: ['B.Tech Computer Science (CGPA: 8.51/10) — NIT Karnataka (2022-2026)'],
      skills: ['Java', 'SQL', 'Object-Oriented Programming', 'Data Structures & Algorithms', 'REST APIs', 'Git', 'Spring Boot Basics', 'PostgreSQL'],
      programmingLanguages: ['Java', 'C++', 'SQL', 'JavaScript'],
      frameworks: ['Spring Boot', 'React', 'Express.js'],
      tools: ['Git', 'Postman', 'Docker', 'VS Code', 'IntelliJ IDEA'],
      experience: [
        {
          company: 'Acme Software Solutions',
          role: 'Backend Engineering Intern',
          duration: '3 Months (Summer 2025)',
          summary: 'Built RESTful microservices in Spring Boot, optimized PostgreSQL queries reducing API response latency by 28%.'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'Distributed Order Management System',
          description: 'High-throughput B2B order processing microservice in Java Spring Boot with PostgreSQL and Redis caching.',
          technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Docker'],
          githubUrl: 'https://github.com/rahul/order-management-java',
          liveUrl: 'https://order-demo.railway.app',
          relevanceScore: 92,
          targetRoleRelevance: 'High relevance for Java Backend Developer'
        },
        {
          id: 'proj-2',
          name: 'Real-Time Fraud Detection Engine',
          description: 'Deterministic transaction risk evaluator comparing transaction velocity and bank records.',
          technologies: ['Java', 'REST API', 'JUnit', 'Git'],
          githubUrl: 'https://github.com/rahul/fraud-rules-engine',
          relevanceScore: 88,
          targetRoleRelevance: 'High relevance for Backend Engineering'
        }
      ],
      certifications: ['Oracle Certified Associate, Java SE 11', 'AWS Certified Cloud Practitioner'],
      qualityScore: 88,
      summary: 'Focused Computer Science undergraduate with strong foundation in Java backend architecture, algorithms, and microservices.',
      extractedAt: new Date().toISOString()
    },
    marksheet: {
      semester: 'Semester VI',
      cgpa: 8.51,
      percentage: 80.8,
      backlogsCount: 0,
      subjects: [
        { name: 'Data Structures & Algorithms', marks: 88, maxMarks: 100, grade: 'A+' },
        { name: 'Database Management Systems', marks: 92, maxMarks: 100, grade: 'O' },
        { name: 'Object Oriented Programming (Java)', marks: 90, maxMarks: 100, grade: 'O' },
        { name: 'Computer Networks', marks: 82, maxMarks: 100, grade: 'A' },
        { name: 'Operating Systems', marks: 84, maxMarks: 100, grade: 'A' },
        { name: 'Discrete Mathematics', marks: 74, maxMarks: 100, grade: 'B+' }
      ],
      strongSubjects: ['Database Management Systems', 'Object Oriented Programming (Java)', 'Data Structures & Algorithms'],
      moderateSubjects: ['Discrete Mathematics', 'Computer Networks'],
      academicTrend: 'Improving'
    },
    projects: [
      {
        id: 'proj-1',
        name: 'Distributed Order Management System',
        description: 'High-throughput B2B order processing microservice in Java Spring Boot with PostgreSQL and Redis caching.',
        technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Docker'],
        githubUrl: 'https://github.com/rahul/order-management-java',
        liveUrl: 'https://order-demo.railway.app',
        relevanceScore: 92,
        targetRoleRelevance: 'High relevance for Java Backend Developer'
      },
      {
        id: 'proj-2',
        name: 'Real-Time Fraud Detection Engine',
        description: 'Deterministic transaction risk evaluator comparing transaction velocity and bank records.',
        technologies: ['Java', 'REST API', 'JUnit', 'Git'],
        githubUrl: 'https://github.com/rahul/fraud-rules-engine',
        relevanceScore: 88,
        targetRoleRelevance: 'High relevance for Backend Engineering'
      }
    ]
  },
  {
    id: 'PRESET-ANANYA',
    label: 'Ananya Iyer — AI/ML & Data Science Specialist',
    profile: {
      name: 'Ananya Iyer',
      degree: 'B.Tech',
      branch: 'Artificial Intelligence & Data Science',
      college: 'SSN College of Engineering, Chennai',
      graduationYear: '2026',
      cgpa: 9.12,
      preferredLocation: 'Bengaluru / Hyderabad',
      preferredDomain: 'AI/ML',
      preferredRole: 'AI/ML Engineer'
    },
    resume: {
      education: ['B.Tech AI & Data Science (CGPA: 9.12/10) — SSN College of Engineering (2022-2026)'],
      skills: ['Python', 'PyTorch', 'Scikit-Learn', 'SQL', 'Pandas', 'NumPy', 'TensorFlow', 'NLP', 'Computer Vision', 'Git'],
      programmingLanguages: ['Python', 'SQL', 'C++'],
      frameworks: ['PyTorch', 'TensorFlow', 'FastAPI', 'HuggingFace Transformers'],
      tools: ['Jupyter', 'Git', 'MLflow', 'Docker', 'Google Colab'],
      experience: [
        {
          company: 'AI Research Lab',
          role: 'Computer Vision Research Intern',
          duration: '4 Months (2025)',
          summary: 'Fine-tuned ResNet & YOLOv8 models for automated OCR on medical receipts with 94.2% accuracy.'
        }
      ],
      projects: [
        {
          id: 'proj-ml-1',
          name: 'Multimodal Document Classification & OCR',
          description: 'Document understanding agent using PyTorch, Tesseract, and Gemini 2.5 API for automated classification.',
          technologies: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'Transformers'],
          githubUrl: 'https://github.com/ananya/doc-ai-multimodal',
          relevanceScore: 95,
          targetRoleRelevance: 'High relevance for AI/ML Engineer'
        }
      ],
      certifications: ['DeepLearning.AI TensorFlow Developer Certificate', 'AWS Machine Learning Specialty'],
      qualityScore: 92,
      summary: 'High-performing AI/ML student with publications in medical imaging and hands-on LLM/OCR deployment experience.',
      extractedAt: new Date().toISOString()
    },
    marksheet: {
      semester: 'Semester VI',
      cgpa: 9.12,
      percentage: 86.6,
      backlogsCount: 0,
      subjects: [
        { name: 'Machine Learning Fundamentals', marks: 95, maxMarks: 100, grade: 'O' },
        { name: 'Deep Learning & Neural Networks', marks: 94, maxMarks: 100, grade: 'O' },
        { name: 'Linear Algebra & Probability', marks: 89, maxMarks: 100, grade: 'A+' },
        { name: 'Database & SQL Systems', marks: 91, maxMarks: 100, grade: 'O' },
        { name: 'Python Data Science Stack', marks: 96, maxMarks: 100, grade: 'O' }
      ],
      strongSubjects: ['Deep Learning & Neural Networks', 'Machine Learning Fundamentals', 'Python Data Science Stack'],
      moderateSubjects: ['Linear Algebra & Probability'],
      academicTrend: 'Stable'
    },
    projects: [
      {
        id: 'proj-ml-1',
        name: 'Multimodal Document Classification & OCR',
        description: 'Document understanding agent using PyTorch, Tesseract, and Gemini 2.5 API for automated classification.',
        technologies: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'Transformers'],
        githubUrl: 'https://github.com/ananya/doc-ai-multimodal',
        relevanceScore: 95,
        targetRoleRelevance: 'High relevance for AI/ML Engineer'
      }
    ]
  }
];

// EVALUATE UNIFIED SKILLS ACROSS ALL INPUT SOURCES
export function calculateUnifiedSkills(
  resume: ExtractedResumeData,
  marksheet: MarksheetData,
  projects: CandidateProject[],
  linkedIn?: LinkedInProfile
): UnifiedSkill[] {
  const skillMap = new Map<string, {
    sources: Set<'Resume' | 'Marksheet' | 'Projects' | 'LinkedIn' | 'Certifications'>;
    occurrences: number;
  }>();

  const addSkill = (skillName: string, source: 'Resume' | 'Marksheet' | 'Projects' | 'LinkedIn' | 'Certifications') => {
    const cleanName = skillName.trim();
    if (!cleanName) return;
    const key = cleanName.toLowerCase();
    
    if (!skillMap.has(key)) {
      skillMap.set(key, { sources: new Set(), occurrences: 0 });
    }
    const record = skillMap.get(key)!;
    record.sources.add(source);
    record.occurrences += 1;
  };

  // 1. Resume skills
  resume.skills.forEach(s => addSkill(s, 'Resume'));
  resume.programmingLanguages.forEach(s => addSkill(s, 'Resume'));
  resume.frameworks.forEach(s => addSkill(s, 'Resume'));
  resume.tools.forEach(s => addSkill(s, 'Resume'));
  
  if (resume.certifications.length > 0) {
    resume.certifications.forEach(c => addSkill(c, 'Certifications'));
  }

  // 2. Projects tech stack
  projects.forEach(p => {
    p.technologies.forEach(t => addSkill(t, 'Projects'));
  });

  // 3. Marksheet subjects -> skills
  marksheet.strongSubjects.forEach(subj => addSkill(subj, 'Marksheet'));

  // 4. LinkedIn optional skills
  if (linkedIn?.skillsText) {
    linkedIn.skillsText.split(',').forEach(s => addSkill(s.trim(), 'LinkedIn'));
  }

  // Convert map to list with proficiency and confidence
  const result: UnifiedSkill[] = [];
  skillMap.forEach((val, key) => {
    // Original casing or capitalize
    const displayName = key.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const sourceCount = val.sources.size;
    
    let level: 'Strong' | 'Intermediate' | 'Beginner' = 'Beginner';
    let confidence = 50 + sourceCount * 15 + val.occurrences * 5;

    if (sourceCount >= 3 || val.occurrences >= 3) {
      level = 'Strong';
      confidence = Math.min(98, confidence);
    } else if (sourceCount >= 2 || val.occurrences >= 2) {
      level = 'Intermediate';
      confidence = Math.min(85, confidence);
    } else {
      level = 'Beginner';
      confidence = Math.min(70, confidence);
    }

    result.push({
      name: displayName,
      level,
      sources: Array.from(val.sources),
      confidenceScore: confidence
    });
  });

  return result.sort((a, b) => b.confidenceScore - a.confidenceScore);
}

// ROLE MATCHING ENGINE FOR 9 TARGET ROLES
export function evaluateRoleMatches(
  unifiedSkills: UnifiedSkill[],
  profile: StudentProfile,
  projects: CandidateProject[],
  marksheet: MarksheetData
): RoleMatch[] {
  const candidateSkillNames = new Set(unifiedSkills.map(s => s.name.toLowerCase()));

  const targetRoleDefinitions = [
    {
      roleName: 'Java Developer',
      domain: 'Software Development' as const,
      requiredSkills: ['Java', 'SQL', 'Spring Boot', 'Object-Oriented Programming', 'Data Structures & Algorithms', 'Git'],
      preferredSkills: ['PostgreSQL', 'JUnit', 'Hibernate', 'Maven']
    },
    {
      roleName: 'Backend Developer',
      domain: 'Software Development' as const,
      requiredSkills: ['Node.js', 'Java', 'SQL', 'REST API', 'Data Structures & Algorithms', 'Git'],
      preferredSkills: ['Express.js', 'Spring Boot', 'PostgreSQL', 'Redis', 'Docker']
    },
    {
      roleName: 'Full Stack Developer',
      domain: 'Software Development' as const,
      requiredSkills: ['React', 'JavaScript', 'Node.js', 'SQL', 'REST API', 'Git'],
      preferredSkills: ['TypeScript', 'Tailwind CSS', 'Next.js', 'MongoDB', 'Docker']
    },
    {
      roleName: 'Frontend Developer',
      domain: 'Software Development' as const,
      requiredSkills: ['JavaScript', 'React', 'HTML/CSS', 'TypeScript', 'Git'],
      preferredSkills: ['Tailwind CSS', 'Next.js', 'Redux / State Management', 'Webpack / Vite']
    },
    {
      roleName: 'Data Analyst',
      domain: 'Data Analytics' as const,
      requiredSkills: ['SQL', 'Python', 'Excel', 'Pandas', 'Data Visualization', 'Statistics'],
      preferredSkills: ['PowerBI', 'Tableau', 'R', 'NumPy']
    },
    {
      roleName: 'Cybersecurity Analyst',
      domain: 'Cybersecurity' as const,
      requiredSkills: ['Network Security', 'Linux', 'Python', 'OWASP Top 10', 'Information Security'],
      preferredSkills: ['Ethical Hacking', 'SIEM', 'Wireshark', 'Cryptography']
    },
    {
      roleName: 'Cloud Engineer',
      domain: 'Cloud' as const,
      requiredSkills: ['Linux', 'AWS', 'Docker', 'Networking', 'Python'],
      preferredSkills: ['CloudFormation', 'Terraform', 'Azure', 'GCP']
    },
    {
      roleName: 'DevOps Engineer',
      domain: 'DevOps' as const,
      requiredSkills: ['Linux', 'Docker', 'CI/CD', 'Git', 'Python', 'Kubernetes'],
      preferredSkills: ['Terraform', 'Ansible', 'Jenkins', 'Monitoring / Prometheus']
    },
    {
      roleName: 'AI/ML Engineer',
      domain: 'AI/ML' as const,
      requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'SQL', 'Pandas', 'NumPy'],
      preferredSkills: ['TensorFlow', 'Deep Learning', 'FastAPI', 'Docker', 'NLP']
    }
  ];

  return targetRoleDefinitions.map(def => {
    const matchedReq = def.requiredSkills.filter(s => 
      candidateSkillNames.has(s.toLowerCase()) || 
      unifiedSkills.some(us => us.name.toLowerCase().includes(s.toLowerCase()))
    );

    const missingReq = def.requiredSkills.filter(s => !matchedReq.includes(s));

    const matchedPref = def.preferredSkills.filter(s => 
      candidateSkillNames.has(s.toLowerCase()) || 
      unifiedSkills.some(us => us.name.toLowerCase().includes(s.toLowerCase()))
    );

    // Calculate transparent score %
    const reqRatio = matchedReq.length / def.requiredSkills.length;
    const prefRatio = matchedPref.length / Math.max(1, def.preferredSkills.length);
    const academicBonus = (marksheet.cgpa >= 8.0) ? 0.08 : (marksheet.cgpa >= 7.0) ? 0.04 : 0;
    
    let rawScore = Math.round((reqRatio * 0.70 + prefRatio * 0.22 + academicBonus) * 100);
    rawScore = Math.min(98, Math.max(25, rawScore));

    const relevantProjs = projects
      .filter(p => p.technologies.some(t => def.requiredSkills.some(rs => rs.toLowerCase() === t.toLowerCase())))
      .map(p => p.name);

    return {
      roleName: def.roleName,
      domain: def.domain,
      matchScore: rawScore,
      matchedSkills: matchedReq.concat(matchedPref),
      missingSkills: missingReq,
      relevantProjects: relevantProjs.length > 0 ? relevantProjs : ['General Software Projects'],
      academicAlignment: marksheet.cgpa >= 7.5 ? 'Strong CGPA match' : 'Moderate academic fit',
      experienceAlignment: 'Internship / Academic Projects aligned'
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// EVALUATE COMPANY MATCHES (Synthetic Demo Companies)
export function evaluateCompanyMatches(
  unifiedSkills: UnifiedSkill[],
  profile: StudentProfile,
  projects: CandidateProject[],
  marksheet: MarksheetData
): DemoCompanyMatchResult[] {
  const candidateSkillNames = new Set(unifiedSkills.map(s => s.name.toLowerCase()));

  return DEMO_COMPANIES.map(company => {
    const matchedReq = company.requiredSkills.filter(s => 
      candidateSkillNames.has(s.toLowerCase()) || 
      unifiedSkills.some(us => us.name.toLowerCase().includes(s.toLowerCase()))
    );

    const missingReq = company.requiredSkills.filter(s => !matchedReq.includes(s));

    const cgpaPass = marksheet.cgpa >= company.minCGPA;
    const skillRatio = matchedReq.length / company.requiredSkills.length;

    let score = Math.round(skillRatio * 80 + (cgpaPass ? 20 : 0));
    score = Math.min(98, Math.max(30, score));

    return {
      company,
      matchScore: score,
      matchedSkills: matchedReq,
      missingRequirements: missingReq.concat(!cgpaPass ? [`Min CGPA required: ${company.minCGPA}`] : []),
      whyItMatches: `${matchedReq.length}/${company.requiredSkills.length} required skills matched + CGPA ${marksheet.cgpa} (${cgpaPass ? 'Eligible' : 'Below cutoff'})`,
      recommendedPrep: missingReq.length > 0 
        ? `Focus on mastering ${missingReq.join(', ')} prior to technical assessment.`
        : 'Strong alignment. Practice system design and DSA coding questions.'
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// CAREER READINESS CALCULATOR (Transparent weighted formula)
export function calculateCareerReadiness(
  profile: StudentProfile,
  resume: ExtractedResumeData,
  marksheet: MarksheetData,
  projects: CandidateProject[],
  roleMatches: RoleMatch[]
): CareerReadinessScore {
  const academicScore = Math.min(100, Math.round((marksheet.cgpa / 10) * 100));
  const technicalSkillScore = Math.min(100, Math.round(resume.skills.length * 9));
  const projectScore = Math.min(100, projects.length * 40);
  const experienceScore = resume.experience.length > 0 ? 85 : 45;
  const resumeQualityScore = resume.qualityScore || 80;
  const topRoleScore = roleMatches.length > 0 ? roleMatches[0].matchScore : 70;

  // Weighted formula: Academic (20%), Tech Skills (25%), Projects (20%), Experience (10%), Resume Quality (10%), Role Align (15%)
  const overallScore = Math.round(
    academicScore * 0.20 +
    technicalSkillScore * 0.25 +
    projectScore * 0.20 +
    experienceScore * 0.10 +
    resumeQualityScore * 0.10 +
    topRoleScore * 0.15
  );

  const factors: string[] = [];
  if (academicScore >= 80) factors.push(`Strong CGPA (${marksheet.cgpa}/10)`);
  if (projects.length >= 2) factors.push(`${projects.length} relevant technical projects demonstrated`);
  if (resume.experience.length > 0) factors.push(`Prior internship experience at ${resume.experience[0].company}`);
  if (resume.certifications.length > 0) factors.push(`${resume.certifications.length} verified certifications`);

  return {
    overallScore: Math.min(98, Math.max(40, overallScore)),
    academicScore,
    technicalSkillScore,
    projectScore,
    experienceScore,
    resumeQualityScore,
    roleAlignmentScore: topRoleScore,
    contributingFactors: factors
  };
}

// SKILL GAP DETECTOR AND 30-DAY ROADMAP
export function generateSkillGapsAndRoadmap(
  targetRoleName: string,
  unifiedSkills: UnifiedSkill[]
): { skillGaps: SkillGap[]; roadmap: RoadmapMilestone[] } {
  const candidateSkills = new Set(unifiedSkills.map(s => s.name.toLowerCase()));

  // Role gap map for all 9 defined target roles
  const roleSkillMap: Record<string, { high: string[]; med: string[]; low: string[] }> = {
    'Java Developer': {
      high: ['Spring Boot', 'REST API Design', 'SQL & Database Indexing'],
      med: ['JUnit & Mockito Testing', 'PostgreSQL', 'Microservices'],
      low: ['Docker Basics', 'Maven / Gradle']
    },
    'Backend Developer': {
      high: ['Node.js / Express', 'REST API Architecture', 'SQL & Database Optimization'],
      med: ['Redis Caching', 'Docker Containerization', 'Authentication (JWT/OAuth)'],
      low: ['CI/CD Pipelines', 'System Design']
    },
    'Full Stack Developer': {
      high: ['React & State Management', 'Node.js & Express', 'SQL / NoSQL Databases'],
      med: ['TypeScript', 'Tailwind CSS', 'Next.js App Router'],
      low: ['Docker', 'WebSockets', 'CI/CD']
    },
    'Frontend Developer': {
      high: ['React Deep Dive', 'TypeScript', 'Tailwind CSS'],
      med: ['Redux Toolkit / Zustand', 'Vite / Webpack Build Tools', 'Responsive UI & Accessibility'],
      low: ['Jest / React Testing Library', 'Web Vitals Performance']
    },
    'Data Analyst': {
      high: ['Advanced SQL Queries', 'Python Pandas & NumPy', 'Data Visualization (PowerBI/Tableau)'],
      med: ['Statistical Analysis', 'Excel VBA / Dashboards', 'A/B Testing'],
      low: ['R Basics', 'BigQuery / Snowflake']
    },
    'Cybersecurity Analyst': {
      high: ['Network Security & Protocols', 'OWASP Top 10 Web Vulnerabilities', 'Linux Administration'],
      med: ['SIEM Tools & Log Analysis', 'Wireshark Packet Analysis', 'Python Incident Scripting'],
      low: ['Ethical Hacking / Penetration Testing', 'Compliance Frameworks']
    },
    'Cloud Engineer': {
      high: ['AWS Core Services (EC2, S3, RDS, IAM)', 'Linux System Administration', 'Docker Containerization'],
      med: ['Terraform Infrastructure as Code', 'Networking & VPC Design', 'CloudWatch Monitoring'],
      low: ['Kubernetes Basics', 'Python Automation']
    },
    'DevOps Engineer': {
      high: ['Docker & Kubernetes', 'CI/CD Pipelines (GitHub Actions/Jenkins)', 'Linux Systems'],
      med: ['Terraform / Ansible', 'Prometheus & Grafana', 'Bash / Python Scripting'],
      low: ['Helm Charts', 'Service Mesh (Istio)']
    },
    'AI/ML Engineer': {
      high: ['PyTorch / TensorFlow', 'Machine Learning Algorithms', 'Python Data Stack'],
      med: ['FastAPI Model Serving', 'Docker Containerization', 'Feature Engineering'],
      low: ['MLOps Fundamentals', 'Distributed Training']
    }
  };

  const defaultRoleGaps = roleSkillMap[targetRoleName] || roleSkillMap['Java Developer'] || roleSkillMap['Backend Developer'];

  const skillGaps: SkillGap[] = [];

  defaultRoleGaps.high.forEach(s => {
    if (!candidateSkills.has(s.toLowerCase())) {
      skillGaps.push({
        skill: s,
        priority: 'HIGH',
        category: 'Core Competency',
        recommendation: `High-priority core requirement for ${targetRoleName}. Complete hands-on project implementation.`
      });
    }
  });

  defaultRoleGaps.med.forEach(s => {
    if (!candidateSkills.has(s.toLowerCase())) {
      skillGaps.push({
        skill: s,
        priority: 'MEDIUM',
        category: 'Industry Standards',
        recommendation: `Medium-priority requirement. Build a working micro-service incorporating ${s}.`
      });
    }
  });

  defaultRoleGaps.low.forEach(s => {
    if (!candidateSkills.has(s.toLowerCase())) {
      skillGaps.push({
        skill: s,
        priority: 'LOW',
        category: 'Nice to Have',
        recommendation: `Low-priority enhancement to boost candidate competitiveness.`
      });
    }
  });

  // 30-Day Preparation Roadmap
  const roadmap: RoadmapMilestone[] = [
    {
      week: 'Week 1: Core Fundamentals & Framework Mastery',
      title: 'Strengthen Target Role Core Tech',
      description: `Focus intensively on ${targetRoleName} primary frameworks and OOP/architectural patterns.`,
      actionItems: [
        'Complete 15 LeetCode Medium problem patterns (Arrays, Graphs, HashTables)',
        'Build a standalone RESTful service with input validation and error handling',
        'Review database indexing and query optimization techniques'
      ],
      targetSkills: defaultRoleGaps.high
    },
    {
      week: 'Week 2: Database Integration & Persistence Layer',
      title: 'Data Layer & Caching Optimization',
      description: 'Integrate relational databases with ORMs, connection pooling, and caching.',
      actionItems: [
        'Connect backend service to PostgreSQL/MySQL using ORM/JDBC',
        'Implement Redis caching for hot database queries',
        'Write automated unit and integration tests using JUnit/Jest'
      ],
      targetSkills: defaultRoleGaps.med.slice(0, 2)
    },
    {
      week: 'Week 3: Containerization & Deployment',
      title: 'Dockerization & Cloud Readiness',
      description: 'Containerize backend components and host demo service online.',
      actionItems: [
        'Write production multi-stage Dockerfile for application',
        'Deploy service to Railway / Render / AWS Cloud Run',
        'Add Swagger / OpenAPI documentation for API endpoints'
      ],
      targetSkills: defaultRoleGaps.low
    },
    {
      week: 'Week 4: Portfolio Polish & Mock Technical Interviews',
      title: 'System Design & Interview Readiness',
      description: 'Refine GitHub repositories and rehearse technical/system design questions.',
      actionItems: [
        'Add architectural diagram and README to GitHub repository',
        'Conduct 3 mock technical interviews focusing on project walkthroughs',
        'Tailor resume bullets with quantifiable performance impact metrics'
      ],
      targetSkills: ['System Design', 'Behavioral STAR Method']
    }
  ];

  return { skillGaps, roadmap };
}

// JOB DESCRIPTION MATCHER
export function analyzeJobDescription(
  jdText: string,
  unifiedSkills: UnifiedSkill[],
  profile: StudentProfile
): JDMatchResult {
  if (!jdText || jdText.trim().length < 20) {
    return {
      jdTitle: 'Custom Job Description',
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      recommendations: ['Please paste a valid job description text.'],
      confidenceExplanation: 'No job description provided.'
    };
  }

  const jdLower = jdText.toLowerCase();
  
  const commonKeywords = [
    'java', 'python', 'javascript', 'typescript', 'react', 'node.js', 'spring boot',
    'sql', 'postgresql', 'mongodb', 'docker', 'kubernetes', 'aws', 'git', 'rest api',
    'microservices', 'c++', 'linux', 'machine learning', 'pytorch', 'tensorflow', 'pandas',
    'ci/cd', 'agile', 'data structures', 'algorithms'
  ];

  const candidateSkillNames = new Set(unifiedSkills.map(s => s.name.toLowerCase()));

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  commonKeywords.forEach(kw => {
    if (jdLower.includes(kw)) {
      if (candidateSkillNames.has(kw) || unifiedSkills.some(us => us.name.toLowerCase().includes(kw))) {
        matchedSkills.push(kw.toUpperCase());
      } else {
        missingSkills.push(kw.toUpperCase());
      }
    }
  });

  const totalKeywordsInJD = matchedSkills.length + missingSkills.length;
  let score = totalKeywordsInJD > 0 ? Math.round((matchedSkills.length / totalKeywordsInJD) * 100) : 75;
  score = Math.min(98, Math.max(35, score));

  return {
    jdTitle: 'Analyzed Job Requirement',
    matchScore: score,
    matchedSkills: matchedSkills.length > 0 ? matchedSkills : ['General Engineering Fundamentals'],
    missingSkills: missingSkills.length > 0 ? missingSkills : ['No critical keyword gaps identified'],
    recommendations: [
      missingSkills.length > 0 
        ? `Incorporate missing keywords (${missingSkills.slice(0, 3).join(', ')}) into your resume skills section.` 
        : 'Strong keyword alignment with this Job Description.',
      'Highlight relevant project bullet points matching the required technical stack.',
      'Prepare technical explanations for your highest-impact project.'
    ],
    confidenceExplanation: `Analyzed ${totalKeywordsInJD} required technical keywords against candidate unified skill matrix.`
  };
}

// INTERVIEW QUESTIONS GENERATOR
export function generateInterviewQuestions(
  targetRole: string,
  unifiedSkills: UnifiedSkill[],
  projects: CandidateProject[]
): InterviewQuestion[] {
  const topSkills = unifiedSkills.slice(0, 3).map(s => s.name).join(', ') || 'Java & SQL';
  const topProj = projects.length > 0 ? projects[0].name : 'distributed system project';

  return [
    {
      id: 'iq-1',
      question: `How did you design the architecture for your ${topProj}? What trade-offs did you make?`,
      category: 'Project',
      difficulty: 'Intermediate',
      relatedSkillOrProject: topProj,
      sampleAnswerHint: 'Explain using STAR method: Situation, Tech Stack choices (e.g. PostgreSQL vs MongoDB), Caching strategy, and quantifiable result.'
    },
    {
      id: 'iq-2',
      question: `Walk us through how you optimize slow database queries and handle concurrency in ${topSkills}.`,
      category: 'Technical',
      difficulty: 'Advanced',
      relatedSkillOrProject: topSkills,
      sampleAnswerHint: 'Discuss database indexing, EXPLAIN ANALYZE, transaction isolation levels, connection pooling, and Redis caching.'
    },
    {
      id: 'iq-3',
      question: 'Describe a situation where a technical project deadline was threatened by a bug or scope change. How did you handle it?',
      category: 'Behavioral',
      difficulty: 'Basic',
      relatedSkillOrProject: 'Team Collaboration',
      sampleAnswerHint: 'Emphasize clear communication, root cause analysis, prioritizing core MVP features, and lessons learned.'
    },
    {
      id: 'iq-4',
      question: 'What is the difference between monolithic and microservices architecture? When would you choose one over the other?',
      category: 'Technical',
      difficulty: 'Intermediate',
      relatedSkillOrProject: 'System Architecture',
      sampleAnswerHint: 'Discuss team scale, deployment independence, complexity overhead, database per service, and network latency.'
    }
  ];
}

// RESUME IMPROVEMENT SUGGESTIONS
export function generateResumeImprovements(
  resume: ExtractedResumeData
): ResumeImprovementSuggestion[] {
  return [
    {
      category: 'Quantifiable Results',
      currentTextSnippet: 'Built microservices for order processing.',
      suggestedImprovement: 'Engineered high-throughput Java microservices processing 5,000+ daily orders with 99.9% uptime and <120ms response latency.',
      rationale: 'Adding specific metrics (volume, uptime, latency) demonstrates business impact rather than just listing tasks.'
    },
    {
      category: 'Impact Words',
      currentTextSnippet: 'Worked on database queries and bug fixes.',
      suggestedImprovement: 'Optimized PostgreSQL relational schemas and query execution plans, reducing API latency by 28%.',
      rationale: 'Action verbs like "Engineered", "Optimized", "Architected" convey proactive engineering capability.'
    },
    {
      category: 'Missing Keywords',
      suggestedImprovement: 'Ensure key industry tools like Docker, Git, CI/CD, and Unit Testing (JUnit/Jest) are explicitly listed in your Skills section.',
      rationale: 'ATS scanners filter resumes based on exact tool and framework matches.'
    }
  ];
}
