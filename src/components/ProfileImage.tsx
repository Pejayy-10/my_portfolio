"use client";

import { useState } from "react";

export const ProfileImage = () => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-48 h-48 md:w-72 md:h-72 shrink-0 border border-[#1a1a1a] rounded overflow-hidden halftone-container relative">
      {!hasError ? (
        <img 
          src="/photo.jpg" 
          alt="Fran Peruso" 
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : null}
      <div className="halftone-dot-pattern" />
      
      {/* Fallback layout shown if photo.jpg is missing in the /public folder */}
      {hasError && (
        <div className="fallback-placeholder absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f0f] text-[#555] font-mono text-[11px] lowercase text-center p-4">
          <span>[ photo.jpg missing ]</span>
          <span className="text-[9px] text-[#333] mt-2 leading-relaxed">
            Place your photo in the public/ folder named &quot;photo.jpg&quot; to see the live halftone shader.
          </span>
        </div>
      )}
    </div>
  );
};
