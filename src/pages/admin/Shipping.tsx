import { useState } from "react";
import { 
  Truck, 
  MapPin, 
  Globe, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowUpRight,
  Navigation,
  Box,
  Zap,
  MoreVertical,
  Play,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminShipping = () => {
  const { 
    orders, 
    simulateLogisticsJourney, 
    shippingMethods, 
    createShippingMethod, 
    updateShippingMethod, 
    deleteShippingMethod 
  } = useAdminData();
  const [searchTerm, setSearchTerm] = useState("");
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);

  const activeOrders = orders.filter(o => o.status !== "Delivered");
  const filteredOrders = activeOrders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shipping?.tracking?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: "Fleet Activity", value: "92%", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Global Hubs", value: "14", icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Avg. Transit", value: "4.2d", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Ship", value: activeOrders.length, icon: Box, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  const handleSimulate = (orderId: string) => {
    simulateLogisticsJourney(orderId);
    toast.success(`Simulation started for ${orderId}`);
  };

  const handleSaveMethod = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      base_price: Number(formData.get("basePrice")),
      surcharge_fixed: Number(formData.get("surchargeFixed")),
      surcharge_midnight: Number(formData.get("surchargeMidnight")),
      active: formData.get("active") === "on"
    };

    try {
      if (editingMethod) {
        await updateShippingMethod(editingMethod.id, data);
      } else {
        await createShippingMethod(data);
      }
      setShowMethodModal(false);
      setEditingMethod(null);
    } catch (err) {
      toast.error("Failed to save shipping method");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logistics & Fleet</h1>
          <p className="text-muted-foreground mt-1 text-sm">Real-time oversight of the TofhaVerse global distribution network.</p>
        </div>
        <div className="flex gap-2">
           <Button 
            variant="outline" 
            className="rounded-xl border-border/50 gap-2"
            onClick={() => { setEditingMethod(null); setShowMethodModal(true); }}
           >
              <Plus size={18} /> Add Method
           </Button>
           <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2">
              <Navigation size={18} /> Live Map View
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 bg-card border border-border/50 rounded-2xl shadow-sm"
          >
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} w-fit mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Global Shipping Methods Config */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {shippingMethods.map((method) => (
            <motion.div
              key={method.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 rounded-[2rem] border transition-all ${method.active ? 'bg-background border-primary/20 shadow-sm' : 'bg-muted/20 border-border/50 grayscale'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Truck size={24} />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingMethod(method); setShowMethodModal(true); }}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteShippingMethod(method.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <h3 className="font-bold text-lg">{method.name}</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="font-bold">${method.basePrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Premium Surcharge</span>
                  <span className="font-bold text-amber-600">+${method.surchargeFixed}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/50 flex flex-wrap items-center justify-between gap-4">
           <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search Tracking ID or Order #" 
                className="pl-10 h-11 rounded-xl bg-background border-border/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl border-border/50 h-11 px-4 gap-2">
                 <Filter size={16} /> Filters
              </Button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-6">Order & Status</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Carrier & Service</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Destination</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Update</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
               {filteredOrders.length > 0 ? (
                 filteredOrders.map((order) => (
                   <tr key={order.id} className="hover:bg-muted/20 transition-colors group">
                     <td className="p-4 pl-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                              <Truck size={18} />
                           </div>
                           <div>
                              <p className="font-bold text-sm">{order.id}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className={`w-2 h-2 rounded-full animate-pulse ${
                                    order.status === "Shipped" ? "bg-blue-500" : "bg-amber-500"
                                 }`} />
                                 <span className="text-[10px] font-bold text-muted-foreground uppercase">{order.status}</span>
                              </div>
                           </div>
                        </div>
                     </td>
                     <td className="p-4">
                        <div>
                           <p className="font-bold text-sm">{order.shipping?.carrier || "TofhaVerse"}</p>
                           <p className="text-xs text-muted-foreground">{order.slot || "Standard"} Tier</p>
                        </div>
                     </td>
                     <td className="p-4">
                        <div className="flex items-center gap-2">
                           <MapPin size={14} className="text-muted-foreground" />
                           <p className="text-xs text-muted-foreground max-w-[150px] truncate">{order.shipping?.address}</p>
                        </div>
                     </td>
                     <td className="p-4">
                        <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{order.timeline?.[0]?.time || "Pending"}</p>
                     </td>
                     <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                           <Button 
                             onClick={() => handleSimulate(order.id)}
                             variant="outline" 
                             size="sm" 
                             className="h-9 px-4 rounded-xl border-border/50 hover:bg-primary/5 text-primary gap-2"
                           >
                              <Play size={14} /> Simulate
                           </Button>
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                              <MoreVertical size={16} />
                           </Button>
                        </div>
                     </td>
                   </tr>
                 ))
               ) : (
                 <tr>
                    <td colSpan={5} className="p-20 text-center">
                       <Truck size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                       <h3 className="text-lg font-bold">No Active Shipments</h3>
                       <p className="text-sm text-muted-foreground mt-1">All artisans have cleared their benches for the day.</p>
                    </td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Map Placeholder */}
       <div className="bg-card border border-border/50 rounded-[3rem] p-8 h-[400px] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0f172a] opacity-90 overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px]" />
          </div>
          <div className="relative z-10 text-center space-y-4">
             <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/30">
                <Navigation size={32} className="text-primary animate-pulse" />
             </div>
             <h2 className="text-2xl font-bold text-white">Interactive Fleet Map</h2>
             <p className="text-slate-400 text-sm max-w-xs mx-auto">Visualizing real-time gift trajectory across 187 active delivery routes.</p>
             <Button variant="secondary" className="rounded-full px-8 bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700">
                Sync GPS Feed
             </Button>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary rounded-full animate-ping" />
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-emerald-500 rounded-full animate-ping [animation-delay:1s]" />
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-ping [animation-delay:2s]" />
       </div>

       {/* Method Modal */}
       {showMethodModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-background border border-border rounded-[2rem] p-8 shadow-2xl"
           >
             <h2 className="text-2xl font-bold mb-6">{editingMethod ? 'Edit' : 'Add'} Shipping Method</h2>
             <form onSubmit={handleSaveMethod} className="space-y-4">
               <div>
                 <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Method Name</label>
                 <Input name="name" defaultValue={editingMethod?.name} placeholder="e.g. Express Fleet Delivery" required />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Base Price ($)</label>
                   <Input type="number" name="basePrice" defaultValue={editingMethod?.basePrice || 0} required />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Surcharge ($)</label>
                   <Input type="number" name="surchargeFixed" defaultValue={editingMethod?.surchargeFixed || 0} required />
                 </div>
               </div>
               <div className="flex items-center gap-3 py-2">
                 <input type="checkbox" name="active" defaultChecked={editingMethod ? editingMethod.active : true} className="w-5 h-5 rounded border-border" />
                 <span className="text-sm font-medium">Method Active</span>
               </div>
               <div className="flex gap-3 pt-4">
                 <Button type="button" variant="ghost" className="flex-1 rounded-xl" onClick={() => setShowMethodModal(false)}>Cancel</Button>
                 <Button type="submit" className="flex-1 rounded-xl">Save Method</Button>
               </div>
             </form>
           </motion.div>
         </div>
       )}
    </div>
  );
};

export default AdminShipping;
