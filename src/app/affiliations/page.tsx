"use client";

import { motion } from "framer-motion";

interface Affiliation {
  id: string;
  name: string;
  initials: string;
  role: "MEMBER" | "FOUNDER";
  description: string;
  linkText: string;
  linkUrl: string;
  watermark: string;
}

const affiliations: Affiliation[] = [
  {
    id: "aff-1",
    name: "Association Alpha of Developer Operations",
    initials: "AA",
    role: "MEMBER",
    description: "A regional association advancing cloud operations, container orchestration, and continuous integration adoption.",
    linkText: "association-alpha.org ↗",
    linkUrl: "#",
    watermark: "ALPHA",
  },
  {
    id: "aff-2",
    name: "Software Systems Industry Board",
    initials: "SS",
    role: "MEMBER",
    description: "A national industry body representing software developers, systems engineering professionals, and IT service providers.",
    linkText: "software-board.org ↗",
    linkUrl: "#",
    watermark: "SSIB",
  },
  {
    id: "aff-3",
    name: "AppBuilders Community",
    initials: "AB",
    role: "FOUNDER",
    description: "A local developer community founded to support software engineers, systems architects, and indie hackers building web tools.",
    linkText: "appbuilders.dev ↗",
    linkUrl: "#",
    watermark: "ABPH",
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

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

export default function AffiliationsPage() {
  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto space-y-12">
      {/* Page Header */}
      <div>
        <h1 className="font-mono text-4xl text-[#e5e5e5] mb-6 lowercase tracking-tight">affiliations</h1>
        <p className="font-sans text-[15px] leading-relaxed text-[#888888] max-w-2xl">
          Associations and communities we are part of — and the ones we help build.
        </p>
      </div>

      {/* Cards Stack */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {affiliations.map((aff) => (
          <motion.div
            key={aff.id}
            variants={cardVariants}
            className="bg-[#0a0a0a]/35 border border-[#141416] rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden group hover:border-[#222] hover:bg-[#0c0c0e]/50 transition-all duration-300"
          >
            {/* Left Column: Logo Node */}
            <div className="w-14 h-14 rounded-2xl bg-[#0e0e10] border border-[#1c1c1e] flex items-center justify-center font-mono text-lg font-bold text-[#e5e5e5] group-hover:border-[#333] transition-colors select-none shrink-0">
              {aff.initials}
            </div>

            {/* Right Column: Content */}
            <div className="flex-1 space-y-3 z-10">
              {/* Badge Row */}
              <div>
                {aff.role === "FOUNDER" ? (
                  <span className="inline-flex items-center gap-1 bg-[#e5e5e5] text-[#0a0a0a] font-mono text-[8px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase select-none">
                    <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/>
                    </svg>
                    FOUNDER
                  </span>
                ) : (
                  <span className="inline-flex items-center border border-[#1c1c1e] text-[#888] font-mono text-[8px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase select-none">
                    MEMBER
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="font-sans text-md font-bold text-[#e5e5e5] group-hover:text-white transition-colors">
                  {aff.name}
                </h3>
                <p className="font-sans text-sm text-[#888888] leading-relaxed max-w-2xl">
                  {aff.description}
                </p>
              </div>

              {/* Link */}
              <div className="pt-1">
                <a
                  href={aff.linkUrl}
                  className="font-mono text-[11px] text-[#555] group-hover:text-[#e5e5e5] transition-colors decoration-none"
                >
                  {aff.linkText}
                </a>
              </div>
            </div>

            {/* Background Watermark */}
            <span className="absolute bottom-[-10px] right-4 font-mono text-[80px] md:text-[96px] font-bold text-white opacity-[0.015] group-hover:opacity-[0.025] transition-opacity select-none pointer-events-none select-none tracking-tighter z-0">
              {aff.watermark}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
