/**
 * TofhaVerse Core Data Schema and Types
 * All product and artisan data now resides in the Supabase database.
 * This file contains purely the TypeScript interfaces for type safety.
 */

export interface Artisan {
  id: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  heritage?: string;
  photo: string;
  studioImages?: string[];
  slug: string;
  stats?: {
    productsCount: number;
    totalSales: number;
    rating: number;
  };
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  userId?: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  isVerified: boolean;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  price: number;
  priceFormatted: string;
  rating: number;
  reviewCount: number;
  category: string;
  occasion: string[];
  recipient: string[];
  vibe: string[];
  shortDesc: string;
  description: string;
  details: string[];
  images: string[];
  stock: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  artisan?: Artisan;
  artisanId?: string;
  specifications?: { label: string; value: string }[];
  story?: string;
  active?: boolean;
  hasPersonalization?: boolean;
  personalization_config?: {
    supportsMonogramming: boolean;
    supportsVideoMessage: boolean;
    supportsEngraving: boolean;
    monogramPrice: number;
    videoPrice: number;
    engravingPrice: number;
    monogramLimit: number;
  };
}

// Global Empty Data (Data is now fetched from Supabase via AdminDataContext)
export const products: Product[] = [];
export const categories: string[] = [];
export const occasions: string[] = [];
export const recipients: string[] = [];
export const vibes: string[] = [];

// Helper Stubs (Legacy)
export const getProductById = (id: string): Product | undefined => undefined;
export const getProductsByOccasion = (occasion: string): Product[] => [];
export const getProductsByVibe = (vibe: string): Product[] => [];
export const getProductsByRecipient = (recipient: string): Product[] => [];
