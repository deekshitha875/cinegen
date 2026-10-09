"use client";

// Beautiful CSS-generated portfolio thumbnails
// Each style tag maps to a specific visual theme
// No external dependencies, instant load, never breaks

const THEME_MAP: Record<string, { bg: string; accent: string; pattern: string; label: string }> = {
  "cinematic": { bg: "from-slate-900 via-zinc-800 to-slate-900", accent: "bg-amber-400/30", pattern: "circles", label: "🎬" },
  "golden-hour": { bg: "from-amber-900 via-orange-800 to-yellow-900", accent: "bg-amber-300/40", pattern: "rays", label: "☀️" },
  "luxury": { bg: "from-zinc-900 via-yellow-900/30 to-zinc-900", accent: "bg-yellow-400/20", pattern: "grid", label: "✦" },
  "sci-fi": { bg: "from-blue-950 via-indigo-900 to-violet-950", accent: "bg-cyan-400/30", pattern: "hexagons", label: "🚀" },
  "neon-dystopia": { bg: "from-violet-950 via-fuchsia-900 to-indigo-950", accent: "bg-fuchsia-400/40", pattern: "lines", label: "⚡" },
  "space": { bg: "from-slate-950 via-blue-950 to-indigo-950", accent: "bg-blue-400/20", pattern: "dots", label: "🌌" },
  "epic": { bg: "from-red-950 via-orange-900 to-amber-950", accent: "bg-orange-400/30", pattern: "burst", label: "⚔️" },
  "nature": { bg: "from-green-900 via-emerald-800 to-teal-900", accent: "bg-green-400/30", pattern: "organic", label: "🌿" },
  "sustainability": { bg: "from-green-900 via-lime-800 to-emerald-900", accent: "bg-lime-400/25", pattern: "leaf", label: "♻️" },
  "documentary": { bg: "from-stone-800 via-zinc-700 to-stone-800", accent: "bg-stone-300/20", pattern: "film", label: "📽️" },
  "emotional": { bg: "from-rose-900 via-pink-800 to-rose-900", accent: "bg-rose-300/30", pattern: "waves", label: "💫" },
  "award-winning": { bg: "from-yellow-900 via-amber-800 to-orange-900", accent: "bg-yellow-300/40", pattern: "stars", label: "🏆" },
  "product-hero": { bg: "from-slate-800 via-gray-700 to-slate-800", accent: "bg-white/20", pattern: "clean", label: "📦" },
  "natural": { bg: "from-green-800 via-teal-700 to-emerald-800", accent: "bg-teal-300/25", pattern: "organic", label: "🌱" },
  "fashion": { bg: "from-rose-900 via-pink-900 to-purple-900", accent: "bg-pink-300/30", pattern: "diagonal", label: "👗" },
  "haute-couture": { bg: "from-neutral-900 via-rose-900/40 to-neutral-900", accent: "bg-rose-300/25", pattern: "luxury", label: "✨" },
  "editorial": { bg: "from-zinc-900 via-neutral-800 to-zinc-900", accent: "bg-neutral-300/20", pattern: "grid", label: "📸" },
  "mascot": { bg: "from-orange-900 via-red-800 to-pink-900", accent: "bg-orange-400/40", pattern: "circles", label: "🎭" },
  "bold-colors": { bg: "from-red-800 via-orange-700 to-yellow-800", accent: "bg-yellow-300/40", pattern: "burst", label: "🎨" },
  "data-viz": { bg: "from-blue-900 via-cyan-800 to-blue-900", accent: "bg-cyan-400/30", pattern: "bars", label: "📊" },
  "fintech": { bg: "from-blue-950 via-indigo-900 to-blue-950", accent: "bg-blue-400/25", pattern: "grid", label: "💳" },
  "brand-anthem": { bg: "from-violet-900 via-purple-800 to-indigo-900", accent: "bg-violet-300/30", pattern: "waves", label: "🎵" },
  "photorealistic": { bg: "from-slate-800 via-zinc-700 to-gray-800", accent: "bg-white/15", pattern: "clean", label: "🖼️" },
  "automotive": { bg: "from-gray-900 via-zinc-800 to-slate-900", accent: "bg-zinc-400/20", pattern: "speed", label: "🚗" },
  "urban": { bg: "from-zinc-900 via-gray-800 to-neutral-900", accent: "bg-gray-300/20", pattern: "grid", label: "🏙️" },
  "sports": { bg: "from-green-900 via-emerald-800 to-teal-900", accent: "bg-green-400/30", pattern: "dynamic", label: "⚽" },
  "hype": { bg: "from-red-900 via-orange-800 to-amber-900", accent: "bg-orange-400/40", pattern: "burst", label: "🔥" },
  "app-demo": { bg: "from-blue-900 via-indigo-800 to-violet-900", accent: "bg-blue-400/25", pattern: "screen", label: "📱" },
  "ui-animation": { bg: "from-indigo-900 via-blue-800 to-cyan-900", accent: "bg-cyan-400/30", pattern: "screen", label: "✨" },
  "architectural": { bg: "from-stone-900 via-zinc-800 to-neutral-900", accent: "bg-stone-300/20", pattern: "geometric", label: "🏛️" },
  "presales": { bg: "from-amber-900 via-yellow-800 to-orange-900", accent: "bg-amber-300/30", pattern: "luxury", label: "🏢" },
  "art-house": { bg: "from-purple-950 via-violet-900 to-indigo-950", accent: "bg-violet-300/35", pattern: "artistic", label: "🎨" },
  "heritage": { bg: "from-amber-950 via-orange-900 to-red-950", accent: "bg-orange-300/30", pattern: "textile", label: "🪔" },
  "gen-z": { bg: "from-pink-900 via-fuchsia-800 to-purple-900", accent: "bg-fuchsia-400/35", pattern: "dynamic", label: "⚡" },
  "viral": { bg: "from-red-900 via-pink-800 to-orange-900", accent: "bg-red-400/35", pattern: "burst", label: "📱" },
  "college": { bg: "from-blue-800 via-indigo-700 to-purple-800", accent: "bg-blue-300/30", pattern: "circles", label: "🎓" },
  "concept-art": { bg: "from-teal-900 via-cyan-800 to-blue-900", accent: "bg-teal-400/30", pattern: "artistic", label: "🖌️" },
  "fantasy": { bg: "from-purple-950 via-indigo-900 to-blue-950", accent: "bg-purple-400/30", pattern: "stars", label: "🔮" },
  "music": { bg: "from-violet-900 via-purple-800 to-fuchsia-900", accent: "bg-violet-400/35", pattern: "waves", label: "🎶" },
  "ethereal": { bg: "from-cyan-950 via-blue-900 to-violet-950", accent: "bg-cyan-300/25", pattern: "organic", label: "🌊" },
  "aurora-borealis": { bg: "from-green-950 via-teal-900 to-blue-950", accent: "bg-teal-300/35", pattern: "aurora", label: "🌌" },
  "dreamlike": { bg: "from-indigo-950 via-purple-900 to-pink-950", accent: "bg-indigo-300/30", pattern: "soft", label: "💭" },
  "streetwear": { bg: "from-zinc-900 via-gray-800 to-stone-900", accent: "bg-zinc-300/20", pattern: "urban", label: "👟" },
  "y2k": { bg: "from-pink-900 via-purple-800 to-blue-900", accent: "bg-pink-400/35", pattern: "retro", label: "✨" },
};

