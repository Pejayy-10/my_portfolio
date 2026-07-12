"use client";

import { motion } from "framer-motion";

interface Role {
  title: string;
  period: string;
  duration: string;
  description: string[];
  skills: string[];
}

interface CompanyExperience {
  id: string;
  name: string;
  initials: string;
  type: string;
  durationTotal?: string;
  location?: string;
  roles: Role[];
}

const experiences: CompanyExperience[] = [
  {
    id: "company-alpha",
    name: "Company Alpha",
    initials: "CA",
    type: "Full-time",
    roles: [
      {
        title: "Lead Software Architect",
        period: "AUG 2025 - PRESENT",
        duration: "11 MOS",
        description: [
          "Direct technical architecture and system-level scaling strategies across core platform infrastructure.",
          "Provide design oversight for microservices pipelines, security standards, and high-throughput databases.",
        ],
        skills: ["System Architecture", "Cloud Scaling", "Generative AI", "+2 skills"],
      },
    ],
  },
  {
    id: "company-beta",
    name: "Company Beta",
    initials: "CB",
    type: "Full-time",
    durationTotal: "1 yr 2 mos",
    location: "Manila, PH · Hybrid",
    roles: [
      {
        title: "Senior DevOps Engineer",
        period: "FEB 2025 - AUG 2025",
        duration: "7 MOS",
        description: [
          "Managed automated container workloads, CI/CD orchestration, and server provisioning workflows.",
          "Standardized infrastructure-as-code scripts, reducing provisioning times and improving build reliability.",
        ],
        skills: ["Docker", "Kubernetes", "CI/CD", "AWS", "+3 skills"],
      },
      {
        title: "Full Stack Developer",
        period: "JUL 2024 - FEB 2025",
        duration: "8 MOS",
        description: [
          "Contributed to front-end refactoring and modular interface assembly using modern component frameworks.",
          "Audited and optimized database queries, reducing server overhead and improving overall response latency.",
        ],
        skills: ["TypeScript", "React", "Node.js", "SQL", "+3 skills"],
      },
    ],
  },
  {
    id: "company-gamma",
    name: "Company Gamma",
    initials: "CG",
    type: "Contract",
    durationTotal: "2 yrs 7 mos",
    location: "Remote",
    roles: [
      {
        title: "Software Engineering Lead",
        period: "JAN 2022 - JUL 2024",
        duration: "2 YRS 7 MOS",
        description: [
          "Led development and deployment of responsive web tools and mobile components for enterprise clients.",
          "Organized sprint cycles, code reviews, and architectural designs for a multi-disciplinary engineering team.",
        ],
        skills: ["Next.js", "TypeScript", "Solution Architecture", "+3 skills"],
      },
    ],
  },
  {
    id: "company-delta",
    name: "Company Delta",
    initials: "CD",
    type: "Internship",
    durationTotal: "6 mos",
    location: "On-site",
    roles: [
      {
        title: "Software Developer Intern",
        period: "JUL 2021 - DEC 2021",
        duration: "6 MOS",
        description: [
          "Assisted in code refactoring, bug fixes, and layout assembly under senior engineer guidance.",
          "Contributed to unit test coverage and documented internal REST API endpoints.",
        ],
        skills: ["JavaScript", "CSS", "Git"],
      },
    ],
  },
];

export default function ExperiencePage() {
  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="font-mono text-4xl text-[#e5e5e5] mb-6 lowercase tracking-tight">experience</h1>
        <p className="font-sans text-[15px] leading-relaxed text-[#888888] max-w-2xl">
          Several years designing and building systems across AI engineering, platform infrastructure, and full-stack development.
        </p>
      </div>

      {/* Timeline Section */}
      <div className="relative pl-0 md:pl-4">
        {/* Continuous Timeline Line */}
        <div className="absolute left-[19px] top-5 bottom-5 w-[1px] bg-[#1a1a1a] z-0" />

        {/* Experience Blocks */}
        <div className="space-y-16">
          {experiences.map((company) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative pl-16 z-10"
            >
              {/* Company Logo Node */}
              <div className="absolute left-0 top-0 w-10 h-10 rounded-xl bg-[#0c0c0c] border border-[#1a1a1a] flex items-center justify-center font-mono text-xs text-[#888] select-none z-20">
                {company.initials}
              </div>

              {/* Company Meta Info */}
              <div className="space-y-1">
                <h3 className="font-sans text-lg font-bold text-[#e5e5e5]">{company.name}</h3>
                <p className="font-mono text-[11px] text-[#555] lowercase">
                  {company.type}
                  {company.durationTotal ? ` · ${company.durationTotal}` : ""}
                  {company.location ? ` · ${company.location}` : ""}
                </p>
              </div>

              {/* Nested Roles timeline */}
              <div className="mt-8 space-y-12">
                {company.roles.map((role) => (
                  <div 
                    key={role.title} 
                    className="relative pl-2 before:absolute before:left-[-48px] before:top-[8px] before:w-2.5 before:h-2.5 before:rounded-full before:border-2 before:border-[#333] before:bg-[#0a0a0a] before:z-10"
                  >
                    {/* Role Title and Period */}
                    <div className="space-y-1">
                      <h4 className="font-sans text-[15px] font-semibold text-[#e5e5e5]">{role.title}</h4>
                      <p className="font-mono text-[10px] text-[#555] uppercase tracking-widest">
                        {role.period} · {role.duration}
                      </p>
                    </div>

                    {/* Role Descriptions */}
                    <div className="mt-4 font-sans text-sm text-[#888888] leading-relaxed space-y-3 max-w-2xl">
                      {role.description.map((desc, idx) => (
                        <p key={idx}>{desc}</p>
                      ))}
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-2 mt-5">
                      {role.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="font-mono text-[10px] text-[#888888] bg-[#0c0c0c] border border-[#1a1a1a] rounded px-2.5 py-1 tracking-wide"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
