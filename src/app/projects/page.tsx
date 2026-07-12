"use client";

import { motion } from "framer-motion";

// Custom Abstract Geometric Icons for Template/Placeholder Projects
const IconAlpha = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 rounded-2xl">
    <rect width="64" height="64" rx="16" fill="#1f1f1f"/>
    <rect x="1" y="1" width="62" height="62" rx="15" stroke="#2c2c2c" strokeWidth="2"/>
    {/* Grid / Network Nodes */}
    <circle cx="20" cy="20" r="4" fill="#555555" />
    <circle cx="44" cy="20" r="4" fill="#555555" />
    <circle cx="20" cy="44" r="4" fill="#555555" />
    <circle cx="44" cy="44" r="4" fill="#555555" />
    <line x1="20" y1="20" x2="44" y2="20" stroke="#333333" strokeWidth="2"/>
    <line x1="20" y1="20" x2="20" y2="44" stroke="#333333" strokeWidth="2"/>
    <line x1="44" y1="20" x2="44" y2="44" stroke="#333333" strokeWidth="2"/>
    <line x1="20" y1="44" x2="44" y2="44" stroke="#333333" strokeWidth="2"/>
    <line x1="20" y1="20" x2="44" y2="44" stroke="#888888" strokeWidth="2" strokeDasharray="4 4"/>
  </svg>
);

const IconBeta = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 rounded-2xl">
    <rect width="64" height="64" rx="16" fill="#1f1f1f"/>
    <rect x="1" y="1" width="62" height="62" rx="15" stroke="#2c2c2c" strokeWidth="2"/>
    {/* Concentric rings */}
    <circle cx="32" cy="32" r="18" stroke="#333333" strokeWidth="2" />
    <circle cx="32" cy="32" r="10" stroke="#555555" strokeWidth="2" />
    <circle cx="32" cy="32" r="4" fill="#888888" />
  </svg>
);

const IconGamma = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 rounded-2xl">
    <rect width="64" height="64" rx="16" fill="#1f1f1f"/>
    <rect x="1" y="1" width="62" height="62" rx="15" stroke="#2c2c2c" strokeWidth="2"/>
    {/* Terminal / Cursor prompt symbol */}
    <path d="M18 20L30 32L18 44" stroke="#555555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="34" y1="44" x2="48" y2="44" stroke="#888888" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const AppStoreBadge = () => (
  <a href="#" className="inline-flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#141414] border border-[#1a1a1a] rounded-lg px-3 py-1.5 transition-all text-[#e5e5e5] decoration-none">
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.16.67-2.88 1.48-.62.72-1.15 1.86-1 2.97 1.08.08 2.21-.57 2.89-1.39z"/>
    </svg>
    <div className="text-left font-sans leading-none">
      <div className="text-[7px] uppercase tracking-wider text-[#888888] font-bold mb-0.5">Download on the</div>
      <div className="text-[10px] font-semibold">App Store</div>
    </div>
  </a>
);

const GooglePlayBadge = () => (
  <a href="#" className="inline-flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#141414] border border-[#1a1a1a] rounded-lg px-3 py-1.5 transition-all text-[#e5e5e5] decoration-none">
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5.27v13.46c0 .88.75 1.54 1.63 1.34l12.2-6.52c.6-.32.6-.96 0-1.28L4.63 3.93C3.75 3.73 3 4.39 3 5.27zm14.16 6.05L4.85 4.67l11.45 6.13c.42.22.42.66 0 .88l-11.45 6.13 12.31-6.59c.45-.24.45-.72 0-.96z"/>
    </svg>
    <div className="text-left font-sans leading-none">
      <div className="text-[7px] uppercase tracking-wider text-[#888888] font-bold mb-0.5">GET IT ON</div>
      <div className="text-[10px] font-semibold">Google Play</div>
    </div>
  </a>
);

interface FeaturedProject {
  id: string;
  badge: string;
  extraBadges?: string[];
  title: string;
  description: string;
  icon: () => React.ReactNode;
  featuredIn: string[];
}

interface StandardProject {
  id: string;
  title: string;
  category: string;
  description: string;
}

const featuredProjects: FeaturedProject[] = [
  {
    id: "project-alpha",
    badge: "SYSTEM ENGINEERING",
    extraBadges: ["OFFLINE FIRST", "DISTRIBUTED LEDGER"],
    title: "Project Alpha // Regional Ledger Sync",
    description: "An offline-first ledger syncing node subsystem capable of handling low-connectivity peripheral nodes.",
    icon: IconAlpha,
    featuredIn: ["Architecture Spec ↗", "System Overview ↗", "Scale Analysis ↗"],
  },
  {
    id: "project-beta",
    badge: "SaaS PLATFORM",
    extraBadges: ["MULTI-TENANT", "EDGE NODE CACHE"],
    title: "Project Beta // Audio Processing Engine",
    description: "Gamified state processing engine caching multi-format audio streams via local-first file subsystem.",
    icon: IconBeta,
    featuredIn: ["API Document ↗", "Performance Benchmark ↗"],
  },
  {
    id: "project-gamma",
    badge: "OPEN SOURCE",
    extraBadges: ["CLI COMPANION"],
    title: "Project Gamma // Automated Deployment Toolkit",
    description: "A highly optimized CLI companion for automating redundant deployment workflows and database migrations.",
    icon: IconGamma,
    featuredIn: ["Source Repo ↗", "Release Logs ↗"],
  },
];

