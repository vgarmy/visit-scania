import type { BadgeId } from "./badgeDefinitions";
import { unlockBadge } from "./badgeStorage";

export type CategoryName =
  | "Museum"
  | "Konst"
  | "Natur"
  | "Strand"
  | "Historia"
  | "Utflykt"
  | "Leder"
  | "Barn";

export type AwardContext = {
  totalVisited: number;
  totalStars: number;

  // ✅ antal besök per kategori (8 st)
  // exempel: { Museum: 12, Natur: 4, ... }
  categoryVisited?: Partial<Record<CategoryName, number>>;

  // legacy (behåll tills du uppdaterat call-site helt)
  museumVisited?: number;
  nationalparkVisited?: number;
  slottVisited?: number;
  naturVisited?: number;

  // plats-specifikt
  visitedThisPlace: boolean;
  allTasksDoneForPlace: boolean;
};

const ALL_CATEGORIES: CategoryName[] = [
  "Museum",
  "Konst",
  "Natur",
  "Strand",
  "Historia",
  "Utflykt",
  "Leder",
  "Barn",
];

export async function evaluateBadges(ctx: AwardContext): Promise<BadgeId[]> {
  const newlyUnlocked: BadgeId[] = [];

  async function tryUnlock(id: BadgeId) {
    const ok = await unlockBadge(id);
    if (ok) newlyUnlocked.push(id);
  }

  const getCat = (name: CategoryName) => ctx.categoryVisited?.[name] ?? 0;

  const categoriesWithAtLeast = (n: number) =>
    ALL_CATEGORIES.filter((c) => getCat(c) >= n).length;

  const hasAllCategoriesAtLeast = (n: number) =>
    ALL_CATEGORIES.every((c) => getCat(c) >= n);

  const maxCategoryCount = () =>
    Math.max(0, ...ALL_CATEGORIES.map((c) => getCat(c)));

  /* =====================
     TOTALA BESÖK
  ===================== */
  if (ctx.totalVisited >= 1) await tryUnlock("first_visit");
  if (ctx.totalVisited >= 3) await tryUnlock("visit_3");
  if (ctx.totalVisited >= 10) await tryUnlock("visit_10");
  if (ctx.totalVisited >= 25) await tryUnlock("visit_25");
  if (ctx.totalVisited >= 50) await tryUnlock("visit_50");
  if (ctx.totalVisited >= 100) await tryUnlock("visit_100");

  /* =====================
     STJÄRNOR
  ===================== */
  if (ctx.totalStars >= 3) await tryUnlock("stars_3");
  if (ctx.totalStars >= 10) await tryUnlock("stars_10");
  if (ctx.totalStars >= 25) await tryUnlock("stars_25");
  if (ctx.totalStars >= 50) await tryUnlock("stars_50");
  if (ctx.totalStars >= 100) await tryUnlock("stars_100");

  /* =====================
     KATEGORI – per kategori (1/3/10/25/50)
  ===================== */
  // Museum
  if (getCat("Museum") >= 1) await tryUnlock("cat_museum_1");
  if (getCat("Museum") >= 3) await tryUnlock("cat_museum_3");
  if (getCat("Museum") >= 10) await tryUnlock("cat_museum_10");
  if (getCat("Museum") >= 25) await tryUnlock("cat_museum_25");
  if (getCat("Museum") >= 50) await tryUnlock("cat_museum_50");

  // Konst
  if (getCat("Konst") >= 1) await tryUnlock("cat_konst_1");
  if (getCat("Konst") >= 3) await tryUnlock("cat_konst_3");
  if (getCat("Konst") >= 10) await tryUnlock("cat_konst_10");
  if (getCat("Konst") >= 25) await tryUnlock("cat_konst_25");
  if (getCat("Konst") >= 50) await tryUnlock("cat_konst_50");

  // Natur
  if (getCat("Natur") >= 1) await tryUnlock("cat_natur_1");
  if (getCat("Natur") >= 3) await tryUnlock("cat_natur_3");
  if (getCat("Natur") >= 10) await tryUnlock("cat_natur_10");
  if (getCat("Natur") >= 25) await tryUnlock("cat_natur_25");
  if (getCat("Natur") >= 50) await tryUnlock("cat_natur_50");

  // Strand
  if (getCat("Strand") >= 1) await tryUnlock("cat_strand_1");
  if (getCat("Strand") >= 3) await tryUnlock("cat_strand_3");
  if (getCat("Strand") >= 10) await tryUnlock("cat_strand_10");
  if (getCat("Strand") >= 25) await tryUnlock("cat_strand_25");
  if (getCat("Strand") >= 50) await tryUnlock("cat_strand_50");

  // Historia
  if (getCat("Historia") >= 1) await tryUnlock("cat_historia_1");
  if (getCat("Historia") >= 3) await tryUnlock("cat_historia_3");
  if (getCat("Historia") >= 10) await tryUnlock("cat_historia_10");
  if (getCat("Historia") >= 25) await tryUnlock("cat_historia_25");
  if (getCat("Historia") >= 50) await tryUnlock("cat_historia_50");

  // Utflykt
  if (getCat("Utflykt") >= 1) await tryUnlock("cat_utflykt_1");
  if (getCat("Utflykt") >= 3) await tryUnlock("cat_utflykt_3");
  if (getCat("Utflykt") >= 10) await tryUnlock("cat_utflykt_10");
  if (getCat("Utflykt") >= 25) await tryUnlock("cat_utflykt_25");
  if (getCat("Utflykt") >= 50) await tryUnlock("cat_utflykt_50");

  // Leder
  if (getCat("Leder") >= 1) await tryUnlock("cat_leder_1");
  if (getCat("Leder") >= 3) await tryUnlock("cat_leder_3");
  if (getCat("Leder") >= 10) await tryUnlock("cat_leder_10");
  if (getCat("Leder") >= 25) await tryUnlock("cat_leder_25");
  if (getCat("Leder") >= 50) await tryUnlock("cat_leder_50");

  // Barn
  if (getCat("Barn") >= 1) await tryUnlock("cat_barn_1");
  if (getCat("Barn") >= 3) await tryUnlock("cat_barn_3");
  if (getCat("Barn") >= 10) await tryUnlock("cat_barn_10");
  if (getCat("Barn") >= 25) await tryUnlock("cat_barn_25");
  if (getCat("Barn") >= 50) await tryUnlock("cat_barn_50");

  /* =====================
     MIX / “en av varje”
  ===================== */
  if (categoriesWithAtLeast(1) >= 2) await tryUnlock("mix_2_categories");
  if (categoriesWithAtLeast(1) >= 4) await tryUnlock("mix_4_categories");
  if (categoriesWithAtLeast(1) >= 6) await tryUnlock("mix_6_categories");
  if (hasAllCategoriesAtLeast(1)) await tryUnlock("mix_all_8_categories");
  if (hasAllCategoriesAtLeast(3)) await tryUnlock("mix_all_8_categories_3x");

  /* =====================
     PAR (båda två)
  ===================== */
  if (getCat("Museum") >= 1 && getCat("Konst") >= 1) await tryUnlock("pair_museum_konst");
  if (getCat("Natur") >= 1 && getCat("Strand") >= 1) await tryUnlock("pair_natur_strand");
  if (getCat("Historia") >= 1 && getCat("Museum") >= 1) await tryUnlock("pair_historia_museum");
  if (getCat("Utflykt") >= 1 && getCat("Strand") >= 1) await tryUnlock("pair_utflykt_strand");
  if (getCat("Leder") >= 1 && getCat("Natur") >= 1) await tryUnlock("pair_leder_natur");
  if (getCat("Barn") >= 1 && getCat("Utflykt") >= 1) await tryUnlock("pair_barn_utflykt");

  /* =====================
     SPECIAL
  ===================== */
  if (categoriesWithAtLeast(1) >= 4) await tryUnlock("special_balans_1_each_first4");
  if (categoriesWithAtLeast(1) >= 6) await tryUnlock("special_balans_1_each_first6");
  if (maxCategoryCount() >= 25) await tryUnlock("special_specialist_any_25");

  /* =====================
     PLATS-SPECIFIKT
  ===================== */
  if (ctx.allTasksDoneForPlace) {
    await tryUnlock("place_all_tasks");
  }

  /* =====================
     KOMBOS
  ===================== */
  if (ctx.visitedThisPlace && ctx.totalStars >= 3) {
    await tryUnlock("combo_visit_plus_3stars");
  }

  if (ctx.totalVisited >= 10 && ctx.totalStars >= 10) {
    await tryUnlock("combo_10_visits_10_stars");
  }

  return newlyUnlocked;
}