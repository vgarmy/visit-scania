export type BadgeId =
  // ===== Besök – total =====
  | "first_visit"
  | "visit_3"
  | "visit_10"
  | "visit_25"
  | "visit_50"
  | "visit_100"

  // ===== Stjärnor =====
  | "stars_3"
  | "stars_10"
  | "stars_25"
  | "stars_50"
  | "stars_100"

  // ===== Plats-typ (legacy) =====
  | "museum_3"
  | "museum_10"
  | "nationalpark_1"
  | "nationalpark_3"
  | "slott_3"
  | "slott_10"
  | "natur_5"

  // ===== NYTT: KATEGORI (8 st) =====
  // Museum
  | "cat_museum_1"
  | "cat_museum_3"
  | "cat_museum_10"
  | "cat_museum_25"

  // Konst
  | "cat_konst_1"
  | "cat_konst_3"
  | "cat_konst_10"
  | "cat_konst_25"

  // Natur
  | "cat_natur_1"
  | "cat_natur_3"
  | "cat_natur_10"
  | "cat_natur_25"

  // Strand
  | "cat_strand_1"
  | "cat_strand_3"
  | "cat_strand_10"
  | "cat_strand_25"

  // Historia
  | "cat_historia_1"
  | "cat_historia_3"
  | "cat_historia_10"
  | "cat_historia_25"

  // Utflykt
  | "cat_utflykt_1"
  | "cat_utflykt_3"
  | "cat_utflykt_10"
  | "cat_utflykt_25"

  // Leder
  | "cat_leder_1"
  | "cat_leder_3"
  | "cat_leder_10"
  | "cat_leder_25"

  // Barn
  | "cat_barn_1"
  | "cat_barn_3"
  | "cat_barn_10"
  | "cat_barn_25"

  // ===== Plats-specifikt =====
  | "place_all_tasks"

  // ===== Kombos =====
  | "combo_visit_plus_3stars"
  | "combo_10_visits_10_stars";

export type BadgeDefinition = {
  id: BadgeId;
  title: string;
  description: string;
  icon: string;
};

