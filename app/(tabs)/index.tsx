import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";

import { getCompletedTasks } from "../../lib/taskStorage";
import { getVisitedPlaces } from "../../lib/visitStorage";
import sevardheterJson from "../data/sevardheter.json";

/* ✅ ENDA NYTT (för tredje quickstat-rutan) */
import { BADGES } from "../../lib/badgeDefinitions";
import { getUnlockedBadges, type UnlockedBadges } from "../../lib/badgeStorage";

const DEV_STORAGE_KEYS = [
  "visitedPlaces",
  "completedTasks",
  "badges_unlocked_v1",
  "profile_photo_v1",
];

type Challenge = { id: string; text: string };

type Place = {
  id: string;
  namn: string;
  kategori?: string;
  typ: string;
  adress: string;
  latitud?: number;
  longitud?: number;
  bild: string;
  intro: string;
  beskrivning: string;
  utmaningar: Challenge[];
};

type PlaceWithCoords = Place & { latitude: number; longitude: number };
type PlaceWithDistance = PlaceWithCoords & { distKm: number };

const sevardheter: Place[] = sevardheterJson as unknown as Place[];

function isValidCoord(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;

  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

/* ✅ NYTT: tolerant timestamp-parser för visitedPlaces (funkar med number|string|true) */
function asTimestamp(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
    const t = Date.parse(v);
    if (Number.isFinite(t)) return t;
  }
  if (v === true) return null;
  return null;
}

