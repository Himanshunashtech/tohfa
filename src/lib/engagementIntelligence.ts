import { Product } from "@/data/products";

/**
 * A pool of luxury-focused cities to simulate global distribution.
 */
const LUXURY_LOCATIONS = [
  "London, UK", "New York, USA", "Paris, France", "Dubai, UAE",
  "Singapore", "Tokyo, Japan", "Milan, Italy", "Geneva, Switzerland",
  "Beverly Hills, USA", "Zürich, Switzerland", "Monaco", "Hong Kong"
];

/**
 * Types of activities to simulate for heartbeats.
 */
const ACTIVITY_TYPES = [
  { type: "added_to_cart", icon: "shopping_bag", message: "just added [PRODUCT] to their gift box" },
  { type: "added_to_wishlist", icon: "heart", message: "just saved [PRODUCT] to their wishlist" },
  { type: "viewing", icon: "eye", message: "is currently curating a gift with [PRODUCT]" },
  { type: "personalized", icon: "sparkles", message: "is now personalizing [PRODUCT] for a loved one" }
];

/**
 * Autonomously generates a plausible 'Heartbeat' activity log.
 */
export const generateHeartbeat = (products: Product[]) => {
  if (!products || products.length === 0) return null;
  
  // Pick a random location and activity
  const location = LUXURY_LOCATIONS[Math.floor(Math.random() * LUXURY_LOCATIONS.length)];
  const activity = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)];
  
  // Pick a product (weighted towards bestsellers)
  const pool = products.filter(p => !p.active === false);
  const trending = pool.filter(p => p.isBestSeller || p.rating >= 4.5);
  const targetPool = trending.length > 0 && Math.random() > 0.3 ? trending : pool;
  const product = targetPool[Math.floor(Math.random() * targetPool.length)];
  
  return {
    location,
    icon: activity.icon,
    message: `A curator in ${location} ${activity.message.replace("[PRODUCT]", `'${product.name}'`)}`,
    productSlug: product.slug || product.id
  };
};

/**
 * Calculates the next heartbeat interval.
 * Randomized between 45 and 150 seconds to maintain a natural rhythm.
 */
export const getNextEngagementInterval = (): number => {
  return (45 + Math.random() * 105) * 1000;
};

/**
 * Returns an 'Idle Nudge' message if the user is inactive.
 */
export const getIdleNudge = (trendingProduct?: Product) => {
  if (!trendingProduct) return "Looking for the perfect gesture? Our master artisans are here to help.";
  return `Considering ${trendingProduct.name}? This masterpiece is currently trending in our European ateliers.`;
};
