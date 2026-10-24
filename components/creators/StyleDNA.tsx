"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { CreatorProfile } from "@/types";

type StyleAxis = {
  label: string;
  key: string;
  color: string;
};

const AXES: StyleAxis[] = [
  { label: "Cinematic", key: "cinematic", color: "#8b5cf6" },
  { label: "Bold",      key: "bold",      color: "#06b6d4" },
  { label: "Minimal",   key: "minimal",   color: "#10b981" },
  { label: "Experimental", key: "experimental", color: "#f59e0b" },
  { label: "Commercial", key: "commercial", color: "#ef4444" },
  { label: "Artistic",  key: "artistic",  color: "#ec4899" },
];

function getStyleScore(creator: CreatorProfile, key: string): number {
  const tools = creator.verifiedTools.map((t) => t.name.toLowerCase());
  const specs = creator.specializations.map((s) => s.toLowerCase());
  const bio = creator.bio.toLowerCase();

  switch (key) {
    case "cinematic":
      return Math.min(100, (
        (tools.some((t) => ["runway", "sora", "kling"].includes(t)) ? 30 : 0) +
        (specs.some((s) => s.includes("film") || s.includes("video")) ? 25 : 0) +
        (bio.includes("cinematic") || bio.includes("film") ? 25 : 0) +
        (creator.stats.avgRating > 4.8 ? 20 : 10)
      ));
    case "bold":
      return Math.min(100, (
        (tools.some((t) => ["midjourney", "flux"].includes(t)) ? 30 : 0) +
        (specs.some((s) => s.includes("social") || s.includes("short")) ? 20 : 0) +
        (bio.includes("bold") || bio.includes("dynamic") || bio.includes("energy") ? 25 : 0) +
        (creator.hourlyRateUsd > 100 ? 25 : 15)
      ));
    case "minimal":
      return Math.min(100, (
        (specs.some((s) => s.includes("image") || s.includes("motion")) ? 25 : 0) +
        (bio.includes("minimal") || bio.includes("clean") || bio.includes("elegant") ? 30 : 0) +
        (tools.some((t) => ["adobe firefly", "flux"].includes(t)) ? 25 : 0) +
        20
      ));
    case "experimental":
      return Math.min(100, (
        (tools.some((t) => ["comfyui", "stable diffusion"].includes(t)) ? 35 : 0) +
        (bio.includes("experimental") || bio.includes("pioneer") || bio.includes("avant") ? 30 : 0) +
        (specs.some((s) => s.includes("animation")) ? 20 : 0) +
        15
      ));
    case "commercial":
      return Math.min(100, (
        (creator.stats.projectsCompleted > 50 ? 30 : creator.stats.projectsCompleted > 25 ? 20 : 10) +
        (creator.stats.repeatClientRate > 80 ? 30 : 20) +
        (creator.verification.badge === "Studio" ? 25 : 15) +
        15
      ));
    case "artistic":
      return Math.min(100, (
        (bio.includes("art") || bio.includes("aesthetic") || bio.includes("visual") ? 30 : 0) +
        (specs.some((s) => s.includes("animation") || s.includes("motion")) ? 25 : 0) +
        (tools.some((t) => ["midjourney", "stable diffusion", "comfyui"].includes(t)) ? 25 : 0) +
        20
      ));
    default: return 50;
  }
}

