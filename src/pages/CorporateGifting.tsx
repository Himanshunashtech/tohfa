import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Globe,
  Gift,
  Upload,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Star,
  Paintbrush,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import { toast } from "sonner";
import { CatalogModal } from "@/components/CatalogModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft } from "lucide-react";

const CorporateGifting = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const isMobile = useIsMobile();

  // Package Builder State
  const [step, setStep] = useState(1);
  const [boxStyle, setBoxStyle] = useState("Matte Black");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const builderItems = [
    { id: "candle", name: "Artisan Candle", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300" },
    { id: "truffles", name: "Gourmet Truffles", img: "https://images.unsplash.com/photo-1549463591-24c1882bd396?q=80&w=300" },
    { id: "mug", name: "Stone Mug", img: "https://images.unsplash.com/photo-1512418490979-92798ccc13b0?q=80&w=300" },
    { id: "journal", name: "Leather Journal", img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=300" },
    { id: "coasters", name: "Marble Coasters", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=300" },
    { id: "scarf", name: "Peace Silk Scarf", img: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=300" },
    { id: "honey", name: "Wild Honey Set", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=300" },
    { id: "diffuser", name: "Aroma Diffuser", img: "https://images.unsplash.com/photo-1620980591763-71887372d6ed?q=80&w=300" }
  ];

  const boxStyles = [
    { name: "Matte Black", color: "bg-slate-950", border: "border-slate-800" },
    { name: "Kraft Earth", color: "bg-[#d2b48c]", border: "border-[#c1a17b]" },
    { name: "Linen Gold", color: "bg-[#f5f5dc]", border: "border-[#e5e5cc]" }
  ];

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(i => i !== itemId) : [...prev, itemId].slice(0, 4)
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target?.result as string);
      reader.readAsDataURL(file);
      toast.success("Logo uploaded for preview!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate data collection
    const inquiryData = {
      boxStyle,
      items: selectedItems.map(id => builderItems.find(item => item.id === id)?.name),
      hasLogo: !!logo
    };

    console.log("Inquiry Submitted:", inquiryData);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Bulk inquiry for '${boxStyle}' collection sent! Our corporate concierge will contact you within 2 hours.`, {
        duration: 5000
      });
      (e.target as HTMLFormElement).reset();
      setLogo(null);
      setSelectedItems([]);
      setStep(1);
    }, 2000);
  };

  return (
    <PageTransition title="Corporate Gifting" description="Elevate your business relationships with premium bulk gifting solutions.">
      {!isMobile && <StickyNav />}

      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-background/80 backdrop-blur-xl border-b border-border/10 p-4 flex items-center justify-between">
          <Link to="/" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
            <ChevronLeft size={20} />
          </Link>
          <div className="text-center">
            <h3 className="text-sm font-heading font-black italic">TofhaVerse</h3>
            <p className="text-[8px] uppercase tracking-widest font-bold text-primary">Corporate Solutions</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsCatalogOpen(true)} className="rounded-full">
            <Star size={18} className="text-primary" />
          </Button>
        </div>
      )}

      <main className={`${isMobile ? "pt-20" : "pt-24"} min-h-screen`}>

        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                  <Briefcase size={12} /> B2B Solutions
                </div>
                <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight italic">
                  Business <span className="text-primary not-italic">Appreciation</span>, Redefined.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  From client onboarding to employee milestones, TofhaVerse provides artisan-crafted bulk gifts that tell your brand's unique story.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
                    className="rounded-full px-10 h-14 text-base font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
                  >
                    Explore Solutions
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsCatalogOpen(true)}
                    className="rounded-full px-10 h-14 text-base font-bold border-2 hover:bg-muted/50 transition-all"
                  >
                    View Catalog
                  </Button>
                </div>
                <div className="flex items-center gap-8 pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Global Partners</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">50k+</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Gifts Delivered</p>
                  </div>
                </div>
              </motion.div>

              {/* Interactive Gift Box Architect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white rounded-[3rem] ${isMobile ? "p-6 rounded-[2.5rem]" : "md:p-10 shadow-2xl"} border border-border relative overflow-visible`}
              >
                <div className={`absolute top-0 ${isMobile ? "left-6" : "right-10"} -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full text-xs font-bold shadow-xl z-20`}>
                  Gift Architect
                </div>

                <div className="flex flex-col h-full">
                  {/* Preview Area */}
                  <div className="mb-6 md:mb-10">
                    <div className={`relative aspect-[16/10] rounded-[3rem] overflow-visible flex items-center justify-center transition-all duration-1000 ${boxStyles.find(s => s.name === boxStyle)?.color} shadow-2xl`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none rounded-[3rem]" />

                      {/* Architect Blueprint Grid Overlay */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                      {/* Box Lid Representation (Interactive) */}
                      <motion.div
                        animate={{
                          rotateX: step === 2 ? 60 : 0,
                          y: step === 2 ? -60 : 0,
                          scale: step === 2 ? 0.9 : 1
                        }}
                        transition={{ type: "spring", damping: 12 }}
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="relative w-48 h-48 bg-white/10 backdrop-blur-md border-[1.5px] border-white/30 rounded-3xl flex items-center justify-center p-6 cursor-pointer group/lid hover:bg-white/20 transition-all overflow-hidden z-20 shadow-2xl shadow-black/20"
                      >
                        {logo ? (
                          <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={logo}
                            alt="Logo"
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover/lid:scale-110 transition-transform">
                              <Paintbrush size={16} className="text-white" />
                            </div>
                            <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-white text-center leading-tight">Your Logo <br /> Here</div>
                          </div>
                        )}

                        {/* Lid Corner Accents */}
                        <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-white/40" />
                        <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-white/40" />
                        <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-white/40" />
                        <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-white/40" />
                      </motion.div>

                      {/* Item Previews inside the "Open" Box (Visible during Step 2) */}
                      <div className="absolute inset-x-0 bottom-12 flex justify-center items-center gap-3 px-8 pointer-events-none">
                        <AnimatePresence>
                          {selectedItems.map((itemId, i) => (
                            <motion.div
                              key={itemId}
                              initial={{ y: 50, opacity: 0, scale: 0.5, rotate: -15 }}
                              animate={{
                                y: step === 2 ? 0 : 20,
                                opacity: step === 2 ? 1 : 0,
                                scale: step === 2 ? 1 : 0.5,
                                rotate: 0
                              }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="w-14 h-14 bg-white rounded-2xl overflow-hidden border border-white/20 shadow-xl shadow-black/10 flex-shrink-0"
                            >
                              <img src={builderItems.find(item => item.id === itemId)?.img} className="w-full h-full object-cover" />
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {selectedItems.length === 0 && step === 2 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-white/40 text-[10px] font-bold uppercase tracking-widest"
                          >
                            Box Empty
                          </motion.p>
                        )}
                      </div>

                      {/* Box Depth Accent */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/10 blur-xl rounded-full" />
                    </div>
                  </div>

                  {/* Step Wizard */}
                  <div className="space-y-6">
                    <div className="flex gap-2 mb-2">
                      {[1, 2, 3].map(s => (
                        <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
                      ))}
                    </div>

                    {step === 1 && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold italic">Step 1: <span className="text-primary not-italic">Select Box Vibe</span></h3>
                        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-3"} gap-3`}>
                          {boxStyles.map(style => (
                            <button
                              key={style.name}
                              onClick={() => setBoxStyle(style.name)}
                              className={`p-4 rounded-2xl border-2 transition-all text-center flex items-center gap-4 ${isMobile ? "justify-start px-6" : "sm:flex-col"} ${boxStyle === style.name ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:bg-muted'}`}
                            >
                              <div className={`${isMobile ? "w-10 h-10 rounded-full" : "w-16 sm:w-full h-8 sm:h-12 rounded-lg mb-2"} ${style.color}`} />
                              <span className="text-[10px] font-bold uppercase tracking-tighter shrink-0">{style.name}</span>
                            </button>
                          ))}
                        </div>
                        <Button className="w-full rounded-2xl h-14 font-bold text-base" onClick={() => setStep(2)}>Next: Artisan Contents</Button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold italic">Step 2: <span className="text-primary not-italic">Add Curated Items</span></h3>
                        <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-none">
                          {builderItems.map(item => (
                            <button
                              key={item.id}
                              onClick={() => toggleItem(item.id)}
                              className={`min-w-[120px] p-2 rounded-2xl border-2 transition-all text-left group ${selectedItems.includes(item.id) ? 'border-primary bg-primary/5' : 'border-border'}`}
                            >
                              <div className="relative aspect-square rounded-2xl overflow-hidden mb-2">
                                <img src={item.img} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                {selectedItems.includes(item.id) && (
                                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[2px]">
                                    <CheckCircle2 size={28} className="text-primary-foreground fill-primary" />
                                  </div>
                                )}
                              </div>
                              <span className="text-[10px] font-bold block truncate text-center px-1">{item.name}</span>
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <Button variant="outline" className="w-full sm:flex-1 rounded-2xl h-14 font-bold" onClick={() => setStep(1)}>Back</Button>
                          <Button className="w-full sm:flex-[2] rounded-2xl h-14 font-bold" onClick={() => setStep(3)}>Next: Branding</Button>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold italic">Step 3: <span className="text-primary not-italic">Finalize Branding</span></h3>
                        <div className="p-6 border-2 border-dashed border-border rounded-2xl flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-all" onClick={() => document.getElementById('logo-upload')?.click()}>
                          <Upload size={24} className="text-primary mb-2" />
                          <span className="text-sm font-bold">{logo ? "Replace Logo" : "Upload Your Logo"}</span>
                          <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button variant="outline" className="w-full sm:flex-1 rounded-2xl h-14 font-bold" onClick={() => setStep(2)}>Back</Button>
                          <Button className="w-full sm:flex-[2] rounded-2xl h-14 font-bold" onClick={() => {
                            document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
                            toast.success("Package design finalized!");
                          }}>Get Custom Quote</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Brand Logos / Trust section */}
        <section className="py-12 border-y border-border/40 bg-muted/5 overflow-hidden">
          <div className="container mx-auto px-6">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50 mb-8">Trusted by global visionaries</p>
            <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
              {["LUMIA", "AETHER", "VELOCITY", "NEXUS", "ORION"].map((brand) => (
                <span key={brand} className="text-2xl font-heading font-black tracking-tighter">{brand}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Showcase / Gifting Masonry */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="max-w-2xl">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4 block">Visual Inspiration</span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold italic leading-tight">Masterpieces in <span className="text-primary not-italic">Bulk</span> Gifting.</h2>
              </div>
              <Link to="/collections">
                <Button variant="link" className="text-foreground font-bold flex items-center gap-2 group">
                  Explore all collections <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className={`grid grid-cols-1 ${isMobile ? "gap-4" : "md:grid-cols-12 gap-6 md:h-[1000px]"}`}>
              {/* Large Featured Kit */}
              <motion.div
                whileHover={{ y: -10 }}
                className={`${isMobile ? "h-[500px]" : "md:col-span-8 md:row-span-1"} relative group rounded-[3rem] overflow-hidden shadow-xl`}
              >
                <img
                  src="https://images.unsplash.com/photo-1625552187571-7ee60ac43d2b?fm=jpg&q=60&w=3000&auto=format&fit=crop"
                  alt="Corporate Luxury Kit"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 text-white max-w-md">
                  <div className="inline-block px-3 py-1 bg-primary rounded-full text-[9px] font-bold uppercase tracking-widest mb-3">Holiday VIP 2024</div>
                  <h3 className="text-3xl font-heading font-bold italic mb-4">The Executive Connoisseur Kit</h3>
                  <p className="text-sm text-white/70 leading-relaxed italic">
                    "Curated for the senior leadership of Lumia Corp, featuring 12-year batch truffles and hand-pressed leather journals."
                  </p>
                </div>
              </motion.div>

              {/* Tall Artisan Box */}
              <motion.div
                whileHover={{ y: -10 }}
                className="md:col-span-4 md:row-span-1 relative group rounded-[3rem] overflow-hidden shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1000"
                  alt="Employee Welcome Box"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h4 className="text-xl font-bold mb-1 italic">Artisan Welcome Sets</h4>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">500+ Delivered</p>
                </div>
              </motion.div>

              {/* Wellness Hamper */}
              <motion.div
                whileHover={{ y: -10 }}
                className="md:col-span-4 md:row-span-1 relative group rounded-[3rem] overflow-hidden shadow-xl h-[400px] md:h-auto"
              >
                <img
                  src="https://plus.unsplash.com/premium_photo-1667430128008-1d6afc3e01f5?fm=jpg&q=60&w=3000&auto=format&fit=crop"
                  alt="Wellness Retreat Gifting"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h4 className="text-xl font-bold mb-1 italic">Zen Ritual Boxes</h4>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Wellness Retreats</p>
                </div>
              </motion.div>

              {/* Custom Branded Accents */}
              <motion.div
                whileHover={{ y: -10 }}
                className="md:col-span-8 md:row-span-1 relative group rounded-[3rem] overflow-hidden shadow-xl h-[400px] md:h-auto"
              >
                <img
                  src="https://plus.unsplash.com/premium_photo-1696863129668-03948ed00909?fm=jpg&q=60&w=3000&auto=format&fit=crop"
                  alt="Branded Artisan Goods"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-10 right-10 text-right text-white max-w-sm">
                  <h3 className="text-2xl font-heading font-bold italic mb-2 leading-tight">Branded To <span className="text-primary not-italic">Perfection</span>.</h3>
                  <p className="text-xs text-white/70 italic leading-relaxed">
                    Every artisan piece can be engraved or foil-stamped with your company identity, ensuring a lasting impression.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section id="solutions" className="py-24 bg-muted/20 scroll-mt-24">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-heading font-bold mb-6 italic">The Corporate <span className="text-primary not-italic">Edge</span></h2>
              <p className="text-muted-foreground">We handle the logistics, so you can focus on the relationships.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: Building2, title: "Custom Branding", desc: "Logo engraving, curated brand colors, and custom message cards." },
                { icon: Globe, title: "Multi-Address Delivery", desc: "Upload a CSV we'll handle individual shipping to 100+ locations." },
                { icon: Star, title: "Artisan Quality", desc: "Luxury gift boxes that feel personal, never generic or mass-produced." }
              ].map((item, i) => (
                <div key={i} className="bg-background rounded-[3rem] p-10 border border-border/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <item.icon size={28} />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bulk Inquiry Form */}
        <section id="inquiry" className="py-32 scroll-mt-24">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="bg-primary rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 italic leading-snug">Let's build <span className="text-white/80 not-italic underline decoration-white/20 underline-offset-4">something</span> unforgettable.</h2>
                  <p className="text-primary-foreground/80 mb-10 leading-relaxed italic">
                    Our corporate specialists will design a custom proposal tailored to your brand goals.
                  </p>

                  <div className="space-y-6">
                    {[
                      "Volume discounts for 50+ gifts",
                      "Dedicated account concierge",
                      "Custom gift sourcing",
                      "Seamless CSV fulfillment"
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle2 size={12} className="text-white" />
                        </div>
                        <span className="text-sm font-medium">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required placeholder="Your Name" className="h-14 bg-white/10 border border-white/20 rounded-2xl px-6 text-sm placeholder:text-white/50 focus:bg-white/20 outline-none transition-all" />
                    <input required placeholder="Work Email" type="email" className="h-14 bg-white/10 border border-white/20 rounded-2xl px-6 text-sm placeholder:text-white/50 focus:bg-white/20 outline-none transition-all" />
                  </div>
                  <input required placeholder="Company Name" className="w-full h-14 bg-white/10 border border-white/20 rounded-2xl px-6 text-sm placeholder:text-white/50 focus:bg-white/20 outline-none transition-all" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select required className="h-14 bg-white/10 border border-white/20 rounded-2xl px-6 text-sm focus:bg-white/20 outline-none transition-all appearance-none cursor-pointer">
                      <option value="">Gift Quantity</option>
                      <option value="20-50">20 - 50 Gifts</option>
                      <option value="50-200">50 - 200 Gifts</option>
                      <option value="200+">200+ Gifts</option>
                    </select>
                    <input placeholder="Occasion Date" type="text" onFocus={(e) => e.target.type = 'date'} className="h-14 bg-white/10 border border-white/20 rounded-2xl px-6 text-sm placeholder:text-white/50 focus:bg-white/20 outline-none transition-all" />
                  </div>
                  <textarea required placeholder="Briefly describe your gifting goal..." className="w-full p-6 bg-white/10 border border-white/20 rounded-3xl text-sm placeholder:text-white/50 focus:bg-white/20 outline-none transition-all h-32 resize-none" />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-white text-primary hover:bg-white/90 rounded-2xl font-bold text-base shadow-xl shadow-black/20"
                  >
                    {isSubmitting ? "Processing Inquiry..." : "Submit Inquiry"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
      <CatalogModal isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />
    </PageTransition>
  );
};

export default CorporateGifting;
