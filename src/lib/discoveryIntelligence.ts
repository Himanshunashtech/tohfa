import { Product } from "@/data/products";

/**
 * Autonomously calculates cross-sells based on vibe, occasion, and artisan heritage.
 */
export const getSmartCrossSells = (product: Product, allProducts: Product[]): Product[] => {
  if (!product || !allProducts || allProducts.length === 0) return [];
  
  const others = allProducts.filter(p => p.id !== product.id);
  
  // Calculate similarity scores
  const suggestions = others.map(p => {
    let score = 0;
    
    // Shared 'Vibe' (Highest weight)
    const commonVibes = p.vibe?.filter(v => product.vibe?.includes(v)) || [];
    score += commonVibes.length * 10;
    
    // Same Artisan
    if (p.artisanId && p.artisanId === product.artisanId) score += 15;
    
    // Same Category
    if (p.category === product.category) score += 5;
    
    // Shared Occasion
    const commonOccasions = p.occasion?.filter(o => product.occasion?.includes(o)) || [];
    score += commonOccasions.length * 3;
    
    return { ...p, similarity: score };
  });
  
  // Return top 4 distinct best matches
  return suggestions
    .sort((a, b) => (b as any).similarity - (a as any).similarity)
    .slice(0, 4);
};

/**
 * Self-Healing Personalization defaults for premium products.
 * Automatically enables monogramming for high-end collections.
 */
export const autoHealPersonalization = (product: any): any => {
  if (!product) return null;
  
  // If personalization already exists, return it
  if (product.personalization_config) return product.personalization_config;
  
  // Autonomous logic: If price > 150 and has tags like 'Bespoke', 'Signature', 'Vested'
  // Or if it belongs to a known high-end category
  const isPremium = (product.price || 0) >= 150;
  const isBespoke = (product.vibe || []).some((v: string) => ['Bespoke', 'Artisanal', 'Exclusive'].includes(v));
  
  if (isPremium || isBespoke) {
    return {
      supportsMonogramming: true,
      supportsVideoMessage: true,
      supportsEngraving: true,
      monogramPrice: 15,
      videoPrice: 0,
      engravingPrice: 20,
      monogramLimit: 5
    };
  }
  
  return null;
};

/**
 * Autonomously selects a 'Surprise & Delight' product for the user.
 */
export const getAutonomousSurpriseProduct = (products: Product[]): Product | undefined => {
  if (!products || products.length === 0) return undefined;
  
  // Exclude low-rating items
  const pool = products.filter(p => (p.rating || 0) >= 4.0);
  if (pool.length === 0) return undefined;
  
  const seed = new Date().getHours(); // Change every hour
  return pool[seed % pool.length];
};
