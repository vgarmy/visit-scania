// lib/profilePhotoStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "profile_photo_v1";

export async function getProfilePhotoUri(): Promise<string | null> {
  const uri = await AsyncStorage.getItem(KEY);
  return uri ?? null;
}

/**
 * Spara profilbild (uri)
 */
export async function setProfilePhotoUri(uri: string): Promise<void> {
  await AsyncStorage.setItem(KEY, uri);
}

/**
 * Ta bort sparad profilbild
 */
export async function clearProfilePhotoUri(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}