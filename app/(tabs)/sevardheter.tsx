import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import { getCompletedTasks } from "../../lib/taskStorage";
import { getVisitedPlaces } from "../../lib/visitStorage";
import sevardheter from "../data/sevardheter.json";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getProgressColors(pct: number) {
  if (pct >= 100) {
    return { fill: "#76D36A", glow: "rgba(118,211,106,0.25)", label: "#2F6B2A" };
  }
  if (pct >= 85) {
    return { fill: "#2E6F64", glow: "rgba(46,111,100,0.18)", label: "#2E6F64" };
  }
  if (pct >= 60) {
    return { fill: "#D9A441", glow: "rgba(217,164,65,0.18)", label: "#9A6A16" };
  }
  return { fill: "#C85A5A", glow: "rgba(200,90,90,0.18)", label: "#8F2F2F" };
}

export default function SevardheterScreen() {
  const router = useRouter();

  const [visited, setVisited] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // ✅ Stabil lutning (RN-style, inte Tailwind)
  const cardRotations = [-2, -1, 0, 1, 2];

  // ✅ Tejp‑variationer (3 lägen)
  const tapeRotations = [-10, 6, -14];
  const tapeOffsets = [
    { left: 22, right: 30 },
    { left: 34, right: 14 },
    { left: 14, right: 38 },
  ];

  useFocusEffect(
    useCallback(() => {
      getVisitedPlaces().then(setVisited);
      getCompletedTasks().then(setCompleted);
    }, [])
  );

  const introText = useMemo(
    () => "Utforska populära sevärdheter runt om i Skåne.",
    []
  );

  return (
    <View className="flex-1 bg-[#2A221A]">
      <ScrollView className="flex-1 bg-[#6B4E2E] px-3 pt-3">
        <View className="absolute left-0 top-0 right-0 h-24 bg-black/10" />
        <View className="absolute left-0 bottom-0 right-0 h-28 bg-black/10" />

        <View className="mt-1 mb-3 rounded-3xl bg-[#F7F0E4] px-4 py-3 border border-[#2F251B]/25 shadow-sm">
          <Text className="text-center text-base text-[#3A2F25]">
            {introText}
          </Text>
          <View className="mt-2 h-[2px] bg-[#3A2F25]/20 rounded-full" />
        </View>

        <View className="gap-3 pb-6">
          {sevardheter.map((plats, index) => {
            const platsId = plats.id;
            const isVisited = !!visited[platsId];

            const totalTasks = plats.utmaningar.length;
            const completedTasksCount = plats.utmaningar.filter(
              (u) => completed[u.id]
            ).length;

            const progress =
              totalTasks > 0 ? completedTasksCount / totalTasks : 0;

            const safePct = clamp(Math.round(progress * 100), 0, 100);
            const colors = getProgressColors(safePct);

            const cardRotate =
              cardRotations[index % cardRotations.length];
            const tapeIndex = index % 3;

            return (
              <Pressable
                key={platsId}
                onPress={() =>
                  router.push({
                    pathname: "/sevardheter/[id]",
                    params: { id: platsId },
                  })
                }
                style={{ transform: [{ rotate: `${cardRotate}deg` }] }}
                android_ripple={{ color: "rgba(0,0,0,0.08)" }}
              >
                {/* ✅ TEJP – RN STYLE, OPACITY, 3 LÄGEN */}
                <View
                  style={{
                    position: "absolute",
                    top: -8,
                    left: tapeOffsets[tapeIndex].left,
                    width: 64,
                    height: 24,
                    backgroundColor: "#E7D7A6",
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "rgba(47,37,27,0.15)",
                    opacity: 0.65,
                    transform: [
                      { rotate: `${tapeRotations[tapeIndex]}deg` },
                    ],
                    zIndex: 10,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: -8,
                    right: tapeOffsets[tapeIndex].right,
                    width: 56,
                    height: 22,
                    backgroundColor: "#E7D7A6",
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "rgba(47,37,27,0.15)",
                    opacity: 0.6,
                    transform: [
                      { rotate: `${-tapeRotations[tapeIndex]}deg` },
                    ],
                    zIndex: 10,
                  }}
                />

                <View className="rounded-[26px] bg-[#2F251B]/35 p-[2px] shadow-lg">
                  <View className="rounded-[24px] bg-[#FFF9EF] border border-[#2F251B]/15 overflow-hidden">
                    <View className="flex-row items-center px-3 py-3">
                      <View className="rounded-2xl bg-[#2F251B]/20 p-[2px]">
                        <Image
                          source={{ uri: plats.bild }}
                          style={{ width: 56, height: 56 }}
                          className="rounded-2xl"
                          resizeMode="cover"
                        />
                      </View>

                      <View className="ml-3 flex-1">
                        <Text className="text-[14px] font-extrabold text-[#1E1A16]">
                          {plats.namn}
                        </Text>
                        <Text className="mt-0.5 text-[10px] text-[#4A3E34]">
                          {plats.adress}
                        </Text>

                        <View className="mt-2">
                          <View className="h-2.5 rounded-full bg-[#2F251B]/10 overflow-hidden">
                            <View
                              style={{
                                width: `${safePct}%`,
                                backgroundColor: colors.glow,
                                height: "100%",
                                position: "absolute",
                              }}
                            />
                            <View
                              style={{
                                width: `${safePct}%`,
                                backgroundColor: colors.fill,
                                height: "100%",
                              }}
                            />
                          </View>

                          <Text className="mt-1 text-[11px] text-[#4A3E34]">
                            {completedTasksCount}/{totalTasks} •{" "}
                            <Text
                              style={{
                                color: colors.label,
                                fontWeight: "800",
                              }}
                            >
                              {safePct}%
                            </Text>
                          </Text>
                        </View>
                      </View>

                      <View className="items-end ml-2">
                        {/* Ej besökt ELLER BESÖKT (inte båda) */}
                        {!isVisited ? (
                          <View className="rounded-full bg-[#1E1A16] px-2.5 py-1">
                            <Text className="text-[12px] text-[#FFF9EF]">Ej besökt</Text>
                          </View>
                        ) : (
                          <View style={{ transform: [{ rotate: "-10deg" }] }}>
                            <View className="rounded-xl border-2 border-[#B42318] bg-[#FFF9EF]/90 px-3 py-1">
                              <Text className="text-[#B42318] font-extrabold tracking-widest text-[10px]">
                                BESÖKT
                              </Text>
                            </View>
                          </View>
                        )}

                        {/* Rund utmanings‑ring (eller ⭐ när alla klara) */}
                        <View
                          className="mt-2 mr-4 h-11 w-11 items-center justify-center rounded-full bg-[#FFF9EF]"
                        >
                          {completedTasksCount === totalTasks && totalTasks > 0 ? (
                              <View
                                style={{
                                  shadowColor: "#000",
                                  shadowOpacity: 0.35,
                                  shadowRadius: 3,
                                  shadowOffset: { width: 0, height: 2 },
                                  elevation: 4, // Android
                                  transform: [{ rotate: "15deg" }],
                                }}
                              >
                                <FontAwesome name="star" size={28} color="#F4B400" />
                              </View>
                          ) : (
                            <View className="border border-[#2F251B] rounded-full px-2 py-1">
                              <Text className="text-[12px] font-bold text-[#2F251B]">
                                {completedTasksCount}/{totalTasks}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                    </View>

                    <View className="h-[6px] bg-[#2F251B]/5" />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}