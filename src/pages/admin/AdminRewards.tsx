import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, 
  Star, 
  Settings2, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Users, 
  Award,
  Zap,
  Target,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Percent
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const AdminRewards = () => {
  const { loyaltySettings, updateLoyaltySettings, customers, isLoading: dataLoading } = useAdminData();
  const [isEditing, setIsEditing] = useState(false);
  const [localSettings, setLocalSettings] = useState(loyaltySettings);

  // Sync local state when remote data loads
  useEffect(() => {
    if (loyaltySettings) setLocalSettings(loyaltySettings);
  }, [loyaltySettings]);

  if (dataLoading || !localSettings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-heading">
        <div className="w-12 h-14 border-x-4 border-t-4 border-primary rounded-t-full rounded-b-lg border-b-transparent animate-bounce" />
        <p className="text-xs font-bold text-muted-foreground animate-pulse uppercase tracking-[0.2em] px-8 text-center leading-relaxed">
          Calibrating Loyalty Logic and Reward Architectures...
        </p>
      </div>
    );
  }

  const handleSave = () => {
    updateLoyaltySettings(localSettings);
    setIsEditing(false);
  };

  const stats = [
    { label: "Active Members", value: customers.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Avg. Points", value: "482", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Redemption Rate", value: "24%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Elite Tier %", value: "12%", icon: Award, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Elite Rewards <span className="text-primary italic">Engine</span></h1>
          <p className="text-sm text-muted-foreground">Orchestrate the global loyalty logic and tier architecture of TofhaVerse.</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => { setLocalSettings(loyaltySettings); setIsEditing(false); }} className="rounded-xl h-11 px-6 font-bold">Cancel</Button>
              <Button onClick={handleSave} className="rounded-xl h-11 px-8 font-bold shadow-lg shadow-primary/20">Save Global Logic</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="rounded-xl h-11 px-8 font-bold gap-2">
              <Settings2 size={18} /> Configure Engine
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-card border border-border/50 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="tiers" className="space-y-8">
        <TabsList className="bg-muted/50 p-1.5 rounded-2xl h-14 border border-border/50">
          <TabsTrigger value="tiers" className="rounded-xl px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Loyalty Tiers</TabsTrigger>
          <TabsTrigger value="earning" className="rounded-xl px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Earning Rules</TabsTrigger>
          <TabsTrigger value="redemption" className="rounded-xl px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Redemption Catalog</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Award size={120} />
               </div>
               <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-primary" /> Tier Architecture
               </h3>
               
               <div className="space-y-6">
                  {Object.entries(localSettings.tierThresholds).map(([tier, threshold], i) => (
                    <div key={tier} className="flex items-center justify-between gap-6 p-5 rounded-2xl bg-muted/20 border border-border/30 group hover:border-primary/30 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold tracking-tighter shadow-sm border ${
                            tier === "silver" ? "bg-slate-100 text-slate-600" :
                            tier === "gold" ? "bg-amber-100 text-amber-600 border-amber-200" :
                            tier === "platinum" ? "bg-emerald-100 text-emerald-600 border-emerald-200" :
                            "bg-primary/10 text-primary border-primary/20"
                          }`}>
                            {tier.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <p className="font-bold text-sm uppercase tracking-widest">{tier}</p>
                             <p className="text-[10px] text-muted-foreground uppercase font-bold">Lifetime Points Required</p>
                          </div>
                       </div>
                    <div className="relative">
                      {isEditing ? (
                        <Input 
                          type="number"
                          value={threshold as string | number}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            tierThresholds: { ...localSettings.tierThresholds, [tier]: parseInt(e.target.value) }
                          })}
                          className="w-32 h-10 rounded-xl bg-background text-right"
                        />
                      ) : (
                        <p className="font-bold text-lg">{(threshold as number).toLocaleString()}</p>
                      )}
                    </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
               <div className="bg-foreground text-background p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-primary/20 opacity-30 pointer-events-none" />
                  <h4 className="text-2xl font-bold mb-4 relative z-10">Elite Privileges</h4>
                  <p className="text-background/60 text-sm leading-relaxed mb-8 relative z-10">
                     Each tier unlocks systemic advantages across the TofhaVerse marketplace, including priority studio access and white-glove logistics.
                  </p>
                  <ul className="space-y-4 relative z-10">
                     <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/90">
                        <Zap size={16} className="text-primary" /> Free Midnight Surcharge (Diamond)
                     </li>
                     <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/90">
                        <Sparkles size={16} className="text-primary" /> Exclusive Artisan Q&A (Platinum+)
                     </li>
                     <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/90">
                        <Percent size={16} className="text-primary" /> 2x Point Multiplier (Gold+)
                     </li>
                  </ul>
               </div>
               
               <div className="p-8 border border-border/50 rounded-[2.5rem] bg-card flex items-center justify-between">
                  <div className="space-y-1">
                     <h4 className="font-bold">Automated Promotions</h4>
                     <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Global Status: Active</p>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-primary/20 relative cursor-pointer">
                     <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary shadow-sm" />
                  </div>
               </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="earning">
           <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-sm">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h3 className="text-2xl font-bold">Earning Velocity</h3>
                    <p className="text-sm text-muted-foreground mt-1">Configure how many points users generate per transaction.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <p className="text-sm font-bold text-muted-foreground">Points per $1</p>
                    {isEditing ? (
                      <Input 
                        type="number"
                        value={localSettings.pointsPerDollar}
                        onChange={(e) => setLocalSettings({ ...localSettings, pointsPerDollar: parseInt(e.target.value) })}
                        className="w-20 h-12 rounded-xl text-center text-xl font-bold border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-20 h-12 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center text-2xl font-black text-primary">
                        {localSettings.pointsPerDollar}
                      </div>
                    )}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                    { label: "Signup Bonus", value: "100 pts", icon: Users },
                    { label: "Birthday Multiplier", value: "3x", icon: Gift },
                    { label: "First Order Bonus", value: "500 pts", icon: Target },
                 ].map((rule) => (
                    <div key={rule.label} className="p-6 rounded-2xl bg-muted/10 border border-border/20 flex flex-col items-center text-center gap-3">
                       <div className="p-3 bg-background rounded-xl border border-border/50">
                          <rule.icon size={20} className="text-primary" />
                       </div>
                       <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground leading-none">{rule.label}</p>
                       <p className="text-xl font-bold text-foreground">{rule.value}</p>
                       <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase text-primary">Edit Logic</Button>
                    </div>
                 ))}
                 <div className="p-6 rounded-3xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/10 transition-colors">
                    <Plus size={20} className="text-muted-foreground" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Add Rule</p>
                 </div>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="redemption">
           <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-bold">Reward Catalog</h3>
                 <Button className="rounded-xl font-bold h-10 gap-2">
                    <Plus size={16} /> New Reward
                 </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {localSettings.redemptionOptions.map((opt) => (
                    <div key={opt.id} className="p-6 rounded-3xl bg-muted/20 border border-border/10 flex items-center justify-between group hover:bg-muted/30 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-background border border-border/50 flex items-center justify-center text-primary shadow-sm">
                             <Gift size={24} />
                          </div>
                          <div>
                             <h4 className="font-bold text-lg leading-none">{opt.label}</h4>
                             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-2">{opt.points} Points Required</p>
                          </div>
                       </div>
                       <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10">
                          <Trash2 size={18} />
                       </Button>
                    </div>
                 ))}
              </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRewards;
