import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { getProductImage } from "@/lib/utils";

const CartPage = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <PageTransition title="My Shopping Bag" description="Review your selected items before checkout.">
      <StickyNav />
      <main className="pt-32 pb-20 bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-6xl px-6">
          <Breadcrumbs />
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-10">Shopping Bag</h1>

          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-[3rem] p-16 text-center border border-border/50 shadow-sm"
            >
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-muted-foreground/40" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't added any gifts to your bag yet. Explore our curated collections to find the perfect present.
              </p>
              <Link to="/shop">
                <Button size="lg" className="rounded-full px-10">Start Shopping</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-background rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-border/50 flex items-center justify-between">
                    <h2 className="font-bold text-lg">Items ({totalItems})</h2>
                    <span className="text-sm text-muted-foreground">Prices include taxes</span>
                  </div>
                  <ul className="divide-y divide-border/50">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.cartId}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-8 flex flex-col sm:flex-row gap-6"
                        >
                          <Link 
                            to={`/product/${item.productId}`}
                            className="w-32 h-40 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-sm"
                          >
                            <img
                              src={getProductImage(item.image)}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800";
                              }}
                            />
                          </Link>
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between gap-4">
                              <div>
                                <Link 
                                  to={`/product/${item.productId}`}
                                  className="font-heading text-xl font-bold hover:text-primary transition-colors"
                                >
                                </Link>
                                {item.personalization ? (
                                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10">
                                    <Sparkles size={12} className="text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Custom: {item.personalization}</span>
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground mt-1">Premium Curated Gift</p>
                                )}
                              </div>
                              <p className="font-heading text-xl font-bold">${item.price.toFixed(2)}</p>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                              <div className="flex items-center gap-6">
                                <div className="flex items-center border border-border rounded-full p-1 bg-muted/30">
                                  <button
                                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-all"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-8 text-center text-sm font-bold">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-all"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeItem(item.cartId)}
                                  className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2 text-sm font-medium"
                                >
                                  <Trash2 size={16} /> Remove
                                </button>
                              </div>
                              <p className="font-heading text-lg font-bold text-primary">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                {/* Shipping Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-background p-6 rounded-3xl border border-border/50 flex flex-col items-center text-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Truck size={20} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider">Free Shipping</p>
                    <p className="text-[10px] text-muted-foreground">On all orders over $75</p>
                  </div>
                  <div className="bg-background p-6 rounded-3xl border border-border/50 flex flex-col items-center text-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <ShieldCheck size={20} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider">Secure Payment</p>
                    <p className="text-[10px] text-muted-foreground">SSL encrypted checkout</p>
                  </div>
                  <div className="bg-background p-6 rounded-3xl border border-border/50 flex flex-col items-center text-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <RotateCcw size={20} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider">Easy Returns</p>
                    <p className="text-[10px] text-muted-foreground">30-day satisfaction guarantee</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <aside className="space-y-6">
                <div className="bg-background rounded-[2.5rem] border border-border/50 shadow-lg shadow-primary/5 p-8 sticky top-32">
                  <h2 className="font-heading text-2xl font-bold mb-6">Summary</h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Shipping</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Tax</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="pt-4 border-t border-border/50 flex justify-between items-end">
                      <span className="font-bold text-lg">Total</span>
                      <span className="text-2xl font-heading font-bold text-primary">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate("/checkout")}
                    className="w-full h-14 rounded-full text-base font-bold shadow-xl shadow-primary/20 gap-2 mb-4"
                  >
                    Proceed to Checkout <ArrowRight size={18} />
                  </Button>
                  
                  <div className="flex flex-col gap-3">
                    <p className="text-[10px] text-center text-muted-foreground px-4">
                      By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                  <h3 className="font-bold text-sm mb-2">Need Help?</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Our gifting experts are available Mon-Fri, 9am-6pm EST to help you with your order.
                  </p>
                  <Link to="/contact" className="text-xs font-bold text-primary hover:underline">
                    Contact Customer Care
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default CartPage;
