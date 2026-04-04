import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  ShoppingBag, 
  DollarSign,
  Award,
  ChevronRight,
  X,
  CreditCard,
  Target,
  Calendar
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const AdminCustomers = () => {
  const { customers: allCustomers, addCustomer } = useAdminData();
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    tier: "Member",
    points: 100
  });

  const filteredCustomers = allCustomers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.tier.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCustomer({
      display_name: formData.displayName,
      email: formData.email,
      phone: formData.phone,
      tier: formData.tier,
      points: formData.points,
      user_id: `manual-${Date.now()}` // Mock user_id for manual entries
    });
    setIsAdding(false);
    setFormData({ displayName: "", email: "", phone: "", tier: "Member", points: 100 });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2 tracking-tighter">Customer <span className="text-primary italic">Universe</span></h1>
          <p className="text-sm text-muted-foreground">Manage relationships, track loyalty, and view comprehensive purchase histories.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="rounded-[1.25rem] h-12 px-6 flex items-center gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
          <UserPlus size={18} /> Register New Customer
        </Button>
      </div>

      {/* Analytics Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Lifetime Value", value: "$42.5k", icon: DollarSign, color: "text-emerald-600 bg-emerald-100" },
          { label: "Average Retention", value: "84%", icon: Star, color: "text-amber-600 bg-amber-100" },
          { label: "Elite Members", value: allCustomers.filter(c => c.tier !== 'Member').length, icon: Award, color: "text-primary bg-primary/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-background p-6 rounded-[2.5rem] border border-border/50 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} shadow-sm`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-background p-6 rounded-[2.5rem] border border-border/50 shadow-lg shadow-black/[0.02] flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search characters by name, email, or tier..." 
            className="w-full h-12 bg-muted/30 border-none rounded-2xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-12 px-6 flex items-center gap-2 border-border/50 hover:bg-muted font-bold">
            <Filter size={18} /> Advanced Filters
          </Button>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-background rounded-[3rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/10 border-b border-border/10">
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Customer Profile</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Membership Status</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Engagement</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lifetime Value</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {filteredCustomers.map((c, i) => (
                <motion.tr 
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-muted/20 transition-all cursor-default"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full border-2 border-background shadow-xl overflow-hidden bg-muted group-hover:scale-110 transition-transform">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.email}`} alt={c.name} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-base tracking-tight text-foreground group-hover:text-primary transition-colors">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 mt-1 uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-md w-fit">
                          <Mail size={12} className="text-primary/60" /> {c.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-2">
                      <span className={`w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] ${
                        c.tier === "Diamond" ? "bg-cyan-100 text-cyan-700 shadow-sm border border-cyan-200" :
                        c.tier === "Platinum" ? "bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200" :
                        c.tier === "Gold" ? "bg-amber-100 text-amber-700 shadow-sm border border-amber-200" :
                        "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {c.tier} Tier
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                         <CreditCard size={12} className="text-primary" /> {c.points.toLocaleString()} Credits
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                     <div className="flex flex-col">
                        <span className="text-sm font-bold flex items-center gap-2">
                          <ShoppingBag size={14} className="text-primary" /> {c.orders} Deliveries
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1.5 flex items-center gap-1.5">
                          <Calendar size={12} /> Established: {c.joined}
                        </span>
                     </div>
                  </td>
                  <td className="px-10 py-6 text-foreground font-mono font-bold text-base">
                    {c.spend}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3">
                       <Link to={`/admin/customers/${c.id}`}>
                          <Button variant="ghost" className="h-10 px-4 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary/10 hover:text-primary group/btn transition-all">
                             View Intelligence <ChevronRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                       </Link>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="sm:max-w-[500px] rounded-[3rem] p-10 border-none shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-heading font-black tracking-tighter">Manually <span className="text-primary">Enlist</span></DialogTitle>
            <DialogDescription className="text-sm">Register a new profile directly into the TofhaVerse identity engine.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Full Identity</Label>
                <Input 
                  placeholder="e.g. Rahul Sharma" 
                  required 
                  value={formData.displayName}
                  onChange={e => setFormData({...formData, displayName: e.target.value})}
                  className="rounded-2xl h-12 bg-muted/20 border-border/50"
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Secure Email</Label>
                  <Input 
                    type="email"
                    placeholder="name@domain.com" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="rounded-2xl h-12 bg-muted/20 border-border/50"
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Communication</Label>
                  <Input 
                    placeholder="+91 99999..." 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="rounded-2xl h-12 bg-muted/20 border-border/50"
                  />
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Elite Standing</Label>
                  <select 
                    value={formData.tier}
                    onChange={e => setFormData({...formData, tier: e.target.value})}
                    className="w-full rounded-2xl h-12 bg-muted/20 border border-border/50 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="Member">Standard Member</option>
                    <option value="Gold">Gold Tier</option>
                    <option value="Platinum">Platinum Elite</option>
                    <option value="Diamond">Diamond Global</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Initial Credits</Label>
                  <Input 
                    type="number"
                    value={formData.points}
                    onChange={e => setFormData({...formData, points: parseInt(e.target.value)})}
                    className="rounded-2xl h-12 bg-muted/20 border-border/50 font-bold"
                  />
               </div>
             </div>
             <DialogFooter className="pt-8 gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs flex-1">Abort</Button>
                <Button type="submit" className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 flex-1">Complete Enlistment</Button>
             </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