export default function HomeScreen() {
  const router = useRouter();

  const [suggested, setSuggested] = useState<Place | null>(null);
  const [visitedCount, setVisitedCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [visitedMap, setVisitedMap] = useState<Record<string, boolean>>({});

  const [userPos, setUserPos] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [locationDenied, setLocationDenied] = useState(false);

  const [showAllNearby, setShowAllNearby] = useState(false);

  const mapRef = useRef<any>(null);
  const didCenterRef = useRef(false);

  const fallback = useRef({ latitude: 55.605, longitude: 12.9875 }).current;

  const [region, setRegion] = useState<Region>({
    latitude: fallback.latitude,
    longitude: fallback.longitude,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
  });

  /* ✅ ENDA NYTT state (för badges-rutan) */
  const [badges, setBadges] = useState<UnlockedBadges>({});
  const unlockedCount = useMemo(() => Object.keys(badges).length, [badges]);

  /* ✅ NYTT state: senaste besöken (horisontell rad) */
  const [recentVisitedPlaces, setRecentVisitedPlaces] = useState<Place[]>([]);

  const totalPlaces = sevardheter.length;
  const totalTasks = sevardheter.reduce((sum, p) => sum + (p.utmaningar?.length ?? 0), 0);
  const progressPct =
    totalTasks > 0 ? Math.min((completedTasksCount / totalTasks) * 100, 100) : 0;

  const allMarkers: PlaceWithCoords[] = useMemo(() => {
    return sevardheter
      .filter((p) => isValidCoord(p.latitud) && isValidCoord(p.longitud))
      .map((p) => ({
        ...p,
        latitude: p.latitud as number,
        longitude: p.longitud as number,
      }));
  }, []);

  const nearbySorted: PlaceWithDistance[] = useMemo(() => {
    if (!allMarkers.length) return [];
    const base = userPos ?? fallback;

    return allMarkers
      .map((p) => ({
        ...p,
        distKm: distanceKm(base.latitude, base.longitude, p.latitude, p.longitude),
      }))
      .sort((a, b) => a.distKm - b.distKm);
  }, [allMarkers, userPos, fallback]);

  // ✅ Filterchips (8-kategorier via fältet "type")
  const CHIP_TYPES = [
    "Alla",
    "Museum",
    "Konst",
    "Natur",
    "Strand",
    "Historia",
    "Utflykt",
    "Leder",
    "Barn",
  ] as const;

  const [selectedType, setSelectedType] = useState<(typeof CHIP_TYPES)[number]>("Alla");

  const visibleMarkers = useMemo(() => {
    if (selectedType === "Alla") return allMarkers;
    return allMarkers.filter((p) => (p.kategori ?? "").toString().trim() === selectedType);
  }, [allMarkers, selectedType]);

  const visibleNearbySorted: PlaceWithDistance[] = useMemo(() => {
    if (!visibleMarkers.length) return [];
    const base = userPos ?? fallback;

    return visibleMarkers
      .map((p) => ({
        ...p,
        distKm: distanceKm(base.latitude, base.longitude, p.latitude, p.longitude),
      }))
      .sort((a, b) => a.distKm - b.distKm);
  }, [visibleMarkers, userPos, fallback]);

  const requestLocation = useCallback(async () => {
    try {
      setLocationDenied(false);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationDenied(true);
        setUserPos(null);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserPos({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    } catch (e) {
      console.warn("Location error", e);
      setUserPos(null);
      setLocationDenied(true);
    }
  }, []);

  const load = useCallback(async () => {
    /* ✅ ENDA logikändringen: hämta unlocked badges också */
    const [visited, completed, unlocked] = await Promise.all([
      getVisitedPlaces(),
      getCompletedTasks(),
      getUnlockedBadges(),
    ]);

    const visitedBoolMap: Record<string, boolean> = Object.fromEntries(
      Object.keys(visited).map((id) => [id, true])
    );

    setVisitedMap(visitedBoolMap);
    setVisitedCount(Object.keys(visited).length);

    const doneTasks = sevardheter
      .flatMap((p) => p.utmaningar ?? [])
      .filter((u) => !!completed[u.id]).length;

    setCompletedTasksCount(doneTasks);

    /* ✅ ENDA NYTT: uppdatera badge-state */
    setBadges(unlocked);

    /* ✅ NYTT: bygg "Senaste besöken" (sortera på timestamp om det finns) */
    const visitedEntries = Object.entries(visited ?? {});
    const visitedSortedIds = visitedEntries
      .map(([id, val]) => ({ id, ts: asTimestamp(val) }))
      .sort((a, b) => {
        const aTs = a.ts ?? -1;
        const bTs = b.ts ?? -1;
        return bTs - aTs;
      })
      .map((x) => x.id);

    const recent = visitedSortedIds
      .map((id) => sevardheter.find((p) => p.id === id))
      .filter(Boolean) as Place[];

    setRecentVisitedPlaces(recent.slice(0, 12));

    const notVisited = sevardheter.filter((p) => !visited[p.id]);
    setSuggested((prev) => {
      if (prev && !visited[prev.id]) return prev;
      if (!notVisited.length) return null;
      return notVisited[Math.floor(Math.random() * notVisited.length)];
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
      requestLocation();
    }, [load, requestLocation])
  );

  const centerOnMe = useCallback(
    (animated: boolean = true) => {
      const center = userPos ?? fallback;

      const next: Region = {
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      };

      setRegion(next);
      mapRef.current?.animateToRegion(next, animated ? 280 : 0);
    },
    [userPos, fallback]
  );

  useEffect(() => {
    if (!userPos) return;
    if (didCenterRef.current) return;

    didCenterRef.current = true;
    centerOnMe(true);
  }, [userPos, centerOnMe]);

  const fitToAllPins = useCallback(
    (animated: boolean = true) => {
      const coords = [
        ...allMarkers.map((p) => ({ latitude: p.latitude, longitude: p.longitude })),
        ...(userPos ? [{ latitude: userPos.latitude, longitude: userPos.longitude }] : []),
      ];
      if (!coords.length) return;

      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
        animated,
      });
    },
    [allMarkers, userPos]
  );

  const devResetEverything = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(DEV_STORAGE_KEYS);
      await load();
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
      <ScrollView className="flex-1 bg-[#6B4E2E] px-4 pt-8" keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View
          className="mb-5 rounded-3xl bg-[#F7F0E4] border border-[#2F251B]/35 px-4 py-4"
          style={{ transform: [{ rotate: "2deg" }] }}
        >
          <View className="absolute -top-5 right-4">
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
            Upplev Skåne
          </Text>
          <Text className="mt-1 text-sm text-[#3A2F25] text-center">
            Upptäck. Samla. Lås upp ⭐
          </Text>
          <View className="mt-2 h-[2px] bg-[#3A2F25]/25 rounded-full" />
        </View>

        {/* Quick stats */}
        <View className="mb-5 flex-row gap-3">
          <View
            className="flex-1 rounded-2xl bg-[#FFF9EF] border border-[#2F251B]/30 p-4 items-center"
            style={{ transform: [{ rotate: "-2deg" }] }}
          >
            <MaterialIcons name="place" size={22} color="#2F251B" />
            <Text className="mt-1 text-xs text-[#4A3E34]">Besökta</Text>
            <Text className="text-xl font-bold text-[#1E1A16]">
              {visitedCount}/{totalPlaces}
            </Text>
          </View>

          <View
            className="flex-1 rounded-2xl bg-[#FFF9EF] border border-[#2F251B]/30 p-4 items-center"
            style={{ transform: [{ rotate: "2deg" }] }}
          >
            <MaterialIcons name="task-alt" size={22} color="#2F251B" />
            <Text className="mt-1 text-xs text-[#4A3E34]">Utmaningar</Text>
            <Text className="text-xl font-bold text-[#1E1A16]">
              {completedTasksCount}/{totalTasks}
            </Text>
          </View>

          {/* ✅ ENDA UI-ÄNDRINGEN: tredje ruta */}
          <View
            className="flex-1 rounded-2xl bg-[#FFF9EF] border border-[#2F251B]/30 p-4 items-center"
            style={{ transform: [{ rotate: "-1deg" }] }}
          >
            <MaterialIcons name="military-tech" size={22} color="#2F251B" />
            <Text className="mt-1 text-xs text-[#4A3E34]">Badges</Text>
            <Text className="text-xl font-bold text-[#1E1A16]">
              {unlockedCount}/{BADGES.length}
            </Text>
          </View>
        </View>

        {/* Progress */}
        <View className="mb-6 rounded-3xl bg-[#FFF9EF] border border-[#2F251B]/30 p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-[#4A3E34]">Total progress</Text>
            <Text className="text-sm font-bold text-[#1E1A16]">{Math.round(progressPct)}%</Text>
          </View>
          <View className="mt-2 h-3 rounded-full bg-[#2F251B]/20 overflow-hidden">
            <View style={{ width: `${progressPct}%` }} className="h-full bg-[#2E6F64]" />
          </View>
        </View>

        {/* ✅ NYTT: Senaste besöken (horisontell rad) */}
        {recentVisitedPlaces.length > 0 && (
          <View className="mb-6">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-xl font-semibold text-[#1E1A16]">Senaste besöken</Text>
              <Text className="text-[11px] text-[#1E1A16]/70">{recentVisitedPlaces.length} st</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 12 }}
            >
              {recentVisitedPlaces.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() =>
                    router.push({ pathname: "/sevardheter/[id]", params: { id: p.id } })
                  }
                  style={{ width: 220, marginRight: 12 }}
                >
                  <View
                    className="rounded-[26px] bg-[#FFF9EF] border border-[#2F251B]/25 overflow-hidden"
                    style={{
                      shadowColor: "#000",
                      shadowOpacity: 0.18,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 3 },
                      elevation: 2,
                      transform: [{ rotate: "-1deg" }],
                    }}
                  >
                    <View style={{ position: "relative" }}>
                      <Image source={{ uri: p.bild }} style={{ width: "100%", height: 120 }} />
                      <View
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          backgroundColor: "rgba(46,111,100,0.92)",
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: "rgba(47,37,27,0.25)",
                        }}
                      >
                        <Text style={{ color: "#FFF9EF", fontSize: 11, fontWeight: "900" }}>
                          ✅ Besökt
                        </Text>
                      </View>
                    </View>

                    <View style={{ padding: 12 }}>
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 16, fontWeight: "900", color: "#1E1A16" }}
                      >
                        {p.namn}
                      </Text>

                      <Text
                        numberOfLines={1}
                        style={{
                          marginTop: 2,
                          fontSize: 11,
                          fontWeight: "800",
                          color: "rgba(30,26,22,0.70)",
                        }}
                      >
                        {(p.kategori ?? p.typ) ? `${p.kategori ?? p.typ}` : "Sevärdhet"}
                      </Text>

                      <Text numberOfLines={1} style={{ marginTop: 2, fontSize: 11, color: "#4A3E34" }}>
                        {p.adress}
                      </Text>

                      <View style={{ marginTop: 8, flexDirection: "row", alignItems: "center" }}>
                        <MaterialIcons name="chevron-right" size={18} color="#2F251B" />
                        <Text
                          style={{
                            marginLeft: 4,
                            fontSize: 11,
                            fontWeight: "900",
                            color: "#2F251B",
                          }}
                        >
                          Öppna
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Filterchips */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 12 }}
          >
            {CHIP_TYPES.map((t) => {
              const active = t === selectedType;
              return (
                <Pressable
                  key={t}
                  onPress={() => setSelectedType(t)}
                  style={{
                    marginRight: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: active ? "rgba(47,37,27,0.92)" : "rgba(255,249,239,0.90)",
                    borderWidth: 1,
                    borderColor: active ? "rgba(47,37,27,0.92)" : "rgba(47,37,27,0.25)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "800",
                      color: active ? "#FFF9EF" : "#2F251B",
                    }}
                  >
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* liten rad under chips (valfri, men tydlig) */}
          <Text className="mt-2 text-[11px] text-[#1E1A16]/70">Filter: {selectedType}</Text>
        </View>

        {/* Map */}
        <View className="mb-10">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xl font-semibold text-[#1E1A16]">Karta</Text>
            {locationDenied ? (
              <Text className="text-[11px] text-[#1E1A16]/70">Plats ej tillåten</Text>
            ) : userPos ? (
              <Text className="text-[11px] text-[#1E1A16]/70">GPS aktiv</Text>
            ) : (
              <Text className="text-[11px] text-[#1E1A16]/70">Hämtar…</Text>
            )}
          </View>

          <View className="rounded-[28px] bg-[#2F251B]/40 p-[2px]">
            <View className="rounded-[26px] bg-[#FFF9EF] border border-[#2F251B]/25 overflow-hidden">
              {/* Buttons */}
              <View style={{ position: "absolute", top: 12, left: 12, zIndex: 60, flexDirection: "row", gap: 8 }}>
                <Pressable
                  onPress={() => centerOnMe(true)}
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: "rgba(47,37,27,0.92)" }}
                >
                  <Text style={{ color: "#FFF9EF", fontWeight: "800", fontSize: 12 }}>
                    Min plats
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => fitToAllPins(true)}
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: "rgba(47,37,27,0.92)" }}
                >
                  <Text style={{ color: "#FFF9EF", fontWeight: "800", fontSize: 12 }}>
                    Visa alla
                  </Text>
                </Pressable>
              </View>

              <MapView
                ref={mapRef}
                provider={PROVIDER_DEFAULT}
                style={{ width: "100%", height: 360 }}
                region={region}
                rotateEnabled={false}
                pitchEnabled={false}
                toolbarEnabled={false}
                scrollEnabled={true}
                zoomEnabled={true}
                onRegionChangeComplete={(r) => setRegion(r)}
              >
                {/* USER: label + icon */}
                {userPos && (
                  <>
                    <Marker
                      coordinate={userPos}
                      tappable={false}
                      tracksViewChanges={false}
                      tracksInfoWindowChanges={false}
                      anchor={{ x: 0.5, y: 0 }}
                      centerOffset={{ x: 0, y: -30 }}
                    >
                      <View pointerEvents="none" style={{ alignItems: "center" }}>
                        <View  className="px-2 py-1 rounded-full max-w-[160px] bg-[#fff9ef]/95 border border-[rgba(47,37,27,0.25)]">
                          <Text numberOfLines={1} className="text-[10px] font-extrabold text-[#1E1A16]">
                            Du är här
                          </Text>
                        </View>
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            backgroundColor: "rgba(255, 249, 239, 0.95)",
                            borderLeftWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: "rgba(47,37,27,0.25)",
                            transform: [{ rotate: "-45deg" }],
                            marginTop: -5,
                          }}
                        />
                      </View>
                    </Marker>

                    <Marker coordinate={userPos} tracksViewChanges={false} tracksInfoWindowChanges={false}>
                      <View style={{ alignItems: "center" }}>
                        <MaterialIcons name="person-pin-circle" size={30} color="#2F251B" />
                      </View>
                    </Marker>
                  </>
                )}

                {/* ALL PLACES: label + icon */}
                {visibleMarkers.map((p) => (
                  <View key={p.id}>
                    <Marker
                      coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                      tappable={false}
                      tracksViewChanges={false}
                      tracksInfoWindowChanges={false}
                      anchor={{ x: 0.5, y: 0 }}
                      centerOffset={{ x: 0, y: -30 }}
                    >
                      <View pointerEvents="none" style={{ alignItems: "center" }}>
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 12,
                            backgroundColor: "rgba(255, 249, 239, 0.95)",
                            borderWidth: 1,
                            borderColor: "rgba(47,37,27,0.25)",
                            maxWidth: 160,
                          }}
                        >
                          <Text
                            numberOfLines={1}
                            style={{
                              color: "#1E1A16",
                              fontSize: 10,
                              fontWeight: "800",
                            }}
                          >
                            {p.namn}
                          </Text>
                        </View>

                        <View
                          style={{
                            width: 10,
                            height: 10,
                            backgroundColor: "rgba(255, 249, 239, 0.95)",
                            borderLeftWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: "rgba(47,37,27,0.25)",
                            transform: [{ rotate: "-45deg" }],
                            marginTop: -5,
                          }}
                        />
                      </View>
                    </Marker>

                    <Marker
                      coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                      onPress={() =>
                        router.push({
                          pathname: "/sevardheter/[id]",
                          params: { id: p.id },
                        })
                      }
                      tracksViewChanges={false}
                      tracksInfoWindowChanges={false}
                    >
                      <View style={{ alignItems: "center" }}>
                        <MaterialIcons
                          name={visitedMap[p.id] ? "place" : "location-on"}
                          size={28}
                          color={visitedMap[p.id] ? "#2E6F64" : "#D9A441"}
                        />
                      </View>
                    </Marker>
                  </View>
                ))}
              </MapView>

              <View className="px-4 py-3">
                <Text className="text-[11px] text-[#4A3E34]">
                  Labels är alltid synliga ovanför markörer. Ikonen är alltid klickbar.
                </Text>
              </View>
            </View>
          </View>

          {/* Nearby list */}
          {nearbySorted.length > 0 && (
            <View className="mt-4">
              <Text className="mb-2 text-sm font-semibold text-[#1E1A16]">Närmast dig</Text>

              {(showAllNearby ? visibleNearbySorted : visibleNearbySorted.slice(0, 8)).map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => router.push({ pathname: "/sevardheter/[id]", params: { id: p.id } })}
                  className="mb-2 rounded-2xl bg-white border border-[#2F251B]/15 px-4 py-3 flex-row items-center"
                >
                  <Text className="text-lg mr-3">{visitedMap[p.id] ? "✅" : "📍"}</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-extrabold text-[#1E1A16]">{p.namn}</Text>
                    <Text className="text-[11px] text-[#4A3E34]">
                      {p.distKm.toFixed(1)} km • {p.typ}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color="#2F251B" />
                </Pressable>
              ))}

              {visibleNearbySorted.length > 8 && (
                <Pressable
                  onPress={() => setShowAllNearby((v) => !v)}
                  className="mt-2 rounded-2xl bg-[#2F251B]/10 border border-[#2F251B]/20 px-4 py-3 items-center"
                >
                  <Text className="text-xs font-extrabold text-[#2F251B]">
                    {showAllNearby ? "Visa färre" : `Visa alla (${nearbySorted.length})`}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        {/* Suggested */}
        {suggested && (
          <View className="mb-10">
            <Text className="mb-3 text-xl font-semibold text-[#1E1A16]">Förslag till nästa besök</Text>
            <Pressable
              onPress={() =>
                router.push({ pathname: "/sevardheter/[id]", params: { id: suggested.id } })
              }
              className="rounded-[28px] bg-[#2F251B]/40 p-[2px]"
            >
              <View className="rounded-[26px] bg-[#FFF9EF] border border-[#2F251B]/25 overflow-hidden">
                <Image source={{ uri: suggested.bild }} style={{ width: "100%", height: 210 }} />
                <View className="p-5">
                  <Text className="text-2xl font-extrabold text-[#1E1A16]">{suggested.namn}</Text>
                  <Text className="mt-1 text-sm text-[#4A3E34]">{suggested.adress}</Text>
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* DEV reset */}
        <View className="pb-10">
          <Pressable
            onPress={confirmDevReset}
            className="mt-4 w-full flex-row items-center justify-center rounded-2xl bg-[#2F251B]/25 border border-[#2F251B]/30 px-4 py-4"
          >
            <MaterialIcons name="delete-forever" size={20} color="#FFF9EF" />
            <Text className="ml-2 text-sm font-extrabold text-[#FFF9EF]">DEV: Rensa appdata</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}