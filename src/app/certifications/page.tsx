"use client";

import { motion } from "framer-motion";

// Custom Abstract SVG Logos for Placeholder Issuers
const LogoAlpha = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#333333" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="#888888"/>
  </svg>
);

const LogoBeta = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="4" stroke="#333333" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" fill="#888888"/>
  </svg>
);

const LogoGamma = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L21 9L12 15L3 9L12 3Z" stroke="#333333" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="12" cy="9" r="2" fill="#888888"/>
  </svg>
);

const LogoDelta = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 5v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V5l-8-3z" stroke="#333333" strokeWidth="2" fill="#121212"/>
    <path d="M12 6v10" stroke="#888888" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const LogoEpsilon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 8L3 12L7 16" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 8L21 12L17 16" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="10" y1="18" x2="14" y2="6" stroke="#888888" strokeWidth="2"/>
  </svg>
);

interface Certification {
  id: string;
  title: string;
  issuer: string;
  logo: () => React.ReactNode;
  rotation: string;
}

interface CertCategory {
  name: string;
  items: Certification[];
}

const certificationCategories: CertCategory[] = [
  {
    name: "AI",
    items: [
      {
        id: "ai-1",
        title: "Generative Models Specialist",
        issuer: "PLATFORM ALPHA",
        logo: LogoAlpha,
        rotation: "-rotate-1 sm:-rotate-[1.5deg]",
      },
      {
        id: "ai-2",
        title: "Neural Networks Practitioner",
        issuer: "ACADEMY BETA",
        logo: LogoBeta,
        rotation: "rotate-1 sm:rotate-[1.2deg]",
      },
      {
        id: "ai-3",
        title: "Cognitive Systems Engineering",
        issuer: "INSTITUTE GAMMA",
        logo: LogoGamma,
        rotation: "-rotate-1 sm:-rotate-[0.8deg]",
      },
      {
        id: "ai-4",
        title: "Vector Database Architect",
        issuer: "REGISTRY DELTA",
        logo: LogoDelta,
        rotation: "rotate-2 sm:rotate-[1.8deg]",
      },
      {
        id: "ai-5",
        title: "Retrieval-Augmented Systems",
        issuer: "SYSTEMS EPSILON",
        logo: LogoEpsilon,
        rotation: "-rotate-1 sm:-rotate-[1.2deg]",
      },
    ],
  },
  {
    name: "Engineering",
    items: [
      {
        id: "eng-1",
        title: "Advanced Data Structures",
        issuer: "ACADEMY BETA",
        logo: LogoBeta,
        rotation: "rotate-1 sm:rotate-[0.8deg]",
      },
      {
        id: "eng-2",
        title: "Distributed Architecture Lead",
        issuer: "INSTITUTE GAMMA",
        logo: LogoGamma,
        rotation: "-rotate-1 sm:-rotate-[1.4deg]",
      },
      {
        id: "eng-3",
        title: "Relational Query Specialist",
        issuer: "REGISTRY DELTA",
        logo: LogoDelta,
        rotation: "rotate-2 sm:rotate-[1deg]",
      },
      {
        id: "eng-4",
        title: "Systems Programming Core",
        issuer: "PLATFORM ALPHA",
        logo: LogoAlpha,
        rotation: "-rotate-1 sm:-rotate-[0.8deg]",
      },
      {
        id: "eng-5",
        title: "Functional Language Expert",
        issuer: "SYSTEMS EPSILON",
        logo: LogoEpsilon,
        rotation: "rotate-1 sm:rotate-[1.5deg]",
      },
    ],
  },
  {
    name: "Cloud & DevOps",
    items: [
      {
        id: "cloud-1",
        title: "Cloud Operations Architect",
        issuer: "REGISTRY DELTA",
        logo: LogoDelta,
        rotation: "-rotate-1 sm:-rotate-[1deg]",
      },
      {
        id: "cloud-2",
        title: "Kubernetes Deployments Core",
        issuer: "PLATFORM ALPHA",
        logo: LogoAlpha,
        rotation: "rotate-1 sm:rotate-[1.4deg]",
      },
    ],
  },
  {
    name: "Security",
    items: [
      {
        id: "sec-1",
        title: "Cybersecurity Fundamentals",
        issuer: "INSTITUTE GAMMA",
        logo: LogoGamma,
        rotation: "-rotate-1 sm:-rotate-[1.6deg]",
      },
      {
        id: "sec-2",
        title: "Network Security Officer",
        issuer: "ACADEMY BETA",
        logo: LogoBeta,
        rotation: "rotate-1 sm:rotate-[1deg]",
      },
    ],
  },
  {
    name: "Project Management",
    items: [
      {
        id: "pm-1",
        title: "Agile Operations Professional",
        issuer: "PLATFORM ALPHA",
        logo: LogoAlpha,
        rotation: "rotate-1 sm:rotate-[0.8deg]",
      },
      {
        id: "pm-2",
        title: "Product Lifecycle Management",
        issuer: "REGISTRY DELTA",
        logo: LogoDelta,
        rotation: "-rotate-1 sm:-rotate-[1.2deg]",
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

export default function CertificationsPage() {
  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto space-y-16">
      {/* Page Header */}
      <div>
        <h1 className="font-mono text-4xl text-[#e5e5e5] mb-6 lowercase tracking-tight">certifications</h1>
        <p className="font-sans text-[15px] leading-relaxed text-[#888888] max-w-2xl">
          Credentials across AI, cloud, engineering, and project management — each verifiable at its source.
        </p>
      </div>

      {/* Certification Sections */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {certificationCategories.map((category) => (
          <motion.div 
            key={category.name} 
            variants={sectionVariants}
            className="space-y-6"
          >
            {/* Category Name */}
            <h2 className="font-mono text-[11px] text-[#555] uppercase tracking-widest">
              {category.name}
            </h2>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {category.items.map((cert) => {
                const Logo = cert.logo;
                return (
                  <a
                    key={cert.id}
                    href="#"
                    className={`block relative bg-[#0a0a0a]/40 border border-[#1a1a1a] rounded-2xl p-5 text-center flex flex-col justify-between h-[180px] shadow-lg hover:rotate-0 hover:scale-105 hover:z-30 hover:border-[#333] hover:bg-[#0c0c0c] transition-all duration-300 ease-out decoration-none group ${cert.rotation}`}
                  >
                    {/* Issuer Logo */}
                    <div>
                      <Logo />
                    </div>

                    {/* Title & Issuer Info */}
                    <div className="flex-1 flex flex-col justify-center my-2 select-none">
                      <h3 className="font-sans text-xs font-bold text-[#e5e5e5] leading-snug line-clamp-2">
                        {cert.title}
                      </h3>
                      <span className="font-mono text-[8px] text-[#555] uppercase tracking-wider mt-1 group-hover:text-[#888] transition-colors">
                        {cert.issuer}
                      </span>
                    </div>

                    {/* Verify Link */}
                    <div className="font-mono text-[9px] uppercase tracking-widest text-[#555] group-hover:text-[#e5e5e5] transition-colors select-none mt-auto">
                      ⟨ verify ⟩
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
