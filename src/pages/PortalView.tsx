import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  Leaf, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  Plus,
  X
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useCart } from "@/context/CartContext";
import StickyNav from "@/components/StickyNav";
import PageTransition from "@/components/PageTransition";
import FooterSection from "@/components/FooterSection";
import WishlistButton from "@/components/WishlistButton";
import { Button } from "@/components/ui/button";
import { getProductImage } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

const PortalView = () => {
  const { slug } = useParams<{ slug: string }>();
  const { portals, products: allProducts } = useAdminData();
  const { addItem } = useCart();
  const portal = portals.find(p => p.slug === slug);

  if (!portal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-heading font-bold mb-4">Portal Not Found</h2>
        <p className="text-muted-foreground mb-8">This gifting portal may have expired or the link is incorrect.</p>
        <Link to="/"><Button>Return to TofhaVerse</Button></Link>
      </div>
    );
  }

  const portalProducts = allProducts.filter(p => portal.featuredProducts.includes(p.id));

  return (
    <PageTransition title={`${portal.client} | TofhaVerse`} description={portal.welcomeMessage}>
      <StickyNav />
      <main className="pt-24 pb-20">
        {/* Dynamic Branded Hero */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-muted/30">
            <div 
              className="absolute inset-0 opacity-10"
              style={{ backgroundColor: portal.primaryColor || "#E11D48" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          </div>
          
          <div className="container mx-auto max-w-6xl px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl p-2 flex items-center justify-center overflow-hidden border border-white/50">
                    <img src={portal.logo} alt={portal.client} className="w-full h-full object-contain" />
                  </div>
                  <X className="text-muted-foreground/40" size={16} />
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                    <Gift size={24} />
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight leading-[1.1]">
                  A Token of <br />
                  <span style={{ color: portal.primaryColor || "#E11D48" }}>Appreciation.</span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
                  {portal.welcomeMessage}
                </p>

                <div className="flex flex-wrap gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white shadow-xl shadow-black/5 border border-border/50"
                  >
                    <Sparkles className="text-primary" size={20} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Corporate Privilege</p>
                      <p className="font-bold text-sm">{portal.discountPct}% Exclusive Discount Applied</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0, 0.55, 0.45, 1] }}
                className="hidden lg:block relative"
              >
                 <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/20">
                    <img 
                      src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop" 
                      alt="Premium Experience"
                      className="w-full aspect-[4/5] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-8 left-8 text-white">
                       <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Hand-selected for you</p>
                       <p className="text-2xl font-bold font-heading">The Artisan Collection</p>
                    </div>
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-primary/20 animate-spin-slow opacity-20" />
                 <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Curation Section */}
        <section className="container mx-auto max-w-6xl px-6 -mt-12 relative z-20">
          <div className="bg-background border border-border/50 rounded-[3rem] p-8 md:p-16 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
               <div>
                  <h2 className="text-3xl font-heading font-bold mb-2">Curated Gifts for <span className="italic">{portal.client}</span></h2>
                  <p className="text-muted-foreground">Hand-picked by our specialists to match your organization's values.</p>
               </div>
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-primary/20 pb-1">
                  Browse Catalog <ChevronRight size={14} />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {portalProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <Link to={`/product/${p.id}`} className="block">
                    <div className="relative overflow-hidden rounded-3xl bg-muted mb-5 border border-border/10">
                      <img
                        src={getProductImage(p.images[0])}
                        alt={p.name}
                        className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                         <div className="bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-emerald-400/50">
                            <Sparkles size={12} className="text-white animate-pulse" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">-{portal.discountPct}% Corp Rate</span>
                         </div>
                      </div>

                      <WishlistButton
                        productId={p.id}
                        productName={p.name}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg"
                      />

                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 w-[80%]">
                        <Button 
                           onClick={(e) => {
                             e.preventDefault();
                             addItem({ productId: p.id, name: p.name, price: p.price * (1 - portal.discountPct/100), image: getProductImage(p.images[0]) });
                           }}
                           className="w-full h-12 rounded-2xl font-bold text-xs shadow-2xl shadow-primary/30"
                        >
                           <Plus size={14} className="mr-2" /> Quick Add to Bag
                        </Button>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="flex items-start justify-between px-2">
                    <Link to={`/product/${p.id}`} className="flex-1">
                      <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-sm font-bold text-primary">${(p.price * (1 - portal.discountPct/100)).toFixed(2)}</span>
                         <span className="text-xs text-muted-foreground line-through opacity-50">{p.priceFormatted}</span>
                      </div>
                    </Link>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary mt-1">
                            <ShieldCheck size={14} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-xl border-border/50 bg-background shadow-xl">
                          <p className="text-[10px] font-bold">Artisan Verified</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              ))}

              {portalProducts.length === 0 && (
                <div className="col-span-full py-24 text-center">
                  <p className="text-muted-foreground italic">No products currently curated for this portal.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Benefits for Enterprise */}
        <section className="container mx-auto max-w-6xl px-6 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-[2rem] bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                   <Truck size={32} />
                </div>
                <h3 className="text-xl font-bold">Priority Corporate Logistics</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Dedicated shipping lines ensuring your executive gifts arrive on schedule, every time.</p>
             </div>
             <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
                   <Leaf size={32} />
                </div>
                <h3 className="text-xl font-bold">Sustainability Verified</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Eco-friendly packaging and carbon-neutral distribution for your corporate social responsibility.</p>
             </div>
             <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-[2rem] bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                   <RotateCcw size={32} />
                </div>
                <h3 className="text-xl font-bold">Concierge Support</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Direct access to the TofhaVerse concierge for large-scale event support and custom branding.</p>
             </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default PortalView;
