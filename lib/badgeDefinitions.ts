// lib/badgeDefinitions.ts
export type BadgeId =
  | "first_visit"
  | "visit_3"
  | "visit_10"
  | "visit_25"
  | "stars_3"
  | "stars_10"
  | "stars_25"
  | "stars_50"
  | "place_all_tasks"
  | "combo_visit_plus_3stars";

export type BadgeDefinition = {
  id: BadgeId;
  title: string;
  description: string;
  icon: string; // Emoji funkar fint som start
};

export const BADGES: BadgeDefinition[] = [
  { id: "first_visit", title: "Första Steget", description: "Besök 1 plats", icon: "👣" },
  { id: "visit_3", title: "Helgutflykt", description: "Besök 3 platser", icon: "🧭" },
  { id: "visit_10", title: "Skåne-Rundan", description: "Besök 10 platser", icon: "🗺️" },
  { id: "visit_25", title: "Lokal Legend", description: "Besök 25 platser", icon: "🏆" },

  { id: "stars_3", title: "Stjärnstart", description: "Samla 3 stjärnor", icon: "⭐" },
  { id: "stars_10", title: "Stjärnjägare", description: "Samla 10 stjärnor", icon: "🌟" },
  { id: "stars_25", title: "Konstellation", description: "Samla 25 stjärnor", icon: "✨" },
  { id: "stars_50", title: "Supernova", description: "Samla 50 stjärnor", icon: "💫" },

  { id: "place_all_tasks", title: "Full Pott", description: "Klart: alla utmaningar på en plats", icon: "🎯" },

  { id: "combo_visit_plus_3stars", title: "Nördigt nöjd", description: "Besök en plats och ha minst 3 stjärnor", icon: "🤓" },
];