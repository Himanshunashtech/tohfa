import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface BrowsingHistoryContextType {
  recentlyViewed: string[];
  addToHistory: (productId: string) => void;
  clearHistory: () => void;
}

const BrowsingHistoryContext = createContext<BrowsingHistoryContextType | undefined>(undefined);

const STORAGE_KEY = "tofhaverse_recent_v1";
const MAX_ITEMS = 12;

export const BrowsingHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse browsing history", e);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToHistory = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists to move to front
      const filtered = prev.filter((id) => id !== productId);
      // Add to front and limit
      return [productId, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  return (
    <BrowsingHistoryContext.Provider value={{ recentlyViewed, addToHistory, clearHistory }}>
      {children}
    </BrowsingHistoryContext.Provider>
  );
};

export const useBrowsingHistory = () => {
  const context = useContext(BrowsingHistoryContext);
  if (context === undefined) {
    throw new Error("useBrowsingHistory must be used within a BrowsingHistoryProvider");
  }
  return context;
};
