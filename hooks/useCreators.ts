"use client";
import { useMemo } from "react";
import { CreatorProfile } from "@/types";
import { seedCreators } from "@/lib/seed/creators";

export function useCreators(): CreatorProfile[] {
  return useMemo(() => seedCreators, []);
}

export function useCreator(id: string): CreatorProfile | undefined {
  return useMemo(() => seedCreators.find((c) => c.id === id), [id]);
}
