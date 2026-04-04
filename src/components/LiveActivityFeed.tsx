import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, UserPlus, Globe } from "lucide-react";

type Activity = {
  id: string;
  type: "order" | "artisan" | "review";
  text: string;
  location: string;
  icon: any;
};

const activities: Activity[] = [
  { id: "1", type: "order", text: "Someone in London just ordered The Midnight Velvet Candle", location: "London, UK", icon: ShoppingBag },
  { id: "2", type: "artisan", text: "Luca just joined as a Master Glassblower from Murano", location: "Murano, IT", icon: UserPlus },
  { id: "3", type: "order", text: "Someone in NYC just curate a custom 'Obsidian' corporate box", location: "New York, US", icon: ShoppingBag },
  { id: "4", type: "review", text: "New 5-star review: 'The unboxing experience was spiritual.'", location: "Paris, FR", icon: Star },
  { id: "5", type: "artisan", text: "Maya Bennett just listed 5 new Artisan Pendants", location: "Sedona, US", icon: Globe },
];

export const LiveActivityFeed = () => {
  const [current, setCurrent] = useState<Activity | null>(null);

  useEffect(() => {
    const showNext = () => {
      const idx = Math.floor(Math.random() * activities.length);
      setCurrent(activities[idx]);
      
      setTimeout(() => {
        setCurrent(null);
      }, 5000);
    };

    const interval = setInterval(showNext, 15000); // Every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-10 left-10 z-[100] pointer-events-none">
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.9 }}
            className="bg-white/80 backdrop-blur-xl border border-border/50 p-4 rounded-3xl shadow-2xl flex items-center gap-4 max-w-sm pointer-events-auto"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <current.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight">{current.text}</p>
              <div className="flex items-center gap-1 mt-1 opacity-50">
                 <Globe size={10} />
                 <span className="text-[10px] uppercase font-bold tracking-widest">{current.location}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
