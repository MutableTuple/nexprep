"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ZoomableImage({ src, alt }) {
  const [open, setOpen] = useState(false);

  // Close on Escape + lock body scroll while the lightbox is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!src) return null;

  return (
    <>
      {/* Thumbnail */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Zoom image"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="group relative mx-auto w-full cursor-zoom-in"
      >
        <div className="relative h-64 w-full sm:h-80">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain transition-opacity group-hover:opacity-85"
            sizes="(max-width: 640px) 100vw, 720px"
          />
        </div>

        <div className="pointer-events-none absolute bottom-2 right-2 rounded-lg bg-black/50 px-2.5 py-1 text-xs font-semibold tracking-wide text-white">
          Click to zoom
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="zoom-fade-in fixed inset-0 z-[9999] flex cursor-zoom-out items-center justify-center bg-black/85 p-6"
        >
          <div className="zoom-scale-in relative h-[90vh] w-[90vw]">
            <Image
              src={src}
              alt={alt}
              fill
              className="rounded-xl object-contain shadow-2xl"
              sizes="90vw"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="fixed right-5 top-5 rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
          >
            <X size={18} />
          </Button>
        </div>
      )}
    </>
  );
}
