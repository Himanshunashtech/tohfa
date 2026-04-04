import { useState, useMemo } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  X, 
  LayoutDashboard, 
  Check, 
  ArrowRight,
  Package,
  Image as ImageIcon,
  Users
} from "lucide-react";
import { getProductImage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AdminCollections = () => {
  const { 
    collections, 
    products, 
    addCollection, 
    updateCollection, 
    deleteCollection, 
    addProductToCollection, 
    removeProductFromCollection,
    updateCollectionProductOrder
  } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  
  // Product Search for Management
  const [productSearch, setProductSearch] = useState("");
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
  const [activeCollectionForProducts, setActiveCollectionForProducts] = useState<any>(null);

  const filteredCollections = collections.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    best_for: "",
    image_url: "",
    is_featured: false,
    status: "published"
  });

  const handleEdit = (col: any) => {
    setEditingCollection(col);
    setFormData({
      name: col.name,
      slug: col.slug,
      description: col.description || "",
      best_for: col.best_for || "",
      image_url: col.image_url || "",
      is_featured: col.is_featured || false,
      status: col.status || "published"
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCollection) {
      await updateCollection(editingCollection.id, formData);
    } else {
      await addCollection(formData);
    }
    setIsModalOpen(false);
    setEditingCollection(null);
    setFormData({ name: "", slug: "", description: "", best_for: "", image_url: "", is_featured: false, status: "published" });
  };

  const openProductManager = (col: any) => {
    setActiveCollectionForProducts(col);
    setIsProductManagerOpen(true);
  };

  const availableProducts = useMemo(() => {
    if (!activeCollectionForProducts) return [];
    const currentProductIds = activeCollectionForProducts.products?.map((p: any) => p.product_id) || [];
    return products.filter(p => 
      !currentProductIds.includes(p.id) && 
      (p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category_name?.toLowerCase().includes(productSearch.toLowerCase()))
    ).slice(0, 8);
  }, [products, productSearch, activeCollectionForProducts]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Collections Hub</h1>
          <p className="text-muted-foreground mt-1">Manage your curated gift sets and collection landing pages.</p>
        </div>
        <Button onClick={() => { setEditingCollection(null); setIsModalOpen(true); }} className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 gap-2">
          <Plus size={20} /> Create Collection
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Collections", value: collections.length, icon: LayoutDashboard, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Products in Collections", value: collections.reduce((acc, c) => acc + (c.products?.length || 0), 0), icon: Package, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Avg. Items / Coll", value: collections.length ? (collections.reduce((acc, c) => acc + (c.products?.length || 0), 0) / collections.length).toFixed(1) : 0, icon: Check, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-background border border-border/50 p-6 rounded-3xl flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCollections.map((col) => (
          <motion.div 
            key={col.id}
            layout
            className="bg-background border border-border/50 rounded-[2.5rem] p-6 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 border-l-8 border-l-primary"
          >
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-border/20 bg-muted">
                <img src={getProductImage(col.image_url)} alt={col.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-bold truncate">{col.name}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(col)} className="w-8 h-8 rounded-full">
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteCollection(col.id)} className="w-8 h-8 rounded-full text-destructive">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{col.description}</p>
                <div className="flex items-center gap-4 mt-4">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded">
                      <Package size={12} /> {col.products?.length || 0} Products
                   </div>
                   <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${col.status === 'published' ? 'text-green-600 bg-green-50' : 'text-slate-500 bg-slate-50'}`}>
                      {col.status === 'published' ? '● Published' : '○ Draft'}
                   </div>
                   {col.is_featured && (
                     <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        🏠 Featured on Home
                     </div>
                   )}
                   <button onClick={() => openProductManager(col)} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary underline decoration-primary/20">
                      Manage Products
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-background rounded-[3rem] border border-border/50 shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">{editingCollection ? "Refine Collection" : "New Curation"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Collection Name</Label>
                    <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-2xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL Path)</Label>
                    <Input id="slug" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="rounded-2xl h-12" placeholder="holiday-warmth" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="desc">Catchy Description</Label>
                  <textarea 
                    id="desc" 
                    required 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full min-h-[100px] bg-muted/20 border border-border/50 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="best_for">Who is this for? (Exclusive USP)</Label>
                  <Input id="best_for" required value={formData.best_for} onChange={e => setFormData({...formData, best_for: e.target.value})} className="rounded-2xl h-12" placeholder="Best for minimalist office setups" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Cover Image URL</Label>
                  <div className="flex gap-2">
                    <Input id="image" required value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="rounded-2xl h-12 flex-1" />
                    <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden shrink-0 border border-border/20">
                      <img src={getProductImage(formData.image_url)} key={formData.image_url} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-5 h-5 rounded-lg border-primary/20 accent-primary"
                  />
                  <Label htmlFor="is_featured" className="text-sm font-medium leading-none cursor-pointer">
                    Feature this collection on the home page
                  </Label>
                </div>

                <div className="space-y-3 pt-2">
                  <Label>Visibility Status</Label>
                  <div className="flex gap-2">
                    {['published', 'draft'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({...formData, status: s})}
                        className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
                          formData.status === s 
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
                            : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-2xl h-14 font-bold text-lg shadow-xl shadow-primary/20">
                  {editingCollection ? "Update Collection" : "Create Collection"}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Manager Panel */}
      <AnimatePresence>
        {isProductManagerOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsProductManagerOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-background border-l border-border/50 shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-border/20">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Manage Curation</h2>
                  <button onClick={() => setIsProductManagerOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={20} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{activeCollectionForProducts?.name}</p>
                
                <div className="relative mt-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    placeholder="Search catalog to add..." 
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="pl-10 rounded-xl h-11 bg-muted/20 border-none" 
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Search Results */}
                {productSearch && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Catalog Results</h4>
                    {availableProducts.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/10 border border-dashed border-border/50 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <img src={getProductImage(p.images?.[0])} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate max-w-[150px]">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground">${p.price}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => addProductToCollection(activeCollectionForProducts.id, p.id)} className="w-8 h-8 rounded-full text-primary hover:bg-primary/10">
                          <Plus size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Current Selection */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary px-2">In Collection ({activeCollectionForProducts?.products?.length || 0})</h4>
                  {[...(activeCollectionForProducts?.products || [])]
                    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                    .map(({ product_id, products: p, sort_order }: any, idx, arr) => (
                    <div key={product_id} className="group relative">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border/50 shadow-sm hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3">
                          <img src={getProductImage(p?.images?.[0])} alt={p?.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate max-w-[120px]">{p?.name}</p>
                            <p className="text-[10px] text-muted-foreground">Order: {sort_order || 0}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" size="icon" 
                            disabled={idx === 0}
                            onClick={() => updateCollectionProductOrder(activeCollectionForProducts.id, product_id, (arr[idx-1].sort_order || 0) - 1)}
                            className="w-7 h-7 rounded-lg hover:bg-primary/10 text-primary"
                          >
                             <ArrowRight size={14} className="-rotate-90" />
                          </Button>
                          <Button 
                            variant="ghost" size="icon" 
                            disabled={idx === arr.length - 1}
                            onClick={() => updateCollectionProductOrder(activeCollectionForProducts.id, product_id, (arr[idx+1].sort_order || 0) + 1)}
                            className="w-7 h-7 rounded-lg hover:bg-primary/10 text-primary"
                          >
                             <ArrowRight size={14} className="rotate-90" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => removeProductFromCollection(activeCollectionForProducts.id, product_id)} className="w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {activeCollectionForProducts?.products?.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-border/20 rounded-[2.5rem]">
                       <Package size={32} className="mx-auto text-muted-foreground/20 mb-2" />
                       <p className="text-xs text-muted-foreground italic tracking-tight">This collection is empty.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 border-t border-border/20">
                 <Button onClick={() => setIsProductManagerOpen(false)} className="w-full rounded-2xl h-12 shadow-lg">Done Management</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCollections;
