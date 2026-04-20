import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getCompletedTasks } from "../../lib/taskStorage";
import { getVisitedPlaces } from "../../lib/visitStorage";
import sevardheter from "../data/sevardheter.json";

export default function HomeScreen() {
  const router = useRouter();

  const [suggested, setSuggested] = useState<
    (typeof sevardheter)[number] | null
  >(null);

  const [visitedCount, setVisitedCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);

  const totalPlaces = sevardheter.length;
  const totalTasks = sevardheter.reduce(
    (sum, plats) => sum + plats.utmaningar.length,
    0
  );

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        const visited = await getVisitedPlaces();
        const completedTasks = await getCompletedTasks();

        const visitedTotal = Object.keys(visited).length;
        setVisitedCount(visitedTotal);

        const doneTasks = sevardheter
          .flatMap((plats) => plats.utmaningar)
          .filter((u) => completedTasks[u.id]).length;

        setCompletedTasksCount(doneTasks);

        // Slumpad ej besökt plats
        const notVisited = sevardheter.filter(
          (plats) => !visited[plats.id]
        );

        if (notVisited.length === 0) {
          setSuggested(null);
        } else {
          const random =
            notVisited[Math.floor(Math.random() * notVisited.length)];
          setSuggested(random);
        }
      }

      loadData();
    }, [])
  );

  /* ===== PROGRESSIV NIVÅLOGIK ===== */

  /* ===== KORREKT PROGRESSIV NIVÅLOGIK ===== */

  const totalPoints = visitedCount + completedTasksCount;

  const BASE_POINTS = 2;
  const MAX_LEVEL = 20;

  /** Hur många poäng krävs för att gå FRÅN nivå n till n+1 */
  function pointsForLevelUp(level: number) {
    return BASE_POINTS + (level - 1);
  }

  /** Räkna ut nuvarande nivå */
  let currentLevel = 1;
  let pointsUsed = 0;

  for (let lvl = 1; lvl <= MAX_LEVEL; lvl++) {
    const cost = pointsForLevelUp(lvl);
    if (totalPoints >= pointsUsed + cost) {
      pointsUsed += cost;
      currentLevel = lvl;
    } else {
      break;
    }
  }

  /** Progress INOM aktuell nivå */
  const pointsIntoLevel = totalPoints - pointsUsed;
  const pointsThisLevel = pointsForLevelUp(currentLevel);

  const progress = Math.min(
    Math.max(pointsIntoLevel / pointsThisLevel, 0),
    1
  );

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const LEVEL_TITLES = [
    "Upptäckare",
    "Nyfiken turist",
    "Äventyrare",
    "Kulturspanare",
    "Museivandrare",
    "Skåne‑utforskare",
    "Historiejägare",
    "Uppdragsmästare",
    "Allvetare",
    "Legend",
  ];

  const currentTitle =
    LEVEL_TITLES[(currentLevel - 1) % LEVEL_TITLES.length];

  const progressColor =
    clampedProgress < 0.33
      ? "#F59E0B"
      : clampedProgress < 0.66
        ? "#10B981"
        : "#3B82F6";

  return (
    <SafeAreaView className="flex-1 bg-[#F6F2EA]" edges={["top"]}>
      <ScrollView className="flex-1 p-5">
        <Text className="text-3xl font-bold text-neutral-900">
          Museer i Skåne
        </Text>

        <Text className="mt-2 text-neutral-700">
          Upptäck museer och sevärdheter med små utmaningar ⭐
        </Text>

        {/* ===== SLUMPAD REKOMMENDATION ===== */}
        {suggested && (
          <View className="mt-6">
            <Text className="mb-2 text-lg font-semibold text-neutral-900">
              Förslag till nästa besök
            </Text>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/sevardheter/[id]",
                  params: { id: suggested.id },
                })
              }
              className="rounded-2xl overflow-hidden bg-white border border-neutral-300"
            >
              <Image
                source={{ uri: suggested.bild }}
                style={{ width: "100%", height: 160 }}
                resizeMode="cover"
              />

              <View className="p-4">
                <Text className="text-xl font-semibold text-neutral-900">
                  {suggested.namn}
                </Text>
                <Text className="mt-1 text-sm text-neutral-600">
                  {suggested.adress}
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* ===== STATISTIK ===== */}
        <View className="mt-6 flex-row gap-3">
          <View className="flex-1 rounded-xl bg-white border border-neutral-300 p-4 items-center justify-center">
            <Text className="text-sm text-neutral-600 text-center">
              Besökta platser
            </Text>
            <Text className="mt-1 text-xl font-bold text-neutral-900 text-center">
              {visitedCount} / {totalPlaces}
            </Text>
          </View>

          <View className="flex-1 rounded-xl bg-white border border-neutral-300 p-4 items-center justify-center">
            <Text className="text-sm text-neutral-600 text-center">
              Klara utmaningar
            </Text>
            <Text className="mt-1 text-xl font-bold text-neutral-900 text-center">
              {completedTasksCount} / {totalTasks}
            </Text>
          </View>
        </View>

        {/* ===== NIVÅ / PROGRESS ===== */}
        <View className="mt-8 rounded-xl bg-white border border-neutral-300 p-4">
          <Text className="text-lg text-neutral-600 text-center">
            Nivå: <Text className="mt-1 text-lg font-bold text-neutral-900 text-center">
           {currentTitle} 
          </Text>
          </Text>



          <View className="mt-4 flex-row items-center">
            <Text className="text-2xl mr-3">🏆</Text>

            <View className="flex-1 h-3 rounded-full bg-neutral-200 overflow-hidden">
              <View
                style={{
                  width: `${clampedProgress * 100}%`,
                  backgroundColor: progressColor,
                }}
                className="h-full rounded-full"
              />
            </View>

            <Text className="ml-3 text-sm text-neutral-600">
              {currentLevel}/{MAX_LEVEL}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}