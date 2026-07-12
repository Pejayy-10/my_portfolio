"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const generateId = (): string => {
  try {
    return crypto.randomUUID();
  } catch {
    return "xxxx-xxxx-4xxx-yxxx-xxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
};

/* Hook that returns the live viewer count — only call once in the app */
export const useLiveViewerCount = () => {
  const [count, setCount] = useState(0);
  const idRef = useRef(generateId());

  useEffect(() => {
    const room = supabase.channel(`portfolio_visitors_${idRef.current}`, {
      config: { presence: { key: idRef.current } },
    });

    room
      .on("presence", { event: "sync" }, () => {
        setCount(Object.keys(room.presenceState()).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await room.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(room);
    };
  }, []);

  return count;
};

export const Sidebar = ({ 
  onSearchClick, 
  onChatClick, 
  onTypingTestClick,
  viewerCount = 0, 
  theme = "dark", 
  onThemeChange 
}: { 
  onSearchClick?: () => void; 
  onChatClick?: () => void; 
  onTypingTestClick?: () => void;
  viewerCount?: number; 
  theme?: "system" | "light" | "dark"; 
  onThemeChange?: (theme: "system" | "light" | "dark", e: React.MouseEvent<HTMLButtonElement>) => void; 
}) => {
  return (
    <div className="h-full flex flex-col px-8 py-10 bg-[#0a0a0a] overflow-y-auto">
      <div className="mb-14">
        <Link href="/" className="font-mono text-[17px] tracking-wide text-[#e5e5e5] hover:text-white transition-colors">Fran Peruso</Link>
      </div>
      
      <nav className="flex flex-col space-y-4 flex-1">
        <Link href="/projects" className="block font-mono text-[13px] text-[#888888] hover:text-[#e5e5e5] transition-colors">Projects</Link>
        <Link href="/experience" className="block font-mono text-[13px] text-[#888888] hover:text-[#e5e5e5] transition-colors">Experience</Link>
        <Link href="/stack" className="block font-mono text-[13px] text-[#888888] hover:text-[#e5e5e5] transition-colors">Stack</Link>
        <Link href="/certifications" className="block font-mono text-[13px] text-[#888888] hover:text-[#e5e5e5] transition-colors">Certifications</Link>
        <Link href="/recommendations" className="block font-mono text-[13px] text-[#888888] hover:text-[#e5e5e5] transition-colors">Recommendations</Link>
        <Link href="/affiliations" className="block font-mono text-[13px] text-[#888888] hover:text-[#e5e5e5] transition-colors">Affiliations</Link>
      </nav>

      <div className="mt-12 space-y-7">
        {/* Ask anything / Typing test */}
        <div className="space-y-4">
          <button 
            onClick={onSearchClick}
            className="w-full flex items-center justify-between text-[#888888] hover:text-[#e5e5e5] transition-colors group cursor-text"
          >
            <span className="font-sans text-[13px]">Ask anything</span>
            <div className="flex items-center space-x-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="font-mono text-[10px] border border-[#333333] rounded px-1.5 py-0.5">Alt</span>
              <span className="text-[10px] text-[#555]">+</span>
              <span className="font-mono text-[10px] border border-[#333333] rounded px-1.5 py-0.5">K</span>
            </div>
          </button>

          <button 
            onClick={onTypingTestClick}
            className="w-full flex items-center justify-between text-[#888888] hover:text-[#e5e5e5] transition-colors group cursor-pointer"
          >
            <span className="font-sans text-[13px]">Typing test</span>
            <div className="flex items-center space-x-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="font-mono text-[10px] border border-[#333333] rounded px-1.5 py-0.5">Alt</span>
              <span className="text-[10px] text-[#555]">+</span>
              <span className="font-mono text-[10px] border border-[#333333] rounded px-1.5 py-0.5">J</span>
            </div>
          </button>
        </div>
        
        <div className="h-[1px] w-full bg-[#1a1a1a]"></div>
        
        {/* Live Status Box */}
        <div className="space-y-4">
          {/* Inline viewer count display */}
          <div className="space-y-4">
            <div className="flex -space-x-2 min-h-[28px]">
              {Array.from({ length: Math.min(viewerCount, 3) }).map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-[#141414] border-2 border-[#0a0a0a] flex items-center justify-center overflow-hidden z-0 relative">
                  <svg className="w-3 h-3 text-[#555]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
              ))}
              {viewerCount > 3 && (
                <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border-2 border-[#0a0a0a] flex items-center justify-center z-10 text-[9px] font-mono text-[#888888] relative">
                  +{viewerCount - 3}
                </div>
              )}
            </div>
            <div className="font-sans text-[13px] text-[#888888]">
              <strong className="text-[#e5e5e5] font-semibold">{viewerCount > 0 ? viewerCount : "0"}</strong> people viewing now
            </div>
          </div>
          <button onClick={onChatClick} className="flex items-center space-x-3 text-[#888888] hover:text-[#e5e5e5] transition-colors w-full text-left">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <span className="font-mono text-xs lowercase">community chat</span>
          </button>
        </div>

        <div className="h-[1px] w-full bg-[#1a1a1a]"></div>

        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <div className="flex items-center border border-[#1a1a1a] rounded-full p-1 bg-[#0f0f0f]">
              <button 
                onClick={(e) => onThemeChange?.("system", e)}
                className={`p-1.5 transition-all duration-200 rounded-full cursor-pointer ${theme === "system" ? "text-[#e5e5e5] bg-[#1a1a1a] shadow-sm" : "text-[#555] hover:text-[#888]"}`}
                title="system theme"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </button>
              <button 
                onClick={(e) => onThemeChange?.("light", e)}
                className={`p-1.5 transition-all duration-200 rounded-full cursor-pointer ${theme === "light" ? "text-[#e5e5e5] bg-[#1a1a1a] shadow-sm" : "text-[#555] hover:text-[#888]"}`}
                title="light mode"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </button>
              <button 
                onClick={(e) => onThemeChange?.("dark", e)}
                className={`p-1.5 transition-all duration-200 rounded-full cursor-pointer ${theme === "dark" ? "text-[#e5e5e5] bg-[#1a1a1a] shadow-sm" : "text-[#555] hover:text-[#888]"}`}
                title="dark mode"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="font-sans text-[13px] leading-relaxed text-[#888888]">
              For work, collabs & everything else, reach me at
            </p>
            <a href="mailto:frandilbertperuso@gmail.com" className="flex items-center space-x-2 font-mono text-[13px] text-[#e5e5e5] hover:text-white transition-colors group">
              <svg className="w-4 h-4 text-[#888888] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="font-medium tracking-wide">frandilbertperuso@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