export const BADGES: BadgeDefinition[] = [
  // ===== Besök =====
  { id: "first_visit", title: "Första steget", description: "Besök 1 plats", icon: "👣" },
  { id: "visit_3", title: "Helgutflykt", description: "Besök 3 platser", icon: "🧭" },
  { id: "visit_10", title: "Skåne-rundan", description: "Besök 10 platser", icon: "🗺️" },
  { id: "visit_25", title: "Lokal legend", description: "Besök 25 platser", icon: "🏆" },
  { id: "visit_50", title: "Upptäckare", description: "Besök 50 platser", icon: "🥾" },
  { id: "visit_100", title: "Skånemästare", description: "Besök 100 platser", icon: "👑" },

  // ===== Stjärnor =====
  { id: "stars_3", title: "Stjärnstart", description: "Samla 3 stjärnor", icon: "⭐" },
  { id: "stars_10", title: "Stjärnjägare", description: "Samla 10 stjärnor", icon: "🌟" },
  { id: "stars_25", title: "Konstellation", description: "Samla 25 stjärnor", icon: "✨" },
  { id: "stars_50", title: "Supernova", description: "Samla 50 stjärnor", icon: "💫" },
  { id: "stars_100", title: "Galaxmästare", description: "Samla 100 stjärnor", icon: "🌌" },

  // ===== Legacy (som du redan hade) =====
  { id: "museum_3", title: "Museinyfiken", description: "Besök 3 museum", icon: "🏛️" },
  { id: "museum_10", title: "Museiveteran", description: "Besök 10 museum", icon: "🖼️" },
  { id: "nationalpark_1", title: "Ut i det vilda", description: "Besök 1 nationalpark", icon: "🌲" },
  { id: "nationalpark_3", title: "Vildmarksresenär", description: "Besök 3 nationalparker", icon: "🏞️" },
  { id: "slott_3", title: "Slottsgäst", description: "Besök 3 slott", icon: "🏰" },
  { id: "slott_10", title: "Adlig vandrare", description: "Besök 10 slott", icon: "👑" },
  { id: "natur_5", title: "Naturvän", description: "Besök 5 naturplatser", icon: "🍃" },

  // ===== NYTT: KATEGORI – Museum =====
  { id: "cat_museum_1", title: "Museistart", description: "Besök 1 plats i kategorin Museum", icon: "🏛️" },
  { id: "cat_museum_3", title: "Museinyfiken+", description: "Besök 3 platser i kategorin Museum", icon: "🗿" },
  { id: "cat_museum_10", title: "Museiveteran+", description: "Besök 10 platser i kategorin Museum", icon: "🖼️" },
  { id: "cat_museum_25", title: "Museimästare", description: "Besök 25 platser i kategorin Museum", icon: "🏆" },

  // ===== NYTT: KATEGORI – Konst =====
  { id: "cat_konst_1", title: "Konstspanare", description: "Besök 1 plats i kategorin Konst", icon: "🎨" },
  { id: "cat_konst_3", title: "Galleri-känsla", description: "Besök 3 platser i kategorin Konst", icon: "🖌️" },
  { id: "cat_konst_10", title: "Konstvandrare", description: "Besök 10 platser i kategorin Konst", icon: "🖼️" },
  { id: "cat_konst_25", title: "Kuratorn", description: "Besök 25 platser i kategorin Konst", icon: "✨" },

  // ===== NYTT: KATEGORI – Natur =====
  { id: "cat_natur_1", title: "Ut i grönskan", description: "Besök 1 plats i kategorin Natur", icon: "🌿" },
  { id: "cat_natur_3", title: "Skogsdoft", description: "Besök 3 platser i kategorin Natur", icon: "🌲" },
  { id: "cat_natur_10", title: "Stigletare", description: "Besök 10 platser i kategorin Natur", icon: "🥾" },
  { id: "cat_natur_25", title: "Naturproffs", description: "Besök 25 platser i kategorin Natur", icon: "🏞️" },

  // ===== NYTT: KATEGORI – Strand =====
  { id: "cat_strand_1", title: "Sand mellan tårna", description: "Besök 1 plats i kategorin Strand", icon: "🏖️" },
  { id: "cat_strand_3", title: "Kustkänsla", description: "Besök 3 platser i kategorin Strand", icon: "🌊" },
  { id: "cat_strand_10", title: "Havsvandrare", description: "Besök 10 platser i kategorin Strand", icon: "🐚" },
  { id: "cat_strand_25", title: "Kustmästare", description: "Besök 25 platser i kategorin Strand", icon: "⛵" },

  // ===== NYTT: KATEGORI – Historia =====
  { id: "cat_historia_1", title: "Tidskikare", description: "Besök 1 plats i kategorin Historia", icon: "⏳" },
  { id: "cat_historia_3", title: "Tidsresenär", description: "Besök 3 platser i kategorin Historia", icon: "🏰" },
  { id: "cat_historia_10", title: "Historiejägare", description: "Besök 10 platser i kategorin Historia", icon: "📜" },
  { id: "cat_historia_25", title: "Arkivmästare", description: "Besök 25 platser i kategorin Historia", icon: "🏛️" },

  // ===== NYTT: KATEGORI – Utflykt =====
  { id: "cat_utflykt_1", title: "Ute på tur", description: "Besök 1 plats i kategorin Utflykt", icon: "🚶" },
  { id: "cat_utflykt_3", title: "Liten runda", description: "Besök 3 platser i kategorin Utflykt", icon: "🧭" },
  { id: "cat_utflykt_10", title: "Stad & vyer", description: "Besök 10 platser i kategorin Utflykt", icon: "🏙️" },
  { id: "cat_utflykt_25", title: "Utflyktsproffs", description: "Besök 25 platser i kategorin Utflykt", icon: "🔥" },

  // ===== NYTT: KATEGORI – Leder =====
  { id: "cat_leder_1", title: "Ledstart", description: "Besök 1 plats i kategorin Leder", icon: "🗺️" },
  { id: "cat_leder_3", title: "Ruttkoll", description: "Besök 3 platser i kategorin Leder", icon: "🚴" },
  { id: "cat_leder_10", title: "Etappmaskin", description: "Besök 10 platser i kategorin Leder", icon: "🥾" },
  { id: "cat_leder_25", title: "Ledmästare", description: "Besök 25 platser i kategorin Leder", icon: "🏁" },

  // ===== NYTT: KATEGORI – Barn =====
  { id: "cat_barn_1", title: "Barnvänligt!", description: "Besök 1 plats i kategorin Barn", icon: "🧸" },
  { id: "cat_barn_3", title: "Familjerunda", description: "Besök 3 platser i kategorin Barn", icon: "👨‍👩‍👧‍👦" },
  { id: "cat_barn_10", title: "Barnproffs", description: "Besök 10 platser i kategorin Barn", icon: "🎡" },
  { id: "cat_barn_25", title: "Familjelegend", description: "Besök 25 platser i kategorin Barn", icon: "🏆" },

  // ===== Plats-specifikt =====
  {
    id: "place_all_tasks",
    title: "Full pott",
    description: "Klara alla utmaningar på en plats",
    icon: "🎯",
  },

  // ===== Kombos =====
  {
    id: "combo_visit_plus_3stars",
    title: "Nördigt nöjd",
    description: "Besök en plats och ha minst 3 stjärnor",
    icon: "🤓",
  },
  {
    id: "combo_10_visits_10_stars",
    title: "Allround‑utforskare",
    description: "Besök 10 platser och samla 10 stjärnor",
    icon: "🔥",
  },
];