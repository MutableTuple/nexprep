import { Card, CardHeader } from "@/components/ui/card";
import React from "react";
import { useState } from "react";
export default function YouTubeEmbed({ videoId, title = "Related video" }) {
  const [loaded, setLoaded] = useState(false);
  if (!videoId) return null;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-5 py-4 border-b flex-row items-center gap-2 space-y-0">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-sm font-semibold">Watch explanation</span>
        <span className="ml-auto text-xs text-muted-foreground">YouTube</span>
      </CardHeader>
      <div className="relative w-full aspect-video bg-gray-950">
        {!loaded ? (
          <div
            onClick={() => setLoaded(true)}
            className="absolute inset-0 cursor-pointer group"
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:bg-red-500 group-hover:scale-110 transition-all duration-150">
                <div className="w-0 h-0 ml-1 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent" />
              </div>
            </div>
          </div>
        ) : (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </Card>
  );
}
