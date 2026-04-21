import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getCompletedTasks } from "../../lib/taskStorage";
import { getVisitedPlaces } from "../../lib/visitStorage";
import sevardheter from "../data/sevardheter.json";

// ✅ DEV: Lägg in ALLA keys du vill rensa här.
// OBS: byt "visitedPlaces" och "completedTasks" om din visitStorage/taskStorage använder andra KEYs.
// Badges-keyn är korrekt från din lib/badgeStorage.ts: "badges_unlocked_v1"
// Profilbild-keyn är korrekt från din lib/profilePhotoStorage.ts: "profile_photo_v1"
const DEV_STORAGE_KEYS = [
  "visitedPlaces",       // ⚠️ byt om din visitStorage använder annan KEY
  "completedTasks",      // ⚠️ byt om din taskStorage använder annan KEY
  "badges_unlocked_v1",  // ✅ badges
  "profile_photo_v1",    // ✅ profilbild
];

export default function HomeScreen() {
  const router = useRouter();

  const [suggested, setSuggested] = useState<(typeof sevardheter)[number] | null>(null);
  const [visitedCount, setVisitedCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);

  const totalPlaces = sevardheter.length;
  const totalTasks = sevardheter.reduce((sum, p) => sum + p.utmaningar.length, 0);

  const load = useCallback(async () => {
    const visited = await getVisitedPlaces();
    const completed = await getCompletedTasks();

    setVisitedCount(Object.keys(visited).length);

    const doneTasks = sevardheter
      .flatMap((p) => p.utmaningar)
      .filter((u) => completed[u.id]).length;

    setCompletedTasksCount(doneTasks);

    const notVisited = sevardheter.filter((p) => !visited[p.id]);
    setSuggested(
      notVisited.length ? notVisited[Math.floor(Math.random() * notVisited.length)] : null
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const progressPct =
    totalTasks > 0 ? Math.min((completedTasksCount / totalTasks) * 100, 100) : 0;

  // ✅ DEV reset: rensa keys + reload
  const devResetEverything = useCallback(async () => {
    try {
      // Rensa explicit de keys vi vet att appen använder
      await AsyncStorage.multiRemove(DEV_STORAGE_KEYS);

      // Om du vill vara 100% brutal (allt i AsyncStorage), slå på den här också:
      // await AsyncStorage.clear();

      await load(); // uppdatera UI direkt
      Alert.alert("Klart!", "Besök, utmaningar, badges och profilbild är rensade.");
    } catch (e) {
      console.error(e);
      Alert.alert("Fel", "Kunde inte rensa local storage.");
    }
  }, [load]);

  const confirmDevReset = useCallback(() => {
    Alert.alert(
      "DEV: Rensa all appdata?",
      "Tar bort besök, utmaningar, badges och profilbild. Kan inte ångras.",
      [
        { text: "Avbryt", style: "cancel" },
        { text: "Rensa", style: "destructive", onPress: devResetEverything },
      ]
    );
  }, [devResetEverything]);

  return (
    <SafeAreaView className="flex-1 bg-[#2A221A]" edges={["top"]}>
      <ScrollView className="flex-1 bg-[#6B4E2E] px-4 pt-8">
        {/* Header note – mer wow + nivå/stjärna */}
        <View
          className="mb-5 rounded-3xl bg-[#F7F0E4] border border-[#2F251B]/35 px-4 py-4"
          style={{ transform: [{ rotate: "2deg" }] }}
        >
          <View className="absolute -top-5 right-4">
            {/* Nivå/Badge */}
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

          <Text className="text-3xl font-extrabold text-[#1E1A16] text-center">
            Museer i Skåne
          </Text>
          <Text className="mt-1 text-sm text-[#3A2F25] text-center">
            Upptäck. Samla. Lås upp ⭐
          </Text>
          <View className="mt-2 h-[2px] bg-[#3A2F25]/25 rounded-full" />
        </View>

        {/* Quick stats – mer kaos */}
        <View className="mb-5 flex-row gap-3">
          <View
            className="flex-1 rounded-2xl bg-[#FFF9EF] border border-[#2F251B]/30 p-4 items-center"
            style={{
              transform: [{ rotate: "-2deg" }],
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
              transform: [{ rotate: "2deg" }],
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
        </View>

        {/* Progress – mer material */}
        <View
          className="mb-6 rounded-3xl bg-[#FFF9EF] border border-[#2F251B]/30 p-4"
          style={{
            transform: [{ rotate: "-1deg" }],
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-[#4A3E34]">Total progress</Text>
            <Text className="text-sm font-bold text-[#1E1A16]">
              {Math.round(progressPct)}%
            </Text>
          </View>

          <View className="mt-2 h-3 rounded-full bg-[#2F251B]/20 overflow-hidden">
            <View style={{ width: `${progressPct}%` }} className="h-full bg-[#2E6F64]" />
          </View>

          {/* Rivet edge */}
          <View className="mt-3 h-[6px] bg-[#2F251B]/5" />
        </View>

        {/* Suggested card – hero större + mer fokus */}
        {suggested && (
          <View className="mb-10">
            <Text className="mb-3 text-xl font-semibold text-[#1E1A16]">
              Förslag till nästa besök
            </Text>

            <Pressable
              onPress={() =>
                router.push({ pathname: "/sevardheter/[id]", params: { id: suggested.id } })
              }
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
                {/* Tape accents – 2 lägen */}
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

                <Image
                  source={{ uri: suggested.bild }}
                  style={{ width: "100%", height: 210 }}
                  resizeMode="cover"
                />

                <View className="p-5">
                  <Text className="text-2xl font-extrabold text-[#1E1A16]">
                    {suggested.namn}
                  </Text>
                  <Text className="mt-1 text-sm text-[#4A3E34]">
                    {suggested.adress}
                  </Text>
                </View>

                {/* Rivet kant */}
                <View className="h-[8px] bg-[#2F251B]/6" />
              </View>
            </Pressable>
          </View>
        )}

        {/* ✅ DEV reset längst ner */}
        <View className="pb-10">
          <Pressable
            onPress={confirmDevReset}
            className="mt-4 w-full flex-row items-center justify-center rounded-2xl bg-[#2F251B]/25 border border-[#2F251B]/30 px-4 py-4"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
              elevation: 2,
            }}
          >
            <MaterialIcons name="delete-forever" size={20} color="#FFF9EF" />
            <Text className="ml-2 text-sm font-extrabold text-[#FFF9EF]">
              DEV: Rensa appdata
            </Text>
          </Pressable>

          <Text className="mt-2 text-center text-[11px] text-[#F7F0E4]/80">
            Bara för utveckling – rensar besök, utmaningar, badges och profilbild.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}