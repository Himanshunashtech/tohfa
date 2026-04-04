import { useState, useEffect } from "react";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  User2, 
  Warehouse, 
  Gift, 
  Share2, 
  Printer, 
  Compass, 
  ArrowRight,
  ShieldCheck, 
  ArrowLeft,
  Search,
  Sparkles,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminData } from "@/context/AdminDataContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const OrderTracking = () => {
  const { id } = useParams();
  const orderId = id;
  const { orders } = useAdminData();
  const [searchId, setSearchId] = useState(orderId || "");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Handle cases where order ID might be in the fragment (e.g. /track/#TV-5164)
  useEffect(() => {
    if (!orderId && window.location.hash) {
      const hashId = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
      if (hashId) {
        navigate(`/track/${hashId}`, { replace: true });
      }
    }
  }, [orderId, navigate]);
  
  const order = orders.find(o => {
    const formattedOrderId = orderId?.startsWith("#") ? orderId : `#${orderId}`;
    return o.id === formattedOrderId || o.rawId === orderId;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;
    
    // Format search ID if needed (strip # for URL, but component handles both)
    const cleanId = searchId.startsWith("#") ? searchId.slice(1) : searchId;
    
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      navigate(`/track/${cleanId}`);
    }, 600);
  };

  if (!order) {
    return (
      <PageTransition title="Track Your Gift">
        <StickyNav />
        <main className="pt-32 pb-20 container mx-auto max-w-4xl px-6 text-center">
          <div className="bg-card border border-border/50 rounded-[3rem] p-12 md:p-20 shadow-sm">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Search size={40} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Track Your Gift</h1>
            <p className="text-muted-foreground mb-12 max-w-md mx-auto">Enter your order ID (e.g., #TV-1234) to see the journey of your handcrafted treasure.</p>
            
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <Input 
                placeholder="Enter Order ID" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="h-14 rounded-2xl bg-muted/50 border-border/50 px-6 font-mono"
              />
              <Button type="submit" size="lg" className="h-14 rounded-2xl px-10 font-bold" disabled={isSearching}>
                {isSearching ? "Searching..." : "Track Now"}
              </Button>
            </form>
          </div>
        </main>
        <FooterSection />
      </PageTransition>
    );
  }

  return (
    <PageTransition title={`Tracking ${order.id}`}>
      <StickyNav />
      <main className="pt-32 pb-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-6">
          {/* Back Action */}
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <div className="p-2 bg-background rounded-full border border-border group-hover:border-primary/50 transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back to Marketplace
          </Link>

          {/* Header Card */}
          <div className="bg-card border border-border/50 rounded-[3rem] p-8 md:p-12 shadow-sm mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Truck size={120} className="rotate-12" />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{order.id}</h1>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
                    order.status === "Shipped" ? "bg-blue-100 text-blue-700" : 
                    order.status === "Cancelled" ? "bg-rose-100 text-rose-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-muted-foreground">Order placed on {new Date().toLocaleDateString()} via {order.shipping?.carrier || "TofhaVerse Global"}</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="rounded-2xl gap-2 border-border/50 h-12 px-6">
                  <Share2 size={18} /> Share Update
                </Button>
                <Button variant="outline" className="rounded-2xl gap-2 border-border/50 h-12 px-6">
                  <Printer size={18} /> Print Invoice
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Journey & Timeline */}
            <div className="lg:col-span-2 space-y-8">
              {/* Journey Map */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border/50 rounded-[3rem] overflow-hidden shadow-sm aspect-video relative group border-4 border-white"
              >
                <div className="absolute inset-0 bg-[#f8f9fa]">
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]" />
                </div>

                {/* The Path */}
                <div className="absolute inset-0 flex items-center justify-center p-24">
                   <div className="relative w-full h-1 bg-muted-foreground/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ 
                          width: order.status === "Cancelled" ? "100%" :
                                 order.status === "Delivered" ? "100%" : 
                                 order.status === "Shipped" ? "65%" : "15%" 
                        }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className={`absolute inset-0 h-full shadow-[0_0_15px_rgba(var(--primary),0.6)] ${
                          order.status === "Cancelled" ? "bg-destructive shadow-destructive/40" : "bg-primary"
                        }`}
                      />
                   </div>
                   
                   {/* Milestones */}
                   <div className="absolute left-10 flex flex-col items-center">
                      <div className="w-14 h-14 bg-background border-2 border-primary rounded-[1.25rem] flex items-center justify-center z-10 shadow-xl">
                        <Building2 size={24} className="text-primary" />
                      </div>
                      <p className="absolute -bottom-10 text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap bg-background px-3 py-1 rounded-full border border-border">Artisan Studio</p>
                   </div>

                   <motion.div 
                      className="absolute z-20 flex flex-col items-center"
                      initial={{ left: "10%" }}
                      animate={{ 
                        left: order.status === "Cancelled" ? "50%" : 
                              order.status === "Delivered" ? "88%" : 
                              order.status === "Shipped" ? "65%" : "15%" 
                      }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                   >
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl border-4 border-background -translate-y-2 ${
                        order.status === "Cancelled" ? "bg-destructive shadow-destructive/40" : "bg-primary shadow-primary/40"
                      }`}>
                        {order.status === "Cancelled" ? <X size={28} className="text-white" /> : <Truck size={28} className="text-white" />}
                      </div>
                   </motion.div>

                   <div className="absolute right-10 flex flex-col items-center">
                      <div className="w-14 h-14 bg-background border-2 border-muted-foreground/30 rounded-[1.25rem] flex items-center justify-center z-10 shadow-lg">
                        <User2 size={24} className="text-muted-foreground" />
                      </div>
                      <p className="absolute -bottom-10 text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap bg-background px-3 py-1 rounded-full border border-border">Destination</p>
                   </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 bg-background/90 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-2xl w-max">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Status</span>
                      <span className="font-bold text-sm text-primary">{order.status === "Delivered" ? "Hand-Delivered" : "In Global Transit"}</span>
                   </div>
                   <div className="w-px h-8 bg-border/50" />
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Timing</span>
                      <span className="font-bold text-sm">{order.slot || "Priority"} Delivery</span>
                   </div>
                   <Button size="sm" variant="ghost" className="rounded-xl hover:bg-primary/5 text-primary gap-2 h-9 px-4 ml-4">
                      Live Feed <Compass size={14} className="animate-spin-slow" />
                   </Button>
                </div>
              </motion.div>

              {/* Timeline */}
              <div className="bg-card border border-border/50 rounded-[3rem] p-10 shadow-sm relative">
                <h3 className="text-2xl font-bold mb-12 flex items-center gap-3">
                   Journey History <span className="text-sm font-medium text-muted-foreground opacity-50">|</span> <span className="text-sm font-medium text-emerald-600 italic">Optimized Path</span>
                </h3>
                
                <div className="space-y-12 relative before:absolute before:left-[1.75rem] before:top-2 before:bottom-2 before:w-px before:bg-border/50">
                  {order.timeline && order.timeline.length > 0 ? (
                    order.timeline.map((event, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-8 relative"
                      >
                        <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center z-10 shadow-lg border-4 border-background ${event.current ? "bg-primary text-white scale-110 shadow-primary/30" : "bg-muted text-muted-foreground"}`}>
                           {event.status.includes("Placed") ? <Package size={22} /> : 
                            event.status.includes("Processing") ? <Warehouse size={22} /> :
                            event.status.includes("Shipped") ? <Truck size={22} /> :
                            <CheckCircle2 size={22} />}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between mb-1">
                             <h4 className={`font-bold text-lg ${event.current ? "text-primary" : "text-foreground"}`}>{event.status}</h4>
                             <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">{event.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                             <MapPin size={14} className="text-primary/40" /> {event.location}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex gap-8 relative">
                      <div className="w-14 h-14 rounded-2xl bg-primary text-white shrink-0 flex items-center justify-center z-10 shadow-lg shadow-primary/30 border-4 border-background">
                         <Package size={22} />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between mb-1">
                           <h4 className="font-bold text-lg text-primary">Order Received</h4>
                           <span className="text-sm font-medium text-muted-foreground">Just now</span>
                        </div>
                        <p className="text-sm text-muted-foreground">TofhaVerse Global System</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel: Support & Security */}
            <div className="space-y-8">
              <div className="bg-foreground text-background rounded-[3rem] p-10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <h3 className="text-2xl font-bold mb-6 relative z-10">Artisan Promise</h3>
                <p className="text-background/70 text-sm leading-relaxed mb-8 relative z-10">
                   Your gift is being delivered via our white-glove fleet. Each hand-off is logged using secure blockchain verification to ensure the integrity of the artisan's work.
                </p>
                <div className="space-y-4 relative z-10">
                   <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <ShieldCheck className="text-primary" size={20} />
                      <span className="text-xs font-bold uppercase tracking-widest text-white/90">Identity Verified</span>
                   </div>
                   <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <Clock className="text-primary" size={20} />
                      <span className="text-xs font-bold uppercase tracking-widest text-white/90">Climate Controlled</span>
                   </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-[3rem] p-10 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Need Assistance?</h3>
                <p className="text-sm text-muted-foreground mb-8">Our gift specialists are available 24/7 to help with your delivery.</p>
                <Link to="/contact">
                   <Button variant="outline" className="w-full rounded-2xl py-6 border-border/50 font-bold hover:bg-primary hover:text-white transition-all">
                      Speak with a Specialist
                   </Button>
                </Link>
                <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
                   <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Support Core</div>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest">
                      Live Support <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default OrderTracking;
