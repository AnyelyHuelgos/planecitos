import { useEffect, useSyncExternalStore } from "react";
import { subscribe } from "@/services/store";
import { getCurrentUser, isSessionReady } from "@/services/auth";
import { getChildProfile, getFavorites } from "@/services/profile";
import { getCatalog, loadCatalog } from "@/services/catalog";
import type { Activity } from "@/types/activity";

const none = () => null;
const empty: string[] = [];
const emptyCatalog: Activity[] = [];

export function useUser() {
  return useSyncExternalStore(subscribe, getCurrentUser, none);
}
export function useSessionReady() {
  return useSyncExternalStore(subscribe, isSessionReady, () => false);
}
export function useChild() {
  return useSyncExternalStore(subscribe, getChildProfile, none);
}
export function useFavorites() {
  return useSyncExternalStore(subscribe, getFavorites, () => empty);
}
/** Todas las tarjetas de planecitos (incluye premium bloqueados, sin pasos). */
export function useCatalog() {
  useEffect(() => { void loadCatalog(); }, []);
  return useSyncExternalStore(subscribe, getCatalog, () => emptyCatalog);
}
