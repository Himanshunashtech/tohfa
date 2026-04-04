import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/WishlistButton";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import { getProductImage } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";

const Wishlist = () => {
  const { products: adminProducts } = useAdminData();
  const { items } = useWishlist();
  const { addItem } = useCart();
  const wishlistProducts = adminProducts.filter((p) => items.includes(p.id));

  return (
    <PageTransition>
      <StickyNav />
      <main className="pt-28 pb-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-10">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
              Your Wishlist
            </h1>
            <p className="text-muted-foreground mt-2">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24">
              <Heart size={48} className="text-muted-foreground/30" />
              <p className="text-muted-foreground">Your wishlist is empty</p>
              <Link
                to="/shop"
                className="text-sm font-medium text-primary hover:underline"
              >
                Explore the Shop →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group"
                >
                  <Link to={`/product/${p.id}`} className="block">
                    <div className="relative overflow-hidden rounded-2xl bg-muted mb-3">
                      <img
                        src={getProductImage(p.images[0])}
                        alt={p.name}
                        loading="lazy"
                        className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <WishlistButton
                        productId={p.id}
                        productName={p.name}
                        className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm"
                      />
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({ productId: p.id, name: p.name, price: p.price, image: getProductImage(p.images[0]) });
                        }}
                        className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 py-2 rounded-full bg-background/90 backdrop-blur-md text-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-border/50"
                      >
                        <ShoppingBag size={14} /> Quick Add
                      </motion.button>
                    </div>
                  </Link>
                  <Link to={`/product/${p.id}`}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{p.category}</p>
                    <h3 className="font-heading text-sm font-semibold text-foreground">{p.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1">{p.priceFormatted}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default Wishlist;
