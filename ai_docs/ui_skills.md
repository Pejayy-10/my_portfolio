# UI Skills: Physics-Driven Animation Recipes

This file contains pre-configured recipes for Framer Motion / Motion execution inside the portfolio ecosystem. The agent must read these structural patterns when building animation modules.

---

## Skill 1: Overlapping Stacked Project Cards Carousel
*Context:* Used in the `02 — projects` display block to create layered cards that slide apart smoothly on interaction.

### Implementation Blueprint
```tsx
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

export const ProjectCard = ({ project, index }) => {
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
```

---

## Skill 2: Interactive Real-Time Audience Indicator Glow
*Context:* Used in the fixed navigation sidebar to power the pulse circle.

### Implementation Blueprint
```tsx
export const LiveIndicator = ({ count }: { count: number }) => {
  return (
    <div className="flex items-center space-x-3 p-2 bg-[#141414] border border-[#1a1a1a] rounded-md">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </div>
      <span className="font-mono text-xs text-[#888888] lowercase">
        {count} people viewing now
      </span>
    </div>
  );
};
```