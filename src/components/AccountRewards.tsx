import { motion } from "framer-motion";
import { 
  Sparkles, 
  ChevronRight, 
  Gift, 
  Truck, 
  Crown, 
  Star, 
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  History
} from "lucide-react";
import { AdminCustomer } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";

const TIER_COLORS = {
  Silver: "text-slate-400 bg-slate-400/10 border-slate-200",
  Gold: "text-amber-500 bg-amber-500/10 border-amber-200",
  Platinum: "text-blue-500 bg-blue-500/10 border-blue-200",
  Diamond: "text-purple-600 bg-purple-600/10 border-purple-200"
};

const NEXT_TIER_GOAL = {
  Silver: 500,
  Gold: 1500,
  Platinum: 5000,
  Diamond: 10000
};

interface AccountRewardsProps {
  customer: AdminCustomer;
}

const AccountRewards = ({ customer }: AccountRewardsProps) => {
  const currentPoints = customer.points;
  const nextTier = customer.tier === "Silver" ? "Gold" : 
                   customer.tier === "Gold" ? "Platinum" : 
                   customer.tier === "Platinum" ? "Diamond" : "Elite Status";
  
  const goalPoints = NEXT_TIER_GOAL[customer.tier as keyof typeof NEXT_TIER_GOAL] || 10000;
  const progress = Math.min((currentPoints / goalPoints) * 100, 100);

  const perks = [
    { title: "Points per $1", value: customer.tier === "Silver" ? "5 pts" : customer.tier === "Gold" ? "8 pts" : "10 pts", icon: TrendingUp },
    { title: "Shipment Perk", value: customer.tier === "Gold" ? "10% Off" : customer.tier === "Platinum" ? "Free" : "Standard", icon: Truck },
    { title: "Special Support", value: customer.tier === "Diamond" ? "Direct Line" : "Standard", icon: ShieldCheck },
    { title: "Monthly Gift", value: customer.tier === "Platinum" ? "Artisan Mini" : "None", icon: Gift }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Stats Card */}
      <div className="relative overflow-hidden bg-primary rounded-[3rem] p-10 md:p-14 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                <Crown size={12} className="text-amber-300" /> {customer.tier} Member
             </div>
             <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 italic">The <span className="text-white/80">World</span> of TofhaPoints</h2>
             <p className="text-primary-foreground/80 mb-8 max-w-sm leading-relaxed">
                You've earned <span className="text-white font-bold">{currentPoints.toLocaleString()}</span> points across your journey with us.
             </p>
             <button className="px-8 py-3 bg-white text-primary rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-transform">
                Redeem for Rewards
             </button>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10">
             <div className="flex justify-between items-end mb-4">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Path to {nextTier}</p>
                <p className="text-2xl font-bold">{progress.toFixed(0)}%</p>
             </div>
             
             {/* Animated Progress Bar */}
             <div className="h-4 w-full bg-white/20 rounded-full overflow-hidden mb-4 p-1">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
             </div>
             
             <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase opacity-60">
                <span>Current: {currentPoints}</span>
                <span>Goal: {goalPoints}</span>
             </div>

             <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                 <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Sparkles size={18} className="text-amber-200" />
                 </div>
                 <p className="text-xs leading-relaxed italic opacity-90">
                    Just <span className="font-bold underline">{(goalPoints - currentPoints).toLocaleString()}</span> more points to unlock {nextTier} status!
                 </p>
             </div>
          </div>
        </div>
      </div>

      {/* Perks Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {perks.map((perk, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-background border border-border/50 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all"
           >
              <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-4">
                 <perk.icon size={20} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{perk.title}</p>
              <p className="font-bold text-base">{perk.value}</p>
           </motion.div>
         ))}
      </div>

      {/* History & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
         <div className="lg:col-span-3 bg-white border border-border/50 rounded-[2.5rem] p-8">
            <h3 className="font-bold mb-6 flex items-center gap-2">
               <History size={18} className="text-primary" /> Points History
            </h3>
            <div className="space-y-4">
               {customer.pointsHistory?.length ? (
                 customer.pointsHistory.map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/5">
                      <div className="flex items-center gap-4">
                         <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                            <ArrowUpRight size={14} />
                         </div>
                         <div>
                            <p className="text-sm font-bold">{item.reason}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{item.date}</p>
                         </div>
                      </div>
                      <p className="font-bold text-primary">+{item.points}</p>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-10 text-muted-foreground italic text-sm">
                    No history found. Start gifting to earn points!
                 </div>
               )}
            </div>
         </div>

         <div className="lg:col-span-2 bg-muted/20 border border-border/50 rounded-[2.5rem] p-8 flex flex-col justify-between">
            <div>
               <h3 className="font-bold mb-2 flex items-center gap-2 italic underline decoration-primary/20 underline-offset-4">
                  Collector-Level Status
               </h3>
               <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  TofhaPoints are more than just currency—they represent your commitment to artisanal discovery.
               </p>

               <div className="space-y-3">
                  {["Exclusive Launch Previews", "Vibration-Free Secure Shipping", "24/7 Gifting Advisor Access"].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium">
                       <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                       {text}
                    </div>
                  ))}
               </div>
            </div>

            <Button className="w-full rounded-2xl h-14 font-extrabold mt-8 gap-2 shadow-lg shadow-black/5">
               Explore Member Perks <ChevronRight size={16} />
            </Button>
         </div>
      </div>
    </div>
  );
};

export default AccountRewards;
