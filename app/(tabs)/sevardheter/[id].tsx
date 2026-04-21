import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import { getCompletedTasks, toggleTask } from "../../../lib/taskStorage";
import {
  getVisitedPlaces,
  markVisited,
  unmarkVisited,
} from "../../../lib/visitStorage";

import { BADGES, type BadgeId } from "../../../lib/badgeDefinitions";
import { evaluateBadges } from "../../../lib/badgeEngine";
import sevardheter from "../../data/sevardheter.json";

export default function SevardhetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const plats = sevardheter.find((p) => p.id === id);

  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [visited, setVisited] = useState<Record<string, string>>({});

  // Toast för nya badges
  const [newBadges, setNewBadges] = useState<BadgeId[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getCompletedTasks().then(setCompleted);
    getVisitedPlaces().then(setVisited);

    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // ✅ TYPE GUARD
  if (!plats) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Sevärdighet hittades inte</Text>
      </View>
    );
  }

  // ✅ Efter guard: frys saker så TS aldrig klagar
  const platsId = plats.id;
  const utmaningar = plats.utmaningar;

  const visitDate = visited[platsId];

  const totalVisited = useMemo(() => Object.keys(visited).length, [visited]);

  const totalStars = useMemo(() => {
    return Object.values(completed).filter(Boolean).length;
  }, [completed]);

  const allTasksDoneForPlace = useMemo(() => {
    return utmaningar.every((u) => !!completed[u.id]);
  }, [completed, utmaningar]);

  function showBadgesToast(ids: BadgeId[]) {
    if (ids.length === 0) return;
    setNewBadges(ids);

    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setNewBadges([]), 3500);
  }

  async function runBadgeCheck(ctx: {
    nextVisited?: Record<string, string>;
    nextCompleted?: Record<string, boolean>;
    visitedThisPlace?: boolean;
    allDoneOverride?: boolean;
  }) {
    const v = ctx.nextVisited ?? visited;
    const c = ctx.nextCompleted ?? completed;

    const totalV = Object.keys(v).length;
    const totalS = Object.values(c).filter(Boolean).length;

    const visitedThis = ctx.visitedThisPlace ?? !!v[platsId];
    const allDone =
      ctx.allDoneOverride ?? utmaningar.every((u) => !!c[u.id]);

    const ids = await evaluateBadges({
      totalVisited: totalV,
      totalStars: totalS,
      visitedThisPlace: visitedThis,
      allTasksDoneForPlace: allDone,
    });

    showBadgesToast(ids);
  }

  async function onToggle(taskId: string) {
    const newState = await toggleTask(taskId);

    // ✅ KORREKT: uppdatera taskId -> state
    const nextCompleted = {
      ...completed,
      [taskId]: newState,
    };

    setCompleted(nextCompleted);

    // Badge-check triggas här (endast här)
    await runBadgeCheck({ nextCompleted });
  }

  async function toggleVisited() {
    if (visitDate) {
      await unmarkVisited(platsId);

      const nextVisited = { ...visited };
      delete nextVisited[platsId];
      setVisited(nextVisited);

      // Vanligt: man tar inte bort badges när man unvisitar
      // så vi kör INTE badge check här.
      return;
    }

    const date = await markVisited(platsId);

    const nextVisited = {
      ...visited,
      [platsId]: date,
    };

    setVisited(nextVisited);

    // Badge-check triggas här (endast här)
    await runBadgeCheck({ nextVisited, visitedThisPlace: true });
  }

  const badgeMeta = useMemo(() => {
    return newBadges
      .map((id) => BADGES.find((b) => b.id === id))
      .filter(Boolean);
  }, [newBadges]);

  return (
    <ScrollView className="flex-1 bg-[#F6F2EA]">
      <Image
        source={{ uri: plats.bild }}
        style={{ width: "100%", height: 220 }}
        resizeMode="cover"
      />

      <View className="p-5">
        {/* ===== TOAST ===== */}
        {badgeMeta.length > 0 && (
          <View className="mb-4 rounded-2xl border border-[#2F251B]/20 bg-[#FFF9EF] px-4 py-3 shadow-sm">
            <Text className="text-sm font-semibold text-[#2F251B]">
              🎉 Ny utmärkelse!
            </Text>

            {badgeMeta.map((b) => (
              <Text key={b!.id} className="mt-1 text-[#2F251B]">
                {b!.icon} <Text className="font-semibold">{b!.title}</Text>{" "}
                <Text className="text-[#2F251B]/70">– {b!.description}</Text>
              </Text>
            ))}
          </View>
        )}

        <Text className="text-3xl font-bold text-neutral-900">
          {plats.namn}
        </Text>

        <Text className="mt-1 text-sm text-neutral-600">{plats.adress}</Text>

        <Text className="mt-4 text-base text-neutral-700">{plats.intro}</Text>

        {/* ===== BESÖKT ===== */}
        <Text className="mt-6 text-xl font-semibold text-neutral-900">
          Besök
        </Text>

        <Pressable
          onPress={toggleVisited}
          className={`mt-3 rounded-xl border px-4 py-3 flex-row items-center ${
            visitDate
              ? "bg-blue-50 border-blue-400"
              : "bg-white border-neutral-300"
          }`}
        >
          <Text className="text-2xl mr-3">{visitDate ? "🏠" : "⌂"}</Text>

          <Text className="flex-1 text-neutral-800">
            {visitDate ? `Besökt ${visitDate}` : "Inte besökt"}
          </Text>
        </Pressable>

        {/* ===== UTMANINGAR ===== */}
        <Text className="mt-8 text-xl font-semibold text-neutral-900">
          Utmaningar
        </Text>

        <View className="mt-3 space-y-2">
          {utmaningar.map((u) => {
            const done = completed[u.id];

            return (
              <Pressable
                key={u.id}
                onPress={() => onToggle(u.id)}
                className={`rounded-xl border px-4 py-3 flex-row items-center ${
                  done
                    ? "bg-green-50 border-green-400"
                    : "bg-white border-neutral-300"
                }`}
              >
                <Text className="text-2xl mr-3">{done ? "⭐" : "☆"}</Text>

                <Text
                  className={`flex-1 ${
                    done ? "text-green-800 line-through" : "text-neutral-800"
                  }`}
                >
                  {u.text}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ===== STATUS (valfritt) ===== */}
        <View className="mt-6 rounded-2xl border border-[#2F251B]/10 bg-white/70 px-4 py-3">
          <Text className="text-sm text-[#2F251B]/80">
            Totalt besök:{" "}
            <Text className="font-bold text-[#2F251B]">{totalVisited}</Text>
            {"  "}•{"  "}
            Totalt stjärnor:{" "}
            <Text className="font-bold text-[#2F251B]">{totalStars}</Text>
          </Text>

          {allTasksDoneForPlace && (
            <Text className="mt-1 text-sm font-semibold text-green-800">
              🎯 Full pott på den här platsen!
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}