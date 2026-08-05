import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useBrowsingHistory } from "@/context/BrowsingHistoryContext";
import { useAdminData } from "@/context/AdminDataContext";
import ProductCard from "@/components/ProductCard";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";

const BrowsingHistory = () => {
  const { recentlyViewed, clearHistory } = useBrowsingHistory();
  const { products } = useAdminData();

  const viewedProducts = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <PageTransition title="My Browsing History">
      <StickyNav />
      <main className="pt-32 pb-24 min-h-screen bg-muted/20">
        <div className="container mx-auto max-w-7xl px-6">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <Link to="/shop" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Shop
              </Link>
              <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight">Your <span className="italic font-normal text-primary">Discoveries</span></h1>
              <p className="text-muted-foreground text-lg italic">A curated record of the treasures you've explored.</p>
            </div>

            {viewedProducts.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearHistory}
                className="rounded-full px-6 h-12 flex items-center gap-2 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all group"
              >
                Clear History <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {viewedProducts.length > 0 ? (
              <motion.div 
                key="history-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16"
              >
                {viewedProducts.map((p, i) => (
                  <ProductCard key={`${p.id}-${i}`} product={p} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-background rounded-[4rem] p-24 text-center border border-dashed border-border/50 max-w-3xl mx-auto shadow-sm"
              >
                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-10 text-muted-foreground">
                  <History size={40} className="opacity-40" />
                </div>
                <h2 className="text-3xl font-heading font-bold mb-6">No discoveries yet</h2>
                <p className="text-muted-foreground mb-12 text-lg">
                  It seems you haven't explored any products recently. Start your journey into the TofhaVerse today.
                </p>
                <Link to="/shop">
                  <Button className="rounded-full px-12 h-16 text-lg font-bold shadow-2xl shadow-primary/20 flex items-center gap-3 mx-auto group">
                    <ShoppingBag size={20} className="group-hover:animate-bounce" />
                    Start Gifting
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default BrowsingHistory;
