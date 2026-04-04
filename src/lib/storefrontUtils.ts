import { Product, Artisan } from "@/data/products";

/**
 * Calculates a 'Trending Momentum' score based on sales, ratings, and recency.
 */
export const calculateTrendingScore = (product: any): number => {
  const salesImpact = (product.total_sales || 0) * 1.5;
  const ratingImpact = (product.rating || 0) * 10;
  
  // Recency bonus: Added in the last 14 days
  const createdDate = new Date(product.created_at || Date.now());
  const diffDays = Math.ceil((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  const recencyBonus = diffDays <= 14 ? (15 - diffDays) * 5 : 0;
  
  return salesImpact + ratingImpact + recencyBonus;
};

/**
 * Generates a stable daily seed for content rotation.
 */
export const getDailySeed = (): number => {
  const now = new Date();
  return now.getFullYear() * 1000 + now.getMonth() * 100 + now.getDate();
};

/**
 * Autonomously selects a featured artisan using a date-based rotation.
 */
export const rotateFeaturedArtisan = (artisans: Artisan[]): Artisan | undefined => {
  if (!artisans || artisans.length === 0) return undefined;
  
  // Filter for 'Verified' masters or highly rated
  const eligible = artisans.filter(a => (a.stats?.rating || 0) >= 4.5);
  const pool = eligible.length > 0 ? eligible : artisans;
  
  const seed = getDailySeed();
  const index = seed % pool.length;
  
  return pool[index];
};

/**
 * Autonomously identifies the 'Hero' collection of the day.
 */
export const getAutonomousHeroSelection = (collections: any[]): any | undefined => {
  if (!collections || collections.length === 0) return undefined;
  
  // Prioritize active collections with the most products
  const active = collections.filter(c => c.active !== false);
  if (active.length === 0) return undefined;
  
  // Sort by (Product Count * 10) + (Newness)
  const sorted = [...active].sort((a, b) => {
    const aScore = (a.products?.length || 0) * 10 + (new Date(a.created_at).getTime() / 1000000000);
    const bScore = (b.products?.length || 0) * 10 + (new Date(b.created_at).getTime() / 1000000000);
    return bScore - aScore;
  });
  
  return sorted[0];
};
