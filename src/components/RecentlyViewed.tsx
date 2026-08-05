import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, History, ChevronRight } from "lucide-react";
import { useBrowsingHistory } from "@/context/BrowsingHistoryContext";
import { useAdminData } from "@/context/AdminDataContext";
import ProductCard from "./ProductCard";

const RecentlyViewed: React.FC = () => {
  const { recentlyViewed, clearHistory } = useBrowsingHistory();
  const { products } = useAdminData();

  const viewedProducts = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  if (viewedProducts.length === 0) return null;

  return (
    <section id="recently-viewed" className="py-20 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold">Pick up where you left off</h2>
              <p className="text-sm text-muted-foreground italic">Your recently viewed items</p>
            </div>
          </div>
          
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors group"
          >
            Clear History <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="relative group/scroll">
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
            {viewedProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="min-w-[240px] md:min-w-[280px] snap-start"
              >
                <ProductCard product={product} index={i} />
              </motion.div>
            ))}
          </div>
          
          {viewedProducts.length > 4 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-background to-transparent w-20 h-full pointer-events-none flex items-center justify-end pr-4 opacity-0 group-hover/scroll:opacity-100 transition-opacity">
               <ChevronRight size={24} className="text-primary animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
