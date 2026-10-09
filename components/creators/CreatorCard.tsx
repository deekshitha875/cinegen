"use client";
import Link from "next/link";
import { Star, MapPin, Clock, CheckCircle } from "lucide-react";
import { CreatorProfile } from "@/types";
import { motion } from "framer-motion";

const BADGE_STYLES: Record<string, string> = {
  Studio: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  Verified: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  Rising: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  Unverified: "bg-white/10 text-white/60 border border-white/10",
};

const AVAIL_STYLES: Record<string, string> = {
  Available: "text-green-400",
  Limited: "text-amber-400",
  Booked: "text-red-400",
};

export function CreatorCard({ creator, index = 0 }: { creator: CreatorProfile; index?: number }) {
  const featured = creator.portfolio[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link href={`/creators/${creator.id}`}>
        <div className="glass rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all group hover:-translate-y-1 cursor-pointer overflow-hidden h-full">
          {/* Cover / Portfolio Preview */}
          <div className="relative h-40 overflow-hidden bg-gradient-to-br from-violet-900/40 to-cyan-900/20">
            {featured && (
              <img
                src={featured.thumbnailUrl}
                alt={featured.title}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Badge */}
            <div className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_STYLES[creator.verification.badge]}`}>
              {creator.verification.badge === "Studio" && "★ "}
              {creator.verification.badge}
            </div>

            {/* Availability */}
            <div className={`absolute bottom-3 left-3 text-xs font-medium ${AVAIL_STYLES[creator.availability]}`}>
              ● {creator.availability}
            </div>

            {/* Mini portfolio strip */}
            {creator.portfolio.length > 1 && (
              <div className="absolute bottom-3 right-3 flex gap-1">
                {creator.portfolio.slice(1, 3).map((p) => (
                  <img
                    key={p.id}
                    src={p.thumbnailUrl}
                    alt=""
                    className="w-8 h-8 rounded object-cover border border-white/20"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-4">
            {/* Avatar + name */}
            <div className="flex items-start gap-3 -mt-8 mb-3 relative z-10">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="w-14 h-14 rounded-xl border-2 border-background object-cover shadow-xl"
              />
              <div className="pt-5">
                <div className="font-semibold text-sm leading-tight">{creator.name}</div>
                <div className="text-xs text-muted-foreground">{creator.handle}</div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{creator.headline}</p>

            {/* Specializations */}
            <div className="flex flex-wrap gap-1 mb-3">
              {creator.specializations.slice(0, 2).map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 bg-violet-500/10 text-violet-300 rounded-full border border-violet-500/20">
                  {s}
                </span>
              ))}
            </div>

            {/* Tools */}
            <div className="flex flex-wrap gap-1 mb-4">
              {creator.verifiedTools.slice(0, 4).map((t) => (
                <span key={t.name} className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 bg-white/5 rounded text-muted-foreground">
                  {t.verified && <CheckCircle className="w-2.5 h-2.5 text-green-400" />}
                  {t.name}
                </span>
              ))}
              {creator.verifiedTools.length > 4 && (
                <span className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-muted-foreground">+{creator.verifiedTools.length - 4}</span>
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between text-xs border-t border-white/5 pt-3">
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Star className="w-3 h-3 fill-amber-400" />
                {creator.stats.avgRating}
                <span className="text-muted-foreground font-normal">({creator.stats.projectsCompleted})</span>
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {creator.location.split(",")[0]}
              </span>
              <span className="text-foreground font-semibold">
                ${creator.hourlyRateUsd}<span className="text-muted-foreground font-normal">/hr</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
