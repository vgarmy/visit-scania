
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BADGES } from "../../lib/badgeDefinitions";
import { getUnlockedBadges, type UnlockedBadges } from "../../lib/badgeStorage";
import {
  clearProfilePhotoUri,
  getProfilePhotoUri,
  setProfilePhotoUri,
} from "../../lib/profilePhotoStorage";
import { getCompletedTasks } from "../../lib/taskStorage";
import { getVisitedPlaces } from "../../lib/visitStorage";

import sevardheter from "../data/sevardheter.json";

/* =========================
   helpers
========================= */

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

function hashToPick(str: string, arr: number[]) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

/* =========================
   UI bits (match Home)
========================= */

function TapePair() {
  return (
    <>
      <View
        style={{
          position: "absolute",
          top: -8,
          left: 16,
          width: 72,
          height: 24,
          backgroundColor: "#E7D7A6",
          opacity: 0.65,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "rgba(47,37,27,0.18)",
          zIndex: 10,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: -8,
          right: 30,
          width: 60,
          height: 22,
          backgroundColor: "#E7D7A6",
          opacity: 0.6,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "rgba(47,37,27,0.18)",
          zIndex: 10,
        }}
      />
    </>
  );
}

function PaperCard({
  rotateDeg = 0,
  children,
}: {
  rotateDeg?: number;
  children: React.ReactNode;
}) {
  return (
    <View
      className="rounded-3xl bg-[#FFF9EF] border border-[#2F251B]/30 p-4"
      style={{
        transform: [{ rotate: `${rotateDeg}deg` }],
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
      }}
    >
      {children}
    </View>
  );
}

function RipEdge() {
  return <View className="mt-3 h-[6px] bg-[#2F251B]/5" />;
}

function Stamp({ text, tone }: { text: string; tone: "green" | "dark" }) {
  const bg = tone === "green" ? "rgba(46,111,100,0.12)" : "rgba(47,37,27,0.10)";
  const border = tone === "green" ? "#2E6F64" : "#2F251B";
  const color = tone === "green" ? "#2E6F64" : "#2F251B";

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: border,
        backgroundColor: bg,
      }}
    >
      <Text style={{ fontSize: 10, fontWeight: "800", letterSpacing: 2, color }}>
        {text}
      </Text>
    </View>
  );
}

function AvatarCircle({
  uri,
  onPress,
  onLongPress,
}: {
  uri: string | null;
  onPress: () => void;
  onLongPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} delayLongPress={450}>
      <View
        className="h-12 w-12 items-center justify-center rounded-full bg-[#FFF9EF]"
        style={{
          borderWidth: 1,
          borderColor: "#2F251B",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
          overflow: "hidden",
        }}
      >
        {uri ? (
          <Image source={{ uri }} style={{ width: 48, height: 48 }} resizeMode="cover" />
        ) : (
          <MaterialIcons name="photo-camera" size={28} color="#2F251B" />
        )}
      </View>
    </Pressable>
  );
}

/* =========================
   screen
========================= */

