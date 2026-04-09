import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import sevardheter from "../data/sevardheter.json";

export default function SevardheterScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-[#F6F2EA] p-2">

      <Text className="mt-2 text-base text-neutral-700 text-center">
        Utforska populära sevärdheter runt om i Skåne.
      </Text>

      <View className="mt-6 gap-2">
        {sevardheter.map((plats) => (
          <Pressable
            key={plats.id}
            onPress={() =>
              router.push({
                pathname: "/sevardheter/[id]",
                params: { id: plats.id },
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
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
``