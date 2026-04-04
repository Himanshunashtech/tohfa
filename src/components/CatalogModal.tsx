import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Download, Mail, ChevronRight, ChevronLeft, Sparkles, Star, Globe, Zap, Coffee, Leaf, Gift, Luggage, Home, Recycle } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATALOG_ITEMS = [
  {
    id: "executive",
    title: "The Executive Suite",
    subtitle: "High-impact gifts for leadership and key partners.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200",
    color: "bg-slate-900",
    accent: "text-amber-400",
    icon: Star,
    highlights: ["Hand-Engraved Glassware", "Leather Desk Accents", "Global Delivery Included"]
  },
  {
    id: "wellness",
    title: "Artisan Wellness",
    subtitle: "Nurturing professional burnout with sensory restoration.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200",
    color: "bg-emerald-950",
    accent: "text-emerald-400",
    icon: Leaf,
    highlights: ["Sustainable Sourcing", "Organic Batch Teas", "Personalized Gift Cards"]
  },
  {
    id: "celebration",
    title: "Milestone Celebration",
    subtitle: "Dynamic gifting for team anniversaries and wins.",
    image: "https://images.unsplash.com/photo-1512418490979-92798ccc13b0?q=80&w=1200",
    color: "bg-primary/95",
    accent: "text-white",
    icon: Zap,
    highlights: ["Custom Color Matching", "Logo-Foil Packaging", "Bulk Dispatch Specialist"]
  },
  {
    id: "tech",
    title: "Tech Innovation Kit",
    subtitle: "Modern essentials for the high-performance remote leader.",
    image: "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=1200", // Gadgets/Work desk
    color: "bg-blue-950",
    accent: "text-blue-400",
    icon: Zap,
    highlights: ["Minimalist Tech Organizers", "CNC-Machined Accessories", "Noise-Canceling Heritage Audio"]
  },
  {
    id: "heritage-tea",
    title: "Heritage Tea & Ceramics",
    subtitle: "A moment of stillness featuring hand-painted global artisan works.",
    image: "https://images.unsplash.com/photo-1545048702-79362596cdc9?q=80&w=1200", // Tea/Ceramics
    color: "bg-orange-950",
    accent: "text-orange-400",
    icon: Coffee,
    highlights: ["Rare Single-Origin Blends", "Hand-Thrown Clay Cups", "Brass Brewing Tools"]
  },
  {
    id: "botanist",
    title: "The Botanist's Desk",
    subtitle: "Living gifts that grow with your professional relationships.",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200", // Plants
    color: "bg-green-900",
    accent: "text-green-300",
    icon: Leaf,
    highlights: ["Preserved Moss Art", "Self-Watering Terrariums", "Hand-Etched Garden Tools"]
  },
  {
    id: "gastronomy",
    title: "Gastronomy Gala",
    subtitle: "A curated feast of global flavors from small-batch workshops.",
    image: "https://images.unsplash.com/photo-1556740734-7f196f7c46f1?q=80&w=1200", // Food basket
    color: "bg-red-950",
    accent: "text-red-400",
    icon: Gift,
    highlights: ["Truffle-Infused Honey", "Artisan Batch Chocolates", "Small-Vineyard Pairings"]
  },
  {
    id: "traveler",
    title: "Traveler's Companion",
    subtitle: "Premium gear for the global nomad and executive traveler.",
    image: "https://images.unsplash.com/photo-1549463591-24c1882bd396?q=80&w=1200", // Travel gear
    color: "bg-stone-900",
    accent: "text-stone-300",
    icon: Luggage,
    highlights: ["Vegetable-Tanned Luggage", "RFID Heritage Pouches", "Global Travel Adapters"]
  },
  {
    id: "home-office",
    title: "Home Office Edit",
    subtitle: "Transforming any space into a sanctuary of focused productivity.",
    image: "https://images.unsplash.com/photo-1493932484895-752d1471eab5?q=80&w=1200", // Interior/Desk
    color: "bg-indigo-950",
    accent: "text-indigo-400",
    icon: Home,
    highlights: ["Ergonomic Oak Accessories", "Brass Task Lighting", "Linen-Bound Notebooks"]
  },
  {
    id: "sustainable",
    title: "Sustainable Heritage",
    subtitle: "Luxury gifting with zero-waste principles at its core.",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=1200", // Recycled/Eco items
    color: "bg-emerald-900",
    accent: "text-lime-400",
    icon: Recycle,
    highlights: ["Recycled Ocean-Bound Plastic", "Upcycled Textile Cases", "Solar-Powered Tech"]
  }
];

