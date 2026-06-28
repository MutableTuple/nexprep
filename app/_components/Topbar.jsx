import { ChevronDown } from "lucide-react";
import React from "react";

export default function Topbar() {
  return (
    <header className="h-14 bg-black text-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-10">
        <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white">
          <div className="w-3 h-3 rounded-full bg-white" />
        </div>
        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-neutral-300">
          {["Work", "About", "Playground", "Resources"].map((item) => (
            <button key={item} className="hover:text-white transition">
              {item}
            </button>
          ))}
        </nav>
      </div>
      <button className="flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 text-sm hover:bg-white/10 transition">
        ihyaet@gmail.com
        <ChevronDown size={14} />
      </button>
    </header>
  );
}
