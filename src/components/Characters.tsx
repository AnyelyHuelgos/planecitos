import type { Age } from "@/types/activity";
import { cn } from "@/lib/utils";

const INK = "#16161D";
const stroke = { fill: "none", stroke: INK, strokeWidth: 7, strokeLinecap: "round" as const };

/** Los personajes de Planecitos: uno por edad. */
export function Character({ age, className, title }: { age: Age; className?: string; title?: string }) {
  const label = title ?? ({ 2: "Sol", 3: "Cubo", 4: "Pico", 5: "Luna" } as const)[age];
  return (
    <svg viewBox="0 0 200 220" className={cn("h-auto", className)} role="img" aria-label={label}>
      {age === 2 && (
        <>
          <path d="M34 100 Q14 86 22 64" {...stroke} />
          <path d="M166 100 Q186 86 178 64" {...stroke} />
          <path d="M86 166 L82 204 M114 166 L118 204 M74 204 L90 204 M110 204 L126 204" {...stroke} />
          <circle cx="100" cy="100" r="72" fill="#FFDB7A" stroke={INK} strokeWidth="6" />
          <circle cx="78" cy="92" r="14" fill="#fff" /><circle cx="81" cy="94" r="7" fill={INK} />
          <circle cx="122" cy="92" r="14" fill="#fff" /><circle cx="125" cy="94" r="7" fill={INK} />
          <circle cx="64" cy="120" r="8" fill="#FFAE94" /><circle cx="136" cy="120" r="8" fill="#FFAE94" />
          <path d="M82 120 Q100 140 118 120" {...stroke} />
        </>
      )}
      {age === 3 && (
        <>
          <path d="M38 98 L12 112" {...stroke} />
          <path d="M162 98 Q186 88 184 62" {...stroke} />
          <path d="M84 162 L82 204 M116 162 L118 204 M72 204 L90 204 M110 204 L128 204" {...stroke} />
          <rect x="36" y="30" width="128" height="134" rx="32" fill="#FFAE94" stroke={INK} strokeWidth="6" />
          <circle cx="78" cy="86" r="14" fill="#fff" /><circle cx="78" cy="89" r="7" fill={INK} />
          <circle cx="122" cy="86" r="14" fill="#fff" /><circle cx="122" cy="89" r="7" fill={INK} />
          <path d="M80 118 L120 118 Q118 138 100 138 Q82 138 80 118 Z" fill={INK} />
        </>
      )}
      {age === 4 && (
        <>
          <path d="M58 120 L22 94" {...stroke} />
          <path d="M142 120 L180 98" {...stroke} />
          <path d="M80 166 L64 204 M120 166 L138 200 M52 204 L68 204 M134 200 L150 196" {...stroke} />
          <path d="M100 26 L170 160 L30 160 Z" fill="#8FDDB8" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <circle cx="84" cy="110" r="12" fill="#fff" /><circle cx="86" cy="108" r="6" fill={INK} />
          <circle cx="116" cy="110" r="12" fill="#fff" /><circle cx="118" cy="108" r="6" fill={INK} />
          <path d="M86 134 Q100 148 114 134" {...stroke} />
        </>
      )}
      {age === 5 && (
        <>
          <path d="M36 140 Q16 130 18 108" {...stroke} />
          <path d="M164 140 Q186 136 190 116" {...stroke} />
          <path d="M84 156 L82 204 M116 156 L118 204 M72 204 L90 204 M110 204 L128 204" {...stroke} />
          <path d="M26 158 A74 74 0 0 1 174 158 Z" fill="#9DBEFF" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M68 118 Q78 108 88 118" {...stroke} />
          <path d="M112 118 Q122 108 132 118" {...stroke} />
          <circle cx="62" cy="136" r="8" fill="#FFDB7A" /><circle cx="138" cy="136" r="8" fill="#FFDB7A" />
          <path d="M88 136 Q100 148 112 136" {...stroke} />
        </>
      )}
    </svg>
  );
}
