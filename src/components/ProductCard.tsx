import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Sparkles } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/WishlistButton";
import { getProductImage } from "@/lib/utils";
import { calculateTrendingScore } from "@/lib/storefrontUtils";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "default" | "small";
}

const ProductCard = ({ product, index = 0, variant = "default" }: ProductCardProps) => {
  const { addItem } = useCart();
  const p = product;

  const trendingScore = calculateTrendingScore(p);
  const isRare = (p.stock || 0) < 5 && p.stock > 0;
  const isRisingStar = p.isNewArrival && p.rating >= 4.5;
  const hasMomentum = trendingScore > 30 && !isRisingStar;

  const isSmall = variant === "small";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.03 }}
      className="group"
    >
      <Link to={`/product/${p.slug || p.id}`} className="block">
        <div className={`relative overflow-hidden ${isSmall ? "rounded-2xl" : "rounded-[2rem]"} bg-muted/50 aspect-[4/5] ${isSmall ? "mb-2" : "mb-4"} shadow-sm group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-500`}>
          <img
            src={getProductImage(p.images[0])}
            alt={p.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${p.stock === 0 ? "grayscale opacity-60" : ""}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800";
            }}
          />
          
          {p.stock === 0 && (
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${isSmall ? "p-2" : "p-6"} text-center`}>
               <div className={`bg-background/90 backdrop-blur-md ${isSmall ? "px-2 py-1 rounded-lg" : "px-4 py-2 rounded-xl"} shadow-2xl border border-white/20 transform rotate-[-5deg]`}>
                  <p className={`${isSmall ? "text-[8px]" : "text-xs"} font-bold text-rose-500 uppercase tracking-widest leading-none`}>Sold Out</p>
               </div>
            </div>
          )}

          <WishlistButton
            productId={p.id}
            productName={p.name}
            className={`absolute ${isSmall ? "top-2 right-2 w-7 h-7" : "top-4 right-4 w-10 h-10"} bg-background/90 backdrop-blur-md shadow-md border-transparent`}
          />
          
          {!isSmall && (
            <>
              {isRare && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-md z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Rare Find
                </div>
              )}
              {isRisingStar && !isRare && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1.5 z-10">
                  <Sparkles size={10} /> Rising Star
                </div>
              )}
              {hasMomentum && !isRare && !isRisingStar && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg z-10">
                  Momentum
                </div>
              )}
            </>
          )}

          {/* Quick Add Button */}
          <div className={`absolute ${isSmall ? "bottom-2 right-2 opacity-0 group-hover:opacity-100" : "inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"} transition-all duration-300 ${p.stock === 0 ? "hidden" : ""}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                if (p.stock > 0) {
                  addItem({ productId: p.id, name: p.name, price: p.price, image: getProductImage(p.images[0]) });
                }
              }}
              className={`${isSmall ? "w-8 h-8 rounded-full" : "w-full py-3 rounded-2xl"} flex items-center justify-center gap-2 bg-background/95 backdrop-blur-xl text-foreground font-bold shadow-xl border border-white/20`}
            >
              <ShoppingBag size={isSmall ? 14 : 16} />
              {!isSmall && "Quick Add"}
            </motion.button>
          </div>
        </div>
      </Link>
      
      <div className={isSmall ? "px-0.5" : "px-1"}>
        {!isSmall && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, j) => (
                <Star
                  key={j}
                  size={12}
                  className={j < p.rating ? "fill-primary text-primary" : "text-border/40"}
                />
              ))}
            </div>
            <span className="text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10 uppercase font-bold tracking-widest">{p.category}</span>
          </div>
        )}
        
        <Link to={`/product/${p.slug || p.id}`}>
          <h3 className={`font-heading ${isSmall ? "text-[11px]" : "text-base"} font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1`}>
            {p.name}
          </h3>
        </Link>
        
        <div className={`flex items-center justify-between ${isSmall ? "mt-0" : "mt-0.5"}`}>
          <p className={`${isSmall ? "text-[11px]" : "text-base"} font-black text-foreground`}>{p.priceFormatted}</p>
          {!isSmall && (p.stock || 0) < 10 && p.stock > 0 && (
            <motion.div 
               initial={{ scale: 0.9 }}
               animate={{ scale: 1 }}
               className="flex items-center gap-1.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">Only {p.stock} left</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
