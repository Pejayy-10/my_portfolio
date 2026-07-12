/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/hooks/useAdmin";
import { EditableText } from "@/components/EditableText";

// Custom Abstract Geometric Icons for Template/Placeholder Projects
const IconAlpha = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 rounded-2xl">
    <rect width="64" height="64" rx="16" fill="#1f1f1f"/>
    <rect x="1" y="1" width="62" height="62" rx="15" stroke="#2c2c2c" strokeWidth="2"/>
    <circle cx="20" cy="20" r="4" fill="#555555" />
    <circle cx="44" cy="20" r="4" fill="#555555" />
    <circle cx="20" cy="44" r="4" fill="#555555" />
    <circle cx="44" cy="44" r="4" fill="#555555" />
    <line x1="20" y1="20" x2="44" y2="20" stroke="#333333" strokeWidth="2"/>
    <line x1="20" y1="20" x2="20" y2="44" stroke="#333333" strokeWidth="2"/>
    <line x1="44" y1="20" x2="44" y2="44" stroke="#333333" strokeWidth="2"/>
    <line x1="20" y1="44" x2="44" y2="44" stroke="#333333" strokeWidth="2"/>
    <line x1="20" y1="20" x2="44" y2="44" stroke="#888888" strokeWidth="2" strokeDasharray="4 4"/>
  </svg>
);

const IconBeta = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 rounded-2xl">
    <rect width="64" height="64" rx="16" fill="#1f1f1f"/>
    <rect x="1" y="1" width="62" height="62" rx="15" stroke="#2c2c2c" strokeWidth="2"/>
    <circle cx="32" cy="32" r="18" stroke="#333333" strokeWidth="2" />
    <circle cx="32" cy="32" r="10" stroke="#555555" strokeWidth="2" />
    <circle cx="32" cy="32" r="4" fill="#888888" />
  </svg>
);

const IconGamma = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 rounded-2xl">
    <rect width="64" height="64" rx="16" fill="#1f1f1f"/>
    <rect x="1" y="1" width="62" height="62" rx="15" stroke="#2c2c2c" strokeWidth="2"/>
    <path d="M18 20L30 32L18 44" stroke="#555555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="34" y1="44" x2="48" y2="44" stroke="#888888" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const AppStoreBadge = ({ url }: { url?: string }) => {
  const isPending = !url || url.trim() === "" || url.trim() === "#";
  const href = isPending ? "/projects/coming-soon" : url;
  const targetProps = isPending ? {} : { target: "_blank", rel: "noopener noreferrer" };

  return (
    <a href={href} {...targetProps} className="inline-flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#141414] border border-[#1a1a1a] rounded-lg px-3 py-1.5 transition-all text-[#e5e5e5] decoration-none">
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.16.67-2.88 1.48-.62.72-1.15 1.86-1 2.97 1.08.08 2.21-.57 2.89-1.39z"/>
      </svg>
      <div className="text-left font-sans leading-none">
        <div className="text-[7px] uppercase tracking-wider text-[#888888] font-bold mb-0.5">Download on the</div>
        <div className="text-[10px] font-semibold">App Store</div>
      </div>
    </a>
  );
};

const GooglePlayBadge = ({ url }: { url?: string }) => {
  const isPending = !url || url.trim() === "" || url.trim() === "#";
  const href = isPending ? "/projects/coming-soon" : url;
  const targetProps = isPending ? {} : { target: "_blank", rel: "noopener noreferrer" };

  return (
    <a href={href} {...targetProps} className="inline-flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#141414] border border-[#1a1a1a] rounded-lg px-3 py-1.5 transition-all text-[#e5e5e5] decoration-none">
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 5.27v13.46c0 .88.75 1.54 1.63 1.34l12.2-6.52c.6-.32.6-.96 0-1.28L4.63 3.93C3.75 3.73 3 4.39 3 5.27zm14.16 6.05L4.85 4.67l11.45 6.13c.42.22.42.66 0 .88l-11.45 6.13 12.31-6.59c.45-.24.45-.72 0-.96z"/>
      </svg>
      <div className="text-left font-sans leading-none">
        <div className="text-[7px] uppercase tracking-wider text-[#888888] font-bold mb-0.5">GET IT ON</div>
        <div className="text-[10px] font-semibold">Google Play</div>
      </div>
    </a>
  );
};

