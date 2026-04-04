import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminData } from "@/context/AdminDataContext";
import { useCart } from "@/context/CartContext";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import PageTransition from "@/components/PageTransition";
import ProductCard from "@/components/ProductCard";
import { getProductImage } from "@/lib/utils";
import collectionSignature from "@/assets/collection-signature.jpg";
import collectionHoliday from "@/assets/collection-holiday.jpg";
import collectionSelfcare from "@/assets/collection-selfcare.jpg";
import collectionGourmet from "@/assets/collection-gourmet.jpg";


const Collections = () => {
  const { collections, isLoading: collectionsLoading } = useAdminData();
  const { addItem } = useCart();
  
  const activeCollections = collections.filter(c => c.status === 'published');

  if (collectionsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition title="Curated Collections" description="Explore our thoughtfully assembled gift sets for every taste and occasion.">
      <StickyNav />
      <main className="pt-24 pb-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight">Curated Collections</h1>
              <p className="text-muted-foreground mt-4 text-lg max-w-xl leading-relaxed">
                Explore our signature curations. Each set is a masterpiece of storytelling, artisan craft, and luxury presentation.
              </p>
            </div>
          </div>

          <div className="space-y-32">
            {activeCollections.map((col, ci) => {
              const colProducts = col.products?.map((p: any) => p.products).filter(Boolean) || [];

              return (
                <motion.section
                  key={col.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] }}
                  className="group"
                >
                  {/* Collection hero */}
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 ${ci % 2 === 1 ? "lg:direction-rtl" : ""}`}>
                    <div className={`relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/5 ${ci % 2 === 1 ? "lg:order-2" : ""}`}>
                      <img
                        src={getProductImage(col.image_url)}
                        alt={col.name}
                        loading="lazy"
                        className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                    
                    <div className={`${ci % 2 === 1 ? "lg:order-1" : ""} space-y-6`}>
                      <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary">
                         Best for: {col.best_for}
                      </div>
                      
                      <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground transition-colors group-hover:text-primary/90">
                        {col.name}
                      </h2>
                      
                      <p className="text-muted-foreground leading-relaxed text-lg italic">
                        "{col.description}"
                      </p>

                      <div className="pt-4">
                        <Link to={`/collections/${col.slug}`}>
                          <Button className="rounded-2xl h-14 px-10 text-lg font-bold shadow-xl shadow-primary/20 group/btn transition-all hover:pr-12">
                            Shop the Collection
                            <motion.span 
                              animate={{ x: [0, 5, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="ml-2"
                            >
                              <ChevronRight size={20} />
                            </motion.span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Collection products - Only show first 4 on landing */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {colProducts.slice(0, 4).map((p: any, i: number) => (
                      <ProductCard key={p.id} product={p} index={i} />
                    ))}
                  </div>
                  
                  {colProducts.length > 4 && (
                    <div className="mt-12 text-center">
                       <Link to={`/collections/${col.slug}`} className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 group/more">
                          View all {colProducts.length} items <ArrowRight size={14} className="group-hover/more:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                  )}
                </motion.section>
              );
            })}
          </div>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default Collections;
