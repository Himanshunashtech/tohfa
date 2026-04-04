import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Package, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Award, 
  Mail, 
  MapPin, 
  Phone,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  MessageSquare,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminCustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { customers, orders, awardPoints, updateCustomer } = useAdminData();
  
  const customer = customers.find(c => c.id === id);
  const [note, setNote] = useState(customer?.adminNotes || "");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleSaveNote = async () => {
    if (!customer) return;
    setIsSavingNote(true);
    await updateCustomer(customer.id, { admin_notes: note });
    setIsSavingNote(false);
  };

  const handleManualPoints = async () => {
    if (!customer || !adjustAmount || !adjustReason) return;
    await awardPoints(customer.email, parseInt(adjustAmount), adjustReason);
    setAdjustAmount("");
    setAdjustReason("");
    setIsAdjusting(false);
  };
  const customerOrders = useMemo(() => 
    orders.filter(o => o.customer.email.toLowerCase() === customer?.email.toLowerCase()),
    [orders, customer]
  );

  const stats = useMemo(() => {
    const totalSpent = customerOrders.reduce((acc, current) => acc + current.total, 0);
    const avgOrder = customerOrders.length > 0 ? totalSpent / customerOrders.length : 0;
    const lastOrder = customerOrders.length > 0 ? customerOrders[0].date : "No orders";
    
    return {
      totalSpent,
      avgOrder,
      orderCount: customerOrders.length,
      lastOrder,
      ltvScore: Math.min(100, Math.floor((totalSpent / 500) * 100)) // Simulation
    };
  }, [customerOrders]);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-background rounded-3xl border border-dashed border-border">
        <User size={48} className="text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">Customer Not Found</h2>
        <p className="text-muted-foreground mb-8">The customer record you are looking for does not exist.</p>
        <Link to="/admin/customers">
          <Button variant="outline">Back to Customers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link to="/admin/customers" className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1 mb-4 uppercase tracking-widest">
            <ChevronLeft size={14} /> Back to Customers
          </Link>
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <User size={32} />
             </div>
             <div>
                <h1 className="text-3xl font-heading font-bold mb-1">{customer.name}</h1>
                <div className="flex items-center gap-2">
                   <span className="text-sm text-muted-foreground">{customer.email}</span>
                   <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                   <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-md ${
                     customer.tier === "Diamond" || customer.tier === "Platinum" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                     customer.tier === "Gold" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" :
                     "bg-slate-100 text-slate-700 border border-slate-200"
                   }`}>
                     {customer.tier} Tier Member
                   </span>
                </div>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl h-12 gap-2">
            <Mail size={18} /> Email Customer
          </Button>
          <Button className="rounded-xl h-12 shadow-lg shadow-primary/20 gap-2">
            <Zap size={18} /> Quick Action
          </Button>
        </div>
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Col: Core Metrics */}
        <div className="lg:col-span-3 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-background p-6 rounded-[2rem] border border-border/50 shadow-sm"
             >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                   <TrendingUp size={20} />
                </div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Lifetime Value</p>
                <h3 className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</h3>
                <div className="mt-4 flex items-center gap-2">
                   <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.ltvScore}%` }} />
                   </div>
                   <span className="text-[10px] font-bold text-emerald-600 uppercase">Top 10%</span>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-background p-6 rounded-[2rem] border border-border/50 shadow-sm"
             >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                   <Award size={20} />
                </div>
                 <div className="flex items-center justify-between gap-4">
                    <h3 className="text-2xl font-bold">{customer.points} PTs</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 hover:bg-primary/10"
                      onClick={() => setIsAdjusting(true)}
                    >
                      Adjust
                    </Button>
                 </div>
                 <div className="mt-4 flex items-center gap-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">Status:</span>
                    <span className="text-[10px] text-muted-foreground">{customer.tier} Priority</span>
                 </div>
              </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-background p-6 rounded-[2rem] border border-border/50 shadow-sm"
             >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                   <Package size={20} />
                </div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Total Orders</p>
                <h3 className="text-2xl font-bold">{stats.orderCount}</h3>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-muted-foreground">
                   <Clock size={12} />
                   <span>Avg. Order Value: <strong>${stats.avgOrder.toFixed(2)}</strong></span>
                </div>
             </motion.div>
          </div>

          {/* Order History */}
          <div className="bg-background rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-border/10 flex items-center justify-between">
                <div>
                   <h2 className="text-xl font-bold">Transaction History</h2>
                   <p className="text-xs text-muted-foreground mt-1">Order timeline and fulfillment status</p>
                </div>
                <Button variant="ghost" size="sm" className="rounded-xl text-xs font-bold gap-2">
                   View All <ChevronRight size={14} />
                </Button>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-muted/30">
                         <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order ID</th>
                         <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                         <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                         <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Items</th>
                         <th className="px-8 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border/10">
                      {customerOrders.map((order) => (
                         <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-8 py-5">
                               <Link to={`/admin/orders/${order.id.replace('#', '')}`} className="font-bold text-sm text-primary hover:underline">
                                  {order.id}
                               </Link>
                            </td>
                            <td className="px-8 py-5 text-sm text-muted-foreground font-medium">{order.date}</td>
                            <td className="px-8 py-5">
                               <span className={`text-[10px] font-bold uppercase py-1 px-3 rounded-full ${
                                 order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
                                 order.status === "Processing" ? "bg-amber-100 text-amber-700" :
                                 "bg-indigo-100 text-indigo-700"
                               }`}>
                                  {order.status}
                               </span>
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex -space-x-2">
                                  {order.items.slice(0, 3).map((item, i) => (
                                     <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                     </div>
                                  ))}
                                  {order.items.length > 3 && (
                                     <div className="w-8 h-8 rounded-full border-2 border-background bg-background flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                                        +{order.items.length - 3}
                                     </div>
                                  )}
                               </div>
                            </td>
                            <td className="px-8 py-5 text-right font-bold text-sm">${order.total.toFixed(2)}</td>
                         </tr>
                      ))}
                      {customerOrders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-8 py-12 text-center text-muted-foreground italic text-sm">
                            No orders found for this customer.
                          </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>

           {/* Loyalty History (Live) */}
           <div className="bg-background rounded-[2.5rem] border border-border/50 shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6">Loyalty Pulse</h2>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 {customer.pointsHistory?.length > 0 ? customer.pointsHistory.map((log: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 relative">
                       {i !== customer.pointsHistory.length - 1 && (
                          <div className="absolute left-[19px] top-10 w-[2px] h-10 bg-border/20 z-0" />
                       )}
                       <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-background ${
                         log.change_amount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                       }`}>
                          {log.change_amount > 0 ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />}
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center justify-between">
                             <h4 className="font-bold text-sm">{log.reason}</h4>
                             <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{new Date(log.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{log.change_amount > 0 ? "+" : ""}{log.change_amount} Points</p>
                       </div>
                    </div>
                 )) : <p className="text-sm text-muted-foreground italic text-center py-8">No loyalty history available.</p>}
              </div>
           </div>

        </div>

        {/* Right Col: Details & Relationship */}
        <div className="space-y-8">
           <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                 <ShieldCheck size={20} className="text-primary" /> Relationship Stats
              </h3>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-3 border-b border-border/5">
                    <span className="text-sm text-muted-foreground">Joined Date</span>
                    <span className="text-sm font-bold">Jan 12, 2024</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-border/5">
                    <span className="text-sm text-muted-foreground">Total Returns</span>
                    <span className="text-sm font-bold text-emerald-600">0 Items</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-border/5">
                    <span className="text-sm text-muted-foreground">Email Status</span>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase">Verified</span>
                 </div>
                 <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-muted-foreground">Review Score</span>
                    <div className="flex items-center gap-1 text-amber-500">
                       <Heart size={14} fill="currentColor" />
                       <span className="text-sm font-bold">4.8</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                 <MapPin size={20} className="text-primary" /> Shipping Info
              </h3>
              
              <div className="space-y-5">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                       <MapPin size={18} className="text-muted-foreground" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Primary Address</p>
                       <p className="text-sm leading-relaxed font-medium">123 Artisan Way, Apt 4B<br />Brooklyn, NY 11201</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                       <Phone size={18} className="text-muted-foreground" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Contact Phone</p>
                       <p className="text-sm font-medium">+1 (555) 000-0000</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Relationship Notes */}
           <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                 <MessageSquare size={20} className="text-primary" /> Admin Notes
              </h3>
              <div className="space-y-4">
                 <div className="relative">
                    <textarea 
                      placeholder="Add internal note..." 
                      className="w-full bg-muted/30 border border-border/10 p-4 rounded-2xl text-sm min-h-[120px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <Button 
                      onClick={handleSaveNote}
                      disabled={isSavingNote || note === customer?.adminNotes}
                      className="w-full mt-2 rounded-xl h-10 font-bold text-xs uppercase tracking-widest"
                    >
                      {isSavingNote ? "Scaling registry..." : "Save Internal Memo"}
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerDetail;
