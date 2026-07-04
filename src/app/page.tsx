import { ProjectCard, ProjectType } from "@/components/ProjectCard";

const mockProjects: ProjectType[] = [
  {
    category: "capstone system engineering",
    title: "municipal digitalized waterworks",
    description: "Built an offline-first regional ledger syncing system handling low-connectivity peripheral nodes.",
  },
  {
    category: "academic thesis",
    title: "indigenous language crowdsourcing",
    description: "Gamified state processing engine caching multi-format audio streams via local-first file subsystem.",
  }
];

export default function Home() {
  return (
    <div className="p-16 max-w-5xl">
      {/* Section 01: Hero Intro & Metrics */}
      <section className="mb-24">
        <h2 className="font-mono text-[#888888] text-sm lowercase mb-6">01 // operational bio</h2>
        <p className="font-sans text-xl leading-relaxed text-[#e5e5e5] mb-8 max-w-3xl">
          I'm a software engineer and UI/UX designer. I build offline-first systems, multi-tenant SaaS applications, and modern digital ecosystems. Currently focused on deep cloud integration architectures and custom edge network infrastructures.
        </p>
        <p className="font-sans text-[#888888] mb-12 max-w-2xl">
          Right now, I am building robust backend configurations and crafting highly polished user interfaces. I specialize in taking rough architectural briefs and turning them into scalable, functional digital infrastructure.
        </p>

        {/* Verifiable Structural Metrics Grid */}
        <div className="grid grid-cols-4 gap-8">
          <div>
            <div className="font-mono text-2xl text-[#e5e5e5] lowercase">4+ Yrs</div>
            <div className="font-mono text-xs text-[#888888] lowercase mt-1">Freelance Web & Multimedia Delivery</div>
          </div>
          <div>
            <div className="font-mono text-2xl text-[#e5e5e5] lowercase">100%</div>
            <div className="font-mono text-xs text-[#888888] lowercase mt-1">Enterprise System Uptime Target</div>
          </div>
          <div>
            <div className="font-mono text-2xl text-[#e5e5e5] lowercase">10+</div>
            <div className="font-mono text-xs text-[#888888] lowercase mt-1">Complex Software Architectures</div>
          </div>
          <div>
            <div className="font-mono text-2xl text-[#e5e5e5] lowercase">ADZU</div>
            <div className="font-mono text-xs text-[#888888] lowercase mt-1">Academic CS Foundation</div>
          </div>
        </div>
      </section>

      {/* Section 02: Core Engineering & Architecture Case Studies */}
      <section className="mb-32">
        <h2 className="font-mono text-[#888888] text-sm lowercase mb-8">02 — projects</h2>
        <div className="relative h-[320px]">
          {mockProjects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
