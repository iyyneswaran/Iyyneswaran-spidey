export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Achievements", href: "#achievements" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
] as const;

export const HERO_ROLES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "FastAPI",
  "WebSockets",
] as const;

export const HERO_HEADLINES = [
  "Full Stack Developer",
  "AI/ML Builder",
  "Hackathon Leader",
] as const;

export const STATS = [
  { value: "10+", label: "Hackathons" },
  { value: "2", label: "Wins" },
  { value: "₹50K", label: "1st Prize" },
  { value: "15", label: "Days AI/DS Internship" },
] as const;

export const ABOUT_TEXT =
  "Full stack developer with experience building scalable systems across AI/ML, backend, and real time applications. Led multiple high pressure hackathon projects, delivering production ready solutions and winning national level competitions. Strong in system design, rapid prototyping, and end to end product execution.";

export const SKILL_CATEGORIES = [
  {
    title: "Languages",
    skills: ["Python", "JavaScript", "TypeScript", "HTML"],
  },
  {
    title: "Frontend",
    skills: ["React", "Tailwind CSS", "Bootstrap"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "FastAPI", "WebSockets"],
  },
  {
    title: "Databases",
    skills: ["PostgreSQL", "MongoDB", "Firebase", "Supabase", "Pinecone", "SQL"],
  },
  {
    title: "Tools",
    skills: [
      "Git",
      "GitHub",
      "GitHub Actions",
      "Docker",
      "Postman",
      "Figma",
      "Arcjet",
      "Zod",
    ],
  },
  {
    title: "Focus Areas",
    skills: [
      "AI/ML",
      "Computer Vision",
      "API Design",
      "Backend",
      "DevOps",
      "UI/UX Design",
      "Version Control",
    ],
  },
] as const;

export type ProjectCategory = "Featured" | "AI/ML" | "Full Stack" | "Hackathon";

export interface Project {
  id: string;
  title: string;
  description: string;
  details: string[];
  techStack: string[];
  outcome: string;
  categories: ProjectCategory[];
  color: string;
  url?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "agriassist",
    title: "AgriAssist",
    description:
      "Hybrid agriculture system integrating software and hardware-driven insights for decision support.",
    details: [
      "Architected and built a hybrid agriculture system integrating software and hardware driven insights for decision support.",
      "Redesigned the system within 48 hours by replacing hardware sensors with geospatial and data-driven models under strict constraints.",
      "Developed full stack architecture with React, Node.js, APIs, and databases.",
      "Led a team of 4, handled technical decisions, final pitching, and jury Q&A.",
      "Won 1st prize (₹50,000) in a 24-hour national level hackathon.",
    ],
    techStack: ["React", "Node.js", "APIs", "Databases", "Geospatial Models"],
    outcome: "🏆 1st Prize — ₹50,000",
    categories: ["Featured", "Full Stack", "Hackathon"],
    color: "#1a1a1a",
    url: "https://agri-assist-frontend-seven.vercel.app/",
  },
  {
    id: "eduguru",
    title: "EduGuru",
    description:
      "Full-stack learning management platform inspired by modern classroom ecosystems.",
    details: [
      "Full-stack learning management platform inspired by modern classroom ecosystems.",
      "Classroom creation and enrollment using unique classroom codes.",
      "Quiz, evaluation, and leaderboard systems.",
      "Multilingual AI-powered academic assistant in English, Hinglish, and Tanglish.",
      "Secure backend with role-based access control, REST APIs, and optimized database operations.",
    ],
    techStack: ["React", "Node.js", "REST APIs", "AI/ML", "RBAC"],
    outcome: "Production-ready LMS",
    categories: ["Featured", "Full Stack", "AI/ML"],
    color: "#2a2a2a",
    url: "https://edu-guru-frontend.vercel.app/",
  },
  {
    id: "Atopsy",
    title: "AI-powered forensic intelligence platform",
    description:
      "Analyzes death investigations using AI for faster, consistent, evidence-based forensic insights.",
    details: [
      "Collects and standardizes autopsy data from diverse forensic sources.",
      "Applies artificial intelligence to uncover forensic patterns and insights.",
      "Generates evidence-driven reports supporting accurate medico-legal investigations.",
    ],
    techStack: ["NLP", "AI/ML", "Python", "PERN", "Tesseract OCR", "FastAPI"],
    outcome: "Accurate, intelligent, evidence-driven forensic autopsy decision support.",
    categories: ["Featured", "AI/ML", "Hackathon"],
    color: "#333333",
    url: "https://atopsy-frontend.vercel.app/",
  },
  {
    id: "fullstack-apps",
    title: "Full Stack Applications",
    description:
      "Scalable web apps using React, Node.js, REST APIs, and real-time communication.",
    details: [
      "Scalable web apps using React, Node.js, REST APIs, modular backend architecture.",
      "Real-time communication using WebSockets.",
      "Secure APIs with Zod validation and multiple databases.",
    ],
    techStack: ["React", "Node.js", "WebSockets", "Zod", "PostgreSQL", "MongoDB"],
    outcome: "Production-grade architecture",
    categories: ["Full Stack"],
    color: "#3d3d3d",
    url: "https://github.com/iyyneswaran?tab=repositories",
  },
];

