"use client";

import { useState, useEffect } from "react";
import { Sidebar, useLiveViewerCount } from "./Sidebar";
import { CommandPalette } from "./CommandPalette";
import { CommunityChat } from "./CommunityChat";
import { TypingTest } from "./TypingTest";
import { useAdmin } from "@/hooks/useAdmin";
import { motion, AnimatePresence } from "framer-motion";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTypingTestOpen, setIsTypingTestOpen] = useState(false);
  const viewerCount = useLiveViewerCount();
  const { isAdmin } = useAdmin();
  const [theme, setTheme] = useState<"system" | "light" | "dark">("dark");

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = (localStorage.getItem("theme") as "system" | "light" | "dark") || "dark";
      setTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeMode: "system" | "light" | "dark") => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    
    if (themeMode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(themeMode);
    }
  };

  // Watch theme change
  useEffect(() => {
    applyTheme(theme);
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // Theme change with View Transition API and circular reveal
  const handleThemeChange = (newTheme: "system" | "light" | "dark", e: React.MouseEvent<HTMLButtonElement>) => {
    const isSupported = typeof document !== 'undefined' && 'startViewTransition' in document;
    
    if (!isSupported) {
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      return;
    }
    
    const x = e.clientX;
    const y = e.clientY;
    
    document.documentElement.style.setProperty('--reveal-x', `${x}px`);
    document.documentElement.style.setProperty('--reveal-y', `${y}px`);
    
    document.documentElement.classList.add('theme-transitioning');
    const transition = (document as unknown as { startViewTransition: (cb: () => void) => { finished: Promise<void> } }).startViewTransition(() => {
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
    
    transition.finished.then(() => {
      document.documentElement.classList.remove('theme-transitioning');
    });
  };

  // Global Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.altKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsTypingTestOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen relative w-full max-w-full overflow-x-hidden">
      {/* Subtle top-right halftone pattern background */}
      <div 
        className="fixed top-0 right-0 w-[40vw] h-[40vh] pointer-events-none opacity-[0.03] dark:opacity-[0.07] z-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--foreground) 1px, transparent 1.5px)",
          backgroundSize: "16px 16px",
          maskImage: "radial-gradient(circle at top right, black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at top right, black, transparent 70%)",
        }}
      />
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
                <Sidebar 
                  onSearchClick={() => setIsCommandPaletteOpen(true)} 
                  onChatClick={() => {
                    setIsChatOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  onTypingTestClick={() => {
                    setIsTypingTestOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  viewerCount={viewerCount}
                  theme={theme}
                  onThemeChange={handleThemeChange}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-80 fixed inset-y-0 left-0 border-r border-[#1a1a1a] z-30">
        <Sidebar 
          onSearchClick={() => setIsCommandPaletteOpen(true)} 
          onChatClick={() => setIsChatOpen(true)}
          onTypingTestClick={() => setIsTypingTestOpen(true)}
          viewerCount={viewerCount}
          theme={theme}
          onThemeChange={handleThemeChange}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-80 pt-16 md:pt-0 min-w-0 max-w-full overflow-x-hidden">
        {children}
      </main>

      {/* Global Modals */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
      <CommunityChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        isAdmin={isAdmin}
      />
      <TypingTest 
        isOpen={isTypingTestOpen} 
        onClose={() => setIsTypingTestOpen(false)} 
      />
    </div>
  );
};
