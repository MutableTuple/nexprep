"use client";

import { useEffect, useMemo, useState } from "react";

// Renders a pre-generated SVG stored on the question row. The SVG came
// from an LLM at authoring/backfill time, so we sanitize it defensively
// before dropping it into the DOM:
//   - Strip <script>, <foreignObject>, event handlers, javascript: urls.
//   - Allow only the SVG element set we actually use for diagrams.
//   - Force the root <svg> to be responsive: no fixed width/height, so it
//     scales to the container while preserving its viewBox aspect ratio.
//
// We do this in-browser (client-side) with DOMPurify — the server-side
// backfill script also does a coarse check, but the browser sanitizer is
// the authoritative one because it's what actually runs before render.

const ALLOWED_TAGS = [
  "svg",
  "g",
  "defs",
  "title",
  "desc",
  "path",
  "line",
  "polyline",
  "polygon",
  "rect",
  "circle",
  "ellipse",
  "text",
  "tspan",
  "textPath",
  "marker",
  "use",
  "symbol",
  "linearGradient",
  "radialGradient",
  "stop",
  "pattern",
  "clipPath",
  "mask",
  "filter",
  "feGaussianBlur",
  "feOffset",
  "feMerge",
  "feMergeNode",
  "feColorMatrix",
  "feBlend",
];

const ALLOWED_ATTR = [
  "id",
  "class",
  "viewBox",
  "preserveAspectRatio",
  "xmlns",
  "d",
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "width",
  "height",
  "points",
  "transform",
  "fill",
  "fill-opacity",
  "fill-rule",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-dasharray",
  "stroke-opacity",
  "opacity",
  "text-anchor",
  "dominant-baseline",
  "alignment-baseline",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "letter-spacing",
  "dx",
  "dy",
  "offset",
  "stop-color",
  "stop-opacity",
  "gradientUnits",
  "gradientTransform",
  "spreadMethod",
  "orient",
  "refX",
  "refY",
  "markerWidth",
  "markerHeight",
  "markerUnits",
  "in",
  "in2",
  "result",
  "stdDeviation",
  "type",
  "values",
  "mode",
  "clip-path",
  "mask",
  "vector-effect",
];

export default function DynamicVisualizer({ svg, fallback = null }) {
  const [DOMPurify, setDOMPurify] = useState(null);

  useEffect(() => {
    let live = true;
    // Dynamic import so DOMPurify is not shipped when there's no SVG to
    // render, and so SSR doesn't try to load a browser-only module.
    import("isomorphic-dompurify").then((mod) => {
      if (live) setDOMPurify(() => mod.default ?? mod);
    });
    return () => {
      live = false;
    };
  }, []);

  const cleaned = useMemo(() => {
    if (!svg || !DOMPurify) return null;
    let out = DOMPurify.sanitize(svg, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      // Belt-and-braces: also forbid attributes that could reach out to the
      // network or execute code, in case a future SVG profile allows them.
      FORBID_ATTR: ["href", "xlink:href", "onclick", "onload", "onerror"],
      FORBID_TAGS: ["script", "foreignObject", "iframe"],
    });
    // Strip fixed width/height on the outer <svg> so it scales.
    out = out.replace(
      /<svg([^>]*?)\swidth="[^"]*"/i,
      "<svg$1",
    );
    out = out.replace(
      /<svg([^>]*?)\sheight="[^"]*"/i,
      "<svg$1",
    );
    return out;
  }, [svg, DOMPurify]);

  if (!svg) return fallback;
  if (!cleaned) {
    // Sanitizer still loading — show fallback (or a lightweight skeleton)
    // rather than a flash of unsanitized markup.
    return fallback;
  }

  return (
    <div
      className="dyn-viz w-full [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-h-[280px] text-foreground"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  );
}
