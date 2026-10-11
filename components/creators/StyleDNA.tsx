"use client";
import { motion } from "framer-motion";
import { CreatorProfile } from "@/types";

type StyleAxis = {
  label: string;
  key: string;
  color: string;
};

const AXES: StyleAxis[] = [
  { label: "Cinematic", key: "cinematic", color: "#8b5cf6" },
  { label: "Bold", key: "bold", color: "#06b6d4" },
  { label: "Minimal", key: "minimal", color: "#10b981" },
  { label: "Experimental", key: "experimental", color: "#f59e0b" },
  { label: "Commercial", key: "commercial", color: "#ef4444" },
  { label: "Artistic", key: "artistic", color: "#ec4899" },
];

function getStyleScore(creator: CreatorProfile, key: string): number {
  const tools = creator.verifiedTools.map((t) => t.name.toLowerCase());
  const specs = creator.specializations.map((s) => s.toLowerCase());
  const bio = creator.bio.toLowerCase();
  const skills = creator.skills.map((s) => s.toLowerCase());

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

function RadarChart({ scores }: { scores: Record<string, number> }) {
  const size = 160;
  const center = size / 2;
  const radius = 60;
  const n = AXES.length;

  const getPoint = (i: number, r: number) => {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const scorePoints = AXES.map((axis, i) => {
    const score = scores[axis.key] / 100;
    return getPoint(i, radius * score);
  });

  const polygonPoints = scorePoints.map((p) => `${p.x},${p.y}`).join(" ");

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid */}
      {gridLevels.map((level) => {
        const points = AXES.map((_, i) => {
          const p = getPoint(i, radius * level);
          return `${p.x},${p.y}`;
        }).join(" ");
        return <polygon key={level} points={points} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
      })}

      {/* Axis lines */}
      {AXES.map((_, i) => {
        const outer = getPoint(i, radius);
        return <line key={i} x1={center} y1={center} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
      })}

      {/* Score polygon */}
      <polygon points={polygonPoints} fill="rgba(139,92,246,0.2)" stroke="#8b5cf6" strokeWidth="1.5" />

      {/* Score dots */}
      {scorePoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={AXES[i].color} />
      ))}

      {/* Labels */}
      {AXES.map((axis, i) => {
        const labelPoint = getPoint(i, radius + 14);
        return (
          <text key={axis.key} x={labelPoint.x} y={labelPoint.y}
            textAnchor="middle" dominantBaseline="middle"
            className="fill-muted-foreground text-[9px]" fontSize="9" fill="rgba(255,255,255,0.5)">
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}

export function StyleDNA({ creator }: { creator: CreatorProfile }) {
  const scores: Record<string, number> = {};
  AXES.forEach((axis) => {
    scores[axis.key] = getStyleScore(creator, axis.key);
  });

  const dominant = AXES.reduce((a, b) => scores[a.key] > scores[b.key] ? a : b);

  return (
    <div className="glass rounded-2xl border border-white/5 p-5">
      <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
        <span className="text-lg">🧬</span> Style DNA
      </h3>

      <RadarChart scores={scores} />

      <div className="mt-3 text-center">
        <div className="text-xs text-muted-foreground mb-2">Dominant Style</div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-semibold">
          {dominant.label}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {AXES.sort((a, b) => scores[b.key] - scores[a.key]).slice(0, 3).map((axis) => (
          <div key={axis.key} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-20">{axis.label}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: axis.color }}
                initial={{ width: 0 }}
                animate={{ width: `${scores[axis.key]}%` }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right">{scores[axis.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