export default function ProjectsPage() {
  const { isAdmin } = useAdmin();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Project Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBadge, setNewBadge] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFeatured, setNewFeatured] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleUpdateField = async (id: string, field: string, value: any) => {
    const { error } = await supabase
      .from("portfolio_projects")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      console.error(`Failed to update project field: ${field}`, error);
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      );
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase
      .from("portfolio_projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete project:", error);
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAddProject = async () => {
    if (!newTitle.trim() || !newBadge.trim()) return;

    const iconTypes = ["alpha", "beta", "gamma"];
    const randomIcon = iconTypes[Math.floor(Math.random() * iconTypes.length)];

    const { data, error } = await supabase
      .from("portfolio_projects")
      .insert({
        title: newTitle,
        badge: newBadge,
        description: newDesc,
        featured: newFeatured,
        icon_type: randomIcon,
        extra_badges: newFeatured ? ["NEW RELEASE"] : [],
        featured_in: newFeatured ? ["Resources ↗"] : []
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add project:", error);
    } else if (data) {
      setProjects((prev) => [...prev, data]);
      setShowAddModal(false);
      setNewTitle("");
      setNewBadge("");
      setNewDesc("");
      setNewFeatured(false);
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "beta":
        return <IconBeta />;
      case "gamma":
        return <IconGamma />;
      default:
        return <IconAlpha />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-[#555] lowercase animate-pulse">
        fetching project directory...
      </div>
    );
  }

  const featuredList = projects.filter((p) => p.featured);
  const standardList = projects.filter((p) => !p.featured);

  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-mono text-4xl text-[#e5e5e5] mb-6 lowercase tracking-tight">projects</h1>
          <p className="font-sans text-[15px] leading-relaxed text-[#888888] max-w-2xl">
            Products and platforms I&apos;ve designed and shipped — spanning developer education, generative AI, and consumer apps.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0f0f0f] border border-[#1a1a1a] rounded px-3 py-1.5 font-mono text-xs text-[#e5e5e5] hover:border-[#333333] transition-colors cursor-pointer select-none"
          >
            [+ add project]
          </button>
        )}
      </div>

      {/* Section 01: Featured Projects */}
      <div className="space-y-8">
        {featuredList.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start shadow-xl hover:border-[#222222] transition-colors relative group"
          >
            {renderIcon(p.icon_type)}
            
            <div className="flex-1 space-y-6">
              {/* Badges row */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="font-mono text-[9px] text-[#e5e5e5] bg-[#1a1a1a] px-2.5 py-1 rounded-full border border-[#2a2a2a] tracking-wider">
                  ⟨{" "}
                  <EditableText
                    text={p.badge}
                    isAdmin={isAdmin}
                    onSave={(val) => handleUpdateField(p.id, "badge", val)}
                  />{" "}
                  ⟩
                </span>
                {p.extra_badges?.map((badge: string, idx: number) => (
                  <span key={idx} className="font-mono text-[8px] text-[#888888] border border-[#1a1a1a] px-2 py-0.5 rounded-full tracking-wider uppercase">
                    {badge}
                  </span>
                ))}
              </div>

              {/* Title and description */}
              <div className="space-y-2">
                <h3 className="font-sans text-xl font-medium text-[#e5e5e5]">
                  <EditableText
                    text={p.title}
                    isAdmin={isAdmin}
                    onSave={(val) => handleUpdateField(p.id, "title", val)}
                  />
                </h3>
                <div className="font-sans text-sm text-[#888888] leading-relaxed max-w-2xl">
                  <EditableText
                    text={p.description}
                    isAdmin={isAdmin}
                    multiline
                    onSave={(val) => handleUpdateField(p.id, "description", val)}
                  />
                </div>
              </div>

              {/* Download links */}
              <div className="flex flex-wrap gap-3 pt-2">
                <AppStoreBadge url={p.app_store_url} />
                <GooglePlayBadge url={p.play_store_url} />
              </div>

              {/* Admin Metadata Editor */}
              {isAdmin && (
                <div className="text-[11px] font-mono text-[#555] space-y-1.5 border border-dashed border-[#222] p-3 rounded-lg max-w-2xl">
                  <div className="text-[9px] uppercase tracking-wider text-[#888] mb-1 font-bold">Admin Metadata Editor</div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="shrink-0 w-36">Icon Type (alpha/beta/gamma):</span>
                    <EditableText
                      text={p.icon_type || "alpha"}
                      isAdmin={isAdmin}
                      onSave={(val) => handleUpdateField(p.id, "icon_type", val)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="shrink-0 w-36">App Store Link:</span>
                    <EditableText
                      text={p.app_store_url || ""}
                      isAdmin={isAdmin}
                      onSave={(val) => handleUpdateField(p.id, "app_store_url", val)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="shrink-0 w-36">Play Store Link:</span>
                    <EditableText
                      text={p.play_store_url || ""}
                      isAdmin={isAdmin}
                      onSave={(val) => handleUpdateField(p.id, "play_store_url", val)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="shrink-0 w-36">Extra Badges (comma sep):</span>
                    <EditableText
                      text={p.extra_badges?.join(", ") || ""}
                      isAdmin={isAdmin}
                      onSave={(val) =>
                        handleUpdateField(
                          p.id,
                          "extra_badges",
                          val.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="shrink-0 w-36">Resources (comma sep):</span>
                    <EditableText
                      text={p.featured_in?.join(", ") || ""}
                      isAdmin={isAdmin}
                      onSave={(val) =>
                        handleUpdateField(
                          p.id,
                          "featured_in",
                          val.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                  </div>
                </div>
              )}

              {/* Featured In Footer */}
              <div className="border-t border-[#1a1a1a] pt-4 mt-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="font-mono text-[9px] text-[#555] uppercase tracking-wider">Resources</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {p.featured_in?.map((feat: string, idx: number) => (
                    <span key={idx} className="font-mono text-[11px] text-[#888888]">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => handleDeleteProject(p.id)}
                className="absolute top-4 right-4 text-xs font-mono text-red-500/60 hover:text-red-500 transition-colors select-none cursor-pointer"
              >
                [delete]
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Section 02: Other Projects List */}
      {standardList.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-mono text-[11px] text-[#555] uppercase tracking-widest">Other Projects</h2>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl divide-y divide-[#1a1a1a] overflow-hidden shadow-xl">
            {standardList.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-6 hover:bg-[#0f0f0f]/50 transition-all duration-200 relative group"
              >
                {/* Left Column: Project Name */}
                <div className="font-mono text-lg text-[#e5e5e5] select-none shrink-0 w-1/4">
                  <EditableText
                    text={p.title}
                    isAdmin={isAdmin}
                    onSave={(val) => handleUpdateField(p.id, "title", val)}
                  />
                </div>

                {/* Middle Column: Category and description */}
                <div className="flex-1 min-w-0 pr-12">
                  <div className="font-mono text-[9px] text-[#555] uppercase tracking-widest mb-1 select-none">
                    <EditableText
                      text={p.badge}
                      isAdmin={isAdmin}
                      onSave={(val) => handleUpdateField(p.id, "badge", val)}
                    />
                  </div>
                  <div className="font-sans text-sm text-[#888888] leading-relaxed">
                    <EditableText
                      text={p.description}
                      isAdmin={isAdmin}
                      multiline
                      onSave={(val) => handleUpdateField(p.id, "description", val)}
                    />
                  </div>
                </div>

                {/* Right Column: Delete or arrow */}
                <div className="shrink-0 select-none ml-2 flex items-center gap-4">
                  {isAdmin ? (
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="text-xs font-mono text-red-500/60 hover:text-red-500 transition-colors select-none cursor-pointer"
                    >
                      [delete]
                    </button>
                  ) : (
                    <div className="text-[#555] group-hover:text-[#e5e5e5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Project Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 w-full max-w-md font-mono space-y-4 shadow-2xl">
            <div className="text-sm text-[#555] uppercase tracking-wider border-b border-[#1a1a1a] pb-2">add new project</div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">category / badge</label>
              <input
                type="text"
                required
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444] min-h-[60px]"
              />
            </div>

            <div className="flex gap-4 items-center pt-2">
              <label className="flex items-center gap-2 text-xs text-[#888] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newFeatured}
                  onChange={(e) => setNewFeatured(e.target.checked)}
                  className="rounded border-[#222] bg-[#0c0c0e]"
                />
                Featured Card Layout
              </label>
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
                onClick={handleAddProject}
                className="px-3 py-1.5 bg-[#e5e5e5] text-black font-semibold rounded text-xs hover:bg-white transition-colors cursor-pointer"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
