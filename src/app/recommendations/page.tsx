"use client";

import { motion } from "framer-motion";

interface Recommendation {
  id: string;
  text: string;
  author: string;
  initials: string;
  role: string;
  date: string;
}

const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    text: "An exceptionally skilled developer. Their technical execution and ability to ship complex systems cleanly is outstanding. They are always focused on clean engineering principles.",
    author: "Mentor Alpha",
    initials: "MA",
    role: "Department of Systems Architecture",
    date: "AUG 2025",
  },
  {
    id: "rec-2",
    text: "They are one of the most reliable engineering partners I have worked with. Their quick executions and concept building skills helped our team deliver most of our complex features ahead of schedule. They always provide insightful feedback both on the strategic and technical aspects of our systems.\n\nIn and out of work, their focus on code quality and clean documentation made a huge difference. I highly recommend them to any team looking for a technical leader who can also execute.",
    author: "Principal Partner",
    initials: "PP",
    role: "Platform Integration Lead",
    date: "JUL 2025",
  },
  {
    id: "rec-3",
    text: "They have been instrumental in our system scaling phases. As our Tech Lead, they're not just a strong developer—they are a true builder. From leading key migrations to mentoring junior developers, they consistently deliver high-quality solutions and forward-thinking ideas.",
    author: "Lead Beta",
    initials: "LB",
    role: "Enterprise Scale Systems",
    date: "MAY 2025",
  },
  {
    id: "rec-4",
    text: "I worked alongside them on several key backend initiatives. They have an impressive tenacity to deliver exactly what they commit to, without sacrificing quality or performance under tight constraints. Their eagerness to research new technologies and integrate them cleanly is a great asset.\n\nTheir work on optimizing database caches and CI/CD pipelines significantly reduced server overhead, improving overall system stability.",
    author: "Teammate Gamma",
    initials: "TG",
    role: "Cloud Systems Specialist",
    date: "DEC 2024",
  },
  {
    id: "rec-5",
    text: "A highly intelligent software engineer who takes lead on complex modules and handles team collaboration exceptionally well. They are extremely structured in their development approach.",
    author: "Technical Lead",
    initials: "TL",
    role: "Core Services Division",
    date: "MAR 2024",
  },
  {
    id: "rec-6",
    text: "I had the pleasure of collaborating on several integrations. They consistently brought strong domain knowledge in database design, performance optimization, and automation workflows. They are the kind of engineer who raises the bar for everyone around them.",
    author: "Partner Delta",
    initials: "PD",
    role: "API Infrastructure",
    date: "JAN 2024",
  },
  {
    id: "rec-7",
    text: "An incredible builder who is passionate about developer experience, automation tooling, and clean interfaces. They are always searching for ways to optimize current processes.",
    author: "Product Lead",
    initials: "PL",
    role: "DevOps & Integrations",
    date: "OCT 2023",
  },
  {
    id: "rec-8",
    text: "Their combination of technical depth and people skills makes them a rare find. They present complex solutions with confidence, communicate transparently with stakeholders, and execute with absolute precision.",
    author: "Advisor Epsilon",
    initials: "AE",
    role: "Strategic Operations",
    date: "JUN 2023",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

export default function RecommendationsPage() {
  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto space-y-12">
      {/* Page Header */}
      <div>
        <h1 className="font-mono text-4xl text-[#e5e5e5] mb-6 lowercase tracking-tight">recommendations</h1>
        <p className="font-sans text-[15px] leading-relaxed text-[#888888] max-w-2xl">
          What leaders, teammates, and mentors say about working together — straight from project feedbacks and logs.
        </p>
      </div>

      {/* Masonry Columns Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full"
      >
        {recommendations.map((rec) => (
          <motion.div
            key={rec.id}
            variants={itemVariants}
            className="break-inside-avoid mb-6 bg-[#0a0a0a]/35 border border-[#141416] rounded-2xl p-6 shadow-md hover:border-[#222] hover:bg-[#0c0c0e]/50 transition-all duration-300 group flex flex-col justify-between"
          >
            {/* Top quote marker */}
            <div className="text-3xl font-serif text-[#1c1c1e] select-none mb-1 leading-none">
              &ldquo;
            </div>

            {/* Testimonial body */}
            <p className="font-serif text-[#d4d4d8] leading-relaxed text-[14px] whitespace-pre-line flex-1">
              {rec.text}
            </p>

            <div className="border-t border-[#141416] my-4 group-hover:border-[#1c1c1e] transition-colors" />

            {/* Author Footer */}
            <div className="flex items-center gap-3">
              {/* Initials Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#141416] border border-[#222] flex items-center justify-center font-mono text-[11px] text-[#888] group-hover:border-[#333] transition-colors select-none shrink-0">
                {rec.initials}
              </div>

              {/* Bio & Date */}
              <div className="flex-1 min-w-0 font-sans leading-tight">
                <div className="text-xs font-semibold text-[#e5e5e5]">
                  {rec.author}
                </div>
                <div className="text-[10px] text-[#555] line-clamp-1 mt-0.5">
                  {rec.role}
                </div>
                <div className="text-[9px] font-mono text-[#444] uppercase tracking-wider mt-1 block">
                  {rec.date}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
