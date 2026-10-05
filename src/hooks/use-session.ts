import { useSyncExternalStore } from "react";
import { subscribe } from "@/services/store";
import { getCurrentUser } from "@/services/auth";
import { getChildProfile, getFavorites } from "@/services/profile";

const none = () => null;
const empty: string[] = [];

export function useUser() {
  return useSyncExternalStore(subscribe, getCurrentUser, none);
}
export function useChild() {
  return useSyncExternalStore(subscribe, getChildProfile, none);
}
export function useFavorites() {
  return useSyncExternalStore(subscribe, getFavorites, () => empty);
}
