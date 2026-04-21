// lib/badgeEngine.ts
import type { BadgeId } from "./badgeDefinitions";
import { unlockBadge } from "./badgeStorage";

type AwardContext = {
  totalVisited: number;
  totalStars: number;
  visitedThisPlace: boolean;
  allTasksDoneForPlace: boolean;
};

export async function evaluateBadges(ctx: AwardContext): Promise<BadgeId[]> {
  const newlyUnlocked: BadgeId[] = [];

  async function tryUnlock(id: BadgeId) {
    const ok = await unlockBadge(id);
    if (ok) newlyUnlocked.push(id);
  }

  // Visits
  if (ctx.totalVisited >= 1) await tryUnlock("first_visit");
  if (ctx.totalVisited >= 3) await tryUnlock("visit_3");
  if (ctx.totalVisited >= 10) await tryUnlock("visit_10");
  if (ctx.totalVisited >= 25) await tryUnlock("visit_25");

  // Stars
  if (ctx.totalStars >= 3) await tryUnlock("stars_3");
  if (ctx.totalStars >= 10) await tryUnlock("stars_10");
  if (ctx.totalStars >= 25) await tryUnlock("stars_25");
  if (ctx.totalStars >= 50) await tryUnlock("stars_50");

  // Place-specific
  if (ctx.allTasksDoneForPlace) await tryUnlock("place_all_tasks");

  // Combo
  if (ctx.visitedThisPlace && ctx.totalStars >= 3) {
    await tryUnlock("combo_visit_plus_3stars");
  }

  return newlyUnlocked;
}