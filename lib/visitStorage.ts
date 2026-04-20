import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "visitedPlaces";

/**
 * Exempel:
 * {
 *   "ales-stenar": "2026-04-09"
 * }
 */
export async function getVisitedPlaces(): Promise<Record<string, string>> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

export async function markVisited(platsId: string): Promise<string> {
  const visits = await getVisitedPlaces();
  const today = new Date().toISOString().split("T")[0];
  visits[platsId] = today;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  return today;
}

export async function unmarkVisited(platsId: string) {
  const visits = await getVisitedPlaces();
  delete visits[platsId];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
}