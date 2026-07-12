/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/hooks/useAdmin";
import { EditableText } from "@/components/EditableText";
import { ProjectType } from "@/components/ProjectCard";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { WorkHistory } from "@/components/WorkHistory";
import { Certifications } from "@/components/Certifications";
import { Recommendations } from "@/components/Recommendations";
import { CommitGrid } from "@/components/CommitGrid";
import { ProfileImage } from "@/components/ProfileImage";

export default function Home() {
  const { isAdmin } = useAdmin();
  const [profile, setProfile] = useState<any>({
    name: "Fran Peruso",
    bio: "Software Engineer & UI/UX Designer. Offline-first systems, multi-tenant SaaS structures, distributed state, cloud infrastructure.",
    title: "Software Engineer",
    email: "frandilbertperuso@gmail.com",
    experience_years: "4+ yrs",
    uptime: "100%",
    projects_count: "10+",
    alma_mater: "WMSU"
  });
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndProjects = async () => {
    try {
      const { data: profileData } = await supabase
        .from("portfolio_profile")
        .select("*")
        .maybeSingle();

      if (profileData) setProfile(profileData);

      const { data: projectsData } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(3);

      if (projectsData) {
        setProjects(
          projectsData.map((p) => ({
            category: p.badge,
            title: p.title,
            description: p.description,
            badges: p.extra_badges || []
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load home page content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndProjects();
  }, []);

  const updateProfileField = async (field: string, value: string) => {
    const { error } = await supabase
      .from("portfolio_profile")
      .update({ [field]: value })
      .eq("id", profile.id);

    if (!error) {
      setProfile((prev: any) => ({ ...prev, [field]: value }));
    } else {
      console.error(`Failed to update profile field: ${field}`, error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-[#555] lowercase animate-pulse">
        initializing systems...
      </div>
    );
  }

  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto overflow-hidden">
      {/* Section 01: Hero Intro & Metrics */}
      <section className="mb-32">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 mb-16 items-start">
          {/* Profile Image with Dynamic Halftone Shader */}
          <ProfileImage />

          {/* Bio & Links */}
          <div className="flex-1 pt-2">
            <h1 className="font-mono text-4xl text-[#e5e5e5] mb-8 lowercase tracking-tight">
              <EditableText
                text={profile.name}
                isAdmin={isAdmin}
                onSave={(val) => updateProfileField("name", val)}
              />
            </h1>
            
            <div className="font-sans text-[15px] leading-relaxed text-[#888888] mb-6 max-w-xl">
              <EditableText
                text={profile.bio}
                isAdmin={isAdmin}
                multiline
                onSave={(val) => updateProfileField("bio", val)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-8">
              {[
                { name: "github", url: "#" },
                { name: "linkedin", url: "#" },
                { name: "instagram", url: "#" },
                { name: "email", url: `mailto:${profile.email}`, isEmail: true },
              ].map((link) => (
                <div key={link.name} className="flex items-center space-x-1.5 group">
                  {link.isEmail ? (
                    <span className="font-mono text-xs text-[#888888] lowercase hover:text-[#e5e5e5] transition-colors">
                      email:{" "}
                      <EditableText
                        text={profile.email}
                        isAdmin={isAdmin}
                        onSave={(val) => updateProfileField("email", val)}
                      />
                    </span>
                  ) : (
                    <a href={link.url} className="flex items-center space-x-1.5">
                      <span className="font-mono text-xs text-[#888888] lowercase group-hover:text-[#e5e5e5] transition-colors">{link.name}</span>
                      <svg className="w-3 h-3 text-[#555555] group-hover:text-[#e5e5e5] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verifiable Structural Metrics Grid */}
        <div className="flex flex-col md:flex-row border-t border-b border-[#1a1a1a] py-8 mb-16">
          <div className="flex-1 md:border-r border-[#1a1a1a] border-b md:border-b-0 pb-6 md:pb-0 mb-6 md:mb-0 pr-8">
            <div className="flex items-start">
              <div className="font-mono text-2xl text-[#e5e5e5] lowercase tracking-tight">
                <EditableText
                  text={profile.experience_years}
                  isAdmin={isAdmin}
                  onSave={(val) => updateProfileField("experience_years", val)}
                />
              </div>
              <svg className="w-3 h-3 text-[#333333] ml-1 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <div className="font-mono text-[10px] text-[#555555] lowercase mt-2 tracking-widest">EXPERIENCE</div>
          </div>
          
          <div className="flex-1 md:border-r border-[#1a1a1a] border-b md:border-b-0 pb-6 md:pb-0 mb-6 md:mb-0 md:px-8">
            <div className="flex items-start">
              <div className="font-mono text-2xl text-[#e5e5e5] lowercase tracking-tight">
                <EditableText
                  text={profile.uptime}
                  isAdmin={isAdmin}
                  onSave={(val) => updateProfileField("uptime", val)}
                />
              </div>
              <svg className="w-3 h-3 text-[#333333] ml-1 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <div className="font-mono text-[10px] text-[#555555] lowercase mt-2 tracking-widest">UPTIME</div>
          </div>
          
          <div className="flex-1 md:border-r border-[#1a1a1a] border-b md:border-b-0 pb-6 md:pb-0 mb-6 md:mb-0 md:px-8">
            <div className="flex items-start">
              <div className="font-mono text-2xl text-[#e5e5e5] lowercase tracking-tight">
                <EditableText
                  text={profile.projects_count}
                  isAdmin={isAdmin}
                  onSave={(val) => updateProfileField("projects_count", val)}
                />
              </div>
              <svg className="w-3 h-3 text-[#333333] ml-1 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <div className="font-mono text-[10px] text-[#555555] lowercase mt-2 tracking-widest">PROJECTS</div>
          </div>
          
          <div className="flex-1 md:pl-8">
            <div className="flex items-start">
              <div className="font-mono text-2xl text-[#e5e5e5] lowercase tracking-tight">
                <EditableText
                  text={profile.alma_mater}
                  isAdmin={isAdmin}
                  onSave={(val) => updateProfileField("alma_mater", val)}
                />
              </div>
              <svg className="w-3 h-3 text-[#333333] ml-1 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <div className="font-mono text-[10px] text-[#555555] lowercase mt-2 tracking-widest">ALMA MATER</div>
          </div>
        </div>

        {/* Dotted Separator */}
        <div className="w-full h-[1px] opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #888888 2px, transparent 2px)', backgroundSize: '8px 1px' }}></div>
      </section>

      {/* Section 02: Core Engineering & Architecture Case Studies */}
      <section className="mb-32">
        <h2 className="font-mono text-[#888888] text-sm lowercase mb-8">02 — projects</h2>
        {projects.length > 0 ? (
          <ProjectCarousel projects={projects} />
        ) : (
          <div className="py-8 text-center text-xs font-mono text-[#555] lowercase">
            no projects loaded.
          </div>
        )}
      </section>

      {/* Section 03: Professional Experience History */}
      <section className="mb-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-mono text-[#888888] text-sm lowercase">03 — professional experience</h2>
          <a href="/experience" className="font-mono text-[#888888] text-xs lowercase hover:text-[#e5e5e5] transition-colors flex items-center group">
            full history
            <svg className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>
        <WorkHistory />
      </section>

      {/* Section 04: Certifications */}
      <section className="mb-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-mono text-[#888888] text-sm lowercase">04 — certifications</h2>
          <a href="/certifications" className="font-mono text-[#888888] text-xs lowercase hover:text-[#e5e5e5] transition-colors flex items-center group">
            all certifications
            <svg className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>
        <Certifications />
      </section>

      {/* Section 05: Recommendations */}
      <section className="mb-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-mono text-[#888888] text-sm lowercase">05 — recommendations</h2>
          <a href="/recommendations" className="font-mono text-[#888888] text-xs lowercase hover:text-[#e5e5e5] transition-colors flex items-center group">
            all recommendations
            <svg className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>
        <Recommendations />
      </section>

      {/* Section 06: GitHub */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-mono text-[#888888] text-sm lowercase">06 — github</h2>
          <a href="#" className="font-mono text-[#888888] text-xs lowercase hover:text-[#e5e5e5] transition-colors flex items-center group">
            view github profile
            <svg className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>
        <CommitGrid />

        {/* Final Dotted Separator */}
        <div className="w-full h-[1px] opacity-30 mt-16" style={{ backgroundImage: 'linear-gradient(to right, #888888 2px, transparent 2px)', backgroundSize: '8px 1px' }}></div>
      </section>
    </div>
  );
}
