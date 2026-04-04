import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  Gift, 
  Tag, 
  Image as ImageIcon,
  ArrowUpRight,
  Sparkles,
  Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminData } from "@/context/AdminDataContext";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const AdminMarketing = () => {
  const { promos, campaigns, toggleCampaign, addCampaign, addPromo, deletePromo, currentArtisan } = useAdminData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCampaignWizard, setShowCampaignWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newPromo, setNewPromo] = useState({ 
    code: "", 
    discount: "", 
    expires: "" 
  });

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    desc: "",
    target: "All Customers",
    benefit: "2x Points"
  });

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    addPromo({
      code: newPromo.code.toUpperCase(),
      discount: newPromo.discount.includes("%") ? newPromo.discount : `${newPromo.discount}% OFF`,
      usage: "0",
      status: "Active",
      expires: new Date(newPromo.expires).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    setShowAddForm(false);
    setNewPromo({ code: "", discount: "", expires: "" });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Growth & Marketing</h1>
          <p className="text-sm text-muted-foreground">Orchestrate campaigns, manage discounts, and drive customer loyalty.</p>
        </div>
        <Button 
          onClick={() => setShowCampaignWizard(true)}
          className="rounded-xl h-11 flex items-center gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 font-bold"
        >
          <Plus size={18} /> Launch New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Promo Codes */}
        <div className="lg:col-span-2 bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold flex items-center gap-2">
                  <Tag size={20} className="text-primary" /> Promo Code Ecosystem
               </h2>
               <Button 
                variant={showAddForm ? "ghost" : "outline"} 
                size="sm" 
                onClick={() => setShowAddForm(!showAddForm)}
                className="rounded-xl h-9 text-xs font-bold"
               >
                {showAddForm ? "Cancel" : "+ Create Code"}
               </Button>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleAddPromo}
                  className="bg-muted/10 p-6 rounded-2xl border border-border/10 mb-8 overflow-hidden space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Promo Code</Label>
                      <Input placeholder="TOFHAV20" required value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Discount (%)</Label>
                      <Input placeholder="20" required type="number" value={newPromo.discount} onChange={e => setNewPromo({...newPromo, discount: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Expiry Date</Label>
                      <Input type="date" required value={newPromo.expires} onChange={e => setNewPromo({...newPromo, expires: e.target.value})} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full rounded-xl">Generate & Activate Promo</Button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="space-y-4">
               {promos.map((promo, i) => (
                  <motion.div 
                     key={promo.code}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="p-5 rounded-2xl bg-muted/10 border border-border/10 flex items-center justify-between group hover:bg-muted/20 transition-all"
                  >
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-background border border-border/50 flex flex-col items-center justify-center shadow-sm">
                           <Percent size={18} className="text-primary" />
                        </div>
                        <div>
                           <p className="font-bold text-sm tracking-widest">{promo.code}</p>
                           <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mt-0.5">{promo.discount} • {promo.usage} Redemptions</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-8">
                        <div className="text-right hidden md:block">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Expires</p>
                           <p className="text-xs font-semibold">{promo.expires}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                           promo.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                        }`}>
                           {promo.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit3 size={16} />
                          </Button>
                          <Button 
                            onClick={() => deletePromo(promo.code)}
                            variant="ghost" size="icon" className="rounded-xl h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                     </div>
                  </motion.div>
               ))}
               
               {promos.length === 0 && !showAddForm && (
                 <div className="py-20 text-center border-2 border-dashed border-border/40 rounded-3xl">
                    <p className="text-sm text-muted-foreground italic">No active promo codes.</p>
                 </div>
               )}
            </div>
        </div>

        {/* Campaign Toggles */}
        <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm divide-y divide-border/10">
           <div className="pb-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Zap size={20} className="text-primary" /> Live Campaigns
              </h2>
              <div className="space-y-6">
                 {campaigns.map((c) => (
                   <div key={c.id} className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground">{c.desc}</span>
                      </div>
                      <div 
                        onClick={() => toggleCampaign(c.id)}
                        className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${c.active ? 'bg-primary/20' : 'bg-muted'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all ${c.active ? 'left-5 bg-primary' : 'left-1 bg-muted-foreground/30'}`} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="pt-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" /> Personalized Banners
              </h2>
              <div className="aspect-video rounded-2xl bg-muted/20 border border-border/10 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-muted/30 transition-all border-dashed">
                 <ImageIcon size={24} className="text-muted-foreground mb-2" />
                 <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Update Home Hero</p>
                 <p className="text-[10px] text-muted-foreground/60 mt-1">Recommended: 1920x1080 (WebP)</p>
              </div>
           </div>
        </div>
      </div>

      {/* Campaign Wizard Modal */}
      <Dialog open={showCampaignWizard} onOpenChange={setShowCampaignWizard}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
           <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Zap size={20} />
                   </div>
                   <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest">Step {wizardStep} of 3</div>
                </div>
                <DialogTitle className="text-2xl font-heading font-bold">Campaign Architect</DialogTitle>
                <DialogDescription className="text-primary-foreground/70">
                  Engineer a high-conversion gifting event for your artisan collection.
                </DialogDescription>
              </DialogHeader>
           </div>
           
           <div className="p-8 space-y-6">
              {wizardStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                   <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest">Campaign Identity</Label>
                      <Input 
                        placeholder="e.g. Winter Solstice Gifting" 
                        className="rounded-xl h-12"
                        value={newCampaign.name}
                        onChange={e => setNewCampaign({...newCampaign, name: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest">Strategic Hook</Label>
                      <Input 
                        placeholder="e.g. Double points on all artisan candles" 
                        className="rounded-xl h-12"
                        value={newCampaign.desc}
                        onChange={e => setNewCampaign({...newCampaign, desc: e.target.value})}
                      />
                   </div>
                </motion.div>
              )}

              {wizardStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                   <Label className="text-xs font-bold uppercase tracking-widest">Target Audience</Label>
                   <div className="grid grid-cols-2 gap-3">
                      {["All Customers", "Elite Only", "New Shoppers", "Dormant Accounts"].map(target => (
                         <button 
                           key={target}
                           onClick={() => setNewCampaign({...newCampaign, target})}
                           className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                             newCampaign.target === target 
                               ? "border-primary bg-primary/5 text-primary shadow-sm" 
                               : "border-border/50 hover:border-border hover:bg-muted/50"
                           }`}
                         >
                            {target}
                         </button>
                      ))}
                   </div>
                </motion.div>
              )}

              {wizardStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                   <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                         <CheckCircle2 className="text-primary" size={24} />
                      </div>
                      <h4 className="font-bold">Ready for Deployment</h4>
                      <p className="text-xs text-muted-foreground">
                        Your "{newCampaign.name}" campaign is optimized for <strong>{newCampaign.target}</strong>.
                      </p>
                   </div>
                   <div className="flex items-center gap-2 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700">
                      <Sparkles size={16} />
                      <p className="text-[10px] font-bold uppercase tracking-wider">AI Recommendation: Launch at 10 AM UTC-8</p>
                   </div>
                </motion.div>
              )}
           </div>

           <DialogFooter className="p-8 pt-0 flex sm:justify-between items-center bg-background">
              {wizardStep > 1 && (
                <Button variant="ghost" onClick={() => setWizardStep(prev => prev - 1)} className="rounded-xl font-bold">Back</Button>
              )}
              {wizardStep < 3 ? (
                <Button onClick={() => setWizardStep(prev => prev + 1)} className="rounded-xl px-8 ml-auto font-bold shadow-lg shadow-primary/20">Next Phase</Button>
              ) : (
                <Button 
                  onClick={() => {
                    addCampaign(newCampaign);
                    setShowCampaignWizard(false);
                    setWizardStep(1);
                    setNewCampaign({ name: "", desc: "", target: "All Customers", benefit: "2x Points" });
                  }} 
                  className="rounded-xl px-8 ml-auto font-bold shadow-lg shadow-primary/20"
                >
                  Confirm & Deploy
                </Button>
              )}
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMarketing;
