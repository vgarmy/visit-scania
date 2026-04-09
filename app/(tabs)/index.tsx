import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-[#F6F2EA] p-5 justify-center">
      <Text className="text-3xl font-bold text-neutral-900">
        Museer i Skåne
      </Text>

      <Text className="mt-2 text-neutral-700">
        Upptäck museer och sevärdheter med små utmaningar ⭐
      </Text>
    </View>
  );
}