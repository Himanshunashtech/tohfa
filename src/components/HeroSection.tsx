import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Gift, Sparkles, ArrowRight, MousePointer2 } from "lucide-react";
import { useRef, useMemo } from "react";
import heroImg from "@/assets/hero-gift.jpg";
import { Magnetic } from "./Magnetic";
import { useGetSiteContentQuery, useGetCollectionsQuery } from "@/store/api/supabaseApi";
import { getAutonomousHeroSelection } from "@/lib/storefrontUtils";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { data: cmsData } = useGetSiteContentQuery();
  const { data: collections } = useGetCollectionsQuery();

  const heroContent = useMemo(() => {
    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    // 1. Check CMS Override
    const heroEntry = cmsData?.find(item => item.section_key === 'home_hero');
    const hero = heroEntry?.content;
    const cmsUpdatedAt = heroEntry?.updated_at;
    const isCmsValid = cmsUpdatedAt ? (now - new Date(cmsUpdatedAt).getTime()) < ONE_DAY_MS : false;

    // 2. Check Autonomous Selection
    const autonomousHero = getAutonomousHeroSelection(collections || []);
    const autoTime = autonomousHero?.updated_at || autonomousHero?.created_at;
    const isAutoValid = autoTime ? (now - new Date(autoTime).getTime()) < ONE_DAY_MS : false;

    // Original Heritage Text (The Fallback)
    const originalTitle = "Elevating The Art Of Generosity";
    const originalSubtitle = "TofhaVerse is where master craftsmanship meets white-glove logistics. Discover gifts that leave an enduring legacy.";

    return {
      title: isCmsValid ? (hero?.title || originalTitle) : (isAutoValid ? (autonomousHero?.name || originalTitle) : originalTitle),
      subtitle: isCmsValid ? (hero?.subtitle || originalSubtitle) : (isAutoValid ? (autonomousHero?.description || originalSubtitle) : originalSubtitle),
      ctaPrimary: isCmsValid ? (hero?.cta_primary || "Begin Curating") : (isAutoValid ? "Explore Collection" : "Begin Curating"),
      ctaPrimaryLink: isCmsValid ? (hero?.cta_primary_link || "/shop") : (isAutoValid && autonomousHero ? `/collections/${autonomousHero.slug}` : "/shop"),
      ctaSecondary: isCmsValid ? (hero?.cta_secondary || "Meet the Makers") : "Meet the Makers",
      ctaSecondaryLink: isCmsValid ? (hero?.cta_secondary_link || "/artisans") : "/artisans",
      image: isCmsValid ? (hero?.image || heroImg) : (isAutoValid && autonomousHero?.banner_image ? autonomousHero.banner_image : heroImg)
    };
  }, [cmsData, collections]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-foreground">
      {/* Cinematic Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y, scale }} >
        <img
          src={heroContent.image}
          alt="Elegantly wrapped gift box"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-transparent to-foreground" />
      </motion.div>

      {/* Floating Particles / Bokeh */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full blur-sm"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{
              y: [null, "-20%", "120%"],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ opacity }}
          className="space-y-8"
        >

          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.9] tracking-tighter whitespace-pre-line">
            {heroContent.title.includes('Generosity') ? (
              <>
                {heroContent.title.split('Generosity')[0]}
                <span className="text-primary italic font-light">Generosity </span>
                {heroContent.title.split('Generosity')[1]}
              </>
            ) : (
              heroContent.title.includes('\n') ? heroContent.title : heroContent.title.replace(/Of /g, 'Of \n')
            )}
          </h1>

          <p className="text-lg md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed font-medium">
            {heroContent.subtitle}
          </p>

          <div className="mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Magnetic strength={0.4}>
                <Link to={heroContent.ctaPrimaryLink || "/shop"}>
                  <Button size="lg" className="rounded-full h-16 px-12 text-lg font-bold bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-2xl shadow-primary/40 group">
                    {heroContent.ctaPrimary} <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Link to={heroContent.ctaSecondaryLink || "/artisans"}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full h-16 px-10 text-lg font-bold border-2 border-white/40 !text-white bg-white/5 hover:bg-white/20 hover:border-white transition-all backdrop-blur-md"
                  >
                    {heroContent.ctaSecondary}
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest mb-2 font-mono">Scroll to Discover</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-16 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>

    </section>
  );
};

export default HeroSection;