export const PROJECT_TABS: ProjectCategory[] = [
  "Featured",
  "AI/ML",
  "Full Stack",
  "Hackathon",
];

export interface ExperienceItem {
  title: string;
  organization: string;
  description: string;
  period?: string;
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    title: "IEEE Student Branch Office Bearer",
    organization: "IEEE",
    description:
      "Webmaster for 1 year, maintaining and managing the official IEEE college website.",
    period: "2026 - present",
  },
  {
    title: "IEEE MAGIC Communicator & RAS MAGIC Mastermind",
    organization: "IEEE",
    description:
      "Active member contributing to communication and robotics & automation society initiatives.",
    period: "2024 - Present",
  },
  {
    title: "IEEE Day & Hackathon Organizer",
    organization: "IEEE",
    description:
      "Organized IEEE Day and co-organized a 14-hour hackathon event.",
    period: "2025",
  },
  {
    title: "Tech Team Member — TEDx",
    organization: "Sairam Institutions",
    description:
      "Tech team member in Sairam Institutions for organizing TEDx event.",
    period: "2024",
  },
  {
    title: "AI/DS Intern",
    organization: "BigSiBucks Innovation Pvt Ltd",
    description:
      "15 days AI/DS internship focusing on artificial intelligence and data science applications.",
    period: "2026",
  },
];

export const HACKATHON_STATS = [
  { value: 10, label: "Hackathons Participated", suffix: "+" },
  { value: 2, label: "Wins Secured", suffix: "" },
] as const;

export const HACKATHON_HIGHLIGHTS = [
  {
    title: "1st Prize — National Level Hackathon",
    venue: "Sir M Visvesvaraya Institute of Technology, Bangalore",
    prize: "₹50,000",
    featured: true,
  },
  {
    title: "3rd Prize — VIT Chennai Hackathon",
    venue: "VIT Chennai",
    prize: "",
    featured: false,
  },
  {
    title: "Rapid System Pivoting",
    venue: "Led team execution under 12–24 hour constraints",
    prize: "",
    featured: false,
  },
] as const;

export const AWARDS = [
  {
    title: "Best Student Volunteer Award",
    organization: "IEEE Student Branch (College Level)",
    year: "2025",
  },
] as const;

export const SYMPOSIUMS = [
  "Participated in 5 symposiums",
  "Secured third prize in a UI/UX design event at Vel Tech Multi Tech Dr Rangarajan Dr Sakunthala Engineering College, Chennai",
  "Participated in 2 technical paper presentations as team lead",
] as const;

export const EDUCATION = [
  {
    degree: "B.E. Mechanical Engineering (Pursuing)",
    institution: "Sri Sairam Institute of Technology, Chennai",
    period: "2023 — 2027",
    grade: "CGPA 8.53",
  },
  {
    degree: "Higher Secondary (12th)",
    institution: "Sharmila Goddess S.M. Matric Hr. Sec School, Mayiladuthurai",
    period: "",
    grade: "91.5%",
  },
  {
    degree: "SSLC (10th)",
    institution: "Sharmila Goddess S.M. Matric Hr. Sec School, Mayiladuthurai",
    period: "",
    grade: "100%",
  },
] as const;

export const LANGUAGES = [
  { name: "English", proficiency: "Professional working proficiency", level: 85 },
  { name: "Tamil", proficiency: "Native and bilingual proficiency", level: 100 },
  { name: "Hindi", proficiency: "Elementary proficiency", level: 35 },
] as const;

export const CONTACT_INFO = {
  email: "iyyneswaranp@gmail.com",
  phone: "+91 9042524161",
  linkedin: "linkedin.com/in/iyyneswaran07",
  linkedinUrl: "https://linkedin.com/in/iyyneswaran07",
  github: "github.com/iyyneswaran",
  githubUrl: "https://github.com/iyyneswaran",
  // portfolio: "iyyneswaranp.vercel.app",
  // portfolioUrl: "https://iyyneswaranp.vercel.app",
} as const;
