export const Certifications = () => {
  const certs = [
    {
      title: "Certified Cloud Solutions Architect",
      provider: "Cloud Services Provider",
      icon: "C",
    },
    {
      title: "Advanced Machine Learning Engineer",
      provider: "Data Institute",
      icon: "M",
    },
    {
      title: "Certified Kubernetes Administrator",
      provider: "Open Source Foundation",
      icon: "K",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {certs.map((cert, i) => (
        <div key={i} className="flex flex-col items-center justify-center p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl hover:border-[#333333] transition-colors group">
          <div className="w-12 h-12 flex items-center justify-center rounded bg-[#0f0f0f] border border-[#1a1a1a] mb-6 shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-mono text-xl text-[#888888]">{cert.icon}</span>
          </div>
          <h3 className="font-sans text-[15px] font-medium text-[#e5e5e5] text-center mb-2 leading-tight">
            {cert.title}
          </h3>
          <p className="font-mono text-[10px] text-[#555555] uppercase tracking-widest mb-6">
            {cert.provider}
          </p>
          <a href="#" className="font-mono text-xs text-[#555555] lowercase hover:text-[#888888] transition-colors flex items-center group/btn">
            <svg className="w-3 h-3 mr-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            verify
            <svg className="w-3 h-3 ml-1 opacity-50 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      ))}
    </div>
  );
};
