import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves a product or asset image path to a full URL.
 * Handles both public URLs and Supabase storage bucket paths (product-images, avatars, etc.).
 */
export function getProductImage(path: string | undefined): string {
  if (!path) return "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800"; // Fallback placeholder
  if (path.startsWith('http')) return path;
  
  // If the path contains a bucket indicator (bucket/file.jpg) or looks like a storage path
  // We check for common bucket prefixes or any path that doesn't look like a local import
  const knownBuckets = ['product-images/', 'avatars/', 'blog/', 'studio/'];
  const isStoragePath = knownBuckets.some(bucket => path.startsWith(bucket));
  
  if (isStoragePath || (!path.startsWith('/') && !path.startsWith('./') && !path.startsWith('@/'))) {
    const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
    // Avoid double bucket prefix if it's already there
    return `${supabaseUrl}/storage/v1/object/public/${path}`;
  }
  
  return path; // Local asset imports or other relative paths
}