export const CatalogModal = ({ isOpen, onClose }: CatalogModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % CATALOG_ITEMS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + CATALOG_ITEMS.length) % CATALOG_ITEMS.length);
  const navigate = useNavigate();

  const current = CATALOG_ITEMS[currentIndex];
  
  const handleDownload = () => {
    toast.success("PDF Catalog download started! Check your downloads folder.", {
      icon: <Download size={16} className="text-emerald-500" />
    });
  };

  const handleGuide = () => {
    onClose();
    setTimeout(() => {
      navigate('/guide');
    }, 300);
  };

  const handleInquiry = () => {
    onClose();
    setTimeout(() => {
      const inquirySection = document.getElementById('inquiry');
      if (inquirySection) {
        inquirySection.scrollIntoView({ behavior: 'smooth' });
        toast.success("Inquiry concierge ready. Please fill in your details.", {
          icon: <Mail size={16} className="text-primary" />
        });
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-10"
      >
        <div 
          className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
          onClick={onClose}
        />

        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-7xl h-full md:h-[85vh] bg-background overflow-hidden md:rounded-[3rem] flex flex-col md:flex-row shadow-2xl"
        >
          {/* Header/Close */}
          <div className="absolute top-6 right-6 z-[110]">
             <Button 
               variant="ghost" 
               size="icon" 
               onClick={onClose} 
               className="rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
             >
                <X size={24} />
             </Button>
          </div>

          {/* Left: Dynamic Imagery */}
          <div className="relative flex-1 h-[40vh] md:h-full overflow-hidden group bg-muted">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{ duration: 0.8 }}
                src={current.image}
                alt={current.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-10 left-10 text-white max-w-md hidden md:block">
               <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] uppercase font-bold tracking-widest mb-4 ${current.accent}`}>
                  <current.icon size={10} className="fill-current" /> Featured Collection
               </div>
               <h2 className="text-4xl font-heading font-bold mb-2 italic tracking-tight">{current.title}</h2>
               <p className="text-sm opacity-80 leading-relaxed font-medium">{current.subtitle}</p>
            </div>

            {/* Slide Navigation Dots (Mobile/Desktop Overlay) */}
            <div className="absolute bottom-6 right-6 flex gap-1.5 z-20">
               {CATALOG_ITEMS.map((_, i) => (
                 <button 
                   key={i} 
                   onClick={() => setCurrentIndex(i)}
                   className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === i ? "w-8 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
                 />
               ))}
            </div>
          </div>

          {/* Right: Content & Interaction */}
          <div className="w-full md:w-1/3 bg-background p-8 md:p-14 flex flex-col justify-between relative border-l border-border/10">
             <div className="space-y-10">
                <div className="flex justify-between items-end border-b border-border pb-8">
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Digital Lookbook</span>
                   <span className="text-2xl font-bold tracking-tighter italic font-heading">
                      0{currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} 
                      <span className="text-muted-foreground text-sm font-normal not-italic mx-1">/</span> 
                      {CATALOG_ITEMS.length}
                   </span>
                </div>

                <div className="space-y-6">
                   <AnimatePresence mode="wait">
                     <motion.div
                       key={currentIndex}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       transition={{ duration: 0.4 }}
                       className="space-y-6"
                     >
                        <h3 className="text-3xl font-heading font-bold italic leading-tight">
                           {current.title}
                        </h3>
                        <ul className="space-y-4">
                           {current.highlights.map((h, i) => (
                             <li 
                               key={i}
                               className="flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-right-4"
                               style={{ animationDelay: `${i * 0.1}s` }}
                             >
                                <div className={`w-2 h-2 rounded-full ${current.accent.replace('text-', 'bg-') || 'bg-primary'}`} />
                                {h}
                             </li>
                           ))}
                        </ul>
                     </motion.div>
                   </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-6">
                   <Button 
                     size="lg" 
                     onClick={handleGuide}
                     className="rounded-2xl h-14 font-bold flex items-center justify-between px-6 shadow-xl shadow-primary/20 bg-primary group overflow-hidden"
                   >
                      <span className="relative z-10">Quick Order Guide</span>
                      <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                   </Button>
                   <Button 
                     variant="outline" 
                     onClick={handleDownload}
                     className="rounded-2xl h-14 font-bold border-2 flex items-center justify-between px-6 hover:bg-muted"
                   >
                      Download PDF Catalog <Download size={18} />
                   </Button>
                </div>
             </div>

             {/* Footer Controls */}
             <div className="flex items-center justify-between pt-10">
                <div className="flex gap-2">
                   <Button onClick={prev} variant="ghost" size="icon" className="rounded-full w-12 h-12 border border-border/50 hover:bg-primary/5">
                      <ChevronLeft size={20} />
                   </Button>
                   <Button onClick={next} variant="ghost" size="icon" className="rounded-full w-12 h-12 border border-border/50 hover:bg-primary/5">
                      <ChevronRight size={20} />
                   </Button>
                </div>
                
                <button 
                  onClick={handleInquiry}
                  className="flex items-center gap-2 text-primary group font-bold text-xs uppercase tracking-[0.2em] transition-all hover:gap-3"
                >
                   <Mail size={14} /> <span className="underline underline-offset-4">Inquire</span>
                   <Sparkles size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
