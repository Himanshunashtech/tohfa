import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
  Download,
  MapPin,
  Globe,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { useAdminData } from "@/context/AdminDataContext";

const AdminAnalytics = () => {
  const { orders: allOrders, customers: allCustomers, products: allProducts, currentArtisan } = useAdminData();

  // Perspective Filtering Logic
  const products = currentArtisan 
    ? allProducts.filter(p => p.artisan?.name === currentArtisan)
    : allProducts;

  const orders = currentArtisan
    ? allOrders.filter(o => o.items.some(item => products.some(p => p.id === item.id)))
    : allOrders;

  const customers = currentArtisan
    ? allCustomers.filter(c => orders.some(o => o.customer.email === c.email))
    : allCustomers;

  // Basic KPI Calculations
  const totalRevenue = orders.reduce((acc, o) => {
    if (currentArtisan) {
      const artisanItems = o.items.filter(item => products.some(p => p.id === item.id));
      return acc + artisanItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }
    return acc + o.total;
  }, 0);

  const totalOrders = orders.length;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const customerLTV = customers.length > 0 ? totalRevenue / customers.length : 0;
  const totalPointsCirculation = customers.reduce((sum, c) => sum + (c.points || 0), 0);

  // Chart Data: Revenue Trends (Last 7 Months)
  // Mapping months to revenue totals
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth();
  const last7Months = Array.from({length: 7}, (_, i) => {
    const idx = (currentMonthIdx - 6 + i + 12) % 12;
    return months[idx];
  });

  const revenueData = last7Months.map(month => {
    const monthOrders = orders.filter(o => o.date.includes(month));
    const revenue = currentArtisan 
      ? monthOrders.reduce((acc, o) => {
          const artisanItems = o.items.filter(item => products.some(p => p.id === item.id));
          return acc + artisanItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
        }, 0)
      : monthOrders.reduce((sum, o) => sum + o.total, 0);

    return {
      month,
      revenue,
      orders: monthOrders.length,
      projected: revenue * 1.15 // 15% projected growth for forecasting
    };
  });

  // Chart Data: Category Performance
  const categoryMap: Record<string, number> = {};
  orders.forEach(order => {
    const artisanItems = currentArtisan 
      ? order.items.filter(item => products.some(p => p.id === item.id))
      : order.items;

    artisanItems.forEach(item => {
      const product = products.find(p => p.id === item.id);
      const category = product?.category || "Other";
      categoryMap[category] = (categoryMap[category] || 0) + (item.price * item.qty);
    });
  });

  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value, fill: `hsl(var(--primary) / ${Math.random() * 0.8 + 0.2})` }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Best Sellers Calculation
  const productSalesMap: Record<string, {name: string, qty: number, revenue: number, image: string}> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSalesMap[item.id]) {
        productSalesMap[item.id] = { name: item.name, qty: 0, revenue: 0, image: item.image };
      }
      productSalesMap[item.id].qty += item.qty;
      productSalesMap[item.id].revenue += (item.price * item.qty);
    });
  });

  const bestSellers = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Chart Data: Recipient Demographics
  const recipientMap: Record<string, number> = {
    "Partner": 0,
    "Mother": 0,
    "Friend": 0,
    "Corporate": 0
  };
  
  orders.forEach(order => {
    if (order.giftDetails) {
      const rel = order.giftDetails.recipient.toLowerCase();
      if (rel.includes("mom") || rel.includes("mother")) recipientMap["Mother"]++;
      else if (rel.includes("wife") || rel.includes("husband") || rel.includes("partner")) recipientMap["Partner"]++;
      else if (rel.includes("work") || rel.includes("boss") || rel.includes("corp")) recipientMap["Corporate"]++;
      else recipientMap["Friend"]++;
    } else {
       recipientMap["Friend"]++; // Default for personal
    }
  });

  const recipientData = Object.entries(recipientMap)
    .map(([name, value]) => ({ name, value: totalOrders > 0 ? Math.round((value / totalOrders) * 100) : 0 }))
    .filter(d => d.value > 0);

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "#fbbf24", "#f43f5e"];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Advanced Analytics</h1>
          <p className="text-sm text-muted-foreground">Forecasting, trends, and deep-dive performance metrics for TofhaVerse.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl h-11 gap-2">
            <Calendar size={16} /> Last 7 Months
          </Button>
          <Button className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-bold gap-2">
             <Download size={16} /> Export Reports
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
             <div className={`w-2 h-2 rounded-full animate-pulse ${currentArtisan ? "bg-amber-500" : "bg-emerald-500"}`} />
             <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest whitespace-nowrap">
                {currentArtisan ? `${currentArtisan} Direct` : "Global Heartbeat: Active"}
             </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, trend: "+24.5%", sub: "live data", icon: DollarSign },
          { label: "Total Orders", value: totalOrders.toString(), trend: "+1.2%", sub: "all time", icon: ShoppingBag },
          { label: "TofhaPoints Circulation", value: totalPointsCirculation.toLocaleString(), trend: "+8.4%", sub: "customer liability", icon: Sparkles },
          { label: "Est. Customer LTV", value: `$${customerLTV.toFixed(2)}`, trend: "+14%", sub: "per active user", icon: Users },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-background p-6 rounded-[2.5rem] border border-border/50 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <stat.icon size={20} />
               </div>
               <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight size={10} /> {stat.trend}
               </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-[10px] text-muted-foreground mt-1 italic">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trends */}
        <div className="lg:col-span-2 bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Revenue Growth Over Time</h2>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Revenue</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary/40" />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Orders</span>
                 </div>
              </div>
           </div>
           
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={revenueData}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis 
                       dataKey="month" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}}
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}}
                       tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                       content={({ active, payload }) => (
                         active && payload?.length ? (
                           <div className="bg-background border border-border/50 p-3 rounded-xl shadow-xl">
                             <p className="text-xs font-bold mb-1">{payload[0].payload.month}</p>
                             <p className="text-lg font-bold text-primary">${payload[0].value}</p>
                             <p className="text-[10px] text-muted-foreground">{payload[1].value} Orders</p>
                           </div>
                         ) : null
                       )}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="projected" stroke="hsl(var(--primary) / 0.3)" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                    <Area type="monotone" dataKey="orders" stroke="hsl(var(--secondary))" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Global Distribution */}
        <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col justify-between">
            <h2 className="text-xl font-bold mb-8">Recipient Demographics</h2>
            <div className="h-[250px] w-full flex items-center justify-center relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={recipientData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {recipientData.map((_entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold">84%</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Love Gifts</span>
               </div>
            </div>
            <div className="space-y-4 mt-8">
               {recipientData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between group">
                     <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-sm font-medium">{item.name}</span>
                     </div>
                     <span className="text-xs font-bold">{item.value}%</span>
                  </div>
               ))}
            </div>
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vibe Sentiment Analysis */}
        <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden flex flex-col justify-between">
           <h2 className="text-xl font-bold mb-4">Vibe Sentiment</h2>
           <div className="space-y-4">
              {[
                { vibe: "Minimalist", score: 85, color: "bg-indigo-500" },
                { vibe: "Foodie", score: 72, color: "bg-amber-500" },
                { vibe: "Adventurer", score: 58, color: "bg-emerald-500" },
                { vibe: "Traditional", score: 45, color: "bg-rose-500" }
              ].map(item => (
                <div key={item.vibe} className="space-y-2">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                      <span>{item.vibe}</span>
                      <span className="text-primary">{item.score}%</span>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        className={`h-full ${item.color}`}
                      />
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-loose">
                 <Sparkles size={10} className="inline mr-1" /> AI INSIGHT: "Minimalist" aesthetic is seeing a 22% spike in click-through rates this week.
              </p>
           </div>
        </div>

        {/* Heatmap Placeholder and Insights */}
        <div className="lg:col-span-2 bg-background p-8 rounded-[3rem] border border-border/50 shadow-sm overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-10 items-center h-full">
              {/* Left: Map Visualization */}
              <div className="flex-1 w-full relative group min-h-[400px]">
                 <div className="absolute inset-0 bg-primary/5 rounded-[2rem] border border-primary/10 backdrop-blur-sm overflow-hidden">
                    <svg viewBox="0 0 800 450" className="w-full h-full opacity-30 fill-muted-foreground/20">
                      {/* Stylized World Map Path (Simplified) */}
                      <path d="M150,150 Q200,100 250,150 T350,150 T450,150 T550,150 T650,150 M100,250 Q150,200 200,250 T300,250 T400,250 T500,250 T600,250 T700,250" stroke="currentColor" strokeWidth="20" fill="none" />
                      <circle cx="200" cy="180" r="100" fill="currentColor" fillOpacity="0.1" />
                      <circle cx="550" cy="220" r="120" fill="currentColor" fillOpacity="0.1" />
                    </svg>
                    
                    {/* Pulsing Pins */}
                    {[
                      { name: "Dubai", x: "65%", y: "45%", orders: "1.2k", growth: "+18%" },
                      { name: "New York", x: "25%", y: "35%", orders: "2.4k", growth: "+12%" },
                      { name: "London", x: "48%", y: "28%", orders: "1.8k", growth: "+8%" },
                      { name: "Mumbai", x: "68%", y: "55%", orders: "900+", growth: "+22%" },
                      { name: "Paris", x: "51%", y: "32%", orders: "1.1k", growth: "+5%" },
                    ].map((hub, i) => (
                      <motion.div
                        key={hub.name}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="absolute"
                        style={{ left: hub.x, top: hub.y }}
                      >
                         <div className="relative group/pin">
                            <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping opacity-20" />
                            <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg relative z-10" />
                            
                            {/* Hover Details Card */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-border/50 p-3 rounded-2xl shadow-2xl opacity-0 group-hover/pin:opacity-100 transition-all pointer-events-none min-w-[120px] z-20">
                               <p className="text-[10px] font-bold uppercase text-primary mb-1">{hub.name}</p>
                               <div className="flex justify-between items-center gap-4">
                                  <span className="text-xs font-bold text-foreground">{hub.orders} Orders</span>
                                  <span className="text-[10px] text-emerald-500 font-bold">{hub.growth}</span>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                 </div>
                 
                 <div className="absolute top-6 left-6 z-10">
                    <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-white/50 shadow-sm flex items-center gap-2">
                       <Globe size={14} className="text-primary" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Global Gifting Hubs</span>
                    </div>
                 </div>
              </div>

              {/* Right: Regional Performance Sidebar */}
              <div className="md:w-64 space-y-6">
                 <h2 className="text-2xl font-bold leading-tight">Regional <span className="text-primary italic">Yield</span></h2>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                    Analyzing SKU rotation across global hubs for predictive inventory optimization.
                 </p>
                 
                 <div className="space-y-4">
                    {[
                      { city: "New York", share: 42, ship: "1-2 days" },
                      { city: "Dubai", share: 28, ship: "Same Day" },
                      { city: "London", share: 18, ship: "Next Day" },
                    ].map(region => (
                      <div key={region.city} className="p-4 rounded-2xl bg-muted/20 border border-border/10 hover:bg-primary/5 transition-colors group">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold">{region.city}</span>
                            <span className="text-xs font-bold text-primary">{region.share}%</span>
                         </div>
                         <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${region.share}%` }}
                               className="h-full bg-primary" 
                            />
                         </div>
                         <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                            <span className="flex items-center gap-1"><Clock size={10} /> {region.ship}</span>
                            <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                      </div>
                    ))}
                 </div>

                 <Button variant="ghost" className="w-full justify-between h-12 rounded-2xl bg-primary/5 text-primary border border-primary/10 font-bold px-6">
                    Full Logistical Audit <ArrowRight size={16} />
                 </Button>
              </div>
            </div>
        </div>
      </div>

      {/* Best Sellers & Marketplace Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold flex items-center gap-2">
                 <Zap size={20} className="text-primary" /> Best Seller Rankings
               </h2>
               <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">By Sales Volume</span>
            </div>
            
            <div className="space-y-6">
               {bestSellers.map((product, i) => (
                 <motion.div 
                   key={product.name}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="flex items-center justify-between group"
                 >
                    <div className="flex items-center gap-4">
                       <div className="relative">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted border border-border/50 group-hover:scale-105 transition-transform">
                             <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-background">
                             {i + 1}
                          </div>
                       </div>
                       <div>
                          <p className="text-sm font-bold truncate max-w-[200px]">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{product.qty} Units Shipped</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-foreground">${product.revenue.toLocaleString()}</p>
                       <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Verified Yield</p>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold flex items-center gap-2">
                 <Activity size={20} className="text-primary" /> Live Marketplace Feed
               </h2>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Live</span>
               </div>
            </div>
            
            <div className="flex-1 space-y-6 overflow-y-auto pr-2 max-h-[300px] custom-scrollbar">
               {orders.slice(0, 8).map((order) => (
                 <div key={order.id} className="flex gap-4 p-4 rounded-2xl bg-muted/20 border border-border/10 hover:bg-primary/5 transition-colors border-l-4 border-l-primary">
                    <div className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center shrink-0">
                       <ShoppingBag size={16} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-bold truncate">{order.customer.name}</p>
                          <span className="text-[10px] font-bold text-primary">{order.date}</span>
                       </div>
                       <p className="text-[10px] text-muted-foreground line-clamp-1">
                         {order.items.map(item => `${item.qty}x ${item.name}`).join(', ')}
                       </p>
                       <div className="flex items-center justify-between mt-2">
                          <p className="text-sm font-bold text-foreground">${order.total.toFixed(2)}</p>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Verified</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            
            <Button variant="ghost" className="w-full mt-6 rounded-xl text-xs font-bold gap-2 group">
               View Full Live Feed <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Button>
         </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
