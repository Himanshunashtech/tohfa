import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Gift,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Globe,
  Plus,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAdminData } from "@/context/AdminDataContext";

const Dashboard = () => {
  const { orders: allOrders, customers, products: allProducts, inventoryLogs: allLogs, currentArtisan } = useAdminData();

  // Perspective Filtering Logic
  const products = currentArtisan 
    ? allProducts.filter(p => p.artisan?.name === currentArtisan)
    : allProducts;

  const orders = currentArtisan
    ? allOrders.filter(o => o.items.some(item => products.some(p => p.id === item.id)))
    : allOrders;

  const inventoryLogs = currentArtisan
    ? allLogs.filter(log => products.some(p => p.id === log.productId))
    : allLogs;

  const totalRevenue = orders.reduce((acc, o) => {
    if (currentArtisan) {
      // Only count revenue for items belonging to this artisan
      const artisanItems = o.items.filter(item => products.some(p => p.id === item.id));
      return acc + artisanItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }
    return acc + o.total;
  }, 0);

  const activeOrders = orders.filter(o => o.status === "Processing" || o.status === "Shipped").length;
  const eliteMembers = customers.filter(c => c.tier === "Diamond" || c.tier === "Platinum").length;
  const giftOrders = orders.filter(o => o.type === "Gift");
  const avgGiftValue = giftOrders.length > 0 ? giftOrders.reduce((acc, o) => acc + o.total, 0) / giftOrders.length : 0;
  
  const lowStockProducts = products.filter(p => p.stock <= 10);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const recentLogs = inventoryLogs.slice(0, 4);

  // Calculate Popular Recipients from real orders
  const recipientCount: Record<string, number> = {
    "Partner": 0,
    "Mother": 0,
    "Friend": 0,
    "Corporate": 0
  };

  orders.forEach(order => {
    if (order.giftDetails) {
      const rel = order.giftDetails.recipient.toLowerCase();
      if (rel.includes("mom") || rel.includes("mother")) recipientCount["Mother"]++;
      else if (rel.includes("wife") || rel.includes("husband") || rel.includes("partner")) recipientCount["Partner"]++;
      else if (rel.includes("work") || rel.includes("boss") || rel.includes("corp")) recipientCount["Corporate"]++;
      else recipientCount["Friend"]++;
    } else {
       recipientCount["Friend"]++; // Default for personal
    }
  });

  const popularRecipients = Object.entries(recipientCount)
    .map(([label, count]) => ({
      label,
      value: orders.length > 0 ? Math.round((count / orders.length) * 100) : 0,
      color: label === "Partner" ? "bg-primary" : 
             label === "Mother" ? "bg-primary/60" : 
             label === "Friend" ? "bg-primary/30" : "bg-muted"
    }))
    .filter(r => r.value > 0 || orders.length === 0)
    .sort((a, b) => b.value - a.value);

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "+12.5%", positive: true },
    { label: "Active Orders", value: activeOrders.toString(), icon: ShoppingBag, trend: "+3", positive: true },
    { label: "Elite Members", value: eliteMembers.toString(), icon: Users, trend: "+84", positive: true },
    { label: "Average Gift Value", value: `$${avgGiftValue.toFixed(2)}`, icon: Gift, trend: "-2.1%", positive: false },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Welcome Back, Admin</h1>
        <p className="text-muted-foreground">Here's what's happening in TofhaVerse today.</p>
      </div>

      {/* Autonomous Operations Core */}
      <div className="bg-foreground text-background p-8 rounded-[3rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <Zap className="text-primary animate-pulse" size={24} />
                <h2 className="text-2xl font-bold font-heading">TofhaVerse Autonomous Engine</h2>
             </div>
             <p className="text-muted-foreground max-w-xl">
               The AI engine is currently monitoring global inventory, optimizing dynamic pricing models, and auto-routing logistics based on real-time demand.
             </p>
             <div className="flex gap-6 mt-6">
                <div>
                   <p className="text-3xl font-bold text-primary">142</p>
                   <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground tracking-tighter">Automated Decisions</p>
                </div>
                <div>
                   <p className="text-3xl font-bold text-primary">12ms</p>
                   <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground tracking-tighter">Response Latency</p>
                </div>
             </div>
          </div>
          <div className="shrink-0">
             <div className="bg-background/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center shadow-inner">
                <p className="text-sm font-bold mb-4 tracking-wide uppercase text-white">Global Autopilot</p>
                <button 
                  onClick={() => {
                    const event = new CustomEvent('sonner-toast', { detail: { type: 'success', message: 'Autopilot engaged. System is self-healing.' }});
                    window.dispatchEvent(event);
                  }}
                  className="w-32 h-14 bg-primary hover:bg-primary/90 text-white rounded-full font-bold transition-all relative overflow-hidden group shadow-[0_0_20px_rgba(var(--primary),0.5)]"
                >
                   <motion.div animate={{ x: ["-100%", "100%"]}} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                   ENGAGE
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-background p-6 rounded-[2.5rem] border border-border/50 shadow-sm cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="text-primary" size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.positive ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                {stat.positive ? <TrendingUp size={10} /> : <TrendingUp size={10} className="rotate-180" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Recent Gifting Activity</h2>
            <Link to="/admin/orders">
              <Button variant="outline" className="rounded-xl text-xs h-9 transition-all active:scale-95">View All Orders</Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/10">
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order ID</th>
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Customer</th>
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</th>
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Slot</th>
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-4 font-bold text-sm tracking-tight">{order.id}</td>
                    <td className="py-4 text-sm">{order.customer.name}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${order.type === "Gift" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {order.type}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-medium flex items-center gap-2">
                       <Clock size={12} className={order.slot === "Midnight" ? "text-primary" : "text-muted-foreground"} />
                       {order.slot}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {order.status === "Processing" && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                        {order.status === "Shipped" && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                        {order.status === "Delivered" && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                        {order.status === "Flagged" && <span className="w-2 h-2 rounded-full bg-rose-400" />}
                        <span className="text-xs font-semibold">{order.status}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-bold text-right">${(currentArtisan ? order.items.filter(item => products.some(p => p.id === item.id)).reduce((sum, item) => sum + (item.price * item.qty), 0) : order.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights & Health */}
        <div className="space-y-8 flex flex-col">
           <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm flex-1">
              <h2 className="text-xl font-bold mb-6">Regional Sales Hubs</h2>
              <div className="space-y-4">
                {[
                  { city: "New York", share: 42, icon: Globe },
                  { city: "Dubai", share: 28, icon: MapPin },
                  { city: "London", share: 18, icon: Globe },
                ].map((region) => (
                  <div key={region.city} className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 hover:bg-primary/5 transition-colors group">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary">
                           <region.icon size={14} />
                        </div>
                        <span className="text-sm font-bold">{region.city}</span>
                     </div>
                     <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">{region.share}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-border/10 pt-8">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Inventory Logs</h3>
                 <div className="space-y-4">
                    {recentLogs.map((log) => (
                       <div key={log.id} className="flex items-start gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${log.change > 0 ? "bg-emerald-500" : "bg-rose-500"}`} />
                          <div className="flex-1">
                             <p className="text-[10px] font-bold tracking-tight leading-none mb-1">{log.productName}</p>
                             <p className="text-[9px] text-muted-foreground">{log.reason} • {log.time}</p>
                          </div>
                          <span className={`text-[10px] font-bold ${log.change > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                             {log.change > 0 ? "+" : ""}{log.change}
                          </span>
                       </div>
                    ))}
                    {recentLogs.length === 0 && (
                       <p className="text-[10px] text-muted-foreground italic">No recent inventory activity.</p>
                    )}
                 </div>
              </div>
           </div>

           {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) ? (
              <div className="p-6 rounded-[2rem] bg-rose-50 border border-rose-100 flex flex-col items-center text-center">
                 <AlertCircle size={24} className="text-rose-500 mb-2" />
                 <p className="text-xs font-bold uppercase text-rose-600 mb-1 tracking-tighter">Operational Alert</p>
                 <p className="text-[10px] text-rose-900 font-medium">
                    {outOfStockProducts.length > 0 ? `${outOfStockProducts.length} items are OUT OF STOCK. ` : ""}
                    {lowStockProducts.length > 0 ? `${lowStockProducts.length} items are critically low.` : ""}
                 </p>
                 <Link to="/admin/products" className="w-full mt-4">
                    <Button variant="ghost" size="sm" className="w-full h-9 rounded-xl text-[10px] font-bold uppercase text-rose-600 hover:bg-rose-200 bg-rose-100/50">Restock Immediately</Button>
                 </Link>
              </div>
           ) : (
             <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center">
                <CheckCircle2 size={24} className="text-emerald-500 mb-2" />
                <p className="text-xs font-bold uppercase text-emerald-600 mb-1 tracking-tighter">Inventory Healthy</p>
                <p className="text-[10px] text-emerald-900 font-medium">All SKUs are above critical levels. Marketplace supply stable.</p>
                <Link to="/admin/products" className="w-full mt-4">
                   <Button variant="ghost" size="sm" className="w-full h-9 rounded-xl text-[10px] font-bold uppercase text-emerald-600 hover:bg-emerald-100">View Catalog</Button>
                </Link>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
