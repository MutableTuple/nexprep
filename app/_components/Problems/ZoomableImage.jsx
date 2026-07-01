"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ZoomableImage({ src, alt }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div
        className="relative cursor-zoom-in group mx-auto max-h-64 sm:max-h-80 w-full"
        onClick={() => setOpen(true)}
      >
        <div className="relative h-64 sm:h-80 w-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain transition-opacity group-hover:opacity-85"
            sizes="(max-width: 640px) 100vw, 720px"
          />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-lg tracking-wide pointer-events-none">
          Click to zoom
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-6 cursor-zoom-out"
          style={{ animation: "fadeIn 0.15s ease" }}
        >
          <div
            className="relative w-[90vw] h-[90vh]"
            style={{ animation: "scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain rounded-xl shadow-2xl"
              sizes="90vw"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="fixed top-5 right-5 rounded-full bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm"
          >
            <X size={18} />
          </Button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes scaleIn { from { transform:scale(0.9);opacity:0 } to { transform:scale(1);opacity:1 } }
      `}</style>
    </>
  );
}