export default function ProfileScreen() {
  const [visitedCount, setVisitedCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [badges, setBadges] = useState<UnlockedBadges>({});
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const totalPlaces = sevardheter.length;
  const totalTasks = useMemo(
    () => sevardheter.reduce((sum, p) => sum + p.utmaningar.length, 0),
    []
  );

  const load = useCallback(async () => {
    const [visited, completed, unlocked, storedPhoto] = await Promise.all([
      getVisitedPlaces(),
      getCompletedTasks(),
      getUnlockedBadges(),
      getProfilePhotoUri(),
    ]);

    setVisitedCount(Object.keys(visited).length);

    const doneTasks = sevardheter
      .flatMap((p) => p.utmaningar)
      .filter((u) => completed[u.id]).length;

    setCompletedTasksCount(doneTasks);
    setBadges(unlocked);
    setPhotoUri(storedPhoto);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const progressPct =
    totalTasks > 0 ? Math.min((completedTasksCount / totalTasks) * 100, 100) : 0;

  const unlockedCount = useMemo(() => Object.keys(badges).length, [badges]);

  const latestBadge = useMemo(() => {
    const entries = Object.entries(badges)
      .filter(([, iso]) => !!iso)
      .map(([id, iso]) => ({ id, iso: iso! }))
      .sort((a, b) => (a.iso < b.iso ? 1 : -1));

    const top = entries[0];
    if (!top) return null;

    const def = BADGES.find((b) => b.id === top.id);
    if (!def) return null;

    return { ...def, iso: top.iso };
  }, [badges]);

  /** ✅ KAMERA-ONLY: ta en bild och sätt som profilbild */
  const takeProfilePhoto = useCallback(async () => {
    // Be om kamera-permission
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Tillåt kamera", "Appen behöver kameratillåtelse för att ta en profilbild.");
      return;
    }

    // Vissa env (t.ex. simulator) saknar kamera
    const hasCam = await ImagePicker.getCameraPermissionsAsync();
    if (!hasCam.granted) {
      Alert.alert("Ingen kamera", "Kunde inte komma åt kameran på den här enheten.");
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (res.canceled) return;

    const uri = res.assets?.[0]?.uri;
    if (!uri) return;

    await setProfilePhotoUri(uri);
    setPhotoUri(uri);
  }, []);

  const confirmRemovePhoto = useCallback(() => {
    if (!photoUri) {
      Alert.alert("Ingen bild", "Du har ingen profilbild att ta bort.");
      return;
    }

    Alert.alert(
      "Ta bort profilbild?",
      "Profilbilden tas bort från appen (inte från din telefon).",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Ta bort",
          style: "destructive",
          onPress: async () => {
            await clearProfilePhotoUri();
            setPhotoUri(null);
          },
        },
      ]
    );
  }, [photoUri]);

  const rotA = -2;
  const rotB = 2;
  const rotC = -1;

  return (
    <SafeAreaView className="flex-1 bg-[#2A221A]" edges={["top"]}>
      <ScrollView className="flex-1 bg-[#6B4E2E] px-4 pt-8">
        {/* Header note */}
        <View
          className="mb-5 rounded-3xl bg-[#F7F0E4] border border-[#2F251B]/35 px-4 py-4"
          style={{ transform: [{ rotate: "2deg" }] }}
        >
          <View className="absolute -top-5 right-4">
            <AvatarCircle
              uri={photoUri}
              onPress={takeProfilePhoto}       // ✅ tryck = kamera
              onLongPress={confirmRemovePhoto} // ✅ långtryck = ta bort
            />
          </View>

          <Text className="text-3xl font-extrabold text-[#1E1A16] text-center">
            Din Profil
          </Text>
          <Text className="mt-1 text-sm text-[#3A2F25] text-center">
            Här kan du följa dina framsteg
          </Text>
          <View className="mt-2 h-[2px] bg-[#3A2F25]/25 rounded-full" />
        </View>

        {/* Quick stats */}
        <View className="mb-5 flex-row gap-3">
          <View
            className="flex-1 rounded-2xl bg-[#FFF9EF] border border-[#2F251B]/30 p-4 items-center"
            style={{
              transform: [{ rotate: `${rotA}deg` }],
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
              elevation: 2,
            }}
          >
            <MaterialIcons name="place" size={22} color="#2F251B" />
            <Text className="mt-1 text-xs text-[#4A3E34]">Besökta</Text>
            <Text className="text-xl font-bold text-[#1E1A16]">
              {visitedCount}/{totalPlaces}
            </Text>
          </View>

          <View
            className="flex-1 rounded-2xl bg-[#FFF9EF] border border-[#2F251B]/30 p-4 items-center"
            style={{
              transform: [{ rotate: `${rotB}deg` }],
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
              elevation: 2,
            }}
          >
            <MaterialIcons name="task-alt" size={22} color="#2F251B" />
            <Text className="mt-1 text-xs text-[#4A3E34]">Utmaningar</Text>
            <Text className="text-xl font-bold text-[#1E1A16]">
              {completedTasksCount}/{totalTasks}
            </Text>
          </View>

          <View
            className="flex-1 rounded-2xl bg-[#FFF9EF] border border-[#2F251B]/30 p-4 items-center"
            style={{
              transform: [{ rotate: `${rotC}deg` }],
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
              elevation: 2,
            }}
          >
            <MaterialIcons name="military-tech" size={22} color="#2F251B" />
            <Text className="mt-1 text-xs text-[#4A3E34]">Badges</Text>
            <Text className="text-xl font-bold text-[#1E1A16]">
              {unlockedCount}/{BADGES.length}
            </Text>
          </View>
        </View>

        {/* Progress */}
        <View className="mb-6">
          <PaperCard rotateDeg={-1}>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-[#4A3E34]">Total progress</Text>
              <Text className="text-sm font-bold text-[#1E1A16]">
                {Math.round(progressPct)}%
              </Text>
            </View>

            <View className="mt-2 h-3 rounded-full bg-[#2F251B]/20 overflow-hidden">
              <View style={{ width: `${progressPct}%` }} className="h-full bg-[#2E6F64]" />
            </View>

            <RipEdge />
          </PaperCard>
        </View>

        {/* Latest badge */}
        {latestBadge && (
          <View className="mb-6">
            <Text className="mb-3 text-xl font-semibold text-[#1E1A16]">
              Senast upplåst
            </Text>

            <View
              className="rounded-[28px] bg-[#2F251B]/40 p-[2px]"
              style={{
                transform: [{ rotate: "2deg" }],
                shadowColor: "#000",
                shadowOpacity: 0.22,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              }}
            >
              <View className="rounded-[26px] bg-[#FFF9EF] border border-[#2F251B]/25 overflow-hidden">
                <TapePair />

                <View className="p-5 flex-row items-center">
                  <View className="mr-4">
                    <View
                      className="h-12 w-12 items-center justify-center rounded-full bg-[#FFF9EF]"
                      style={{
                        borderWidth: 1,
                        borderColor: "#2F251B",
                        shadowColor: "#000",
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 3,
                      }}
                    >
                      <MaterialIcons name="star" size={30} color="#D9A441" />
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="text-2xl font-extrabold text-[#1E1A16]">
                      {latestBadge.icon} {latestBadge.title}
                    </Text>
                    <Text className="mt-1 text-sm text-[#4A3E34]">
                      {latestBadge.description}
                    </Text>
                    <Text className="mt-1 text-[12px] text-[#4A3E34]/80">
                      Vunnen: {formatDate(latestBadge.iso)}
                    </Text>

                    <View className="mt-3 self-start">
                      <Stamp text="UNLOCKED" tone="green" />
                    </View>
                  </View>
                </View>

                <View className="h-[8px] bg-[#2F251B]/6" />
              </View>
            </View>
          </View>
        )}

        {/* Badges list */}
        <View className="mb-10">
          <Text className="mb-3 text-xl font-semibold text-[#1E1A16]">
            Alla utmärkelser
          </Text>

          <PaperCard rotateDeg={0}>
            <TapePair />

            <Text className="text-sm text-[#4A3E34]">
              Låses upp via Besök och Utmaningar
            </Text>

            <View className="mt-4 space-y-3">
              {BADGES.map((b) => {
                const unlockedIso = badges[b.id];
                const isUnlocked = !!unlockedIso;
                const deg = hashToPick(b.id, [-2, -1, 0, 1, 2]);

                return (
                  <View
                    key={b.id}
                    className={`rounded-2xl border px-4 py-3 flex-row items-center ${
                      isUnlocked
                        ? "bg-white border-[#2F251B]/25"
                        : "bg-[#2F251B]/5 border-[#2F251B]/15"
                    }`}
                    style={{
                      transform: [{ rotate: `${deg}deg` }],
                      shadowColor: "#000",
                      shadowOpacity: isUnlocked ? 0.12 : 0.06,
                      shadowRadius: 4,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: isUnlocked ? 2 : 1,
                    }}
                  >
                    <Text className={`text-2xl mr-3 ${isUnlocked ? "" : "opacity-40"}`}>
                      {b.icon}
                    </Text>

                    <View className="flex-1">
                      <Text
                        className={`text-[14px] font-extrabold ${
                          isUnlocked ? "text-[#1E1A16]" : "text-[#1E1A16]/45"
                        }`}
                      >
                        {b.title}
                      </Text>
                      <Text
                        className={`text-[12px] ${
                          isUnlocked ? "text-[#4A3E34]" : "text-[#4A3E34]/45"
                        }`}
                      >
                        {b.description}
                      </Text>

                      {isUnlocked && (
                        <Text className="mt-1 text-[11px] text-[#4A3E34]/80">
                          Vunnen: {formatDate(unlockedIso)}
                        </Text>
                      )}
                    </View>

                    <View className="ml-2">
                      {isUnlocked ? (
                        <Stamp text="UPPLÅST" tone="green" />
                      ) : (
                        <Stamp text="LÅST" tone="dark" />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            <RipEdge />
          </PaperCard>

          <Text className="mt-3 text-center text-[11px] text-[#F7F0E4]/80">
            Tips: Långtryck på profilbilden för att ta bort den.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
