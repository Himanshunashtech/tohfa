import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { getProductImage } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-background border-l border-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-foreground" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Your Cart ({totalItems})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                <ShoppingBag size={48} className="text-muted-foreground/30" />
                <p className="text-muted-foreground text-sm">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.cartId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-4"
                    >
                      <Link
                        to={`/product/${item.productId}`}
                        onClick={onClose}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0"
                      >
                        <img
                          src={getProductImage(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800";
                          }}
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.productId}`}
                          onClick={onClose}
                          className="font-heading text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        {item.personalization && (
                          <div className="mt-1 space-y-0.5">
                            {typeof item.personalization === 'object' && item.personalization !== null ? (
                              <>
                                {(item.personalization as any).monogram && (
                                  <p className="text-[9px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                                    <Sparkles size={10} /> Monogram: {(item.personalization as any).monogram}
                                  </p>
                                )}
                                {(item.personalization as any).videoMessage && (
                                  <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                                    <Sparkles size={10} /> Video Message
                                  </p>
                                )}
                                {(item.personalization as any).waxSeal && (
                                  <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                                    <Sparkles size={10} /> Signature Engraving
                                  </p>
                                )}
                              </>
                            ) : typeof item.personalization === 'string' && item.personalization !== "N/A" ? (
                              <p className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                                <Sparkles size={10} /> {item.personalization}
                              </p>
                            ) : null}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-0.5">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border rounded-full">
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs font-medium text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.cartId)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-foreground shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-heading text-lg font-bold text-foreground">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping & taxes calculated at checkout
                </p>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 24px hsl(11 65% 63% / 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-sm tracking-wide"
                >
                  Checkout — ${totalPrice.toFixed(2)}
                </motion.button>
                <button
                  onClick={onClose}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
