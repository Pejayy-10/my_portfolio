import React from "react";

const history = [
  {
    role: "Freelance Full-Stack Developer & Multimedia Designer",
    company: "Independent",
    tenure: "4-Year Tenure",
    description: "Delivered multi-tenant web platforms, corporate branding assets, and high-impact kinetic motion graphics sequences.",
    skills: ["TypeScript", "Next.js", "Supabase", "Motion Graphics"]
  },
  {
    role: "UI/UX Designer (Part-Time Contract)",
    company: "Creative Design Studio",
    tenure: "1-Year Tenure",
    description: "Designed responsive digital architectures and production-ready design systems using advanced Figma pipelines.",
    skills: ["Figma", "Design Systems", "Prototyping", "UI/UX"]
  }
];

export const WorkHistory = () => {
  return (
    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#1a1a1a] before:to-transparent">
      {history.map((item, i) => (
        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Timeline Node */}
          <div className="flex items-center justify-center w-5 h-5 rounded-full border border-[#333333] bg-[#0a0a0a] text-slate-500 group-hover:border-[#888888] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors z-10 ml-0 md:mx-auto">
            <div className="w-1.5 h-1.5 bg-[#555555] rounded-full group-hover:bg-[#e5e5e5] transition-colors"></div>
          </div>
          
          {/* Content Card */}
          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] p-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shadow-2xl hover:border-[#333333] transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
              <h3 className="font-mono text-lg font-medium lowercase text-[#e5e5e5]">{item.role}</h3>
              <span className="font-mono text-xs text-[#888888] lowercase px-2 py-1 bg-[#141414] border border-[#1a1a1a] rounded whitespace-nowrap">{item.tenure}</span>
            </div>
            <div className="font-mono text-sm text-[#555555] mb-4 lowercase">{item.company}</div>
            <p className="font-sans text-sm text-[#888888] leading-relaxed mb-6">
              {item.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {item.skills.map((skill) => (
                <span key={skill} className="font-mono text-xs lowercase text-[#555555] border border-[#1a1a1a] px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