function AnimatedRadarChart({ scores }: { scores: Record<string, number> }) {
  const [progress, setProgress] = useState(0);
  const size = 220;
  const center = size / 2;
  const radius = 78;
  const n = AXES.length;

  useEffect(() => {
    // Animate the radar polygon drawing in
    let start: number | null = null;
    const duration = 1200;
    function step(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const p = Math.min(elapsed / duration, 1);
      // ease-out cubic
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(step);
    }
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const getPoint = (i: number, r: number) => {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const scorePoints = AXES.map((axis, i) => {
    const animatedScore = (scores[axis.key] / 100) * progress;
    return getPoint(i, radius * animatedScore);
  });

  const fullScorePoints = AXES.map((axis, i) => {
    return getPoint(i, radius * (scores[axis.key] / 100));
  });

  const polygonPoints = scorePoints.map((p) => `${p.x},${p.y}`).join(" ");
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow effect behind the chart */}
      <div
        className="absolute rounded-full blur-2xl opacity-30"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(6,182,212,0.3) 50%, transparent 100%)",
        }}
      />

      <svg width={size} height={size} className="relative z-10">
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
          </radialGradient>
          <filter id="radarGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid rings */}
        {gridLevels.map((level) => {
          const pts = AXES.map((_, i) => {
            const p = getPoint(i, radius * level);
            return `${p.x},${p.y}`;
          }).join(" ");
          return (
            <polygon
              key={level}
              points={pts}
              fill="none"
              stroke={level === 1.0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}
              strokeWidth={level === 1.0 ? "1.5" : "1"}
            />
          );
        })}

        {/* Axis lines */}
        {AXES.map((axis, i) => {
          const outer = getPoint(i, radius);
          const dot = getPoint(i, radius * (scores[axis.key] / 100));
          return (
            <g key={axis.key}>
              <line
                x1={center} y1={center}
                x2={outer.x} y2={outer.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              {/* Animated outer tick dot */}
              <motion.circle
                cx={dot.x}
                cy={dot.y}
                r="3"
                fill={axis.color}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: progress, scale: progress }}
              />
            </g>
          );
        })}

        {/* Filled score polygon */}
        <polygon
          points={polygonPoints}
          fill="url(#radarFill)"
          stroke="rgba(139,92,246,0.8)"
          strokeWidth="1.5"
          filter="url(#radarGlow)"
        />

        {/* Glowing score polygon outline */}
        <polygon
          points={AXES.map((axis, i) => {
            const s = (scores[axis.key] / 100) * progress;
            const p = getPoint(i, radius * s);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(139,92,246,0.9)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Axis labels with scores */}
        {AXES.map((axis, i) => {
          const labelPoint = getPoint(i, radius + 20);
          const score = scores[axis.key];
          return (
            <g key={axis.key}>
              <text
                x={labelPoint.x}
                y={labelPoint.y - 5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fill="rgba(255,255,255,0.55)"
                fontWeight="600"
              >
                {axis.label}
              </text>
              <text
                x={labelPoint.x}
                y={labelPoint.y + 7}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fill={axis.color}
                fontWeight="700"
              >
                {Math.round(score * progress)}
              </text>
            </g>
          );
        })}

        {/* Center dot */}
        <circle cx={center} cy={center} r="3" fill="rgba(139,92,246,0.8)" />
      </svg>
    </div>
  );
}

export function StyleDNA({ creator }: { creator: CreatorProfile }) {
  const scores: Record<string, number> = {};
  AXES.forEach((axis) => { scores[axis.key] = getStyleScore(creator, axis.key); });

  const sorted = [...AXES].sort((a, b) => scores[b.key] - scores[a.key]);
  const dominant = sorted[0];
  const top3 = sorted.slice(0, 3);

  return (
    <div className="glass rounded-2xl border border-white/5 p-5">
      <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
        <span className="text-lg">🧬</span> Style DNA
      </h3>
      <p className="text-xs text-muted-foreground mb-4">AI-computed creative profile</p>

      <AnimatedRadarChart scores={scores} />

      {/* Dominant style badge */}
      <div className="mt-4 text-center">
        <div className="text-xs text-muted-foreground mb-1.5">Dominant Style</div>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border"
          style={{
            background: `${dominant.color}20`,
            borderColor: `${dominant.color}40`,
            color: dominant.color,
          }}
        >
          {dominant.label}
        </div>
      </div>

      {/* Top 3 bars */}
      <div className="mt-5 space-y-2.5">
        {top3.map((axis, idx) => (
          <div key={axis.key} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-24 flex-shrink-0">{axis.label}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: axis.color }}
                initial={{ width: 0 }}
                animate={{ width: `${scores[axis.key]}%` }}
                transition={{ duration: 0.8, delay: 0.3 + idx * 0.1, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs w-7 text-right flex-shrink-0" style={{ color: axis.color }}>
              {scores[axis.key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
