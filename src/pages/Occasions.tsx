import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, Gift, Heart, Home, Sparkles } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/WishlistButton";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import PageTransition from "@/components/PageTransition";
import { getProductImage } from "@/lib/utils";
import birthdayImg from "@/assets/occasion-birthday.jpg";
import anniversaryImg from "@/assets/occasion-anniversary.jpg";
import newhomeImg from "@/assets/occasion-newhome.jpg";
import justbecauseImg from "@/assets/occasion-justbecause.jpg";

const occasions = [
  { id: "birthday", label: "Birthday", icon: Gift, image: birthdayImg, desc: "Make their special day unforgettable with gifts they'll treasure." },
  { id: "anniversary", label: "Anniversary", icon: Heart, image: anniversaryImg, desc: "Celebrate love and milestones with timeless elegance." },
  { id: "newhome", label: "New Home", icon: Home, image: newhomeImg, desc: "Welcome them to their new chapter with thoughtful home essentials." },
  { id: "justbecause", label: "Just Because", icon: Sparkles, image: justbecauseImg, desc: "The best gifts need no reason — surprise someone you care about." },
];

const Occasions = () => {
  const { products: adminProducts } = useAdminData();
  const [selected, setSelected] = useState(occasions[0]);
  const { addItem } = useCart();
  const occasionProducts = adminProducts.filter(p => p.occasion?.some(o => o.toLowerCase() === selected.id.toLowerCase()));

  return (
    <PageTransition title="Gifts by Occasion" description="Find the perfect present for birthdays, weddings, new homes, and more.">
      <StickyNav />
      <main className="pt-24 pb-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
              Shop by Occasion
            </h1>
            <p className="text-muted-foreground mt-2">
              Find the perfect gift for every moment that matters.
            </p>
          </div>

          {/* Occasion selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {occasions.map((o) => (
              <motion.button
                key={o.id}
                onClick={() => setSelected(o)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-2xl aspect-[4/3] group ${
                  selected.id === o.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                }`}
              >
                <img
                  src={o.image}
                  alt={o.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 transition-colors duration-300 ${
                  selected.id === o.id ? "bg-primary/30" : "bg-foreground/40 group-hover:bg-foreground/25"
                }`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <o.icon size={24} className="text-primary-foreground" />
                  <span className="font-heading text-lg font-bold text-primary-foreground">{o.label}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Selected occasion content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-10">
                <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                  Gifts for {selected.label}
                </h2>
                <p className="text-muted-foreground">{selected.desc}</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {occasionProducts.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
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
                      <h3 className="font-heading text-sm font-semibold text-foreground">{p.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={11} className={j < p.rating ? "fill-primary text-primary" : "text-border"} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({p.reviewCount})</span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mt-1">{p.priceFormatted}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {occasionProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-16">No products for this occasion yet.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default Occasions;