const standardProjects: StandardProject[] = [
  {
    id: "project-delta",
    title: "Project Delta",
    category: "GENERATIVE AI",
    description: "An AI-native platform prototype mapping spiritual and theological learning datasets.",
  },
  {
    id: "project-epsilon",
    title: "Project Epsilon",
    category: "GENERATIVE AI",
    description: "Automated social media fact-checker model API integrating localized verification models.",
  },
  {
    id: "project-zeta",
    title: "Project Zeta",
    category: "PLATFORM",
    description: "Workspace booking engine and availability scheduler scaled for enterprise office fleets.",
  },
  {
    id: "project-eta",
    title: "Project Eta",
    category: "PLATFORM",
    description: "Verification compiler issuing cryptographically verifiable, skills-based credentials.",
  },
  {
    id: "project-theta",
    title: "Project Theta",
    category: "GENERATIVE AI",
    description: "Algorithmic capstone template generator for computer science curriculum verification.",
  },
  {
    id: "project-iota",
    title: "Project Iota",
    category: "WEB APP",
    description: "An ATS-optimized layout compiler rendering clean, structured developer resume profiles.",
  },
  {
    id: "project-kappa",
    title: "Project Kappa",
    category: "EDTECH · AI",
    description: "Custom training model assisting curriculum evaluation workflows using transformer embeddings.",
  },
];

export default function ProjectsPage() {
  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto space-y-16">
      {/* Page Header */}
      <div>
        <h1 className="font-mono text-4xl text-[#e5e5e5] mb-6 lowercase tracking-tight">projects</h1>
        <p className="font-sans text-[15px] leading-relaxed text-[#888888] max-w-2xl">
          Products and platforms I&apos;ve designed and shipped — spanning developer education, generative AI, and consumer apps.
        </p>
      </div>

      {/* Section 01: Featured Projects */}
      <div className="space-y-8">
        {featuredProjects.map((p) => {
          const Icon = p.icon;
          return (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start shadow-xl hover:border-[#222222] transition-colors"
            >
              <Icon />
              <div className="flex-1 space-y-6">
                {/* Badges row */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-mono text-[9px] text-[#e5e5e5] bg-[#1a1a1a] px-2.5 py-1 rounded-full border border-[#2a2a2a] tracking-wider">
                    ⟨ {p.badge} ⟩
                  </span>
                  {p.extraBadges?.map((badge, idx) => (
                    <span key={idx} className="font-mono text-[8px] text-[#888888] border border-[#1a1a1a] px-2 py-0.5 rounded-full tracking-wider uppercase">
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Title and description */}
                <div className="space-y-2">
                  <h3 className="font-sans text-xl font-medium text-[#e5e5e5]">{p.title}</h3>
                  <p className="font-sans text-sm text-[#888888] leading-relaxed max-w-2xl">{p.description}</p>
                </div>

                {/* Download links */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <AppStoreBadge />
                  <GooglePlayBadge />
                </div>

                {/* Featured In Footer */}
                <div className="border-t border-[#1a1a1a] pt-4 mt-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-mono text-[9px] text-[#555] uppercase tracking-wider">Resources</span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {p.featuredIn.map((feat, idx) => (
                      <a key={idx} href="#" className="font-mono text-[11px] text-[#888888] hover:text-[#e5e5e5] transition-colors decoration-none">
                        {feat}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Section 02: Other Projects List */}
      <div className="space-y-6">
        <h2 className="font-mono text-[11px] text-[#555] uppercase tracking-widest">Other Projects</h2>
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl divide-y divide-[#1a1a1a] overflow-hidden shadow-xl">
          {standardProjects.map((p) => (
            <a 
              key={p.id}
              href="#"
              className="flex items-center justify-between p-6 hover:bg-[#0f0f0f]/50 transition-all group duration-200 decoration-none"
            >
              {/* Left Column: Project Name */}
              <div className="font-mono text-lg text-[#e5e5e5] group-hover:text-white transition-colors select-none shrink-0 w-1/4">
                {p.title}
              </div>

              {/* Middle Column: Category and description */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="font-mono text-[9px] text-[#555] uppercase tracking-widest mb-1 select-none">
                  {p.category}
                </div>
                <div className="font-sans text-sm text-[#888888] group-hover:text-[#b5b5b9] transition-colors leading-relaxed">
                  {p.description}
                </div>
              </div>

              {/* Right Column: Arrow indicator */}
              <div className="text-[#555] group-hover:text-[#e5e5e5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 select-none ml-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
