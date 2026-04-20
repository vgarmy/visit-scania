import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";

import { Image, Pressable, ScrollView, Text, View } from "react-native";

import { getCompletedTasks } from "../../lib/taskStorage";
import { getVisitedPlaces } from "../../lib/visitStorage";
import sevardheter from "../data/sevardheter.json";

export default function SevardheterScreen() {
  const router = useRouter();

  const [visited, setVisited] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});


  useFocusEffect(
    useCallback(() => {
      getVisitedPlaces().then(setVisited);
      getCompletedTasks().then(setCompleted);
    }, [])
  );


  return (
    <ScrollView className="flex-1 bg-[#F6F2EA] p-2">
      <Text className="mt-2 text-base text-neutral-700 text-center">
        Utforska populära sevärdheter runt om i Skåne.
      </Text>

      <View className="mt-6 gap-2">
        {sevardheter.map((plats) => {
          const platsId = plats.id;

          /* ✅ BESÖK */
          const isVisited = !!visited[platsId];

          /* ✅ TASK‑PROGRESS */
          const totalTasks = plats.utmaningar.length;
          const completedTasksCount = plats.utmaningar.filter(
            (u) => completed[u.id]
          ).length;

          return (
            <Pressable
              key={platsId}
              onPress={() =>
                router.push({
                  pathname: "/sevardheter/[id]",
                  params: { id: platsId },
                })
              }
              className="flex-row items-center rounded-xl border border-neutral-300 bg-[#FDFCF9] px-2 py-2"
            >
              {/* Bild */}
              <Image
                source={{ uri: plats.bild }}
                style={{ width: 40, height: 40 }}
                className="rounded-lg"
                resizeMode="cover"
              />

              {/* Text */}
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-neutral-900">
                  {plats.namn}
                </Text>

                <Text className="text-sm text-neutral-600">
                  {plats.adress}
                </Text>
              </View>

              {/* STATUS */}
              <View className="items-end ml-2">
                {/* Hus */}
                <Text className="text-lg">
                  {isVisited ? "🏠" : "⌂"}
                </Text>

                {/* Progress */}
                <Text className="text-xs text-neutral-600">
                  {completedTasksCount}/{totalTasks}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}