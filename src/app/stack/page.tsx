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
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
} as const;

export default function StackPage() {
  const { isAdmin } = useAdmin();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Category Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItemsStr, setNewItemsStr] = useState("");

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from("portfolio_stack")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) setCategories(data);
    } catch (err) {
      console.error("Failed to load stack:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleUpdateItems = async (id: string, value: string) => {
    const list = value.split(",").map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase
      .from("portfolio_stack")
      .update({ items: list })
      .eq("id", id);

    if (error) {
      console.error("Failed to update stack category items:", error);
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, items: list } : c))
      );
    }
  };

  const handleUpdateCategoryName = async (id: string, value: string) => {
    const { error } = await supabase
      .from("portfolio_stack")
      .update({ category: value })
      .eq("id", id);

    if (error) {
      console.error("Failed to update stack category name:", error);
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, category: value } : c))
      );
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tech stack category?")) return;
    const { error } = await supabase
      .from("portfolio_stack")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete category:", error);
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    const itemList = newItemsStr.split(",").map((s) => s.trim()).filter(Boolean);

    const { data, error } = await supabase
      .from("portfolio_stack")
      .insert({
        category: newCategoryName,
        items: itemList
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add stack category:", error);
    } else if (data) {
      setCategories((prev) => [...prev, data]);
      setShowAddModal(false);
      setNewCategoryName("");
      setNewItemsStr("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-[#555] lowercase animate-pulse">
        loading tech stack directories...
      </div>
    );
  }

  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-mono text-4xl text-[#e5e5e5] mb-6 lowercase tracking-tight">stack</h1>
          <p className="font-sans text-[15px] leading-relaxed text-[#888888] max-w-2xl">
            The tools, frameworks, and platforms I reach for — across the front end, back end, infrastructure, and AI.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0f0f0f] border border-[#1a1a1a] rounded px-3 py-1.5 font-mono text-xs text-[#e5e5e5] hover:border-[#333333] transition-colors cursor-pointer select-none"
          >
            [+ add category]
          </button>
        )}
      </div>

      {/* Stack Categories Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {categories.map((category) => (
          <motion.div 
            key={category.id} 
            variants={itemVariants}
            className="space-y-4 relative group"
          >
            {/* Category Title */}
            <div className="flex justify-between items-center pr-12">
              <h2 className="font-mono text-[11px] text-[#555] uppercase tracking-widest">
                <EditableText
                  text={category.category}
                  isAdmin={isAdmin}
                  onSave={(val) => handleUpdateCategoryName(category.id, val)}
                />
              </h2>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="font-mono text-[10px] text-red-500/60 hover:text-red-500 transition-colors select-none cursor-pointer"
                >
                  [delete category]
                </button>
              )}
            </div>

            {/* Tech Badges Container */}
            <div className="flex flex-wrap gap-2.5 items-center">
              {isAdmin ? (
                <div className="border border-dashed border-[#222] rounded p-2.5 w-full max-w-lg">
                  <label className="text-[9px] text-[#555] font-mono block mb-1">
                    EDIT PILLS (COMMA SEPARATED)
                  </label>
                  <EditableText
                    text={category.items.join(", ")}
                    isAdmin={isAdmin}
                    onSave={(val) => handleUpdateItems(category.id, val)}
                  />
                </div>
              ) : (
                category.items.map((tech: string) => (
                  <span
                    key={tech}
                    className="font-mono text-xs text-[#888] bg-[#0c0c0c] border border-[#1a1a1a] rounded px-3 py-1.5 hover:text-[#e5e5e5] hover:border-[#333] hover:bg-[#0f0f0f] transition-all duration-200 cursor-default select-none"
                  >
                    {tech}
                  </span>
                ))
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Category Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 w-full max-w-md font-mono space-y-4 shadow-2xl">
            <div className="text-sm text-[#555] uppercase tracking-wider border-b border-[#1a1a1a] pb-2">add new tech stack category</div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">category name (e.g. cloud & infrastructure)</label>
              <input
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">items (comma-separated)</label>
              <input
                type="text"
                value={newItemsStr}
                onChange={(e) => setNewItemsStr(e.target.value)}
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
                onClick={handleAddCategory}
                className="px-3 py-1.5 bg-[#e5e5e5] text-black font-semibold rounded text-xs hover:bg-white transition-colors cursor-pointer"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
