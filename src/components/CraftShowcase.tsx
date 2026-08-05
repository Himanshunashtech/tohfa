import { useAdminData } from "@/context/AdminDataContext";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Box, Hammer, Palette, Flame, Layers, LayoutGrid } from "lucide-react";

// Special icons for prioritized categories
const specialCategories = [
  { name: "Metal", icon: <Hammer size={16} />, color: "text-slate-500" },
  { name: "Wood", icon: <Box size={16} />, color: "text-orange-600" },
  { name: "Ceramics", icon: <Layers size={16} />, color: "text-stone-600" },
  { name: "Brass", icon: <Flame size={16} />, color: "text-amber-600" },
  { name: "Paintings", icon: <Palette size={16} />, color: "text-rose-600" }
];

interface CraftShowcaseProps {
  onCategorySelect?: (category: string) => void;
}

const CraftShowcase = ({ onCategorySelect }: CraftShowcaseProps) => {
  const { products } = useAdminData();

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const cat = product.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  // Get all categories, prioritizing the special ones
  const allCategoryNames = Object.keys(groupedProducts).sort((a, b) => {
    const aSpecialIdx = specialCategories.findIndex(s => s.name.toLowerCase() === a.toLowerCase());
    const bSpecialIdx = specialCategories.findIndex(s => s.name.toLowerCase() === b.toLowerCase());
    
    if (aSpecialIdx !== -1 && bSpecialIdx === -1) return -1;
    if (aSpecialIdx === -1 && bSpecialIdx !== -1) return 1;
    if (aSpecialIdx !== -1 && bSpecialIdx !== -1) return aSpecialIdx - bSpecialIdx;
    return a.localeCompare(b);
  });

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">No products available in the shop yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-24 py-10">
      {allCategoryNames.map((catName, idx) => {
        const catProducts = groupedProducts[catName];
        const special = specialCategories.find(s => s.name.toLowerCase() === catName.toLowerCase());
        
        const icon = special?.icon || <LayoutGrid size={16} />;
        const colorClass = special?.color || "text-primary";

        return (
          <motion.div 
            key={catName} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="group/section"
          >
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-background flex items-center justify-center ${colorClass} shadow-sm border border-border/50 group-hover/section:scale-110 transition-transform duration-500`}>
                  {icon}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-heading font-bold text-foreground">{catName} Curations</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{catProducts.length} Premium Artifacts</p>
                </div>
              </div>
              
              <button 
                onClick={() => onCategorySelect?.(catName)}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
              >
                View Grid <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative group/scroll">
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth no-scrollbar">
                {catProducts.map((p, i) => (
                  <div key={p.id} className="min-w-[200px] md:min-w-[260px] snap-start">
                    <ProductCard product={p} index={i} />
                  </div>
                ))}
                
                {/* View All Card */}
                <button 
                  onClick={() => onCategorySelect?.(catName)}
                  className="min-w-[200px] md:min-w-[260px] snap-start group/all h-full"
                >
                  <div className="h-full aspect-[4/5] rounded-[2.5rem] bg-background/50 border-2 border-dashed border-border/50 flex flex-col items-center justify-center space-y-4 group-hover/all:bg-primary/5 group-hover/all:border-primary/30 transition-all duration-500">
                     <div className="w-12 h-12 rounded-full bg-background shadow-md flex items-center justify-center text-primary group-hover/all:scale-110 transition-transform">
                        <ArrowRight size={20} />
                     </div>
                     <div className="text-center">
                        <p className="text-sm font-heading font-bold">See All</p>
                        <p className="text-lg font-heading font-bold text-primary">{catName} Treasures</p>
                     </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CraftShowcase;
