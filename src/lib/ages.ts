import type { Age } from "@/types/activity";

/** Cada edad tiene su color, su forma y su personaje. */
export const AGES: Age[] = [2, 3, 4, 5];

export const AGE_INFO: Record<Age, { name: string; trait: string; bg: string; soft: string }> = {
  2: { name: "Sol", trait: "Curioso. Para él, todo es nuevo.", bg: "bg-age-2", soft: "bg-age-2-soft" },
  3: { name: "Cubo", trait: "Constructor. Arma, desarma y vuelve a armar.", bg: "bg-age-3", soft: "bg-age-3-soft" },
  4: { name: "Pico", trait: "Aventurero. Nunca se queda quieto.", bg: "bg-age-4", soft: "bg-age-4-soft" },
  5: { name: "Luna", trait: "Soñadora. Se inventa una historia para todo.", bg: "bg-age-5", soft: "bg-age-5-soft" },
};

export function ageInfo(age: number) {
  const a = (Math.min(5, Math.max(2, age)) as Age);
  return AGE_INFO[a];
}
