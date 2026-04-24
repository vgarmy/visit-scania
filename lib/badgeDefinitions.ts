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

  // ===== KATEGORI (8 st) =====
  // Museum
  | "cat_museum_1"
  | "cat_museum_3"
  | "cat_museum_10"
  | "cat_museum_25"
  | "cat_museum_50"

  // Konst
  | "cat_konst_1"
  | "cat_konst_3"
  | "cat_konst_10"
  | "cat_konst_25"
  | "cat_konst_50"

  // Natur
  | "cat_natur_1"
  | "cat_natur_3"
  | "cat_natur_10"
  | "cat_natur_25"
  | "cat_natur_50"

  // Strand
  | "cat_strand_1"
  | "cat_strand_3"
  | "cat_strand_10"
  | "cat_strand_25"
  | "cat_strand_50"

  // Historia
  | "cat_historia_1"
  | "cat_historia_3"
  | "cat_historia_10"
  | "cat_historia_25"
  | "cat_historia_50"

  // Utflykt
  | "cat_utflykt_1"
  | "cat_utflykt_3"
  | "cat_utflykt_10"
  | "cat_utflykt_25"
  | "cat_utflykt_50"

  // Leder
  | "cat_leder_1"
  | "cat_leder_3"
  | "cat_leder_10"
  | "cat_leder_25"
  | "cat_leder_50"

  // Barn
  | "cat_barn_1"
  | "cat_barn_3"
  | "cat_barn_10"
  | "cat_barn_25"
  | "cat_barn_50"

  // ===== NYTT: MIX / “en av varje” =====
  | "mix_2_categories"
  | "mix_4_categories"
  | "mix_6_categories"
  | "mix_all_8_categories"
  | "mix_all_8_categories_3x"

  // ===== NYTT: PAR (båda två) =====
  | "pair_museum_konst"
  | "pair_natur_strand"
  | "pair_historia_museum"
  | "pair_utflykt_strand"
  | "pair_leder_natur"
  | "pair_barn_utflykt"

  // ===== NYTT: SPECIAL =====
  | "special_balans_1_each_first4"
  | "special_balans_1_each_first6"
  | "special_specialist_any_25"

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

  // ===== KATEGORI – Museum =====
  { id: "cat_museum_1", title: "Museistart", description: "Besök 1 plats i kategorin Museum", icon: "🏛️" },
  { id: "cat_museum_3", title: "Museinyfiken+", description: "Besök 3 platser i kategorin Museum", icon: "🗿" },
  { id: "cat_museum_10", title: "Museiveteran+", description: "Besök 10 platser i kategorin Museum", icon: "🖼️" },
  { id: "cat_museum_25", title: "Museimästare", description: "Besök 25 platser i kategorin Museum", icon: "🏆" },
  { id: "cat_museum_50", title: "Museilegendar", description: "Besök 50 platser i kategorin Museum", icon: "🏛️" },

  // ===== KATEGORI – Konst =====
  { id: "cat_konst_1", title: "Konstspanare", description: "Besök 1 plats i kategorin Konst", icon: "🎨" },
  { id: "cat_konst_3", title: "Galleri-känsla", description: "Besök 3 platser i kategorin Konst", icon: "🖌️" },
  { id: "cat_konst_10", title: "Konstvandrare", description: "Besök 10 platser i kategorin Konst", icon: "🖼️" },
  { id: "cat_konst_25", title: "Kuratorn", description: "Besök 25 platser i kategorin Konst", icon: "✨" },
  { id: "cat_konst_50", title: "Konstlegendar", description: "Besök 50 platser i kategorin Konst", icon: "🎨" },

  // ===== KATEGORI – Natur =====
  { id: "cat_natur_1", title: "Ut i grönskan", description: "Besök 1 plats i kategorin Natur", icon: "🌿" },
  { id: "cat_natur_3", title: "Skogsdoft", description: "Besök 3 platser i kategorin Natur", icon: "🌲" },
  { id: "cat_natur_10", title: "Stigletare", description: "Besök 10 platser i kategorin Natur", icon: "🥾" },
  { id: "cat_natur_25", title: "Naturproffs", description: "Besök 25 platser i kategorin Natur", icon: "🏞️" },
  { id: "cat_natur_50", title: "Naturlegendar", description: "Besök 50 platser i kategorin Natur", icon: "🌿" },

  // ===== KATEGORI – Strand =====
  { id: "cat_strand_1", title: "Sand mellan tårna", description: "Besök 1 plats i kategorin Strand", icon: "🏖️" },
  { id: "cat_strand_3", title: "Kustkänsla", description: "Besök 3 platser i kategorin Strand", icon: "🌊" },
  { id: "cat_strand_10", title: "Havsvandrare", description: "Besök 10 platser i kategorin Strand", icon: "🐚" },
  { id: "cat_strand_25", title: "Kustmästare", description: "Besök 25 platser i kategorin Strand", icon: "⛵" },
  { id: "cat_strand_50", title: "Kustlegendar", description: "Besök 50 platser i kategorin Strand", icon: "🌊" },

  // ===== KATEGORI – Historia =====
  { id: "cat_historia_1", title: "Tidskikare", description: "Besök 1 plats i kategorin Historia", icon: "⏳" },
  { id: "cat_historia_3", title: "Tidsresenär", description: "Besök 3 platser i kategorin Historia", icon: "🏰" },
  { id: "cat_historia_10", title: "Historiejägare", description: "Besök 10 platser i kategorin Historia", icon: "📜" },
  { id: "cat_historia_25", title: "Arkivmästare", description: "Besök 25 platser i kategorin Historia", icon: "🏛️" },
  { id: "cat_historia_50", title: "Historielegendar", description: "Besök 50 platser i kategorin Historia", icon: "⏳" },

  // ===== KATEGORI – Utflykt =====
  { id: "cat_utflykt_1", title: "Ute på tur", description: "Besök 1 plats i kategorin Utflykt", icon: "🚶" },
  { id: "cat_utflykt_3", title: "Liten runda", description: "Besök 3 platser i kategorin Utflykt", icon: "🧭" },
  { id: "cat_utflykt_10", title: "Stad & vyer", description: "Besök 10 platser i kategorin Utflykt", icon: "🏙️" },
  { id: "cat_utflykt_25", title: "Utflyktsproffs", description: "Besök 25 platser i kategorin Utflykt", icon: "🔥" },
  { id: "cat_utflykt_50", title: "Utflyktslegendar", description: "Besök 50 platser i kategorin Utflykt", icon: "🧭" },

  // ===== KATEGORI – Leder =====
  { id: "cat_leder_1", title: "Ledstart", description: "Besök 1 plats i kategorin Leder", icon: "🗺️" },
  { id: "cat_leder_3", title: "Ruttkoll", description: "Besök 3 platser i kategorin Leder", icon: "🚴" },
  { id: "cat_leder_10", title: "Etappmaskin", description: "Besök 10 platser i kategorin Leder", icon: "🥾" },
  { id: "cat_leder_25", title: "Ledmästare", description: "Besök 25 platser i kategorin Leder", icon: "🏁" },
  { id: "cat_leder_50", title: "Ledlegendar", description: "Besök 50 platser i kategorin Leder", icon: "🗺️" },

  // ===== KATEGORI – Barn =====
  { id: "cat_barn_1", title: "Barnvänligt!", description: "Besök 1 plats i kategorin Barn", icon: "🧸" },
  { id: "cat_barn_3", title: "Familjerunda", description: "Besök 3 platser i kategorin Barn", icon: "👨‍👩‍👧‍👦" },
  { id: "cat_barn_10", title: "Barnproffs", description: "Besök 10 platser i kategorin Barn", icon: "🎡" },
  { id: "cat_barn_25", title: "Familjelegend", description: "Besök 25 platser i kategorin Barn", icon: "🏆" },
  { id: "cat_barn_50", title: "Familjelegendar", description: "Besök 50 platser i kategorin Barn", icon: "🎡" },

  // ===== NYTT: MIX / “en av varje” =====
  { id: "mix_2_categories", title: "Blandad start", description: "Besök platser i 2 olika kategorier", icon: "🎒" },
  { id: "mix_4_categories", title: "Fyra smaker", description: "Besök platser i 4 olika kategorier", icon: "🍱" },
  { id: "mix_6_categories", title: "Skåne‑mix", description: "Besök platser i 6 olika kategorier", icon: "🧩" },
  { id: "mix_all_8_categories", title: "En av varje", description: "Besök minst 1 plats i varje kategori", icon: "🎟️" },
  { id: "mix_all_8_categories_3x", title: "Full samling", description: "Besök minst 3 platser i varje kategori", icon: "🏅" },

  // ===== NYTT: PAR =====
  { id: "pair_museum_konst", title: "Kulturduo", description: "Besök minst 1 Museum och 1 Konst", icon: "🏛️🎨" },
  { id: "pair_natur_strand", title: "Ute vid kanten", description: "Besök minst 1 Natur och 1 Strand", icon: "🌿🌊" },
  { id: "pair_historia_museum", title: "Tidslager", description: "Besök minst 1 Historia och 1 Museum", icon: "⏳🏛️" },
  { id: "pair_utflykt_strand", title: "Vyer & bad", description: "Besök minst 1 Utflykt och 1 Strand", icon: "🚶🏖️" },
  { id: "pair_leder_natur", title: "Stig & skog", description: "Besök minst 1 Leder och 1 Natur", icon: "🥾🌲" },
  { id: "pair_barn_utflykt", title: "Familjetur", description: "Besök minst 1 Barn och 1 Utflykt", icon: "👨‍👩‍👧‍👦🧭" },

  // ===== NYTT: SPECIAL =====
  { id: "special_balans_1_each_first4", title: "Balans", description: "Besök minst 1 plats i 4 olika kategorier", icon: "⚖️" },
  { id: "special_balans_1_each_first6", title: "Riktig bredd", description: "Besök minst 1 plats i 6 olika kategorier", icon: "🌈" },
  { id: "special_specialist_any_25", title: "Specialist", description: "Besök 25 platser inom samma kategori", icon: "🎯" },

  // ===== Plats-specifikt =====
  { id: "place_all_tasks", title: "Full pott", description: "Klara alla utmaningar på en plats", icon: "🎯" },

  // ===== Kombos =====
  { id: "combo_visit_plus_3stars", title: "Nördigt nöjd", description: "Besök en plats och ha minst 3 stjärnor", icon: "🤓" },
  { id: "combo_10_visits_10_stars", title: "Allround‑utforskare", description: "Besök 10 platser och samla 10 stjärnor", icon: "🔥" },
];