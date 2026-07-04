export const Recommendations = () => {
  const recs = [
    {
      quote: "Fran consistently demonstrates a deep understanding of complex system architectures. Their ability to deliver resilient offline-first ledgers under pressure is remarkable.",
      initials: "JD",
      name: "John Doe",
      role: "VP OF ENGINEERING, ENTERPRISE CORP",
    },
    {
      quote: "Working with Fran was an absolute pleasure. They brought technical excellence and a unique design sensibility that elevated our multi-tenant SaaS platform significantly.",
      initials: "AS",
      name: "Alice Smith",
      role: "PRODUCT DIRECTOR, TECH STARTUP",
    },
    {
      quote: "A rare mix of deep backend knowledge and highly refined frontend execution. Fran is one of the most talented engineers I've had the opportunity to collaborate with.",
      initials: "MJ",
      name: "Michael Johnson",
      role: "LEAD ARCHITECT, OPEN SOURCE FOUNDATION",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {recs.map((rec, i) => (
        <div key={i} className="flex flex-col p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl hover:border-[#333333] transition-colors">
          <div className="text-[#333333] mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.017 21L16.439 14.2829C16.439 14.2829 15.6515 14.2829 14.939 14.2829C13.889 14.2829 13.064 13.4579 13.064 12.4079C13.064 11.3579 13.889 10.5329 14.939 10.5329C16.964 10.5329 18.689 12.1829 18.689 14.2829C18.689 15.5579 18.164 16.7579 17.264 17.5829L14.017 21ZM5.01703 21L7.43903 14.2829C7.43903 14.2829 6.65153 14.2829 5.93903 14.2829C4.88903 14.2829 4.06403 13.4579 4.06403 12.4079C4.06403 11.3579 4.88903 10.5329 5.93903 10.5329C7.96403 10.5329 9.68903 12.1829 9.68903 14.2829C9.68903 15.5579 9.16403 16.7579 8.26403 17.5829L5.01703 21Z" />
            </svg>
          </div>
          <p className="font-sans text-[15px] leading-relaxed text-[#e5e5e5] mb-8 flex-1">
            {rec.quote}
          </p>
          <div className="flex items-center pt-6 border-t border-[#1a1a1a]">
            <div className="w-8 h-8 rounded-full bg-[#141414] border border-[#333333] flex items-center justify-center shrink-0 mr-3">
              <span className="font-mono text-[10px] text-[#888888]">{rec.initials}</span>
            </div>
            <div>
              <h4 className="font-sans text-[13px] font-medium text-[#e5e5e5] mb-0.5">{rec.name}</h4>
              <p className="font-mono text-[9px] text-[#555555] tracking-widest uppercase">{rec.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
