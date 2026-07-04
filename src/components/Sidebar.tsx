"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getViews, incrementViews } from "@/actions/metrics";

export const LiveIndicator = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Initial fetch and increment
    const init = async () => {
      await incrementViews();
      const initialCount = await getViews();
      setCount(initialCount);
    };
    init();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "metrics", filter: "id=eq.1" },
        (payload) => {
          setCount(payload.new.views);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex items-center space-x-3 p-2 bg-[#141414] border border-[#1a1a1a] rounded-md">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </div>
      <span className="font-mono text-xs text-[#888888] lowercase">
        {count > 0 ? `${count} people viewing now` : "loading telemetry..."}
      </span>
    </div>
  );
};

export const Sidebar = ({ onSearchClick }: { onSearchClick?: () => void }) => {
  return (
    <div className="h-full flex flex-col p-8 bg-[#0a0a0a] overflow-y-auto">
      <div className="mb-12">
        <h1 className="font-mono font-medium text-lg lowercase">Fran Peruso</h1>
      </div>
      
      <nav className="flex flex-col space-y-8 flex-1">
        <div className="space-y-4">
          <a href="#" className="block font-mono text-sm text-[#888888] hover:text-[#e5e5e5] lowercase transition-colors">01 // shop</a>
          <a href="#" className="block font-mono text-sm text-[#888888] hover:text-[#e5e5e5] lowercase transition-colors">02 // blog</a>
          <a href="#" className="block font-mono text-sm text-[#888888] hover:text-[#e5e5e5] lowercase transition-colors">03 // gear</a>
          <a href="#" className="block font-mono text-sm text-[#888888] hover:text-[#e5e5e5] lowercase transition-colors">04 // resources</a>
        </div>
        
        <div className="space-y-4">
          <a href="#" className="block font-mono text-sm text-[#888888] hover:text-[#e5e5e5] lowercase transition-colors">05 // collabs</a>
          <a href="#" className="block font-mono text-sm text-[#888888] hover:text-[#e5e5e5] lowercase transition-colors">06 // consulting</a>
        </div>
      </nav>

      <div className="mt-8 space-y-6">
        {/* Ask Anything Engine block */}
        <button 
          onClick={onSearchClick}
          className="w-full p-3 border border-[#1a1a1a] rounded-md bg-[#0f0f0f] flex items-center justify-between text-[#888888] hover:bg-[#141414] transition-colors group cursor-text"
        >
          <span className="font-mono text-xs lowercase group-hover:text-[#e5e5e5] transition-colors">Search...</span>
          <span className="font-mono text-xs border border-[#1a1a1a] rounded px-1.5 py-0.5 group-hover:border-[#333333] transition-colors">Alt+K</span>
        </button>
        
        {/* Live Status Box */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[#888888]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="font-mono text-xs lowercase">Zamboanga Peninsula, PH</span>
          </div>
          <LiveIndicator />
        </div>

        <div className="pt-6 border-t border-[#1a1a1a]">
          <a href="mailto:frandilbertperuso@gmail.com" className="font-mono text-xs text-[#888888] hover:text-[#e5e5e5] lowercase transition-colors">
            frandilbertperuso@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};
