import { useState, useMemo } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  LayoutGrid, 
  Check, 
  ArrowRight,
  Package,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getProductImage } from "@/lib/utils";

const AdminCategories = () => {
  const { 
    categories, 
    products, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    updateProduct
  } = useAdminData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  // Product Search for Management
  const [productSearch, setProductSearch] = useState("");
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
  const [activeCategoryForProducts, setActiveCategoryForProducts] = useState<any>(null);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    sort_order: 0
  });

  const handleEdit = (cat: any) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug || "",
      description: cat.description || "",
      image_url: cat.image_url || "",
      sort_order: cat.sort_order || 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
    } else {
      await addCategory(formData);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "", image_url: "", sort_order: 0 });
  };

  const openProductManager = (cat: any) => {
    setActiveCategoryForProducts(cat);
    setIsProductManagerOpen(true);
  };

  // Products currently in this category
  const categoryProducts = useMemo(() => {
    if (!activeCategoryForProducts) return [];
    return products.filter(p => p.category === activeCategoryForProducts.name);
  }, [products, activeCategoryForProducts]);

  // Products NOT in this category available for adding
  const availableProducts = useMemo(() => {
    if (!activeCategoryForProducts) return [];
    return products.filter(p => 
      p.category !== activeCategoryForProducts.name && 
      (p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category?.toLowerCase().includes(productSearch.toLowerCase()))
    ).slice(0, 8);
  }, [products, productSearch, activeCategoryForProducts]);

  const handleAddProduct = async (productId: string) => {
    if (!activeCategoryForProducts) return;
    await updateProduct(productId, { 
      category: activeCategoryForProducts.name,
      categoryId: activeCategoryForProducts.id 
    });
    toast.success("Product moved to this category");
  };

  const handleRemoveProduct = async (productId: string) => {
    await updateProduct(productId, { 
      category: "Uncategorized",
      categoryId: null 
    });
    toast.success("Product removed from category");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Category Workshop</h1>
          <p className="text-muted-foreground mt-1">Organize your shop's core browsing structure and material curations.</p>
        </div>
        <Button onClick={() => { setEditingCategory(null); setIsModalOpen(true); }} className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 gap-2">
          <Plus size={20} /> Create Category
        </Button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCategories.map((cat) => (
          <motion.div 
            key={cat.id}
            layout
            className="bg-background border border-border/50 rounded-[2rem] p-5 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
          >
            <div className="flex gap-5">
              <div className="w-14 h-14 rounded-xl bg-muted/30 flex items-center justify-center text-primary shrink-0 border border-border/50">
                {cat.image_url ? (
                  <img src={getProductImage(cat.image_url)} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Layers size={24} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-bold truncate">{cat.name}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)} className="w-8 h-8 rounded-full">
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)} className="w-8 h-8 rounded-full text-destructive">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded">
                      <Package size={12} /> {products.filter(p => p.category === cat.name).length} Products
                   </div>
                   <button onClick={() => openProductManager(cat)} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary underline decoration-primary/20">
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
              className="relative w-full max-w-lg bg-background rounded-[3rem] border border-border/50 shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">{editingCategory ? "Refine Category" : "New Category"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cat_name">Category Name</Label>
                  <Input id="cat_name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-2xl h-12" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cat_image">Icon/Image URL (Optional)</Label>
                  <Input id="cat_image" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="rounded-2xl h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat_order">Sort Order</Label>
                  <Input id="cat_order" type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})} className="rounded-2xl h-12" />
                </div>

                <Button type="submit" className="w-full rounded-2xl h-14 font-bold text-lg shadow-xl shadow-primary/20">
                  {editingCategory ? "Update Category" : "Build Category"}
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
                  <h2 className="text-xl font-bold">Assign Products</h2>
                  <button onClick={() => setIsProductManagerOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={20} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{activeCategoryForProducts?.name}</p>
                
                <div className="relative mt-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    placeholder="Search other products to move here..." 
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
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Available Products</h4>
                    {availableProducts.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/10 border border-dashed border-border/50 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <img src={getProductImage(p.images?.[0])} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate max-w-[150px]">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground">Current: {p.category || 'None'}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleAddProduct(p.id)} className="w-8 h-8 rounded-full text-primary hover:bg-primary/10">
                          <Plus size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Current Category Products */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary px-2">Assigned to {activeCategoryForProducts?.name} ({categoryProducts.length})</h4>
                  {categoryProducts.map((p) => (
                    <div key={p.id} className="group relative">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border/50 shadow-sm hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3">
                          <img src={getProductImage(p.images?.[0])} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate max-w-[120px]">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground">${p.price}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(p.id)} className="w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {categoryProducts.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-border/20 rounded-[2.5rem]">
                       <Package size={32} className="mx-auto text-muted-foreground/20 mb-2" />
                       <p className="text-xs text-muted-foreground italic tracking-tight">No products in this category.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 border-t border-border/20">
                 <Button onClick={() => setIsProductManagerOpen(false)} className="w-full rounded-2xl h-12 shadow-lg">Finish Assigment</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
