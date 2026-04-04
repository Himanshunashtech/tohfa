import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, Mountain, UtensilsCrossed, Star, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/WishlistButton";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import { getProductImage } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vibes = [
  { id: "Luxe", label: "The Luxe", icon: Gem, desc: "Opulent materials, gold accents, and ultimate sophistication." },
  { id: "Artisanal", label: "The Artisan", icon: Mountain, desc: "Hand-crafted treasures with unique textures and ancestral soul." },
  { id: "Eco-Minimalist", label: "The Eco-Minimalist", icon: UtensilsCrossed, desc: "Sustainable beauty meets stripped-back, intentional design." },
  { id: "Cozy", label: "The Cozy", icon: Star, desc: "Warm textiles and comforting objects for the sanctuary seeker." },
];

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100+", min: 100, max: Infinity },
];

const GiftGuide = () => {
  const { products: adminProducts } = useAdminData();
  const [selectedVibe, setSelectedVibe] = useState(vibes[0]);
  const [priceRange, setPriceRange] = useState(0);
  const { addItem } = useCart();

  const filtered = useMemo(() => {
    const vibeProducts = adminProducts.filter(p => p.vibe?.some(v => v.toLowerCase() === selectedVibe.id.toLowerCase()));
    const range = priceRanges[priceRange];
    return vibeProducts.filter((p) => p.price >= range.min && p.price < range.max);
  }, [selectedVibe, priceRange, adminProducts]);

  return (
    <PageTransition title="Personalized Gift Guide" description="Answer a few questions and let our experts find the perfect gift for you.">
      <StickyNav />
      <main className="pt-24 pb-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
              Gift Guide
            </h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Not sure what to get? Pick their personality and we'll match the perfect gift.
            </p>
          </div>

          {/* Vibe selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {vibes.map((v) => (
              <motion.button
                key={v.id}
                onClick={() => setSelectedVibe(v)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedVibe.id === v.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-foreground border border-border hover:border-primary/40"
                }`}
              >
                <v.icon size={18} />
                {v.label}
              </motion.button>
            ))}
          </div>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={selectedVibe.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-muted-foreground mb-10"
            >
              {selectedVibe.desc}
            </motion.p>
          </AnimatePresence>

          {/* Price filter */}
          <div className="flex items-center justify-between mb-10">
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "gift" : "gifts"} found
            </p>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-muted-foreground" />
              <Select
                value={String(priceRange)}
                onValueChange={(v) => setPriceRange(Number(v))}
              >
                <SelectTrigger className="w-[140px] h-9 text-sm border-border rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((r, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedVibe.id + priceRange}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filtered.map((p, i) => (
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
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{p.category}</p>
                    <h3 className="font-heading text-sm font-semibold text-foreground">{p.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={11} className={j < p.rating ? "fill-primary text-primary" : "text-border"} />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mt-1">{p.priceFormatted}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-16">
              No gifts match these filters. Try adjusting the price range.
            </p>
          )}
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default GiftGuide;