const DEFAULT_THEME = { bg: "from-violet-950 via-indigo-900 to-cyan-950", accent: "bg-violet-400/25", pattern: "default", label: "🎬" };

function getTheme(styleTags: string[]) {
  for (const tag of styleTags) {
    const theme = THEME_MAP[tag.toLowerCase()];
    if (theme) return theme;
  }
  return DEFAULT_THEME;
}

function PatternSVG({ pattern, accent }: { pattern: string; accent: string }) {
  const cls = `absolute inset-0 ${accent} opacity-60`;
  switch (pattern) {
    case "dots":
      return (
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      );
    case "grid":
      return (
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      );
    case "lines":
      return (
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 1px, transparent 1px, transparent 20px)" }} />
      );
    case "waves":
      return (
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200" preserveAspectRatio="none">
          <path d="M0,100 C100,60 200,140 300,100 C350,80 380,120 400,100 L400,200 L0,200Z" fill="rgba(255,255,255,0.15)" />
          <path d="M0,130 C80,100 180,160 280,120 C340,100 380,140 400,120 L400,200 L0,200Z" fill="rgba(255,255,255,0.1)" />
        </svg>
      );
    case "stars":
      return (
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{ top: `${10 + (i * 23) % 80}%`, left: `${5 + (i * 31) % 90}%` }} />
          ))}
        </div>
      );
    case "circles":
      return (
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 400 200">
          <circle cx="350" cy="50" r="80" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <circle cx="350" cy="50" r="120" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <circle cx="50" cy="180" r="60" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </svg>
      );
    case "hexagons":
      return (
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9z'/%3E%3C/svg%3E\")" }} />
      );
    default:
      return (
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)" }} />
      );
  }
}

interface PortfolioThumbProps {
  styleTags: string[];
  title: string;
  contentType: string;
  aspectRatio: string;
  mediaType: string;
  seedLogged?: boolean;
  className?: string;
}

export function PortfolioThumb({ styleTags, title, contentType, aspectRatio, mediaType, seedLogged, className = "" }: PortfolioThumbProps) {
  const theme = getTheme(styleTags);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${theme.bg} ${className}`}>
      {/* Pattern overlay */}
      <PatternSVG pattern={theme.pattern} accent={theme.accent} />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/40" />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="text-4xl">{theme.label}</div>
        <div className="text-white/80 text-xs font-semibold text-center px-4 line-clamp-2 leading-tight">{title}</div>
        <div className="text-white/40 text-xs">{contentType}</div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between px-3 pb-1.5">
        <span className="text-white/60 text-xs font-mono">{aspectRatio}</span>
        <span className="text-white/60 text-xs capitalize">{mediaType}</span>
      </div>

      {/* Seed logged badge */}
      {seedLogged && (
        <div className="absolute top-2 left-2 flex items-center gap-1 text-xs px-1.5 py-0.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full">
          ✓ AI Logged
        </div>
      )}
    </div>
  );
}
