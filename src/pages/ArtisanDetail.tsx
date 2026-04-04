import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  MapPin, 
  History, 
  ArrowLeft, 
  Star, 
  Share2, 
  Heart,
  MessageSquare,
  Package,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import PageTransition from "@/components/PageTransition";
import ProductCard from "../components/ProductCard";
import { Magnetic } from "@/components/Magnetic";
import { useRef } from "react";
import { getProductImage } from "@/lib/utils";

const ArtisanDetail = () => {
  const { slug } = useParams();
  const { artisans, products } = useAdminData();
  const artisan = artisans.find(a => a.slug === slug);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  if (!artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Artisan Not Found</h2>
          <Link to="/artisans" className="text-primary mt-4 inline-block hover:underline">Back to Artisans</Link>
        </div>
      </div>
    );
  }

  const artisanProducts = products.filter(p => p.artisan?.id === artisan.id);

  return (
    <PageTransition title={`${artisan.name} | TofhaVerse Artisan`}>
      <StickyNav />
      
      <div ref={containerRef} className="relative min-h-screen overflow-hidden">
        {/* Hero Section */}
        <div className="relative h-[80vh] md:h-screen w-full flex items-end">
          <motion.div 
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={getProductImage(artisan.photo)} 
              alt={artisan.name} 
              className="w-full h-full object-cover grayscale-[0.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </motion.div>

          <div className="container mx-auto px-6 pb-20 relative z-10">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
               <Link to="/artisans" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm font-medium transition-colors">
                  <ArrowLeft size={16} /> Back to Gallery
               </Link>
               <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                     Verified Master
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                     <Star size={14} className="fill-amber-400" /> {artisan.stats?.rating || "4.9"}
                  </span>
               </div>
               <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter">
                  {artisan.name}
               </h1>
               <div className="flex flex-wrap items-center gap-6 text-white/80 font-medium">
                  <span className="flex items-center gap-2"><MapPin size={18} className="text-primary" /> {artisan.location}</span>
                  <span className="flex items-center gap-2"><History size={18} className="text-primary" /> {artisan.role}</span>
               </div>
            </motion.div>
          </div>
        </div>

        {/* Biography Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7"
              >
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-px bg-primary" />
                   <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">The Heritage</h2>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                   Preserving centuries of craft through a modern lens.
                </h3>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed italic">
                   <p>{artisan.bio}</p>
                   <p className="not-italic text-foreground/80 font-medium">{artisan.heritage}</p>
                </div>

                <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8">
                   <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Experience</p>
                      <p className="text-xl font-bold">15+ Years</p>
                   </div>
                   <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Works</p>
                      <p className="text-xl font-bold">{artisan.stats?.productsCount || 12} Curated Pieces</p>
                   </div>
                   <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Waitlist</p>
                      <p className="text-xl font-bold text-emerald-500">Available</p>
                   </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 space-y-8"
              >
                 <div className="bg-card/50 p-8 rounded-[3rem] border border-border/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700" />
                    <h4 className="font-bold text-xl mb-4 group-hover:translate-x-1 transition-transform">Studio Vibe</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                       Visit {artisan.name}'s studio virtually and witness the slow rhythm of deliberate creation.
                    </p>
                    <div className="flex gap-4">
                       <Button className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20">
                          View Gallery
                       </Button>
                       <Magnetic>
                          <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-2">
                             <Share2 size={18} />
                          </Button>
                       </Magnetic>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    {artisan.studioImages?.map((img, i) => (
                       <motion.div 
                         key={i}
                         whileHover={{ y: -5 }}
                         className="aspect-square rounded-[2rem] overflow-hidden bg-muted group cursor-pointer"
                       >
                          <img src={getProductImage(img)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                       </motion.div>
                    ))}
                 </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Collection Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="flex items-end justify-between mb-16">
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-4">The Collection</h2>
                <p className="text-muted-foreground">Hand-finished works available for immediate commission.</p>
              </div>
              <Button variant="ghost" className="font-bold gap-2 group">
                 View Full Archive <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {artisanProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {artisanProducts.length === 0 && (
                 <div className="col-span-full py-20 text-center bg-background rounded-[3rem] border border-dashed border-border/50">
                    <Package className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
                    <h3 className="font-bold text-xl">Private Commissions Only</h3>
                    <p className="text-muted-foreground mt-2">This artisan's portfolio is currently fully commissioned.</p>
                 </div>
              )}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 container mx-auto px-6">
           <div className="relative rounded-[4rem] overflow-hidden bg-primary p-12 md:p-24 text-center text-primary-foreground shadow-2xl shadow-primary/30">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2000')] opacity-10 mix-blend-overlay" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                 <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                    Direct Commission
                 </span>
                 <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                    Start a conversation <br /> with {artisan.name.split(' ')[0]}
                 </h2>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button className="bg-white text-primary hover:bg-white/90 h-16 px-10 rounded-2xl font-bold text-lg shadow-xl shrink-0">
                       Request Private Commission
                    </Button>
                    <Magnetic>
                       <Button variant="outline" className="h-16 px-10 rounded-2xl font-bold border-2 border-white/30 text-white hover:bg-white/10 shrink-0">
                          Follow Studio Updates
                       </Button>
                    </Magnetic>
                 </div>
              </motion.div>
           </div>
        </section>
      </div>

      <FooterSection />
    </PageTransition>
  );
};

export default ArtisanDetail;
