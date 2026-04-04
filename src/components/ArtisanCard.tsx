import { motion } from "framer-motion";
import { MapPin, Award, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Artisan } from "@/data/products";

interface ArtisanCardProps {
  artisan: Artisan;
}

const ArtisanCard = ({ artisan }: ArtisanCardProps) => {
  return (
    <div className="bg-muted/30 border border-border/50 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="relative shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-background rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <img src={artisan.photo} alt={artisan.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
               <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">The Maker</span>
               <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <MapPin size={12} /> {artisan.location}
               </div>
            </div>
            <h3 className="text-3xl font-heading font-bold">{artisan.name}</h3>
            <p className="text-sm font-bold text-muted-foreground italic">{artisan.role}</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed italic">
            "{artisan.bio}"
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground bg-background px-4 py-2 rounded-xl border border-border/50 shadow-sm">
               <Award size={14} className="text-primary" /> Master Artisan
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground bg-background px-4 py-2 rounded-xl border border-border/50 shadow-sm">
               <Sparkles size={14} className="text-amber-500" /> Hand-Signed
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-4">
         <p className="text-xs text-muted-foreground font-medium">
           Every purchase directly supports our community of <span className="text-foreground font-bold">certified independent artisans</span>.
         </p>
         <Link to="/ethics" className="text-xs font-bold text-primary hover:underline underline-offset-4">Learn about our Ethics →</Link>
      </div>
    </div>
  );
};

export default ArtisanCard;
