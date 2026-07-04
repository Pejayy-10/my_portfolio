"use client";

import { motion } from "framer-motion";

const cardVariants = {
  initial: (index: number) => ({
    x: index * 12,
    y: index * 8,
    rotate: index * -2,
    zIndex: 10 - index,
    scale: 1 - index * 0.02,
  }),
  hover: {
    y: -24,
    rotate: 0,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1], // Custom snappy cubic-bezier
    },
  },
};

export interface ProjectType {
  title: string;
  category: string;
  description: string;
}

export const ProjectCard = ({ project, index }: { project: ProjectType; index: number }) => {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className="absolute bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 w-[340px] h-[240px] shadow-2xl"
    >
      <span className="font-mono text-xs text-[#888888] lowercase">
        {project.category}
      </span>
      <h3 className="font-mono text-lg font-medium lowercase text-[#e5e5e5] mt-2">
        {project.title}
      </h3>
      <p className="font-sans text-sm text-[#888888] mt-4 leading-relaxed">
        {project.description}
      </p>
    </motion.div>
  );
};
