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

  // ✅ NYTT: antal besök per kategori (8 st)
  // exempel: { Museum: 12, Natur: 4, ... }
  categoryVisited?: Partial<Record<CategoryName, number>>;

  // legacy (behåll tills vi uppdaterar call site)
  museumVisited?: number;
  nationalparkVisited?: number;
  slottVisited?: number;
  naturVisited?: number;

  // plats-specifikt
  visitedThisPlace: boolean;
  allTasksDoneForPlace: boolean;
};

export async function evaluateBadges(ctx: AwardContext): Promise<BadgeId[]> {
  const newlyUnlocked: BadgeId[] = [];

  async function tryUnlock(id: BadgeId) {
    const ok = await unlockBadge(id);
    if (ok) newlyUnlocked.push(id);
  }

  const getCat = (name: CategoryName) => ctx.categoryVisited?.[name] ?? 0;

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
     NYTT: KATEGORI-BADGES (8 st)
  ===================== */
  // Museum
  if (getCat("Museum") >= 1) await tryUnlock("cat_museum_1");
  if (getCat("Museum") >= 3) await tryUnlock("cat_museum_3");
  if (getCat("Museum") >= 10) await tryUnlock("cat_museum_10");
  if (getCat("Museum") >= 25) await tryUnlock("cat_museum_25");

  // Konst
  if (getCat("Konst") >= 1) await tryUnlock("cat_konst_1");
  if (getCat("Konst") >= 3) await tryUnlock("cat_konst_3");
  if (getCat("Konst") >= 10) await tryUnlock("cat_konst_10");
  if (getCat("Konst") >= 25) await tryUnlock("cat_konst_25");

  // Natur
  if (getCat("Natur") >= 1) await tryUnlock("cat_natur_1");
  if (getCat("Natur") >= 3) await tryUnlock("cat_natur_3");
  if (getCat("Natur") >= 10) await tryUnlock("cat_natur_10");
  if (getCat("Natur") >= 25) await tryUnlock("cat_natur_25");

  // Strand
  if (getCat("Strand") >= 1) await tryUnlock("cat_strand_1");
  if (getCat("Strand") >= 3) await tryUnlock("cat_strand_3");
  if (getCat("Strand") >= 10) await tryUnlock("cat_strand_10");
  if (getCat("Strand") >= 25) await tryUnlock("cat_strand_25");

  // Historia
  if (getCat("Historia") >= 1) await tryUnlock("cat_historia_1");
  if (getCat("Historia") >= 3) await tryUnlock("cat_historia_3");
  if (getCat("Historia") >= 10) await tryUnlock("cat_historia_10");
  if (getCat("Historia") >= 25) await tryUnlock("cat_historia_25");

  // Utflykt
  if (getCat("Utflykt") >= 1) await tryUnlock("cat_utflykt_1");
  if (getCat("Utflykt") >= 3) await tryUnlock("cat_utflykt_3");
  if (getCat("Utflykt") >= 10) await tryUnlock("cat_utflykt_10");
  if (getCat("Utflykt") >= 25) await tryUnlock("cat_utflykt_25");

  // Leder
  if (getCat("Leder") >= 1) await tryUnlock("cat_leder_1");
  if (getCat("Leder") >= 3) await tryUnlock("cat_leder_3");
  if (getCat("Leder") >= 10) await tryUnlock("cat_leder_10");
  if (getCat("Leder") >= 25) await tryUnlock("cat_leder_25");

  // Barn
  if (getCat("Barn") >= 1) await tryUnlock("cat_barn_1");
  if (getCat("Barn") >= 3) await tryUnlock("cat_barn_3");
  if (getCat("Barn") >= 10) await tryUnlock("cat_barn_10");
  if (getCat("Barn") >= 25) await tryUnlock("cat_barn_25");

  /* =====================
     Legacy (kan tas bort senare)
  ===================== */
  if ((ctx.museumVisited ?? 0) >= 3) await tryUnlock("museum_3");
  if ((ctx.museumVisited ?? 0) >= 10) await tryUnlock("museum_10");

  if ((ctx.nationalparkVisited ?? 0) >= 1) await tryUnlock("nationalpark_1");
  if ((ctx.nationalparkVisited ?? 0) >= 3) await tryUnlock("nationalpark_3");

  if ((ctx.slottVisited ?? 0) >= 3) await tryUnlock("slott_3");
  if ((ctx.slottVisited ?? 0) >= 10) await tryUnlock("slott_10");

  if ((ctx.naturVisited ?? 0) >= 5) await tryUnlock("natur_5");

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