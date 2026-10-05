import type { Category, Location, Material } from "@/types/activity";

export const CATEGORY_LABEL: Record<Category, string> = {
  crear: "Crear",
  moverse: "Moverse",
  aprender: "Aprender",
  tranquilo: "Algo tranquilo",
  juntos: "Hacer juntos",
  solo: "Jugar solo",
};

export const LOCATION_LABEL: Record<Location, string> = {
  casa: "En casa",
  afuera: "Afuera",
  cualquier: "Donde sea",
};

export const MATERIAL_LABEL: Record<Material, string> = {
  papel: "Papel",
  colores: "Colores",
  carton: "Cartón",
  plastilina: "Plastilina",
  cinta: "Cinta",
  nada: "Nada especial",
};

export const AGES = [2, 3, 4, 5] as const;
export const DURATIONS = [5, 15, 30] as const;
