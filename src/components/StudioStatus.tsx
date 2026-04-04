import { motion } from "framer-motion";
import { User, Activity, MapPin, Clock } from "lucide-react";
import { Artisan } from "@/data/products";
import { Link } from "react-router-dom";

interface StudioStatusProps {
  artisan: Artisan;
}

const StudioStatus = ({ artisan }: StudioStatusProps) => {
  // Simulated dynamic data
  const loadPercentage = Math.floor(Math.random() * 40) + 60; // 60-100%
  const isBusy = loadPercentage > 85;

  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={artisan.photo} 
              alt={artisan.name} 
              className="w-12 h-12 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${isBusy ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight">{artisan.name}</h4>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{artisan.role}</p>
          </div>
        </div>
        <Link to={`/artisan/${artisan.slug}`} className="text-[10px] font-bold text-primary uppercase hover:underline">
          View Studio
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Activity size={14} className="text-primary/70" /> Studio Workload
          </span>
          <span className={isBusy ? 'text-amber-600' : 'text-emerald-600'}>{loadPercentage}%</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${loadPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className={`h-full rounded-full ${isBusy ? 'bg-amber-500' : 'bg-emerald-500'}`}
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
            <MapPin size={10} /> Origin
          </span>
          <span className="text-xs font-bold truncate">{artisan.location}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
            <Clock size={10} /> Next Drop
          </span>
          <span className="text-xs font-bold">14 Days</span>
        </div>
      </div>

      {isBusy && (
         <p className="mt-4 text-[10px] bg-amber-500/10 text-amber-700 p-2 rounded-lg font-bold text-center border border-amber-500/20">
            ⏳ High Commission Volume: 3-5 day finish lead time
         </p>
      )}
    </div>
  );
};

export default StudioStatus;
