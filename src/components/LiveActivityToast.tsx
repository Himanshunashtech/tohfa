import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, X } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";

const LOCATIONS = ["Dubai, UAE", "New York, USA", "London, UK", "Mumbai, India", "Singapore", "Paris, France"];
const NAMES = ["Aria", "Liam", "Sophia", "Zayan", "Emma", "Kavya", "Omar"];

const LiveActivityToast = () => {
  const { products } = useAdminData();
  const [isVisible, setIsVisible] = useState(false);
  const [currentActivity, setCurrentActivity] = useState({
    name: "",
    product: "",
    location: "",
    type: "GIFTED" as "GIFTED" | "VIEWING",
    count: 0
  });

  useEffect(() => {
    if (products.length === 0) return;

    const triggerNext = () => {
      const delay = Math.random() * 15000 + 8000; // 8-23 seconds
      setTimeout(() => {
        const product = products[Math.floor(Math.random() * products.length)];
        const isViewing = Math.random() > 0.6;
        
        setCurrentActivity({
          name: NAMES[Math.floor(Math.random() * NAMES.length)],
          product: product.name,
          location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
          type: isViewing ? "VIEWING" : "GIFTED",
          count: Math.floor(Math.random() * 12) + 3
        });
        setIsVisible(true);

        setTimeout(() => setIsVisible(false), 5000);
        triggerNext();
      }, delay);
    };

    triggerNext();
  }, [products]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          className="fixed bottom-10 left-10 z-[100] max-w-sm pointer-events-auto"
        >
          <div className="bg-background/80 backdrop-blur-xl border border-white/20 p-5 rounded-[2rem] shadow-2xl flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2" />
            
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
               <Gift size={20} />
            </div>

            <div className="flex-1 min-w-0 pr-4">
               <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5 flex items-center gap-1">
                 <Sparkles size={10} /> Live Activity
               </p>
               <p className="text-[13px] font-bold text-foreground leading-tight truncate">
                  {currentActivity.type === "VIEWING" 
                    ? `${currentActivity.count} people are viewing ${currentActivity.product}`
                    : `${currentActivity.name} gifted the ${currentActivity.product}`
                  }
               </p>
               <p className="text-[11px] text-muted-foreground italic">
                  {currentActivity.type === "VIEWING" ? "Live from TofhaVerse" : `Sent to ${currentActivity.location}`}
               </p>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted text-muted-foreground"
            >
              <X size={12} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LiveActivityToast;
