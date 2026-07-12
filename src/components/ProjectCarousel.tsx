"use client";

import { useState } from "react";
import { ProjectCard, ProjectType } from "./ProjectCard";

export const ProjectCarousel = ({ projects }: { projects: ProjectType[] }) => {
  const [activeIndex, setActiveIndex] = useState(1); // Default to middle card

  return (
    <div className="relative h-[360px] w-full flex justify-center items-center">
      <div className="relative w-full max-w-2xl h-full flex justify-center items-center">
        {projects.map((project, i) => {
          let position: "left" | "center" | "right" | "hidden" = "hidden";
          
          if (i === activeIndex) {
            position = "center";
          } else if (i === activeIndex - 1 || (activeIndex === 0 && i === projects.length - 1)) {
            // Logic for looping the previous item
            position = "left";
          } else if (i === activeIndex + 1 || (activeIndex === projects.length - 1 && i === 0)) {
            // Logic for looping the next item
            position = "right";
          }

          return (
            <ProjectCard
              key={project.title}
              project={project}
              isActive={i === activeIndex}
              position={position}
              onClick={() => setActiveIndex(i)}
            />
          );
        })}
      </div>
    </div>
  );
};
