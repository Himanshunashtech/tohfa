import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Quote, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminData } from "@/context/AdminDataContext";
import { useGetSiteContentQuery } from "@/store/api/supabaseApi";
import { rotateFeaturedArtisan } from "@/lib/storefrontUtils";
import { Button } from "./ui/button";
import { useRef, useMemo } from "react";

const ArtisanSpotlight = () => {
  const { artisans } = useAdminData();
  const { data: cmsData } = useGetSiteContentQuery();

  // Pick the artisan autonomously or via CMS
  const artisan = useMemo(() => {
    const about = cmsData?.find(item => item.section_key === 'home_about')?.content;
    if (about?.artisan_id) {
      return artisans.find(a => a.id === about.artisan_id) || artisans[0];
    }
    return rotateFeaturedArtisan(artisans);
  }, [artisans, cmsData]);

  const sectionContent = useMemo(() => {
    const about = cmsData?.find(item => item.section_key === 'home_about')?.content;
    return {
      title: about?.title || "The Soul Behind The Masterpiece",
      content: about?.content || artisan?.bio || "Every gift starts with a pair of skilled hands and a heart full of tradition...",
      image: about?.image || artisan?.photo
    };
  }, [cmsData, artisan]);

  const spotlightRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: spotlightRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  if (!artisan) return null;

  return (
    <section ref={spotlightRef} className="relative py-40 overflow-hidden bg-[#0a0a0a] text-white">
      {/* Parallax Background Glow */}
      <motion.div 
        className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none"
        style={{ y }}
      >
        <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[12rem] -translate-y-1/2 translate-x-1/4" />
      </motion.div>

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Artisan Image Collage */}
          <div className="relative order-2 lg:order-1">
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="relative rounded-[4rem] overflow-hidden aspect-[4/5] shadow-2xl border border-white/5 shadow-primary/10"
             >
                <img 
                  src={artisan.photo} 
                  alt={artisan.name} 
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-12 left-12 flex items-center gap-4">
                   <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                      <ShieldCheck className="text-primary" size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Verified Master</p>
                      <h4 className="font-bold text-lg">{artisan.name}</h4>
                   </div>
                </div>
             </motion.div>
             
             {/* Studio Image Float */}
             <motion.div 
               initial={{ opacity: 0, y: 50, scale: 0.9 }}
               whileInView={{ opacity: 1, y: 0, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="absolute -bottom-12 -right-12 w-1/2 rounded-[3rem] overflow-hidden aspect-square border-8 border-[#0a0a0a] shadow-2xl hidden md:block"
             >
                <img 
                  src={artisan.studioImages?.[0] || "https://images.unsplash.com/photo-1595914480838-8959eb4482c3?q=80&w=800"} 
                  className="w-full h-full object-cover" 
                  alt="Studio context"
                />
             </motion.div>
          </div>

          {/* Artisan Story content */}
          <div className="space-y-10 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-[0.2em]">
               <MapPin size={14} /> Artisan Spotlight
            </div>
            
            <div className="space-y-6">
               <h2 className="font-heading text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter">
                 {sectionContent.title.includes('Masterpiece') ? (
                   <>
                     The Soul <br /> Behind The <br /> <span className="text-primary">Masterpiece</span>
                   </>
                 ) : sectionContent.title}
               </h2>
               <p className="text-xl text-white/60 leading-relaxed max-w-xl italic font-serif">
                  "{sectionContent.content}"
               </p>
            </div>

            <div className="grid grid-cols-2 gap-8 py-4">
               <div>
                  <p className="text-4xl font-heading font-bold text-white mb-2">{artisan.stats?.rating || "4.9"}<span className="text-primary text-2xl font-normal">/5</span></p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Global Artisan Rating</p>
               </div>
               <div>
                  <p className="text-4xl font-heading font-bold text-white mb-2">{artisan.stats?.productsCount || "24"}</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Masterpiece Collection</p>
               </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
               <Link to={`/artisan/${artisan.slug}`}>
                  <Button size="lg" className="rounded-full h-16 px-10 text-lg font-bold bg-primary text-primary-foreground hover:scale-105 transition-transform group">
                     Explore Legacy <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </Button>
               </Link>
               <Link to="/about">
                  <Button variant="outline" size="lg" className="rounded-full h-16 px-10 text-lg font-bold border-white/20 text-white bg-transparent hover:bg-white/5 hover:text-white">
                     Our Mission
                  </Button>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisanSpotlight;
