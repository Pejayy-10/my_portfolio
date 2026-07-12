/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/hooks/useAdmin";
import { EditableText } from "@/components/EditableText";

// Custom Abstract SVG Logos for Placeholder Issuers
const LogoAlpha = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#333333" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="#888888"/>
  </svg>
);

const LogoBeta = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="4" stroke="#333333" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" fill="#888888"/>
  </svg>
);

const LogoGamma = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L21 9L12 15L3 9L12 3Z" stroke="#333333" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="12" cy="9" r="2" fill="#888888"/>
  </svg>
);

const LogoDelta = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 5v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V5l-8-3z" stroke="#333333" strokeWidth="2" fill="#121212"/>
    <path d="M12 6v10" stroke="#888888" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const LogoEpsilon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 8L3 12L7 16" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 8L21 12L17 16" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="10" y1="18" x2="14" y2="6" stroke="#888888" strokeWidth="2"/>
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

export default function CertificationsPage() {
  const { isAdmin } = useAdmin();
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Cert Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newIssuer, setNewIssuer] = useState("");
  const [newCategory, setNewCategory] = useState("AI");
  const [newUrl, setNewUrl] = useState("");

  const fetchCerts = async () => {
    try {
      const { data } = await supabase
        .from("portfolio_certifications")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) setCerts(data);
    } catch (err) {
      console.error("Failed to fetch certs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleUpdateField = async (id: string, field: string, value: string) => {
    const { error } = await supabase
      .from("portfolio_certifications")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      console.error("Failed to update certification field:", error);
    } else {
      setCerts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
      );
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    const { error } = await supabase
      .from("portfolio_certifications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete certification:", error);
    } else {
      setCerts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleAddCert = async () => {
    if (!newTitle.trim() || !newIssuer.trim()) return;

    const iconTypes = ["alpha", "beta", "gamma", "delta", "epsilon"];
    const randomIcon = iconTypes[Math.floor(Math.random() * iconTypes.length)];
    const rotations = [
      "-rotate-1 sm:-rotate-[1.5deg]",
      "rotate-1 sm:rotate-[1.2deg]",
      "-rotate-1 sm:-rotate-[0.8deg]",
      "rotate-2 sm:rotate-[1.8deg]",
      "-rotate-1 sm:-rotate-[1.2deg]"
    ];
    const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

    const { data, error } = await supabase
      .from("portfolio_certifications")
      .insert({
        title: newTitle,
        issuer: newIssuer,
        category: newCategory,
        verify_url: newUrl,
        icon_type: randomIcon,
        rotation: randomRotation
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add certification:", error);
    } else if (data) {
      setCerts((prev) => [...prev, data]);
      setShowAddModal(false);
      setNewTitle("");
      setNewIssuer("");
      setNewCategory("AI");
      setNewUrl("");
    }
  };

  const renderLogo = (type: string) => {
    switch (type) {
      case "beta":
        return <LogoBeta />;
      case "gamma":
        return <LogoGamma />;
      case "delta":
        return <LogoDelta />;
      case "epsilon":
        return <LogoEpsilon />;
      default:
        return <LogoAlpha />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-[#555] lowercase animate-pulse">
        retrieving credential registry...
      </div>
    );
  }

  // Group certifications by category client-side
  const categoriesMap = certs.reduce((acc: any, cert: any) => {
    const cat = cert.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(cert);
    return acc;
  }, {});

  const categories = Object.keys(categoriesMap);

  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-mono text-4xl text-[#e5e5e5] mb-6 lowercase tracking-tight">certifications</h1>
          <p className="font-sans text-[15px] leading-relaxed text-[#888888] max-w-2xl">
            Credentials across AI, cloud, engineering, and project management — each verifiable at its source.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0f0f0f] border border-[#1a1a1a] rounded px-3 py-1.5 font-mono text-xs text-[#e5e5e5] hover:border-[#333333] transition-colors cursor-pointer select-none"
          >
            [+ add certification]
          </button>
        )}
      </div>

      {/* Certification Sections */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {categories.map((catName) => (
          <motion.div 
            key={catName} 
            variants={sectionVariants}
            className="space-y-6"
          >
            {/* Category Name */}
            <h2 className="font-mono text-[11px] text-[#555] uppercase tracking-widest">
              {catName}
            </h2>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {categoriesMap[catName].map((cert: any) => (
                <div
                  key={cert.id}
                  className={`block relative bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-5 text-center flex flex-col justify-between h-[210px] shadow-lg hover:rotate-0 hover:scale-105 hover:z-30 hover:border-[#333] hover:bg-[#0c0c0c] transition-all duration-300 ease-out decoration-none group ${cert.rotation}`}
                >
                  {/* Issuer Logo */}
                  <div>
                    {renderLogo(cert.icon_type)}
                  </div>

                  {/* Title & Issuer Info */}
                  <div className="flex-1 flex flex-col justify-center my-2 select-none">
                    <h3 className="font-sans text-xs font-bold text-[#e5e5e5] leading-snug line-clamp-2">
                      <EditableText
                        text={cert.title}
                        isAdmin={isAdmin}
                        onSave={(val) => handleUpdateField(cert.id, "title", val)}
                      />
                    </h3>
                    <span className="font-mono text-[8px] text-[#555] uppercase tracking-wider mt-1 group-hover:text-[#888] transition-colors">
                      <EditableText
                        text={cert.issuer}
                        isAdmin={isAdmin}
                        onSave={(val) => handleUpdateField(cert.id, "issuer", val)}
                      />
                    </span>
                    {isAdmin && (
                      <span className="font-mono text-[7px] text-[#444] uppercase tracking-wider mt-1">
                        Category:{" "}
                        <EditableText
                          text={cert.category}
                          isAdmin={isAdmin}
                          onSave={(val) => handleUpdateField(cert.id, "category", val)}
                        />
                      </span>
                    )}
                  </div>

                  {/* Verify Link or Delete */}
                  <div className="flex flex-col gap-1 items-center mt-auto font-mono text-[9px]">
                    {isAdmin ? (
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="text-red-500/60 hover:text-red-500 transition-colors select-none cursor-pointer"
                      >
                        [delete]
                      </button>
                    ) : (
                      <a
                        href={cert.verify_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="uppercase tracking-widest text-[#555] group-hover:text-[#e5e5e5] transition-colors select-none"
                      >
                        ⟨ verify ⟩
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Certification Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 w-full max-w-md font-mono space-y-4 shadow-2xl">
            <div className="text-sm text-[#555] uppercase tracking-wider border-b border-[#1a1a1a] pb-2">add new certification</div>
            
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
              <label className="text-[10px] text-[#555] uppercase">issuer</label>
              <input
                type="text"
                required
                value={newIssuer}
                onChange={(e) => setNewIssuer(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">category (e.g. AI, Cloud, DevOps)</label>
              <input
                type="text"
                required
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">verification URL</label>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
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
                onClick={handleAddCert}
                className="px-3 py-1.5 bg-[#e5e5e5] text-black font-semibold rounded text-xs hover:bg-white transition-colors cursor-pointer"
              >
                Add Certification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
