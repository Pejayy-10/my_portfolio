/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const Certifications = () => {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      const { data } = await supabase
        .from("portfolio_certifications")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(3);

      if (data) setCerts(data);
      setLoading(false);
    };
    fetchCerts();
  }, []);

  if (loading) {
    return (
      <div className="py-8 text-center text-xs font-mono text-[#555] lowercase animate-pulse">
        loading certifications...
      </div>
    );
  }

  if (certs.length === 0) {
    return (
      <div className="py-8 text-center text-xs font-mono text-[#555] lowercase">
        no certifications found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {certs.map((cert, i) => (
        <div key={i} className="flex flex-col items-center justify-center p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl hover:border-[#333333] transition-colors group">
          <div className="w-12 h-12 flex items-center justify-center rounded bg-[#0f0f0f] border border-[#1a1a1a] mb-6 shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-mono text-xl text-[#888888]">
              {cert.title.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="font-sans text-[15px] font-medium text-[#e5e5e5] text-center mb-2 leading-tight">
            {cert.title}
          </h3>
          <p className="font-mono text-[10px] text-[#555555] uppercase tracking-widest mb-6">
            {cert.issuer}
          </p>
          <a 
            href={cert.verify_url || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-mono text-xs text-[#555555] lowercase hover:text-[#888888] transition-colors flex items-center group/btn"
          >
            <svg className="w-3 h-3 mr-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            verify
            <svg className="w-3 h-3 ml-1 opacity-50 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      ))}
    </div>
  );
};
