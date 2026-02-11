"use client";

import { useEffect, useMemo, useState } from "react";

const svgCache = new Map();

const applyCurrentColor = (svgText) => {
  // Replace non-"none" fills and strokes with currentColor
  let processed = svgText
    .replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"')
    .replace(/stroke="(?!none)[^"]*"/gi, 'stroke="currentColor"');

  return processed;
};

const setSvgSize = (svgText, size) => {
  if (!size) return svgText;
  const sizeValue = typeof size === "number" ? `${size}` : `${size}`;
  let processed = svgText;

  if (processed.includes("<svg")) {
    processed = processed.replace(/<svg([^>]*)>/i, (match, attrs) => {
      const cleaned = attrs
        .replace(/\swidth="[^"]*"/i, "")
        .replace(/\sheight="[^"]*"/i, "");
      return `<svg${cleaned} width="${sizeValue}" height="${sizeValue}">`;
    });
  }
  return processed;
};

export default function Icon({
  name,
  color,
  size,
  className,
  basePath = "/logos",
  debug = false,
}) {
  const [svg, setSvg] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const candidates = useMemo(() => {
    if (!name) return [];
    const normalized = name.endsWith(".svg") ? name : `${name}.svg`;
    const list = [];
    const addCandidate = (candidate) => {
      if (!candidate) return;
      if (candidate.startsWith("/")) list.push(candidate);
      else list.push(`${basePath}/${candidate}`);
    };
    addCandidate(normalized);

    const withoutPrefix = normalized.replace(/^icon-/, "");
    if (withoutPrefix !== normalized) addCandidate(withoutPrefix);

    if (!normalized.includes("-outline")) {
      addCandidate(normalized.replace(/\.svg$/, "-outline.svg"));
      if (withoutPrefix === normalized) {
        addCandidate(withoutPrefix.replace(/\.svg$/, "-outline.svg"));
      }
    }

    return Array.from(new Set(list));
  }, [name, basePath]);

  useEffect(() => {
    if (candidates.length === 0) {
      setSvg(null);
      return;
    }

    let isMounted = true;

    const load = async () => {
      if (debug) {
        setDebugInfo({ status: "loading", candidates });
        // eslint-disable-next-line no-console
        console.log("[Icon] loading", { name, candidates });
      }
      for (const src of candidates) {
        if (svgCache.has(src)) {
          if (isMounted) setSvg(svgCache.get(src));
          if (debug && isMounted) {
            setDebugInfo({ status: "cache", src, candidates });
            // eslint-disable-next-line no-console
            console.log("[Icon] cache hit", { name, src });
          }
          return;
        }
        try {
          const res = await fetch(src);
          if (!res.ok) continue;
          const text = await res.text();
          const processed = applyCurrentColor(text);
          svgCache.set(src, processed);
          if (isMounted) setSvg(processed);
          if (debug && isMounted) {
            setDebugInfo({ status: "loaded", src, candidates });
            // eslint-disable-next-line no-console
            console.log("[Icon] loaded", { name, src });
          }
          return;
        } catch {
          // try next candidate
        }
      }
      if (isMounted) {
        setSvg(null);
        if (debug) {
          setDebugInfo({ status: "not_found", candidates });
          // eslint-disable-next-line no-console
          console.warn("[Icon] not found", { name, candidates });
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [candidates]);

  const rendered = useMemo(() => {
    if (!svg) return null;
    return setSvgSize(svg, size);
  }, [svg, size]);

  if (!rendered) {
    if (debug && debugInfo) {
      return (
        <span
          className={className}
          style={{
            display: "inline-flex",
            alignItems: "center",
            lineHeight: 1,
            fontSize: 10,
            border: "1px dashed currentColor",
            padding: "2px 4px",
          }}
          title={debugInfo?.candidates?.join(", ")}
        >
          {name || "icon"}
        </span>
      );
    }
    return null;
  }

  return (
    <span
      className={className}
      style={{
        lineHeight: 0,
        display: "inline-flex",
        ...(color ? { color } : null),
      }}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
