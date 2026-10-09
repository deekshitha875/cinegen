"use client";
import { useState, useEffect, useCallback } from "react";
import { Brief } from "@/types";
import { storage } from "@/lib/storage";
import { seedBriefs } from "@/lib/seed/briefs";

const KEY = "cinegen_briefs";

export function useBriefs() {
  const [userBriefs, setUserBriefs] = useState<Brief[]>([]);

  useEffect(() => {
    const stored = storage.read<Brief[]>(KEY) ?? [];
    setUserBriefs(stored);
  }, []);

  const allBriefs = [...seedBriefs, ...userBriefs];

  const saveBrief = useCallback((brief: Brief) => {
    setUserBriefs((prev) => {
      const exists = prev.findIndex((b) => b.id === brief.id);
      const updated = exists >= 0 ? prev.map((b) => (b.id === brief.id ? brief : b)) : [...prev, brief];
      storage.write(KEY, updated);
      return updated;
    });
  }, []);

  const getBrief = useCallback((id: string) => allBriefs.find((b) => b.id === id), [allBriefs]);

  return { briefs: allBriefs, saveBrief, getBrief };
}
