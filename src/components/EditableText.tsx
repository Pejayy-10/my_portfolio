"use client";

import { useState, useRef, useEffect } from "react";

interface EditableTextProps {
  text: string;
  onSave: (newText: string) => Promise<void>;
  isAdmin: boolean;
  multiline?: boolean;
  className?: string;
  inputClassName?: string;
}

export const EditableText = ({
  text,
  onSave,
  isAdmin,
  multiline = false,
  className = "",
  inputClassName = "",
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text || "");
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync value when text prop changes
  useEffect(() => {
    setValue(text || "");
  }, [text]);

  const handleSave = async () => {
    if (value === text) {
      setIsEditing(false);
      return;
    }
    setIsLoading(true);
    try {
      await onSave(value);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save text:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleSave();
    } else if (e.key === "Escape") {
      setValue(text || "");
      setIsEditing(false);
    }
  };

  if (!isAdmin) {
    return <span className={className}>{text}</span>;
  }

  if (isEditing) {
    return (
      <div ref={containerRef} className="inline-flex flex-col gap-1 w-full max-w-full z-20">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className={`w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 font-sans text-sm text-[#e5e5e5] focus:outline-none focus:border-[#444] resize-y min-h-[80px] ${inputClassName}`}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className={`w-full bg-[#0c0c0e] border border-[#222] rounded px-3 py-1.5 font-sans text-sm text-[#e5e5e5] focus:outline-none focus:border-[#444] ${inputClassName}`}
            autoFocus
          />
        )}
        <div className="flex gap-2 justify-end mt-1 text-[10px] font-mono select-none">
          <button
            onClick={() => {
              setValue(text || "");
              setIsEditing(false);
            }}
            disabled={isLoading}
            className="text-[#555] hover:text-[#888] transition-colors cursor-pointer"
          >
            cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="text-[#e5e5e5] hover:text-white font-semibold transition-colors cursor-pointer"
          >
            {isLoading ? "saving..." : "save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <span 
      onClick={() => setIsEditing(true)}
      className={`relative group cursor-pointer inline-block hover:bg-[#1a1a1a]/15 hover:outline hover:outline-1 hover:outline-dashed hover:outline-[#333] hover:rounded px-1 -mx-1 transition-all ${className}`}
      title="Click to edit"
    >
      {text}
      <span className="opacity-0 group-hover:opacity-100 absolute -right-6 top-1/2 -translate-y-1/2 ml-2 text-[10px] text-[#555] transition-opacity select-none font-mono">
        edit
      </span>
    </span>
  );
};
