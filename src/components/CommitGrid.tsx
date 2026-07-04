"use client";

import React, { useEffect, useState } from "react";
import { getGitHubCommits } from "@/actions/github";

const getFillColor = (level: number) => {
  switch (level) {
    case 1:
      return "#06402b";
    case 2:
      return "#0f5d40";
    case 3:
      return "#1a7c56";
    case 4:
      return "#27a070";
    default:
      return "#141414"; // Empty state
  }
};

export const CommitGrid = () => {
  const [contributions, setContributions] = useState<number[][]>([]);

  useEffect(() => {
    const fetchCommits = async () => {
      const data = await getGitHubCommits();
      setContributions(data);
    };
    fetchCommits();
  }, []);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[800px]">
        <div className="flex items-center space-x-1 mb-2">
          <span className="font-mono text-xs text-[#888888] lowercase">Commit Topology Engine</span>
          <span className="flex-1 border-b border-[#1a1a1a] border-dashed mx-4"></span>
          <span className="font-mono text-xs text-[#888888] lowercase">Real-time Layout</span>
        </div>
        
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 shadow-2xl">
          <svg width="100%" height="112" viewBox="0 0 728 112" className="overflow-visible">
            {contributions.length > 0 && contributions.map((week, x) => (
              <g key={x} transform={`translate(${x * 14}, 0)`}>
                {week.map((level, y) => (
                  <rect
                    key={y}
                    y={y * 14}
                    width="10"
                    height="10"
                    rx="2"
                    fill={getFillColor(level)}
                    className="transition-colors duration-300 hover:fill-[#333333] cursor-crosshair"
                  />
                ))}
              </g>
            ))}
          </svg>
          
          <div className="flex justify-between items-center mt-4">
            <span className="font-mono text-xs text-[#555555] lowercase">Activity mapped to local cluster</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-[#555555] lowercase">Less</span>
              <svg width="66" height="10" className="overflow-visible">
                <rect x="0" y="0" width="10" height="10" rx="2" fill="#141414" />
                <rect x="14" y="0" width="10" height="10" rx="2" fill="#06402b" />
                <rect x="28" y="0" width="10" height="10" rx="2" fill="#0f5d40" />
                <rect x="42" y="0" width="10" height="10" rx="2" fill="#1a7c56" />
                <rect x="56" y="0" width="10" height="10" rx="2" fill="#27a070" />
              </svg>
              <span className="font-mono text-xs text-[#555555] lowercase">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
