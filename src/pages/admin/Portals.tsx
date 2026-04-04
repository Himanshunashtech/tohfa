import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Plus, 
  ExternalLink, 
  MoreVertical, 
  Users, 
  TrendingUp, 
  Globe, 
  Copy, 
  Check, 
  Trash2, 
  Edit,
  X,
  PieChart,
  Layout
} from "lucide-react";
import { useAdminData, AdminPortal } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminPortals = () => {
  const { portals, addPortal, updatePortal, deletePortal, products } = useAdminData();
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<AdminPortal>>({
    name: "",
    client: "",
    welcomeMessage: "",
    discountPct: 10,
    primaryColor: "#E11D48",
    active: true,
    slug: "",
    featuredProducts: []
  });

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/portal/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(slug);
    toast.success("Portal link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.client || !formData.slug) {
      toast.error("Please fill in the required fields.");
      return;
    }

    const newPortal: AdminPortal = {
      ...formData,
      id: `p-${Date.now()}`,
      stats: { views: 0, orders: 0, revenue: 0 },
      featuredProducts: formData.featuredProducts || [],
    } as AdminPortal;

    addPortal(newPortal);
    setIsAdding(false);
    setFormData({
      name: "",
      client: "",
      welcomeMessage: "",
      discountPct: 10,
      primaryColor: "#E11D48",
      active: true,
      slug: "",
      featuredProducts: []
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">B2B Gifting <span className="text-primary">Portals</span></h1>
          <p className="text-muted-foreground">Provision and manage custom-branded storefronts for enterprise clients.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 gap-2">
          <Plus size={18} /> Provision New Portal
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Portal Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {portals.map((portal, i) => (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-background border border-border/50 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: portal.primaryColor || "#E11D48" }} />
                
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border border-border/10 p-2">
                    {portal.logo ? (
                      <img src={portal.logo} alt={portal.client} className="w-full h-full object-contain" />
                    ) : (
                      <Globe size={32} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleCopy(portal.slug)}
                      className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                    >
                      {copiedId === portal.slug ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-1">{portal.name}</h3>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{portal.client}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-3 bg-muted/30 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter mb-1">Views</p>
                    <p className="text-sm font-bold">{portal.stats.views.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter mb-1">Orders</p>
                    <p className="text-sm font-bold">{portal.stats.orders.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter mb-1">Revenue</p>
                    <p className="text-sm font-bold">${portal.stats.revenue.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link to={`/portal/${portal.slug}`} target="_blank" className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl gap-2 font-bold text-xs h-10">
                      <ExternalLink size={14} /> Preview Portal
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={() => deletePortal(portal.id)} className="rounded-xl w-10 h-10 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {portals.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/50">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Palette size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">No portals active</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2">Provision your first client storefront to get started with B2B gifting.</p>
              <Button onClick={() => setIsAdding(true)} variant="link" className="mt-4 text-primary font-bold">
                Provision a new portal
              </Button>
            </div>
          )}
        </div>

        {/* Global Portal Stats */}
        <div className="space-y-8">
           <div className="bg-background border border-border/50 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="font-bold flex items-center gap-2 mb-6 text-lg">
                <TrendingUp size={18} className="text-primary" /> B2B Performance
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Enterprise Revenue</span>
                    <span className="text-sm font-bold">$6.3K</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} className="h-full bg-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Client Reach</span>
                    <span className="text-sm font-bold">2.1K Users</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "42%" }} className="h-full bg-sky-500" />
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-border/10">
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Quick Insights</p>
                 <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-xs text-primary leading-relaxed">
                      <strong>Google Rewards</strong> is currently your highest performing portal, accounting for 65% of enterprise monthly revenue.
                    </p>
                 </div>
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-foreground text-background shadow-xl">
              <h3 className="font-bold text-lg mb-2">Artisan Marketplace Sync</h3>
              <p className="text-xs opacity-60 mb-6 leading-relaxed">Enterprise portals automatically sync inventory from our artisan network in real-time.</p>
              <Button variant="outline" className="w-full rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold h-12 text-xs uppercase tracking-widest">
                Force Inventory Sync
              </Button>
           </div>
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-background border border-border/50 rounded-[3rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-8 right-8 p-3 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <X size={20} />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-heading font-bold mb-2">Client Provisioning</h2>
                <p className="text-muted-foreground">Configure the custom branding and policy for this enterprise portal.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client Name</Label>
                    <Input 
                      id="client" 
                      placeholder="e.g. Google India" 
                      value={formData.client} 
                      onChange={e => setFormData({ ...formData, client: e.target.value })}
                      className="rounded-2xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portalName">Portal Name</Label>
                    <Input 
                      id="portalName" 
                      placeholder="e.g. Rewards Suite" 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-2xl h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Custom URL Slug</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground truncate max-w-[100px]">/portal/</span>
                      <Input 
                        id="slug" 
                        placeholder="google-rewards" 
                        value={formData.slug} 
                        onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="rounded-2xl h-12 pl-16 font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Brand Color</Label>
                    <div className="flex gap-3">
                      <Input 
                        id="color" 
                        type="color" 
                        className="w-12 h-12 p-1 rounded-xl cursor-pointer" 
                        value={formData.primaryColor}
                        onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                      />
                      <Input 
                        value={formData.primaryColor} 
                        onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="rounded-2xl flex-1 h-12 font-mono text-sm uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome">Welcome Message</Label>
                  <textarea 
                    id="welcome"
                    placeholder="Tell the employees why they are here..."
                    className="w-full rounded-2xl border border-border/50 bg-background px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    value={formData.welcomeMessage}
                    onChange={e => setFormData({ ...formData, welcomeMessage: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Initial Product Curation</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {products.slice(0, 9).map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          const current = formData.featuredProducts || [];
                          const updated = current.includes(p.id) ? current.filter(id => id !== p.id) : [...current, p.id];
                          setFormData({ ...formData, featuredProducts: updated });
                        }}
                        className={`text-left p-3 rounded-2xl border transition-all ${
                          formData.featuredProducts?.includes(p.id) ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border/50 bg-muted/20 hover:bg-muted/40"
                        }`}
                      >
                         <p className="text-[10px] font-bold truncate">{p.name}</p>
                         <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{p.priceFormatted}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="flex-1 rounded-2xl h-14 font-bold">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 rounded-2xl h-14 font-bold shadow-xl shadow-primary/20">
                    Finish & Provision
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPortals;
