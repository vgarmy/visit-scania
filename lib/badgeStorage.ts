// lib/badgeStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { BadgeId } from "./badgeDefinitions";

const KEY = "badges_unlocked_v1";

export type UnlockedBadges = Partial<Record<BadgeId, string>>;

export async function getUnlockedBadges(): Promise<UnlockedBadges> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function unlockBadge(badgeId: BadgeId): Promise<boolean> {
  const badges = await getUnlockedBadges();
  if (badges[badgeId]) return false;
  badges[badgeId] = new Date().toISOString();
  await AsyncStorage.setItem(KEY, JSON.stringify(badges));
  return true;
}

// ✅ lägg till detta:
export async function clearUnlockedBadges(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}