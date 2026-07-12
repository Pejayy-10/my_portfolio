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
      staggerChildren: 0.1,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

export default function AffiliationsPage() {
  const { isAdmin } = useAdmin();
  const [affiliations, setAffiliations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Affiliation Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newInitials, setNewInitials] = useState("");
  const [newRole, setNewRole] = useState("MEMBER");
  const [newDesc, setNewDesc] = useState("");
  const [newLinkText, setNewLinkText] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newWatermark, setNewWatermark] = useState("");

  const fetchAffiliations = async () => {
    try {
      const { data } = await supabase
        .from("portfolio_affiliations")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) setAffiliations(data);
    } catch (err) {
      console.error("Failed to load affiliations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliations();
  }, []);

  const handleUpdateField = async (id: string, field: string, value: string) => {
    const { error } = await supabase
      .from("portfolio_affiliations")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      console.error("Failed to update affiliation field:", error);
    } else {
      setAffiliations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
      );
    }
  };

  const handleDeleteAffiliation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this affiliation?")) return;
    const { error } = await supabase
      .from("portfolio_affiliations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete affiliation:", error);
    } else {
      setAffiliations((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleAddAffiliation = async () => {
    if (!newName.trim() || !newInitials.trim()) return;

    const { data, error } = await supabase
      .from("portfolio_affiliations")
      .insert({
        name: newName,
        initials: newInitials.toUpperCase(),
        role: newRole,
        description: newDesc,
        link_text: newLinkText || "link ↗",
        link_url: newLinkUrl || "#",
        watermark: newWatermark.toUpperCase() || newInitials.toUpperCase()
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add affiliation:", error);
    } else if (data) {
      setAffiliations((prev) => [...prev, data]);
      setShowAddModal(false);
      setNewName("");
      setNewInitials("");
      setNewRole("MEMBER");
      setNewDesc("");
      setNewLinkText("");
      setNewLinkUrl("");
      setNewWatermark("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-[#555] lowercase animate-pulse">
        loading affiliations files...
      </div>
    );
  }

  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-mono text-4xl text-[#e5e5e5] mb-6 lowercase tracking-tight">affiliations</h1>
          <p className="font-sans text-[15px] leading-relaxed text-[#888888] max-w-2xl">
            Associations and communities we are part of — and the ones we help build.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0f0f0f] border border-[#1a1a1a] rounded px-3 py-1.5 font-mono text-xs text-[#e5e5e5] hover:border-[#333333] transition-colors cursor-pointer select-none"
          >
            [+ add affiliation]
          </button>
        )}
      </div>

      {/* Cards Stack */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {affiliations.map((aff) => (
          <motion.div
            key={aff.id}
            variants={cardVariants}
            className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden group hover:border-[#333333] hover:bg-[#0c0c0c] transition-all duration-300"
          >
            {/* Left Column: Logo Node */}
            <div className="w-14 h-14 rounded-2xl bg-[#0e0e10] border border-[#1c1c1e] flex items-center justify-center font-mono text-lg font-bold text-[#e5e5e5] group-hover:border-[#333] transition-colors select-none shrink-0">
              <EditableText
                text={aff.initials}
                isAdmin={isAdmin}
                onSave={(val) => handleUpdateField(aff.id, "initials", val)}
              />
            </div>

            {/* Right Column: Content */}
            <div className="flex-1 space-y-3 z-10">
              {/* Badge Row */}
              <div className="flex justify-between items-start">
                <div>
                  {isAdmin ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={aff.role}
                        onChange={(e) => handleUpdateField(aff.id, "role", e.target.value)}
                        className="bg-[#0c0c0e] border border-[#222] text-[#888] font-mono text-[8px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase"
                      >
                        <option value="MEMBER">MEMBER</option>
                        <option value="FOUNDER">FOUNDER</option>
                      </select>
                    </div>
                  ) : aff.role === "FOUNDER" ? (
                    <span className="inline-flex items-center gap-1 bg-[#e5e5e5] text-[#0a0a0a] font-mono text-[8px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase select-none">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/>
                      </svg>
                      FOUNDER
                    </span>
                  ) : (
                    <span className="inline-flex items-center border border-[#1c1c1e] text-[#888] font-mono text-[8px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase select-none">
                      MEMBER
                    </span>
                  )}
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteAffiliation(aff.id)}
                    className="font-mono text-xs text-red-500/60 hover:text-red-500 transition-colors select-none cursor-pointer"
                  >
                    [delete]
                  </button>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="font-sans text-md font-bold text-[#e5e5e5] group-hover:text-white transition-colors">
                  <EditableText
                    text={aff.name}
                    isAdmin={isAdmin}
                    onSave={(val) => handleUpdateField(aff.id, "name", val)}
                  />
                </h3>
                <div className="font-sans text-sm text-[#888888] leading-relaxed max-w-2xl">
                  <EditableText
                    text={aff.description}
                    isAdmin={isAdmin}
                    multiline
                    onSave={(val) => handleUpdateField(aff.id, "description", val)}
                  />
                </div>
              </div>

              {/* Link */}
              <div className="pt-1">
                {isAdmin ? (
                  <div className="space-y-1 border border-dashed border-[#222] p-2 rounded max-w-md">
                    <label className="text-[8px] text-[#555] block font-mono">LINK TEXT</label>
                    <EditableText
                      text={aff.link_text}
                      isAdmin={isAdmin}
                      onSave={(val) => handleUpdateField(aff.id, "link_text", val)}
                    />
                    <label className="text-[8px] text-[#555] block font-mono mt-1.5">LINK URL</label>
                    <EditableText
                      text={aff.link_url}
                      isAdmin={isAdmin}
                      onSave={(val) => handleUpdateField(aff.id, "link_url", val)}
                    />
                  </div>
                ) : (
                  <a
                    href={aff.link_url || "#"}
                    className="font-mono text-[11px] text-[#555] group-hover:text-[#e5e5e5] transition-colors decoration-none"
                  >
                    {aff.link_text}
                  </a>
                )}
              </div>
            </div>

            {/* Background Watermark */}
            <span className="absolute bottom-[-10px] right-4 font-mono text-[80px] md:text-[96px] font-bold text-white opacity-[0.015] group-hover:opacity-[0.025] transition-opacity select-none pointer-events-none select-none tracking-tighter z-0">
              {isAdmin ? (
                <span className="text-xs">
                  Watermark:{" "}
                  <EditableText
                    text={aff.watermark}
                    isAdmin={isAdmin}
                    onSave={(val) => handleUpdateField(aff.id, "watermark", val)}
                  />
                </span>
              ) : (
                aff.watermark
              )}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Affiliation Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 w-full max-w-md font-mono space-y-4 shadow-2xl">
            <div className="text-sm text-[#555] uppercase tracking-wider border-b border-[#1a1a1a] pb-2">add new affiliation</div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">initials (e.g. AA)</label>
              <input
                type="text"
                required
                value={newInitials}
                onChange={(e) => setNewInitials(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              >
                <option value="MEMBER">MEMBER</option>
                <option value="FOUNDER">FOUNDER</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444] min-h-[60px]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">link text (e.g. site.org ↗)</label>
              <input
                type="text"
                value={newLinkText}
                onChange={(e) => setNewLinkText(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">link URL</label>
              <input
                type="text"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">watermark label (e.g. ALPHA)</label>
              <input
                type="text"
                value={newWatermark}
                onChange={(e) => setNewWatermark(e.target.value)}
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
                onClick={handleAddAffiliation}
                className="px-3 py-1.5 bg-[#e5e5e5] text-black font-semibold rounded text-xs hover:bg-white transition-colors cursor-pointer"
              >
                Add Affiliation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
