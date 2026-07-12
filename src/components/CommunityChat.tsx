"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

/* ─── UUID fallback for non-HTTPS contexts (e.g. phone on local IP) ─── */
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

interface Message {
  id: string;
  created_at: string;
  username: string;
  gender: string;
  location: string;
  content: string;
}

interface PlayerPresence {
  id: string;
  username: string;
  gender: string;
  location: string;
  x: number;
  y: number;
}

/* ─── Male pixel sprite (simple blocky character) ─── */
const MaleSprite = () => (
  <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
    {/* Head */}
    <rect x="5" y="1" width="6" height="5" rx="1" fill="#888" />
    {/* Body */}
    <rect x="5" y="6" width="6" height="5" fill="#666" />
    {/* Left arm */}
    <rect x="3" y="7" width="2" height="4" fill="#666" />
    {/* Right arm */}
    <rect x="11" y="7" width="2" height="4" fill="#666" />
    {/* Left leg */}
    <rect x="5" y="11" width="3" height="4" fill="#555" />
    {/* Right leg */}
    <rect x="8" y="11" width="3" height="4" fill="#555" />
  </svg>
);

/* ─── Female pixel sprite (with skirt detail) ─── */
const FemaleSprite = () => (
  <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
    {/* Head */}
    <rect x="5" y="1" width="6" height="5" rx="1" fill="#aaa" />
    {/* Hair accent */}
    <rect x="4" y="1" width="1" height="4" fill="#777" />
    <rect x="11" y="1" width="1" height="4" fill="#777" />
    {/* Body */}
    <rect x="5" y="6" width="6" height="3" fill="#8a6a8a" />
    {/* Skirt */}
    <rect x="4" y="9" width="8" height="3" fill="#7a5a7a" />
    {/* Left leg */}
    <rect x="5" y="12" width="2" height="3" fill="#666" />
    {/* Right leg */}
    <rect x="9" y="12" width="2" height="3" fill="#666" />
  </svg>
);

