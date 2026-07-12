/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/hooks/useAdmin";
import { EditableText } from "@/components/EditableText";

export default function ExperiencePage() {
  const { isAdmin } = useAdmin();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Experience Modal States
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [cName, setCName] = useState("");
  const [cInitials, setCInitials] = useState("");
  const [cType, setCType] = useState("Full-time");
  const [cDuration, setCDuration] = useState("");
  const [cLocation, setCLocation] = useState("");

  // Add Role Modal States
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [targetCompanyId, setTargetCompanyId] = useState("");
  const [rTitle, setRTitle] = useState("");
  const [rPeriod, setRPeriod] = useState("");
  const [rDuration, setRDuration] = useState("");
  const [rDesc, setRDesc] = useState("");
  const [rSkills, setRSkills] = useState("");

  const fetchExperiences = async () => {
    try {
      const { data } = await supabase
        .from("portfolio_experience")
        .select(`
          *,
          portfolio_experience_roles (*)
        `)
        .order("created_at", { ascending: false });

      if (data) {
        // Sort roles within each experience
        const sorted = data.map((exp: any) => ({
          ...exp,
          portfolio_experience_roles: exp.portfolio_experience_roles?.sort(
            (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          ) || []
        }));
        setExperiences(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleUpdateCompany = async (id: string, field: string, value: string) => {
    const { error } = await supabase
      .from("portfolio_experience")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      console.error("Failed to update company:", error);
    } else {
      setExperiences((prev) =>
        prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
      );
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company experience?")) return;
    const { error } = await supabase
      .from("portfolio_experience")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete company:", error);
    } else {
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    }
  };

  const handleAddCompany = async () => {
    if (!cName.trim() || !cInitials.trim()) return;

    const { data, error } = await supabase
      .from("portfolio_experience")
      .insert({
        name: cName,
        initials: cInitials,
        type: cType,
        duration_total: cDuration,
        location: cLocation
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add company:", error);
    } else if (data) {
      setExperiences((prev) => [{ ...data, portfolio_experience_roles: [] }, ...prev]);
      setShowAddCompanyModal(false);
      setCName("");
      setCInitials("");
      setCDuration("");
      setCLocation("");
    }
  };

  const handleUpdateRole = async (roleId: string, companyId: string, field: string, value: any) => {
    const { error } = await supabase
      .from("portfolio_experience_roles")
      .update({ [field]: value })
      .eq("id", roleId);

    if (error) {
      console.error("Failed to update role field:", error);
    } else {
      setExperiences((prev) =>
        prev.map((exp) => {
          if (exp.id !== companyId) return exp;
          return {
            ...exp,
            portfolio_experience_roles: exp.portfolio_experience_roles.map((r: any) =>
              r.id === roleId ? { ...r, [field]: value } : r
            )
          };
        })
      );
    }
  };

  const handleDeleteRole = async (roleId: string, companyId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    const { error } = await supabase
      .from("portfolio_experience_roles")
      .delete()
      .eq("id", roleId);

    if (error) {
      console.error("Failed to delete role:", error);
    } else {
      setExperiences((prev) =>
        prev.map((exp) => {
          if (exp.id !== companyId) return exp;
          return {
            ...exp,
            portfolio_experience_roles: exp.portfolio_experience_roles.filter((r: any) => r.id !== roleId)
          };
        })
      );
    }
  };

  const handleAddRole = async () => {
    if (!rTitle.trim()) return;

    const descArray = rDesc.split("\n").map((d) => d.trim()).filter(Boolean);
    const skillsArray = rSkills.split(",").map((s) => s.trim()).filter(Boolean);

    const { data, error } = await supabase
      .from("portfolio_experience_roles")
      .insert({
        experience_id: targetCompanyId,
        title: rTitle,
        period: rPeriod,
        duration: rDuration,
        description: descArray,
        skills: skillsArray
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add role:", error);
    } else if (data) {
      setExperiences((prev) =>
        prev.map((exp) => {
          if (exp.id !== targetCompanyId) return exp;
          return {
            ...exp,
            portfolio_experience_roles: [...exp.portfolio_experience_roles, data]
          };
        })
      );
      setShowAddRoleModal(false);
      setRTitle("");
      setRPeriod("");
      setRDuration("");
      setRDesc("");
      setRSkills("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-[#555] lowercase animate-pulse">
        retrieving timeline nodes...
      </div>
    );
  }

  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-mono text-4xl text-[#e5e5e5] mb-6 lowercase tracking-tight">experience</h1>
          <p className="font-sans text-[15px] leading-relaxed text-[#888888] max-w-2xl">
            Several years designing and building systems across AI engineering, platform infrastructure, and full-stack development.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddCompanyModal(true)}
            className="bg-[#0f0f0f] border border-[#1a1a1a] rounded px-3 py-1.5 font-mono text-xs text-[#e5e5e5] hover:border-[#333333] transition-colors cursor-pointer select-none"
          >
            [+ add company]
          </button>
        )}
      </div>

      {/* Timeline Section */}
      <div className="relative pl-0 md:pl-4">
        {/* Continuous Timeline Line */}
        <div className="absolute left-[19px] top-5 bottom-5 w-[1px] bg-[#1a1a1a] z-0" />

        {/* Experience Blocks */}
        <div className="space-y-16">
          {experiences.map((company) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative pl-16 z-10"
            >
              {/* Company Logo Node */}
              <div className="absolute left-0 top-0 w-10 h-10 rounded-xl bg-[#0c0c0c] border border-[#1a1a1a] flex items-center justify-center font-mono text-xs text-[#888] select-none z-20">
                {company.initials}
              </div>

              {/* Company Meta Info */}
              <div className="space-y-1 relative group">
                <h3 className="font-sans text-lg font-bold text-[#e5e5e5]">
                  <EditableText
                    text={company.name}
                    isAdmin={isAdmin}
                    onSave={(val) => handleUpdateCompany(company.id, "name", val)}
                  />
                </h3>
                <p className="font-mono text-[11px] text-[#555] lowercase">
                  <EditableText
                    text={company.type}
                    isAdmin={isAdmin}
                    onSave={(val) => handleUpdateCompany(company.id, "type", val)}
                  />
                  {company.duration_total ? " · " : ""}
                  {company.duration_total && (
                    <EditableText
                      text={company.duration_total}
                      isAdmin={isAdmin}
                      onSave={(val) => handleUpdateCompany(company.id, "duration_total", val)}
                    />
                  )}
                  {company.location ? " · " : ""}
                  {company.location && (
                    <EditableText
                      text={company.location}
                      isAdmin={isAdmin}
                      onSave={(val) => handleUpdateCompany(company.id, "location", val)}
                    />
                  )}
                </p>

                {isAdmin && (
                  <div className="absolute top-0 right-0 flex gap-4 font-mono text-xs select-none">
                    <button
                      onClick={() => {
                        setTargetCompanyId(company.id);
                        setShowAddRoleModal(true);
                      }}
                      className="text-green-500/60 hover:text-green-500 transition-colors cursor-pointer"
                    >
                      [+ add role]
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      className="text-red-500/60 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      [delete]
                    </button>
                  </div>
                )}
              </div>

              {/* Nested Roles timeline */}
              <div className="mt-8 space-y-12">
                {company.portfolio_experience_roles?.map((role: any) => (
                  <div
                    key={role.id}
                    className="relative pl-2 before:absolute before:left-[-48px] before:top-[8px] before:w-2.5 before:h-2.5 before:rounded-full before:border-2 before:border-[#333] before:bg-[#0a0a0a] before:z-10 group"
                  >
                    {/* Role Title and Period */}
                    <div className="space-y-1 relative">
                      <h4 className="font-sans text-[15px] font-semibold text-[#e5e5e5]">
                        <EditableText
                          text={role.title}
                          isAdmin={isAdmin}
                          onSave={(val) => handleUpdateRole(role.id, company.id, "title", val)}
                        />
                      </h4>
                      <p className="font-mono text-[10px] text-[#555] uppercase tracking-widest">
                        <EditableText
                          text={role.period}
                          isAdmin={isAdmin}
                          onSave={(val) => handleUpdateRole(role.id, company.id, "period", val)}
                        />
                        {" · "}
                        <EditableText
                          text={role.duration}
                          isAdmin={isAdmin}
                          onSave={(val) => handleUpdateRole(role.id, company.id, "duration", val)}
                        />
                      </p>

                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteRole(role.id, company.id)}
                          className="absolute top-0 right-0 font-mono text-xs text-red-500/60 hover:text-red-500 transition-colors cursor-pointer select-none"
                        >
                          [delete role]
                        </button>
                      )}
                    </div>

                    {/* Role Descriptions */}
                    <div className="mt-4 font-sans text-sm text-[#888888] leading-relaxed space-y-3 max-w-2xl">
                      {isAdmin ? (
                        <div className="border border-dashed border-[#222] rounded p-2">
                          <label className="text-[9px] text-[#555] font-mono block mb-1">
                            EDIT DESCRIPTIONS (ONE PER LINE)
                          </label>
                          <EditableText
                            text={role.description?.join("\n") || ""}
                            isAdmin={isAdmin}
                            multiline
                            onSave={(val) =>
                              handleUpdateRole(
                                role.id,
                                company.id,
                                "description",
                                val.split("\n").map((s) => s.trim()).filter(Boolean)
                              )
                            }
                          />
                        </div>
                      ) : (
                        role.description?.map((desc: string, idx: number) => (
                          <p key={idx}>{desc}</p>
                        ))
                      )}
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-2 mt-5 items-center">
                      {isAdmin ? (
                        <div className="border border-dashed border-[#222] rounded p-2 w-full max-w-md">
                          <label className="text-[9px] text-[#555] font-mono block mb-1">
                            EDIT SKILLS (COMMA SEPARATED)
                          </label>
                          <EditableText
                            text={role.skills?.join(", ") || ""}
                            isAdmin={isAdmin}
                            onSave={(val) =>
                              handleUpdateRole(
                                role.id,
                                company.id,
                                "skills",
                                val.split(",").map((s) => s.trim()).filter(Boolean)
                              )
                            }
                          />
                        </div>
                      ) : (
                        role.skills?.map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="font-mono text-[10px] text-[#888888] bg-[#0c0c0c] border border-[#1a1a1a] rounded px-2.5 py-1 tracking-wide"
                          >
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Company Modal Popup */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 w-full max-w-md font-mono space-y-4 shadow-2xl">
            <div className="text-sm text-[#555] uppercase tracking-wider border-b border-[#1a1a1a] pb-2">add new company experience</div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">company name</label>
              <input
                type="text"
                required
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">initials</label>
              <input
                type="text"
                required
                value={cInitials}
                onChange={(e) => setCInitials(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">type</label>
              <select
                value={cType}
                onChange={(e) => setCType(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">duration (e.g. 1 yr 2 mos)</label>
              <input
                type="text"
                value={cDuration}
                onChange={(e) => setCDuration(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">location</label>
              <input
                type="text"
                value={cLocation}
                onChange={(e) => setCLocation(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCompanyModal(false)}
                className="px-3 py-1.5 border border-[#222] rounded text-xs text-[#888] hover:text-[#e5e5e5] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCompany}
                className="px-3 py-1.5 bg-[#e5e5e5] text-black font-semibold rounded text-xs hover:bg-white transition-colors cursor-pointer"
              >
                Add Company
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal Popup */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 w-full max-w-md font-mono space-y-4 shadow-2xl">
            <div className="text-sm text-[#555] uppercase tracking-wider border-b border-[#1a1a1a] pb-2">add new nested role</div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">role title</label>
              <input
                type="text"
                required
                value={rTitle}
                onChange={(e) => setRTitle(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">period (e.g. AUG 2025 - PRESENT)</label>
              <input
                type="text"
                required
                value={rPeriod}
                onChange={(e) => setRPeriod(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">duration (e.g. 11 MOS)</label>
              <input
                type="text"
                required
                value={rDuration}
                onChange={(e) => setRDuration(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">descriptions (one per line)</label>
              <textarea
                value={rDesc}
                onChange={(e) => setRDesc(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444] min-h-[80px]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#555] uppercase">skills (comma-separated)</label>
              <input
                type="text"
                value={rSkills}
                onChange={(e) => setRSkills(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddRoleModal(false)}
                className="px-3 py-1.5 border border-[#222] rounded text-xs text-[#888] hover:text-[#e5e5e5] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddRole}
                className="px-3 py-1.5 bg-[#e5e5e5] text-black font-semibold rounded text-xs hover:bg-white transition-colors cursor-pointer"
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
