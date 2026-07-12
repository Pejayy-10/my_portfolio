"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/hooks/useAdmin";

export const CommandPalette = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { logout } = useAdmin();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"search" | "login">("search");
  const [email, setEmail] = useState("frandilbertperuso@gmail.com");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Listen for Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (view === "login") {
          setView("search");
          setQuery("");
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, view]);

  // Reset states on open/close
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setView("search");
      setPassword("");
      setStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  // Command interception
  const handleInputChange = (val: string) => {
    setQuery(val);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cleaned = query.trim().toLowerCase();
      if (cleaned === "/sudo") {
        setView("login");
        setQuery("");
        e.preventDefault();
      } else if (cleaned === "/logout") {
        logout();
        setQuery("");
        onClose();
        e.preventDefault();
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("success");
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

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
              {view === "search" ? (
                <>
                  <div className="p-4 border-b border-[#1a1a1a] flex items-center space-x-3">
                    <span className="text-[#888888]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </span>
                    <input
                      type="text"
                      autoFocus
                      value={query}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={handleInputKeyDown}
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
                </>
              ) : (
                <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 font-mono">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3 mb-2">
                    <span className="text-xs text-[#555] uppercase tracking-wider">admin authentication</span>
                    <button 
                      type="button" 
                      onClick={() => setView("search")}
                      className="text-xs text-[#555] hover:text-[#888] cursor-pointer"
                    >
                      [back]
                    </button>
                  </div>

                  {status === "success" ? (
                    <div className="py-8 text-center text-sm text-green-500">
                      Authentication successful. Console loaded.
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] text-[#555] uppercase">email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-2 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#444]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-[#555] uppercase">password</label>
                        <input
                          type="password"
                          required
                          autoFocus
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-2 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#444]"
                        />
                      </div>

                      {status === "error" && (
                        <div className="text-xs text-[#ea4335] mt-1">
                          {errorMessage}
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setView("search")}
                          className="px-4 py-2 border border-[#222] rounded text-xs text-[#888] hover:text-[#e5e5e5] transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="px-4 py-2 bg-[#e5e5e5] text-black font-semibold rounded text-xs hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {status === "loading" ? "Verifying..." : "Login"}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
