"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "./CommandPalette";
import { motion, AnimatePresence } from "framer-motion";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Alt+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1a1a1a] z-40 flex items-center justify-between px-6">
        <span className="font-mono font-medium text-sm lowercase">Fran Peruso</span>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-[#888888] hover:text-[#e5e5e5] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* Mobile Sliding Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed inset-y-0 left-0 w-80 bg-[#0a0a0a] border-r border-[#1a1a1a] z-50 flex flex-col"
            >
              <div className="p-6 border-b border-[#1a1a1a] flex justify-end">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#888888] hover:text-[#e5e5e5] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar onSearchClick={() => setIsCommandPaletteOpen(true)} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-80 fixed inset-y-0 left-0 border-r border-[#1a1a1a] z-30">
        <Sidebar onSearchClick={() => setIsCommandPaletteOpen(true)} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-80 pt-16 md:pt-0">
        {children}
      </main>

      {/* Global Modals */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  );
};
