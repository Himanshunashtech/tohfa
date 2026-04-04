import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminData } from "@/context/AdminDataContext";
import { useGetSiteContentQuery } from "@/store/api/supabaseApi";
import { calculateTrendingScore } from "@/lib/storefrontUtils";
import ProductCard from "@/components/ProductCard";
import { Button } from "./ui/button";
import { useMemo } from "react";

const TrendingGifts = () => {
  const { products } = useAdminData();
  const { data: cmsData } = useGetSiteContentQuery();

  const displayProducts = useMemo(() => {
    const featuredContent = cmsData?.find(item => item.section_key === 'home_featured')?.content;
    const curatedIds = featuredContent?.product_ids || [];
    
    if (curatedIds.length > 0) {
      return curatedIds
        .map((id: string) => products.find(p => p.id === id || p.rawId === id))
        .filter(Boolean)
        .slice(0, 4);
    }
    
    // Autonomous Ranking: Momentum Score
    return [...products]
      .filter(p => !p.active === false) // Ensure active
      .sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a))
      .slice(0, 4);
  }, [products, cmsData]);

  const sectionConfig = useMemo(() => {
    const featuredContent = cmsData?.find(item => item.section_key === 'home_featured')?.content;
    return {
      title: featuredContent?.title || "Trending Gestures",
      subtitle: featuredContent?.subtitle || "Handpicked by our curators, these artisanal treasures are currently capturing hearts across the TofhaVerse."
    };
  }, [cmsData]);

  // Self-Hiding: Only show if we have enough trending items to look "Full"
  if (displayProducts.length < 3) return null;

  return (
    <section id="trending" className="relative py-32 px-6 overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.05),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-[0.2em]">
               <Sparkles size={14} /> The Curated Selection
            </div>
            <h2 className="font-heading text-5xl md:text-6xl font-bold text-foreground leading-[1.1]">
              {sectionConfig.title.includes('Gestures') ? (
                <>
                  Trending <span className="italic font-normal text-primary">Gestures</span>
                </>
              ) : sectionConfig.title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
               {sectionConfig.subtitle}
            </p>
          </div>
          <Link to="/shop">
             <Button variant="ghost" className="rounded-full gap-2 font-bold h-12 px-8 group hover:bg-primary/5">
                View Entire Collection <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingGifts;