export const CommunityChat = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState<"join" | "chat">("join");

  // User Info
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [detectedLocation, setDetectedLocation] = useState("Unknown");
  const [locationLoading, setLocationLoading] = useState(true);

  // Chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Game state
  const [players, setPlayers] = useState<Record<string, PlayerPresence>>({});
  const [myPos, setMyPos] = useState({ x: 10, y: 10 });
  const myId = useRef(generateId()).current;
  const gameRoomRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const chatChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ─── Auto-detect location on mount ───
  useEffect(() => {
    if (!isOpen) return;
    setLocationLoading(true);
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.city && data.country_code) {
          setDetectedLocation(`${data.city}, ${data.country_code}`);
        } else if (data.country_name) {
          setDetectedLocation(data.country_name);
        }
      })
      .catch(() => setDetectedLocation("Unknown"))
      .finally(() => setLocationLoading(false));
  }, [isOpen]);

  // ─── Escape to close ───
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // ─── Handle Joining ───
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setStep("chat");
  };

  // ─── Setup Presence (Game) channel — separate from chat ───
  useEffect(() => {
    if (!isOpen || step !== "chat") return;

    const room = supabase.channel("community_game", {
      config: { presence: { key: myId } },
    });
    gameRoomRef.current = room;

    room
      .on("presence", { event: "sync" }, () => {
        const state = room.presenceState<PlayerPresence>();
        const activePlayers: Record<string, PlayerPresence> = {};
        for (const [key, presences] of Object.entries(state)) {
          if (presences.length > 0) {
            activePlayers[key] = presences[0];
          }
        }
        setPlayers(activePlayers);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await room.track({
            id: myId,
            username,
            gender,
            location: detectedLocation,
            x: 10,
            y: 10,
          });
        }
      });

    return () => {
      supabase.removeChannel(room);
      gameRoomRef.current = null;
    };
  }, [isOpen, step, myId, username, gender, detectedLocation]);

  // ─── Setup Chat channel (postgres_changes) — separate from game ───
  useEffect(() => {
    if (!isOpen || step !== "chat") return;

    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (data && !error) {
        setMessages(data.reverse());
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
      }
    };
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            // Deduplicate by ID (in case optimistic + realtime both fire)
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
      )
      .subscribe();
    chatChannelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      chatChannelRef.current = null;
    };
  }, [isOpen, step]);

  // ─── Broadcast position to Presence whenever myPos changes ───
  useEffect(() => {
    if (!isOpen || step !== "chat" || !gameRoomRef.current) return;
    gameRoomRef.current.track({
      id: myId,
      username,
      gender,
      location: detectedLocation,
      x: myPos.x,
      y: myPos.y,
    });
  }, [myPos, isOpen, step, myId, username, gender, detectedLocation]);

  // ─── Handle Movement (WASD / Arrows) ───
  useEffect(() => {
    if (!isOpen || step !== "chat") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't move if typing in chat input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();
      let dx = 0, dy = 0;

      if (key === "w" || key === "arrowup") dy = -1;
      else if (key === "s" || key === "arrowdown") dy = 1;
      else if (key === "a" || key === "arrowleft") dx = -1;
      else if (key === "d" || key === "arrowright") dx = 1;
      else return;

      e.preventDefault();

      setMyPos((prev) => {
        const newX = Math.max(0, Math.min(19, prev.x + dx));
        const newY = Math.max(0, Math.min(19, prev.y + dy));
        if (newX === prev.x && newY === prev.y) return prev;
        return { x: newX, y: newY };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, step]);

  // ─── Focus game canvas on mount ───
  useEffect(() => {
    if (step === "chat") {
      setTimeout(() => canvasRef.current?.focus(), 300);
    }
  }, [step]);

  // ─── Send Message ───
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const msg = inputMsg.trim();
    setInputMsg("");

    const { error } = await supabase.from("messages").insert({
      username,
      gender,
      location: detectedLocation,
      content: msg,
    });

    if (error) {
      console.error("Failed to send message:", error);
    }
  };

  // ─── Time formatting ───
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-xl">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-[#555] hover:text-white transition-colors p-2 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <AnimatePresence mode="wait">
        {step === "join" ? (
          <motion.form
            key="join"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleJoin}
            className="w-[calc(100%-32px)] max-w-md bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-6 md:p-8"
          >
            <h2 className="font-mono text-xl text-[#e5e5e5] mb-2 lowercase">join community</h2>
            <p className="font-sans text-[13px] text-[#555] mb-8">Enter a name and pick your avatar to join the lobby.</p>

            <div className="space-y-5">
              {/* Username */}
              <div>
                <label className="block font-mono text-[11px] text-[#555] lowercase mb-2">username</label>
                <input
                  autoFocus
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#141414] border border-[#1a1a1a] rounded-md px-4 py-2.5 font-sans text-sm text-[#e5e5e5] focus:outline-none focus:border-[#333] transition-colors"
                  placeholder="e.g. frandesal"
                />
              </div>

              {/* Auto-detected location */}
              <div>
                <label className="block font-mono text-[11px] text-[#555] lowercase mb-2">location</label>
                <div className="w-full bg-[#141414] border border-[#1a1a1a] rounded-md px-4 py-2.5 font-sans text-sm text-[#888] flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#555] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {locationLoading ? (
                    <span className="text-[#555] animate-pulse">detecting...</span>
                  ) : (
                    <span>{detectedLocation}</span>
                  )}
                </div>
                <p className="font-mono text-[9px] text-[#444] mt-1.5">auto-detected from your ip</p>
              </div>

              {/* Gender / Avatar */}
              <div>
                <label className="block font-mono text-[11px] text-[#555] lowercase mb-2">avatar</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`flex-1 py-4 rounded-md border text-sm font-sans flex flex-col items-center gap-3 transition-all ${gender === "male" ? "border-[#555] bg-[#1a1a1a] text-white" : "border-[#1a1a1a] bg-[#141414] text-[#888] hover:border-[#333]"}`}
                  >
                    <MaleSprite />
                    <span className="font-mono text-[11px] lowercase">male</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`flex-1 py-4 rounded-md border text-sm font-sans flex flex-col items-center gap-3 transition-all ${gender === "female" ? "border-[#555] bg-[#1a1a1a] text-white" : "border-[#1a1a1a] bg-[#141414] text-[#888] hover:border-[#333]"}`}
                  >
                    <FemaleSprite />
                    <span className="font-mono text-[11px] lowercase">female</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={locationLoading}
                className="w-full mt-4 bg-[#e5e5e5] text-[#0a0a0a] font-mono text-sm py-3 rounded-md hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                enter lobby ↵
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-7xl h-[90vh] md:h-[85vh] flex flex-col md:flex-row gap-8 p-4 md:p-6 overflow-y-auto md:overflow-visible"
          >
            {/* ─── Left: Chat Area ─── */}
            <div className="w-full md:w-1/3 flex flex-col min-w-0 md:min-w-[320px] h-[350px] md:h-auto shrink-0">
              <div className="font-mono text-[11px] text-[#555] lowercase mb-4 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {messages.length} messages
              </div>

              <div className="flex-1 overflow-y-auto space-y-5 pr-2 mb-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#1a1a1a transparent" }}>
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <p className="font-mono text-[11px] text-[#444] lowercase">no messages yet</p>
                    <p className="font-mono text-[10px] text-[#333] lowercase mt-1">be the first to say something!</p>
                  </div>
                )}
                {messages.map((m) => (
                  <div key={m.id} className="flex gap-3">
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.gender === "female" ? "bg-[#1a151a]" : "bg-[#151a1a]"}`}>
                      {m.gender === "female" ? <FemaleSprite /> : <MaleSprite />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-sans text-sm font-medium text-[#e5e5e5]">{m.username}</span>
                        <span className="font-mono text-[10px] text-[#555] lowercase">{m.location} · {timeAgo(m.created_at)}</span>
                      </div>
                      <div className="bg-[#141414] border border-[#1a1a1a] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-[#ccc] font-sans break-words inline-block max-w-full">
                        {m.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="mt-auto border-t border-[#1a1a1a] pt-4">
                <div className="font-mono text-[11px] text-[#555] lowercase mb-2">
                  chatting as <span className="text-[#e5e5e5] font-bold">{username}</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="say something_"
                    className="w-full bg-transparent border-b border-[#1a1a1a] py-3 pr-16 font-mono text-[13px] text-[#e5e5e5] focus:outline-none focus:border-[#555] transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[11px] text-[#555] hover:text-[#e5e5e5] lowercase transition-colors"
                  >
                    send ↵
                  </button>
                </div>
              </form>
            </div>

            {/* ─── Right: Multiplayer Canvas ─── */}
            <div className="w-full md:flex-1 flex flex-col items-stretch md:items-end h-[350px] md:h-auto shrink-0 md:shrink">
              <div className="font-mono text-[11px] text-[#555] lowercase mb-4 flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {Object.keys(players).length} online
                </span>
                <span>·</span>
                <span>wasd / arrows to move</span>
              </div>

              <div
                ref={canvasRef}
                tabIndex={0}
                className="w-full flex-1 bg-[#0c0c0c] border border-[#1a1a1a] rounded-xl relative overflow-hidden outline-none cursor-crosshair"
                style={{
                  backgroundImage: "linear-gradient(#141414 1px, transparent 1px), linear-gradient(90deg, #141414 1px, transparent 1px)",
                  backgroundSize: "5% 5%",
                }}
                onClick={() => canvasRef.current?.focus()}
              >
                {/* Render LOCAL player from myPos (instant feedback) */}
                <div
                  className="absolute flex flex-col items-center transition-all duration-100 ease-out"
                  style={{
                    left: `${myPos.x * 5}%`,
                    top: `${myPos.y * 5}%`,
                    width: "5%",
                    height: "5%",
                    zIndex: 10,
                  }}
                >
                  <div className="absolute -top-5 whitespace-nowrap font-mono text-[9px] px-1.5 py-0.5 rounded text-white bg-[#333]/90 font-bold">
                    {username}
                  </div>
                  <div className="w-full h-full flex items-center justify-center">
                    {gender === "female" ? <FemaleSprite /> : <MaleSprite />}
                  </div>
                </div>

                {/* Render REMOTE players from Presence */}
                {Object.entries(players)
                  .filter(([key]) => key !== myId)
                  .map(([key, p]) => (
                    <div
                      key={key}
                      className="absolute flex flex-col items-center transition-all duration-150 ease-out"
                      style={{
                        left: `${p.x * 5}%`,
                        top: `${p.y * 5}%`,
                        width: "5%",
                        height: "5%",
                        zIndex: 5,
                      }}
                    >
                      <div className="absolute -top-5 whitespace-nowrap font-mono text-[9px] px-1.5 py-0.5 rounded text-[#aaa] bg-[#0a0a0a]/80">
                        {p.username}
                      </div>
                      <div className="w-full h-full flex items-center justify-center">
                        {p.gender === "female" ? <FemaleSprite /> : <MaleSprite />}
                      </div>
                    </div>
                  ))}
              </div>

              {/* WASD visual hint */}
              <div className="flex gap-1 mt-4 opacity-40">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded border border-[#333] flex items-center justify-center font-mono text-[9px] text-[#666]">W</div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded border border-[#333] flex items-center justify-center font-mono text-[9px] text-[#666]">A</div>
                    <div className="w-6 h-6 rounded border border-[#333] flex items-center justify-center font-mono text-[9px] text-[#666]">S</div>
                    <div className="w-6 h-6 rounded border border-[#333] flex items-center justify-center font-mono text-[9px] text-[#666]">D</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
