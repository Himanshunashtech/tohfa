import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface WishlistContextType {
  items: string[];
  toggleItem: (productId: string, productName?: string) => void;
  isWishlisted: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<string[]>(() => {
    const saved = localStorage.getItem("tofha_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tofha_wishlist", JSON.stringify(items));
  }, [items]);

  const isWishlisted = useCallback(
    (productId: string) => items.includes(productId),
    [items]
  );

  const toggleItem = useCallback(
    (productId: string, productName?: string) => {
      setItems((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          toast.success("Removed from wishlist");
          return prev.filter((id) => id !== productId);
        }
        toast.success(`${productName || "Item"} added to wishlist`);
        return [...prev, productId];
      });
    },
    []
  );

  return (
    <WishlistContext.Provider value={{ items, toggleItem, isWishlisted, totalItems: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
