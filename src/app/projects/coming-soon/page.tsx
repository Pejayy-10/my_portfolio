"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ProjectComingSoon() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center select-none font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-8 space-y-8 relative overflow-hidden shadow-2xl"
      >
        {/* Decorative Grid Scanning Background */}
        <div className="absolute inset-0 coming-soon-grid bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 z-0 pointer-events-none" />

        {/* Pulse radar animation */}
        <div className="relative z-10 flex justify-center">
          <div className="relative w-16 h-16 rounded-full border border-dashed border-[#333333] flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-dashed border-[#333333] animate-ping opacity-15" />
            <svg className="w-6 h-6 text-[#888888] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <span className="text-[10px] text-[#888888] uppercase tracking-widest bg-[#141414] border border-[#1a1a1a] px-3 py-1 rounded-full">
            build status: pending
          </span>
          <h2 className="text-xl font-bold text-[#e5e5e5] lowercase tracking-tight pt-2">
            awaiting deployment
          </h2>
          <p className="font-sans text-sm text-[#888888] leading-relaxed max-w-sm mx-auto">
            this application is currently undergoing platform review, awaiting store publication approval, or in private beta testing.
          </p>
        </div>

        <div className="pt-2 relative z-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border border-[#1a1a1a] hover:border-[#333333] rounded-lg px-4 py-2 text-xs text-[#888888] hover:text-[#e5e5e5] transition-all bg-transparent"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            back to directory
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
