"use client";

import { motion } from "framer-motion";

export interface ProjectType {
  title: string;
  category: string;
  description: string;
  badges: string[];
}

interface ProjectCardProps {
  project: ProjectType;
  index: number;
  isActive: boolean;
  position: "left" | "center" | "right" | "hidden";
  onClick: () => void;
}

export const ProjectCard = ({ project, index, isActive, position, onClick }: ProjectCardProps) => {
  // Determine animation state based on logical position
  let animateState = { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 0, opacity: 0 };
  
  if (position === "center") {
    animateState = { x: 0, y: 0, rotate: 0, scale: 1.05, zIndex: 50, opacity: 1 };
  } else if (position === "left") {
    animateState = { x: -140, y: 20, rotate: -6, scale: 0.9, zIndex: 40, opacity: 0.6 };
  } else if (position === "right") {
    animateState = { x: 140, y: 20, rotate: 6, scale: 0.9, zIndex: 40, opacity: 0.6 };
  } else {
    animateState = { x: 0, y: 40, rotate: 0, scale: 0.8, zIndex: 10, opacity: 0 };
  }

  return (
    <motion.div
      animate={animateState}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      className={`absolute left-0 right-0 mx-auto bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 w-[320px] md:w-[400px] shadow-2xl ${isActive ? "cursor-default" : "cursor-pointer hover:border-[#333333]"}`}
      style={{ originX: 0.5, originY: 1 }}
    >
      {/* Top Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.badges.map((badge, i) => (
          <div 
            key={i} 
            className={`px-3 py-1 rounded-full text-[10px] font-mono lowercase whitespace-nowrap tracking-wider ${i === 0 ? 'bg-[#e5e5e5] text-[#0a0a0a]' : 'border border-[#1a1a1a] text-[#888888]'}`}
          >
            {i === 0 ? `{ ${badge} }` : badge}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-4">
        {/* App Logo Placeholder */}
        <div className="w-12 h-12 rounded-xl bg-[#141414] border border-[#1a1a1a] flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-[#333333]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        
        {/* Title */}
        <h3 className="font-mono text-lg text-[#e5e5e5] lowercase tracking-tight">
          {project.title}
        </h3>
      </div>

      {/* Description */}
      <p className="font-sans text-sm text-[#888888] leading-relaxed mb-6">
        {project.description}
      </p>

      {/* App Store Placeholders */}
      <div className="flex gap-3">
        <div className="h-10 w-32 bg-[#141414] border border-[#1a1a1a] rounded-lg flex items-center justify-center">
          <span className="font-mono text-[10px] text-[#555555]">app store</span>
        </div>
        <div className="h-10 w-32 bg-[#141414] border border-[#1a1a1a] rounded-lg flex items-center justify-center">
          <span className="font-mono text-[10px] text-[#555555]">play store</span>
        </div>
      </div>
    </motion.div>
  );
};
