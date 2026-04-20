import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import { getCompletedTasks, toggleTask } from "../../../lib/taskStorage";
import {
  getVisitedPlaces,
  markVisited,
  unmarkVisited,
} from "../../../lib/visitStorage";
import sevardheter from "../../data/sevardheter.json";

export default function SevardhetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const plats = sevardheter.find((p) => p.id === id);

  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [visited, setVisited] = useState<Record<string, string>>({});

  useEffect(() => {
    getCompletedTasks().then(setCompleted);
    getVisitedPlaces().then(setVisited);
  }, []);

  /* ✅ TYPE GUARD */
  if (!plats) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Sevärdighet hittades inte</Text>
      </View>
    );
  }

  /* ✅ EFTER HÄR ÄR plats GARANTERAT DEFINIERAD */
  const platsId = plats.id;
  const visitDate = visited[platsId];

  async function onToggle(taskId: string) {
    const newState = await toggleTask(taskId);
    setCompleted((prev) => ({
      ...prev,
      [taskId]: newState,
    }));
  }

  async function toggleVisited() {
    if (visitDate) {
      await unmarkVisited(platsId);
      setVisited((prev) => {
        const copy = { ...prev };
        delete copy[platsId];
        return copy;
      });
    } else {
      const date = await markVisited(platsId);
      setVisited((prev) => ({
        ...prev,
        [platsId]: date,
      }));
    }
  }

  return (
    <ScrollView className="flex-1 bg-[#F6F2EA]">
      <Image
        source={{ uri: plats.bild }}
        style={{ width: "100%", height: 220 }}
        resizeMode="cover"
      />

      <View className="p-5">
        <Text className="text-3xl font-bold text-neutral-900">
          {plats.namn}
        </Text>

        <Text className="mt-1 text-sm text-neutral-600">
          {plats.adress}
        </Text>

        <Text className="mt-4 text-base text-neutral-700">
          {plats.intro}
        </Text>

        {/* ===== BESÖKT ===== */}
        <Text className="mt-6 text-xl font-semibold text-neutral-900">
          Besök
        </Text>

        <Pressable
          onPress={toggleVisited}
          className={`mt-3 rounded-xl border px-4 py-3 flex-row items-center
            ${
              visitDate
                ? "bg-blue-50 border-blue-400"
                : "bg-white border-neutral-300"
            }
          `}
        >
          <Text className="text-2xl mr-3">
            {visitDate ? "🏠" : "⌂"}
          </Text>

          <Text className="flex-1 text-neutral-800">
            {visitDate ? `Besökt ${visitDate}` : "Inte besökt"}
          </Text>
        </Pressable>

        {/* ===== UTMANINGAR ===== */}
        <Text className="mt-8 text-xl font-semibold text-neutral-900">
          Utmaningar
        </Text>

        <View className="mt-3 space-y-2">
          {plats.utmaningar.map((u) => {
            const done = completed[u.id];

            return (
              <Pressable
                key={u.id}
                onPress={() => onToggle(u.id)}
                className={`rounded-xl border px-4 py-3 flex-row items-center
                  ${
                    done
                      ? "bg-green-50 border-green-400"
                      : "bg-white border-neutral-300"
                  }
                `}
              >
                <Text className="text-2xl mr-3">
                  {done ? "⭐" : "☆"}
                </Text>

                <Text
                  className={`flex-1 ${
                    done
                      ? "text-green-800 line-through"
                      : "text-neutral-800"
                  }`}
                >
                  {u.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}