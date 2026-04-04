import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

export interface CartItem {
  cartId: string; // Unique for this cart entry (product + personalization combo)
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  personalization?: any; // Structured customization data (monogram, videoUrl, waxSeal)
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity" | "cartId">) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("tofha_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tofha_cart", JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addItem = (item: Omit<CartItem, "quantity" | "cartId">) => {
    setItems((prev) => {
      // Find item with same productId AND same personalization
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.personalization === item.personalization
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], quantity: next[existingIndex].quantity + 1 };
        return next;
      }

      const cartId = `${item.productId}-${Date.now()}`;
      return [...prev, { ...item, quantity: 1, cartId }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const removeItem = (cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("tofha_cart");
  };

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
