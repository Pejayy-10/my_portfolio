"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypingTestProps {
  isOpen: boolean;
  onClose: () => void;
}

const WORDS = [
  "at", "many", "than", "through", "little", "give", "head", "small", "stand", "call", "part", "get", "place",
  "lead", "state", "come", "plan", "number", "all", "people", "like", "but", "few", "make", "or", "program",
  "system", "code", "run", "dev", "tech", "compile", "build", "data", "stack", "cloud", "model", "logic",
  "architecture", "server", "client", "database", "query", "node", "process", "deploy", "script", "test"
];

const generateWordsText = () => {
  const list = [];
  for (let i = 0; i < 45; i++) {
    const idx = Math.floor(Math.random() * WORDS.length);
    list.push(WORDS[idx]);
  }
  return list.join(" ");
};

const KEYBOARD_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
];

export const TypingTest = ({ isOpen, onClose }: TypingTestProps) => {
  const [wordsText, setWordsText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "finished" | "confirm-restart">("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Initialize words
  useEffect(() => {
    if (isOpen) {
      setWordsText(generateWordsText());
      setTypedText("");
      setStatus("idle");
      setElapsedSeconds(0);
      setTotalKeystrokes(0);
      setActiveKeys(new Set());
    }
  }, [isOpen]);

  // Restart function
  const restartTest = useCallback(() => {
    setWordsText(generateWordsText());
    setTypedText("");
    setStatus("idle");
    setElapsedSeconds(0);
    setTotalKeystrokes(0);
    setActiveKeys(new Set());
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Timer effect
  useEffect(() => {
    if (status === "running") {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= 29) {
            setStatus("finished");
            if (timerRef.current) clearInterval(timerRef.current);
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Calculate metrics
  let correctCount = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === wordsText[i]) {
      correctCount++;
    }
  }

  const accuracy = totalKeystrokes > 0 ? Math.round((correctCount / totalKeystrokes) * 100) : 100;
  const wpm = elapsedSeconds > 0 ? Math.round((correctCount / 5) / (elapsedSeconds / 60)) : 0;

  // Keyboard Event Handlers
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Manage active keys set for highlighting virtual keyboard
      const key = e.key.toLowerCase();
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.add(key === " " ? "space" : key);
        return next;
      });

      // Handle modals and controls
      if (status === "confirm-restart") {
        if (e.key === "Enter") {
          e.preventDefault();
          restartTest();
        } else if (e.key === "Escape") {
          e.preventDefault();
          setStatus("running");
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        setStatus("confirm-restart");
        return;
      }

      if (status === "finished") return;

      // Handle normal typing input
      if (e.key === "Backspace") {
        e.preventDefault();
        setTypedText((prev) => prev.slice(0, -1));
      } else if (e.key === " " || e.key.length === 1) {
        e.preventDefault();
        
        // Start game on first keystroke
        if (status === "idle") {
          setStatus("running");
        }

        setTypedText((prev) => {
          const next = prev + e.key;
          if (next.length >= wordsText.length) {
            setStatus("finished");
          }
          return next;
        });
        setTotalKeystrokes((prev) => prev + 1);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(key === " " ? "space" : key);
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isOpen, status, wordsText, restartTest, onClose]);

  // Adjust scroll as user types to keep active text centered
  useEffect(() => {
    if (textContainerRef.current) {
      const activeChar = textContainerRef.current.querySelector(".active-char");
      if (activeChar) {
        activeChar.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [typedText]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-md z-[100] flex flex-col items-center justify-between py-16 px-6 font-mono"
      >
        {/* Top Header Metrics */}
        <div className="flex items-center gap-16 select-none mt-4">
          <div className="text-center">
            <div className="text-4xl font-mono text-[#e5e5e5] font-semibold">{wpm}</div>
            <div className="text-[10px] text-[#555] tracking-wider uppercase mt-1">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-mono text-[#e5e5e5] font-semibold">{accuracy}%</div>
            <div className="text-[10px] text-[#555] tracking-wider uppercase mt-1">ACC</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-mono text-[#e5e5e5] font-semibold">{elapsedSeconds}s</div>
            <div className="text-[10px] text-[#555] tracking-wider uppercase mt-1">TIME</div>
          </div>
        </div>

        {/* Typing Text Display */}
        <div 
          ref={textContainerRef}
          className="w-full max-w-3xl overflow-y-auto max-h-[140px] select-none text-center px-4 leading-relaxed text-lg my-8 transition-all duration-300"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="inline-block text-left whitespace-pre-wrap max-w-full">
            {wordsText.split("").map((char, idx) => {
              let charClass = "text-[#333333]"; // Untyped/Default
              const isTyped = idx < typedText.length;
              const isActive = idx === typedText.length;

              if (isTyped) {
                charClass = typedText[idx] === char ? "text-[#e5e5e5]" : "text-[#ea4335] bg-[#ea4335]/10 rounded-sm";
              }

              return (
                <span 
                  key={idx} 
                  className={`relative font-mono text-base ${charClass} ${isActive ? "active-char border-l border-white animate-pulse" : ""}`}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Keyboard Layout UI */}
        <div className="flex flex-col gap-2 items-center select-none w-full max-w-xl">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5 justify-center w-full">
              {row.map((key) => {
                const isActive = activeKeys.has(key);
                return (
                  <div
                    key={key}
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono text-sm uppercase transition-all duration-75 ${
                      isActive 
                        ? "border-[#e5e5e5] text-white bg-[#1a1a1a] shadow-[0_0_8px_rgba(255,255,255,0.1)] scale-95" 
                        : "border-[#1c1c1e] text-[#555] bg-[#0c0c0e]/30"
                    }`}
                  >
                    {key}
                  </div>
                );
              })}
            </div>
          ))}
          {/* Spacebar */}
          <div className="w-full flex justify-center mt-0.5">
            <div
              className={`w-52 h-9 rounded-lg border flex items-center justify-center font-mono text-[10px] tracking-widest uppercase transition-all duration-75 ${
                activeKeys.has("space") 
                  ? "border-[#e5e5e5] text-white bg-[#1a1a1a] shadow-[0_0_8px_rgba(255,255,255,0.1)] scale-95" 
                  : "border-[#1c1c1e] text-[#555] bg-[#0c0c0e]/30"
              }`}
            >
              SPACE
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="h-10 flex items-center justify-center w-full select-none mb-4">
          <AnimatePresence mode="wait">
            {status === "confirm-restart" ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 bg-[#121214] border border-[#222] rounded-full px-4 py-1.5 text-xs text-[#888]"
              >
                <span>restart test?</span>
                <span className="bg-[#1c1c1e] border border-[#333] rounded px-1.5 py-0.5 text-[9px] text-[#e5e5e5] flex items-center gap-0.5">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                  </svg>
                  enter
                </span>
                <span>to confirm</span>
                <span className="text-[#333] font-bold">·</span>
                <span className="bg-[#1c1c1e] border border-[#333] rounded px-1.5 py-0.5 text-[9px] text-[#e5e5e5]">esc</span>
                <span>cancel</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex gap-6 items-center text-[10px] text-[#555] font-mono"
              >
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#0c0c0e]/35 border border-[#1a1a1c] rounded px-1.5 py-0.5 text-[9px] text-[#888] shadow-sm">tab</span>
                  <span>restart</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#0c0c0e]/35 border border-[#1a1a1c] rounded px-1.5 py-0.5 text-[9px] text-[#888] shadow-sm">esc</span>
                  <span>close</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
