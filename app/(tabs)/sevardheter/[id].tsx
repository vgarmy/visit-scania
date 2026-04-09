import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import sevardheter from "../../data/sevardheter.json";

export default function SevardhetDetailScreen() {
  const { id } = useLocalSearchParams();

  const plats = sevardheter.find((p) => p.id === id);

  if (!plats) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Sevärdighet hittades inte</Text>
      </View>
    );
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

        <Text className="mt-6 text-xl font-semibold text-neutral-900">
          Utmaningar
        </Text>

        <View className="mt-3 space-y-2">
          {plats.utmaningar.map((u) => (
            <View
              key={u.id}
              className="rounded-xl border border-neutral-300 bg-white px-4 py-3"
            >
              <Text className="text-neutral-800">
                ⭐ {u.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}