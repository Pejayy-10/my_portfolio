import { ProjectType } from "@/components/ProjectCard";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { WorkHistory } from "@/components/WorkHistory";
import { Certifications } from "@/components/Certifications";
import { Recommendations } from "@/components/Recommendations";
import { CommitGrid } from "@/components/CommitGrid";
import { ProfileImage } from "@/components/ProfileImage";

const mockProjects: ProjectType[] = [
  {
    category: "system engineering",
    title: "Project Alpha // Offline Sync",
    description: "Built an offline-first regional ledger syncing system handling low-connectivity peripheral nodes.",
    badges: ["#1 SYSTEM", "ENTERPRISE", "INTERNAL"],
  },
  {
    category: "saas infrastructure",
    title: "Project Beta // Multi-Tenant",
    description: "Gamified state processing engine caching multi-format audio streams via local-first file subsystem.",
    badges: ["SAAS PLATFORM", "B2B SCALING", "EDGE NETWORK"],
  },
  {
    category: "open source",
    title: "Project Gamma // Toolkit",
    description: "A highly optimized CLI companion for automating redundant deployment workflows and database migrations.",
    badges: ["OPEN SOURCE", "1M+ DOWNLOADS"],
  }
];

export default function Home() {
  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto overflow-hidden">
      {/* Section 01: Hero Intro & Metrics */}
      <section className="mb-32">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 mb-16 items-start">
          {/* Profile Image with Dynamic Halftone Shader */}
          <ProfileImage />

          {/* Bio & Links */}
          <div className="flex-1 pt-2">
            <h1 className="font-mono text-4xl text-[#e5e5e5] mb-8 lowercase tracking-tight">Fran Peruso</h1>
            
            <p className="font-sans text-[15px] leading-relaxed text-[#888888] mb-6 max-w-xl">
              I&apos;m a software engineer and UI/UX designer. I build offline-first systems, multi-tenant SaaS applications, and modern digital ecosystems. Currently focused on deep cloud integration architectures and custom edge network infrastructures.
            </p>
            
            <p className="font-sans text-[15px] leading-relaxed text-[#888888] mb-12 max-w-xl">
              Right now, I am building robust backend configurations and crafting highly polished user interfaces. I specialize in taking rough architectural briefs and turning them into scalable, functional digital infrastructure.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              {[
                { name: "github", url: "#" },
                { name: "linkedin", url: "#" },
                { name: "instagram", url: "#" },
                { name: "email", url: "mailto:contact@example.com" },
              ].map((link) => (
                <a key={link.name} href={link.url} className="flex items-center space-x-1.5 group">
                  <span className="font-mono text-xs text-[#888888] lowercase group-hover:text-[#e5e5e5] transition-colors">{link.name}</span>
                  <svg className="w-3 h-3 text-[#555555] group-hover:text-[#e5e5e5] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Verifiable Structural Metrics Grid */}
        <div className="flex flex-col md:flex-row border-t border-b border-[#1a1a1a] py-8 mb-16">
          <div className="flex-1 md:border-r border-[#1a1a1a] border-b md:border-b-0 pb-6 md:pb-0 mb-6 md:mb-0 pr-8">
            <div className="flex items-start">
              <div className="font-mono text-2xl text-[#e5e5e5] lowercase tracking-tight">4+ yrs</div>
              <svg className="w-3 h-3 text-[#333333] ml-1 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <div className="font-mono text-[10px] text-[#555555] lowercase mt-2 tracking-widest">EXPERIENCE</div>
          </div>
          
          <div className="flex-1 md:border-r border-[#1a1a1a] border-b md:border-b-0 pb-6 md:pb-0 mb-6 md:mb-0 md:px-8">
            <div className="flex items-start">
              <div className="font-mono text-2xl text-[#e5e5e5] lowercase tracking-tight">100%</div>
              <svg className="w-3 h-3 text-[#333333] ml-1 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <div className="font-mono text-[10px] text-[#555555] lowercase mt-2 tracking-widest">UPTIME</div>
          </div>
          
          <div className="flex-1 md:border-r border-[#1a1a1a] border-b md:border-b-0 pb-6 md:pb-0 mb-6 md:mb-0 md:px-8">
            <div className="flex items-start">
              <div className="font-mono text-2xl text-[#e5e5e5] lowercase tracking-tight">10+</div>
              <svg className="w-3 h-3 text-[#333333] ml-1 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <div className="font-mono text-[10px] text-[#555555] lowercase mt-2 tracking-widest">PROJECTS</div>
          </div>
          
          <div className="flex-1 md:pl-8">
            <div className="flex items-start">
              <div className="font-mono text-2xl text-[#e5e5e5] lowercase tracking-tight">WMSU</div>
              <svg className="w-3 h-3 text-[#333333] ml-1 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <div className="font-mono text-[10px] text-[#555555] lowercase mt-2 tracking-widest">ALMA MATTER</div>
          </div>
        </div>

        {/* Dotted Separator */}
        <div className="w-full h-[1px] opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #888888 2px, transparent 2px)', backgroundSize: '8px 1px' }}></div>
      </section>

      {/* Section 02: Core Engineering & Architecture Case Studies */}
      <section className="mb-32">
        <h2 className="font-mono text-[#888888] text-sm lowercase mb-8">02 — projects</h2>
        <ProjectCarousel projects={mockProjects} />
      </section>

      {/* Section 03: Professional Experience History */}
      <section className="mb-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-mono text-[#888888] text-sm lowercase">03 — professional experience</h2>
          <a href="#" className="font-mono text-[#888888] text-xs lowercase hover:text-[#e5e5e5] transition-colors flex items-center group">
            full history
            <svg className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>
        <WorkHistory />

        {/* Stack Section */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-mono text-[#888888] text-xs lowercase tracking-widest">STACK</h3>
            <a href="#" className="font-mono text-[#888888] text-xs lowercase hover:text-[#e5e5e5] transition-colors flex items-center group">
              view all
              <svg className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            {["TypeScript", "React", "Next.js", "Node.js", "Python", "Laravel", "PostgreSQL", "AWS", "Docker", "Kubernetes", "PyTorch", "Claude Code"].map((tech) => (
              <a key={tech} href="#" className="font-mono text-xs text-[#888888] border border-[#1a1a1a] rounded px-3 py-1.5 hover:text-[#e5e5e5] hover:border-[#333333] hover:bg-[#0f0f0f] transition-all">
                {tech}
              </a>
            ))}
            <a href="#" className="font-mono text-xs text-[#555555] border border-dashed border-[#1a1a1a] rounded px-3 py-1.5 hover:text-[#888888] hover:border-[#333333] transition-colors">
              + more
            </a>
          </div>
        </div>
      </section>

      {/* Section 04: Certifications */}
      <section className="mb-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-mono text-[#888888] text-sm lowercase">04 — certifications</h2>
          <a href="#" className="font-mono text-[#888888] text-xs lowercase hover:text-[#e5e5e5] transition-colors flex items-center group">
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
          <a href="#" className="font-mono text-[#888888] text-xs lowercase hover:text-[#e5e5e5] transition-colors flex items-center group">
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
