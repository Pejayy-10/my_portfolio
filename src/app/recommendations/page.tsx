/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/hooks/useAdmin";
import { EditableText } from "@/components/EditableText";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

export default function RecommendationsPage() {
  const { isAdmin } = useAdmin();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Recommendation Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newText, setNewText] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newInitials, setNewInitials] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newDate, setNewDate] = useState("");

  const fetchRecommendations = async () => {
    try {
      const { data } = await supabase
        .from("portfolio_recommendations")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) setRecommendations(data);
    } catch (err) {
      console.error("Failed to load recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleUpdateField = async (id: string, field: string, value: string) => {
    const { error } = await supabase
      .from("portfolio_recommendations")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      console.error("Failed to update recommendation field:", error);
    } else {
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
      );
    }
  };

  const handleDeleteRecommendation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recommendation?")) return;
    const { error } = await supabase
      .from("portfolio_recommendations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete recommendation:", error);
    } else {
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleAddRecommendation = async () => {
    if (!newText.trim() || !newAuthor.trim() || !newInitials.trim()) return;

    const { data, error } = await supabase
      .from("portfolio_recommendations")
      .insert({
        text: newText,
        author: newAuthor,
        initials: newInitials.toUpperCase(),
        role: newRole,
        date: newDate.toUpperCase()
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add recommendation:", error);
    } else if (data) {
      setRecommendations((prev) => [...prev, data]);
      setShowAddModal(false);
      setNewText("");
      setNewAuthor("");
      setNewInitials("");
      setNewRole("");
      setNewDate("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-[#555] lowercase animate-pulse">
        loading recommendation letters...
      </div>
    );
  }

  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-mono text-4xl text-[#e5e5e5] mb-6 lowercase tracking-tight">recommendations</h1>
          <p className="font-sans text-[15px] leading-relaxed text-[#888888] max-w-2xl">
            What leaders, teammates, and mentors say about working together — straight from project feedbacks and logs.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0f0f0f] border border-[#1a1a1a] rounded px-3 py-1.5 font-mono text-xs text-[#e5e5e5] hover:border-[#333333] transition-colors cursor-pointer select-none"
          >
            [+ add recommendation]
          </button>
        )}
      </div>

      {/* Masonry Columns Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full"
      >
        {recommendations.map((rec) => (
          <motion.div
            key={rec.id}
            variants={itemVariants}
            className="break-inside-avoid mb-6 bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-6 shadow-md hover:border-[#333333] hover:bg-[#0c0c0c] transition-all duration-300 group flex flex-col justify-between relative"
          >
            {/* Top quote marker */}
            <div className="text-3xl font-serif text-[#1c1c1e] select-none mb-1 leading-none flex justify-between items-start">
              <span>&ldquo;</span>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteRecommendation(rec.id)}
                  className="font-mono text-[10px] text-red-500/60 hover:text-red-500 transition-colors select-none cursor-pointer"
                >
                  [delete]
                </button>
              )}
            </div>

            {/* Testimonial body */}
            <div className="font-serif text-[#d4d4d8] leading-relaxed text-[14px] whitespace-pre-line flex-1">
              <EditableText
                text={rec.text}
                isAdmin={isAdmin}
                multiline
                onSave={(val) => handleUpdateField(rec.id, "text", val)}
              />
            </div>

            <div className="border-t border-[#141416] my-4 group-hover:border-[#1c1c1e] transition-colors" />

            {/* Author Footer */}
            <div className="flex items-center gap-3">
              {/* Initials Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#141416] border border-[#222] flex items-center justify-center font-mono text-[11px] text-[#888] group-hover:border-[#333] transition-colors select-none shrink-0">
                <EditableText
                  text={rec.initials}
                  isAdmin={isAdmin}
                  onSave={(val) => handleUpdateField(rec.id, "initials", val)}
                />
              </div>

              {/* Bio & Date */}
              <div className="flex-1 min-w-0 font-sans leading-tight">
                <div className="text-xs font-semibold text-[#e5e5e5]">
                  <EditableText
                    text={rec.author}
                    isAdmin={isAdmin}
                    onSave={(val) => handleUpdateField(rec.id, "author", val)}
                  />
                </div>
                <div className="text-[10px] text-[#555] line-clamp-1 mt-0.5">
                  <EditableText
                    text={rec.role}
                    isAdmin={isAdmin}
                    onSave={(val) => handleUpdateField(rec.id, "role", val)}
                  />
                </div>
                <div className="text-[9px] font-mono text-[#444] uppercase tracking-wider mt-1 block">
                  <EditableText
                    text={rec.date}
                    isAdmin={isAdmin}
                    onSave={(val) => handleUpdateField(rec.id, "date", val)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Recommendation Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 w-full max-w-md font-mono space-y-4 shadow-2xl">
            <div className="text-sm text-[#555] uppercase tracking-wider border-b border-[#1a1a1a] pb-2">add new recommendation</div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">testimonial text</label>
              <textarea
                required
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444] min-h-[100px]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">author name</label>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">initials (e.g. MA)</label>
              <input
                type="text"
                required
                maxLength={3}
                value={newInitials}
                onChange={(e) => setNewInitials(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">role / title (e.g. VP of Engineering)</label>
              <input
                type="text"
                required
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">date (e.g. AUG 2025)</label>
              <input
                type="text"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 border border-[#222] rounded text-xs text-[#888] hover:text-[#e5e5e5] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddRecommendation}
                className="px-3 py-1.5 bg-[#e5e5e5] text-black font-semibold rounded text-xs hover:bg-white transition-colors cursor-pointer"
              >
                Add Recommendation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
