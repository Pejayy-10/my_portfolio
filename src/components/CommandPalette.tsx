"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CommandPalette = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  // Listen for Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="p-4 border-b border-[#1a1a1a] flex items-center space-x-3">
                <span className="text-[#888888]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                <input
                  type="text"
                  autoFocus
                  placeholder="Ask anything engine..."
                  className="w-full bg-transparent text-[#e5e5e5] font-mono text-sm focus:outline-none placeholder:text-[#333333]"
                />
              </div>
              <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
                <div className="px-3 py-2 text-xs font-mono text-[#888888] lowercase">suggested</div>
                <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#141414] transition-colors flex items-center space-x-3 group">
                  <span className="text-[#333333] group-hover:text-[#e5e5e5] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </span>
                  <span className="font-mono text-sm text-[#e5e5e5] lowercase">explain offline-first architecture</span>
                </button>
                <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#141414] transition-colors flex items-center space-x-3 group">
                  <span className="text-[#333333] group-hover:text-[#e5e5e5] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </span>
                  <span className="font-mono text-sm text-[#e5e5e5] lowercase">view municipal waterworks case study</span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
