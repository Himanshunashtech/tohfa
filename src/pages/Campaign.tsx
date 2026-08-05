import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import { Link } from "react-router-dom";
import { Play, ArrowRight, Star, Heart, Sparkles, Loader2, MousePointer2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// No local imports - using bucket assets only

interface CampaignItem {
  src: string;
  title: string;
  subtitle: string;
  fileName: string;
}

const GiftCardStack = ({ cards, theme = 'gold' }: { cards: { title: string; description: string }[]; theme?: 'gold' | 'silver' }) => {
  const [currentCards, setCurrentCards] = useState(cards);
  const [hasInteracted, setHasInteracted] = useState(false);

  const cycle = () => {
    setHasInteracted(true);
    const [top, ...rest] = currentCards;
    setCurrentCards([...rest, top]);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[450px] cursor-pointer group pt-10" onClick={cycle}>
      <AnimatePresence mode="popLayout">
        {currentCards.map((card, i) => {
          const isTop = i === 0;
          return (
            <motion.div
              key={card.title}
              layout
              initial={{ x: 0, scale: 0.9, opacity: 0 }}
              animate={{
                x: i * 35,
                y: i * -30,
                scale: 1 - i * 0.04,
                zIndex: currentCards.length - i,
                opacity: 1 - i * 0.15,
                rotate: i * 4
              }}
              exit={{
                x: -600,
                opacity: 0,
                rotate: -20,
                transition: { duration: 1.0, ease: "circOut" }
              }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className={`absolute inset-0 p-8 rounded-[2rem] border backdrop-blur-3xl shadow-2xl flex flex-col justify-between transition-colors duration-500 ${theme === 'gold'
                ? 'bg-gradient-to-br from-white/10 to-white/5 border-secondary/30'
                : 'bg-gradient-to-br from-white/10 to-white/5 border-primary/30'
                }`}
            >
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'gold' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-2xl font-bold tracking-tight">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-1">
                  {[1, 2, 3].map((dot, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${(currentCards.length - i - 1) === idx ? (theme === 'gold' ? 'bg-secondary w-4' : 'bg-primary w-4') : 'bg-white/20'
                        }`}
                    />
                  ))}
                </div>
                <span className={`text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 ${theme === 'gold' ? 'text-secondary' : 'text-primary'}`}>
                  Tofhaverse Edition
                </span>
              </div>

              {/* Premium Border Overlay */}
              <div className={`absolute inset-2 border rounded-[1.6rem] pointer-events-none opacity-20 ${theme === 'gold' ? 'border-secondary' : 'border-primary'}`}></div>

              {/* Animated Tap Hint (Only on top card before interaction) */}
              {isTop && !hasInteracted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.8, 1, 0.9, 0.8],
                    x: [20, 0, 10, 20],
                    y: [20, 0, 10, 20]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-12 right-12 pointer-events-none flex flex-col items-center gap-2"
                >
                  <MousePointer2 className={`w-8 h-8 ${theme === 'gold' ? 'text-secondary' : 'text-primary'}`} fill="currentColor" />
                  <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Tap to Reveal</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Click to reveal next story
      </div>
    </div>
  );
};

const Campaign = () => {
  const [loading, setLoading] = useState(true);
  const [campaignItems, setCampaignItems] = useState<CampaignItem[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<'mastery' | 'celebration'>('mastery');

  // Metadata mapping for filenames
  const metadataMap: Record<string, { title: string; subtitle: string }> = {
    "A_Gift": { title: "Meaningful Gifting", subtitle: "Beyond objects, we gift stories." },
    "Crafted": { title: "Master Hands", subtitle: "The touch of excellence in every piece." },
    "Ethical": { title: "Timeless Grace", subtitle: "Ethical beauty that never fades." },
    "Functional": { title: "Functional Art", subtitle: "Where utility meets inspiration." },
    "Honor_Her_Legacy": { title: "Legacy", subtitle: "Honoring the hands that built us." },
    "Honor_Her_With": { title: "Heritage & Honor", subtitle: "Preserving traditions for the future." },
    "Make_Her": { title: "Truly Seen", subtitle: "A gift that speaks her language." },
    "Mastery": { title: "Mastery Meets Matriarchy", subtitle: "A celebration of strength and skill." },
    // Celebration (Earth Day) Campaign Metadata
    "Earth": { title: "Honor the Earth", subtitle: "A vow for environmental preservation." },
    "Purpose": { title: "Celebrate with Purpose", subtitle: "Gifts that respect the world we share." },
    "Conscious": { title: "Conscious Luxury", subtitle: "A legacy of ethical stewardship." },
    "Artistry": { title: "Enduring Artistry", subtitle: "Beauty that respects its origins." },
    "Environmental": { title: "Environmental Respect", subtitle: "Rooted in nature, crafted for her." },
    "Connections": { title: "Meaningful Connections", subtitle: "Connecting hearts, protecting our home." },
  };

  const getMetadata = (fileName: string) => {
    for (const key in metadataMap) {
      if (fileName.includes(key)) return metadataMap[key];
    }
    return { title: fileName.split('.')[0].replace(/_/g, ' '), subtitle: "Part of our heritage collection." };
  };

  useEffect(() => {
    const fetchCampaignAssets = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.storage.from('campaigns').list();

        if (error) throw error;

        if (data && data.length > 0) {
          const items = data.map(file => {
            const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(file.name);
            const metadata = getMetadata(file.name);
            return {
              src: publicUrl,
              ...metadata,
              fileName: file.name
            };
          });

          // Sort items - put Mastery Meets Matriarchy first for the hero
          items.sort((a, b) => b.fileName.includes('Mastery') ? 1 : -1);
          setCampaignItems(items);
        } else {
          // Fallback to local assets if bucket is empty
          console.log("Bucket empty, using local fallbacks");
          setCampaignItems([
            { src: "", title: "Mastery Meets Matriarchy", subtitle: "A celebration of strength and skill.", fileName: "Mastery" },
            { src: "", title: "Meaningful Gifting", subtitle: "Beyond objects, we gift stories.", fileName: "A_Gift" },
            { src: "", title: "Heritage & Honor", subtitle: "Preserving traditions for the future.", fileName: "Honor_Her_With" },
            { src: "", title: "Master Hands", subtitle: "The touch of excellence in every piece.", fileName: "Crafted" },
            { src: "", title: "Timeless Grace", subtitle: "Ethical beauty that never fades.", fileName: "Ethical" },
            { src: "", title: "Functional Art", subtitle: "Where utility meets inspiration.", fileName: "Functional" },
            { src: "", title: "Legacy", subtitle: "Honoring the hands that built us.", fileName: "Honor_Her_Legacy" },
            { src: "", title: "Truly Seen", subtitle: "A gift that speaks her language.", fileName: "Make_Her" },
          ]);
        }
      } catch (err) {
        console.error("Error fetching campaign assets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignAssets();
  }, []);

  // Split items into campaigns
  const masteryAssets = campaignItems.filter(item =>
    !item.fileName.includes('Earth') &&
    !item.fileName.includes('Purpose') &&
    !item.fileName.includes('Conscious') &&
    !item.fileName.includes('Artistry') &&
    !item.fileName.includes('Environmental') &&
    !item.fileName.includes('Connections') &&
    item.fileName.toLowerCase() !== 'v3.mp4' &&
    item.fileName.toLowerCase() !== 'v4.mp4'
  );

  const celebrationAssets = campaignItems.filter(item =>
    item.fileName.includes('Earth') ||
    item.fileName.includes('Purpose') ||
    item.fileName.includes('Conscious') ||
    item.fileName.includes('Artistry') ||
    item.fileName.includes('Environmental') ||
    item.fileName.includes('Connections') ||
    item.fileName.toLowerCase() === 'v3.mp4' ||
    item.fileName.toLowerCase() === 'v4.mp4'
  );

  const currentAssets = activeCampaign === 'mastery' ? masteryAssets : celebrationAssets;

  const heroImage = currentAssets.find(item => item.fileName.includes('Mastery') || item.fileName.includes('Earth'))?.src || currentAssets[0]?.src || "";
  const legacyVideo = activeCampaign === 'mastery'
    ? masteryAssets.find(item => item.fileName.toLowerCase() === 'v1.mp4')?.src
    : celebrationAssets.find(item => item.fileName.toLowerCase() === 'v3.mp4')?.src || masteryAssets.find(item => item.fileName.toLowerCase() === 'v1.mp4')?.src;

  const legacyFallbackImage = currentAssets.find(item => item.fileName.includes('Legacy') || item.fileName.includes('Vow'))?.src || "";

  const journeyVideo = activeCampaign === 'mastery'
    ? currentAssets.find(item => item.fileName.toLowerCase() === 'v2.mp4')?.src
    : currentAssets.find(item => item.fileName.toLowerCase() === 'v4.mp4')?.src || currentAssets.find(item => item.fileName.toLowerCase() === 'v2.mp4')?.src;

  const ctaImage = currentAssets.find(item => item.fileName.includes('Seen') || item.fileName.includes('Purpose'))?.src || "";

  // Card Content Data
  const legacyCards = [
    { title: "The Mother's Voice", description: "Wisdom whispered through generations, shaping the very hands that create our most cherished heirlooms. It is a voice of resilience, guiding the artisan through the quiet concentration of their craft, ensuring that every piece carries the weight of a lineage that values heart over haste." },
    { title: "Artisan Lineage", description: "A storied heritage of skill and dedication, preserved in every intricate stitch, fold, and finish. These techniques are not found in books, but in the memory of the hands — a silent dialogue between the master and the apprentice that has continued unbroken for centuries." },
    { title: "Heirloom Standard", description: "Crafted not for a fleeting season, but for a lifetime of stories and the generations yet to come. Our definition of luxury is found in endurance; we create objects that gather beauty with age, intended to be passed down as tangible proof of a family's enduring love." }
  ];

  const archiveCards = [
    { title: "Raw Potential", description: "Selecting only the finest earth-born materials as our canvas for uncompromising beauty and strength. From the texture of ethically sourced leather to the luster of hand-spun silks, each material is chosen for its ability to tell a story and its promise to age with grace." },
    { title: "The Quiet Hours", description: "Where patience meets precision in the heart of our workshop, turning time into timeless art. In an age of mass production, we celebrate the slow rhythm of the needle and the loom, where a single afternoon might be spent perfecting a single, unseen detail." },
    { title: "The Final Vow", description: "A singular signature of excellence placed upon every completed masterpiece before it leaves our care. This final inspection is more than a quality check; it is a vow that this object is ready to witness the milestones, the joys, and the quiet moments of your life." }
  ];

  const preservationCards = [
    { title: "Earth's Bounty", description: "Deeply respecting the soil that provides our medium, our inspiration, and the legacy of our craft. We believe that true luxury cannot exist at the expense of nature; therefore, we only harvest what can be replenished, honoring the cyclical wisdom of the world." },
    { title: "Sustainable Rhythm", description: "A production cycle that breathes in harmony with the planet, ensuring beauty without compromise. By localizing our supply chain and utilizing traditional carbon-neutral methods, we minimize our footprint while maximizing the human impact of every creation." },
    { title: "The Vow of Care", description: "Gifting that honors both the recipient and the environment through conscious, zero-waste practices. Our packaging is designed to be kept or composted, ensuring that the joy of receiving a Tofhaverse gift leaves no trace on the earth, only a lasting impression on the soul." }
  ];

  return (
    <PageTransition title="Our Campaign | TofhaVerse" description="Mastery Meets Matriarchy - A tribute to the hands that create and the hearts that give.">
      <StickyNav />
      <main className="bg-background overflow-hidden min-h-screen">
        <AnimatePresence>
          {loading ? (
            <div className="h-[80vh] flex flex-col items-center justify-center text-center px-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="space-y-6"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                  <Sparkles className="absolute inset-0 m-auto text-secondary w-6 h-6 animate-pulse" />
                </div>
                <p className="text-sm font-bold tracking-[0.3em] uppercase text-primary animate-pulse">Loading Campaign Experience</p>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Cinematic Hero */}
              <section className="relative min-h-[100vh] md:h-[100vh] flex items-center justify-center overflow-hidden">
                <motion.div
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.4 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute inset-0 z-0"
                >
                  <img src={heroImage} alt="Campaign Hero" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background"></div>
                </motion.div>

                <div className="container relative z-10 mx-auto px-6 text-center pt-28 md:pt-32">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 mb-10 md:mb-14"
                  >
                    {/* <Sparkles className="text-secondary w-5 h-5" />
                    <span className="text-sm font-bold tracking-[0.3em] uppercase text-primary">{activeCampaign === 'mastery' ? 'Original Campaign 2024' : 'Earth Day Edition 2024'}</span>
                    <Sparkles className="text-secondary w-5 h-5" /> */}
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="font-heading text-4xl sm:text-5xl md:text-8xl font-bold mb-6 md:mb-8 leading-tight text-slate-900"
                  >
                    {activeCampaign === 'mastery' ? (
                      <>
                        Mastery Meets <br />
                        <span className="text-secondary italic">Matriarchy</span>
                      </>
                    ) : (
                      <>
                        Celebrate Them, <br />
                        <span className="text-secondary italic">Honor the Earth</span>
                      </>
                    )}
                  </motion.h1>

                  {/* Campaign Switcher */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex justify-center mt-8 mb-10 md:mt-12 md:mb-16"
                  >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-full inline-flex gap-2">
                      <button
                        onClick={() => setActiveCampaign('mastery')}
                        className={`px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all ${activeCampaign === 'mastery'
                          ? 'bg-secondary text-secondary-foreground shadow-lg'
                          : 'text-white/60 hover:text-white'
                          }`}
                      >
                        Mastery
                      </button>
                      <button
                        onClick={() => setActiveCampaign('celebration')}
                        className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-sm font-bold tracking-widest uppercase transition-all ${activeCampaign === 'celebration'
                          ? 'bg-secondary text-secondary-foreground shadow-lg'
                          : 'text-white/60 hover:text-white'
                          }`}
                      >
                        Celebration
                      </button>
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="text-base md:text-2xl text-slate-700 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed font-medium"
                  >
                    {activeCampaign === 'mastery'
                      ? "A tribute to the silent architects of our heritage — the women whose hands weave the fabric of our culture and the artisans who preserve it."
                      : "A tribute to the planet that sustains our creativity — where every gift chosen is a vow of preservation and a respect for the world we share."}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex flex-wrap justify-center gap-4 md:gap-6 pb-20 md:pb-0"
                  >
                    <Link to="/shop" className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-transform group">
                      Explore The Collection <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </section>

              {/* Narrative Section */}
              <section className="py-32 container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                  >
                    <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                      {activeCampaign === 'mastery' ? (
                        <>
                          Honoring the Legacy <br />
                          <span className="text-secondary">Of Craft & Care</span>
                        </>
                      ) : (
                        <>
                          Global Preservation <br />
                          <span className="text-secondary">& Environmental Respect</span>
                        </>
                      )}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {activeCampaign === 'mastery'
                        ? "Our latest campaign explores the profound intersection between the wisdom of matriarchy and the discipline of mastery. Each piece in this collection was selected to represent the resilience, grace, and artistry passed down through generations."
                        : "Leveraging the upcoming Earth Day sentiment to position birthday gifting as an act of global preservation and environmental respect. A tribute to the world that nurtures the hands that create."}
                    </p>
                    <div className="grid grid-cols-2 gap-8 pt-6">
                      <div>
                        <div className="text-primary font-bold text-3xl mb-1">
                          {activeCampaign === 'mastery' ? "8+" : "100%"}
                        </div>
                        <div className="text-sm text-muted-foreground uppercase tracking-widest">
                          {activeCampaign === 'mastery' ? "Master Artisans" : "Neutral Carbon"}
                        </div>
                      </div>
                      <div>
                        <div className="text-primary font-bold text-3xl mb-1">
                          {activeCampaign === 'mastery' ? "100%" : "Zero"}
                        </div>
                        <div className="text-sm text-muted-foreground uppercase tracking-widest">
                          {activeCampaign === 'mastery' ? "Ethically Crafted" : "Waste Sourcing"}
                        </div>
                      </div>
                    </div>

                    <div className="pt-10 max-w-lg">
                      <GiftCardStack
                        cards={activeCampaign === 'mastery' ? legacyCards : preservationCards}
                        theme={activeCampaign === 'mastery' ? 'gold' : 'silver'}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative h-[700px] md:h-[1000px] w-full rounded-[3rem] overflow-hidden group shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
                  >
                    {legacyVideo ? (
                      <video
                        src={legacyVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover transition-all duration-700 hover:brightness-[0.8]"
                      />
                    ) : (
                      <img src={legacyFallbackImage} alt="Legacy" className="w-full h-full object-cover transition-all duration-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-12">
                      <p className="text-white text-xl italic font-heading">
                        {legacyVideo ? "Experience the Craft" : "Honor Her Legacy With Theirs"}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Visual Gallery */}
              <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-6">
                  <div className="text-center mb-20">
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Visual Journal</span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold">The Campaign Story</h2>
                  </div>

                  <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {currentAssets
                      .filter(item => !item.fileName.toLowerCase().endsWith('.mp4'))
                      .map((img, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="break-inside-avoid relative rounded-3xl overflow-hidden group shadow-xl"
                        >
                          <img src={img.src} alt={img.title} className="w-full h-auto object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                          <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-white font-bold text-xl mb-1">{img.title}</h3>
                            <p className="text-white/70 text-sm">{img.subtitle}</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </section>

              {/* Expanded Video Journey Section - Reconstructed for 2-column layout */}
              {journeyVideo && (
                <section className="py-32 container mx-auto px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Video Column (Left) */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="relative h-[700px] md:h-[1000px] w-full rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] ring-1 ring-white/10 order-2 lg:order-1"
                    >
                      <video
                        src={journeyVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover transition-all duration-700 hover:brightness-[0.8]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </motion.div>

                    {/* Text Column (Right) */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="space-y-8 order-1 lg:order-2"
                    >
                      <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                        The Living Archive <br />
                        <span className="text-secondary italic">A Heartbeat of Creation</span>
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        Witness the rhythm of creation. From the first touch of raw materials to the final flourish of excellence, this is the heartbeat of Tofhaverse. Each movement is a testament to the discipline required to turn an idea into an heirloom.
                      </p>
                      <div className="grid grid-cols-2 gap-8 pt-6">
                        <div>
                          <div className="text-primary font-bold text-3xl mb-1">15+</div>
                          <div className="text-sm text-muted-foreground uppercase tracking-widest">Handcrafted Designs</div>
                        </div>
                        <div>
                          <div className="text-primary font-bold text-3xl mb-1">Heritage</div>
                          <div className="text-sm text-muted-foreground uppercase tracking-widest">Sustainable Materials</div>
                        </div>
                      </div>

                      <div className="pt-10 max-w-lg">
                        <GiftCardStack cards={archiveCards} theme="gold" />
                      </div>
                    </motion.div>
                  </div>
                </section>
              )}

              {/* Quote Section */}
              <section className="py-32 bg-primary text-primary-foreground text-center">
                <div className="container mx-auto px-6 max-w-4xl">
                  <Heart className="w-12 h-12 mx-auto mb-10 text-secondary fill-secondary" />
                  <h2 className="text-3xl md:text-5xl font-heading font-medium italic leading-relaxed">
                    "To gift is to recognize the artistry in another human soul. This campaign is our letter of appreciation to the creators and the nurturers."
                  </h2>
                  <div className="mt-12 h-px w-24 bg-white/20 mx-auto"></div>
                  <p className="mt-8 uppercase tracking-[0.3em] font-bold text-sm">The Tofhaverse Vision</p>
                </div>
              </section>

              {/* CTA Section */}
              <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <img src={ctaImage} className="w-full h-full object-cover blur-2xl" alt="CTA backdrop" />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                  <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8">Ready to start your story?</h2>
                  <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Each gift from our campaign collection comes with a limited edition storytelling card and premium heritage packaging.
                  </p>
                  <Link to="/shop" className="px-12 py-5 bg-secondary text-secondary-foreground rounded-full font-bold text-lg hover:scale-105 transition-transform inline-block">
                    Shop The Campaign
                  </Link>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default Campaign;
