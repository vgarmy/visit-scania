import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#D97706",
      }}
    >
      {/* Hem */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Hem",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Sevärdheter (lista) */}
      <Tabs.Screen
        name="sevardheter"
        options={{
          title: "Sevärdheter",
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ✅ Dölj detaljsidan från tab-baren */}
      <Tabs.Screen
        name="sevardheter/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
