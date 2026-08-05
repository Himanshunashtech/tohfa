import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  Gift, 
  Tag, 
  Heart,
  Image as ImageIcon,
  RefreshCw,
  CheckSquare,
  Square,
  X,
  Zap,
  MessageSquare,
  ChevronDown,
  Palette
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProductImage } from "@/lib/utils";

const AdminProducts = () => {
  const { 
    products: activeProducts, 
    trashProducts, 
    deleteProduct, 
    restoreProduct,
    purgeProduct,
    globalRestock, 
    bulkDeleteProducts, 
    bulkRestockProducts, 
    currentArtisan,
    updateProduct
  } = useAdminData();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "trash">("active");
  
  const currentPool = activeTab === "active" ? activeProducts : trashProducts;

  const products = currentArtisan 
    ? currentPool.filter(p => p.artisan?.name === currentArtisan)
    : currentPool;
 
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const [orderedProducts, setOrderedProducts] = useState(filteredProducts);

  useEffect(() => {
    setOrderedProducts(filteredProducts);
  }, [filteredProducts]);

  const handleReorder = (newOrder: any[]) => {
    setOrderedProducts(newOrder);
  };

  const handleDragEnd = () => {
    orderedProducts.forEach((product, index) => {
      // Re-assign sort_order to backend only after dragging stops
      if (product.sortOrder !== index) {
        updateProduct(product.id, { sortOrder: index });
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === orderedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orderedProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
       bulkDeleteProducts(selectedIds);
       setSelectedIds([]);
    }
  };

  const handleBulkRestock = () => {
    bulkRestockProducts(selectedIds, 50);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Inventory Management</h1>
          <p className="text-sm text-muted-foreground">Manage your gift catalog, metadata, and stock levels.</p>
        </div>
        <div className="flex items-center gap-4">
           {activeTab === "active" ? (
             <>
                <Button 
                  variant="outline" 
                  onClick={globalRestock}
                  className="rounded-xl h-11 flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/5 transition-all"
                >
                  <RefreshCw size={18} /> Bulk Restock (100)
                </Button>
                <Link to="/admin/products/new">
                  <Button className="rounded-xl h-11 flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                    <Plus size={18} /> Add New Gift
                  </Button>
                </Link>
             </>
           ) : (
             <Button 
                variant="ghost" 
                onClick={() => {}} // Could add "Empty Trash" here
                className="rounded-xl h-11 px-6 text-muted-foreground italic pointer-events-none"
             >
                Items in Dustbin are hidden from storefront
             </Button>
           )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-muted/30 rounded-2xl w-fit border border-border/50">
         <button 
           onClick={() => { setActiveTab("active"); setSelectedIds([]); }}
           className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "active" ? "bg-background text-primary shadow-sm ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground"}`}
         >
           Active Catalog ({activeProducts.length})
         </button>
         <button 
           onClick={() => { setActiveTab("trash"); setSelectedIds([]); }}
           className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === "trash" ? "bg-background text-rose-500 shadow-sm ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground"}`}
         >
           Dustbin ({trashProducts.length})
         </button>
      </div>

      {/* Tools */}
      <div className="bg-background p-6 rounded-[2rem] border border-border/50 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button 
            variant="ghost" 
            onClick={toggleSelectAll}
            className="rounded-xl h-11 px-4 flex items-center gap-2 hover:bg-muted"
          >
            {selectedIds.length === orderedProducts.length && orderedProducts.length > 0 ? (
               <CheckSquare size={20} className="text-primary" />
            ) : (
               <Square size={20} className="text-muted-foreground" />
            )}
            <span className="text-sm font-bold">Select All</span>
          </Button>
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or category..." 
              className="w-full h-11 bg-muted/30 border-none rounded-xl pl-10 pr-4 text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="rounded-xl h-11 flex-1 md:flex-none flex items-center gap-2">
            <Filter size={18} /> Filters
          </Button>
          <div className="h-6 w-[1px] bg-border/50 hidden md:block" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden md:block">
            {orderedProducts.length} Products
          </p>
        </div>
      </div>

      {/* Product Grid (Admin View) */}
      <Reorder.Group 
        axis="y"
        values={orderedProducts}
        onReorder={handleReorder}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {orderedProducts.map((p, i) => (
          <Reorder.Item
            key={p.id}
            value={p}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`bg-background rounded-[2.5rem] border ${selectedIds.includes(p.id) ? "border-primary ring-2 ring-primary/20" : "border-border/50"} shadow-sm overflow-hidden group relative cursor-grab active:cursor-grabbing`}
          >
            {/* Selection Checkbox */}
            <button 
              onClick={() => toggleSelect(p.id)}
              className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                selectedIds.includes(p.id) ? "bg-primary text-white" : "bg-white/80 backdrop-blur-md opacity-0 group-hover:opacity-100"
              }`}
            >
              {selectedIds.includes(p.id) ? <CheckSquare size={18} /> : <Square size={18} />}
            </button>

            <div className="relative aspect-[4/3] overflow-hidden">
               <img 
                src={getProductImage(p.images[0])} 
                alt={p.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex gap-2 w-full">
                     {activeTab === "active" ? (
                       <>
                         <Link to={`/admin/products/${p.id}`} className="flex-1">
                            <Button className="w-full bg-white text-black hover:bg-white/90 rounded-xl h-10 font-bold text-xs gap-2">
                               <Edit2 size={14} /> Quick Edit
                            </Button>
                         </Link>
                         <Button 
                            variant="outline" 
                            onClick={() => deleteProduct(p.id)}
                            className="h-10 w-10 p-0 rounded-xl bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-rose-500 hover:border-rose-500"
                          >
                           <Trash2 size={16} />
                         </Button>
                       </>
                     ) : (
                       <>
                         <Button 
                            onClick={() => restoreProduct(p.id)}
                            className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl h-10 font-bold text-xs gap-2 shadow-lg shadow-emerald-500/20"
                         >
                            <RefreshCw size={14} /> Re-add to Store
                         </Button>
                         <Button 
                            variant="outline" 
                            onClick={() => { if(confirm("Permanently delete this product? This cannot be undone.")) purgeProduct(p.id) }}
                            className="h-10 w-10 p-0 rounded-xl bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-rose-600 hover:border-rose-600"
                          >
                           <Trash2 size={16} />
                         </Button>
                       </>
                     )}
                  </div>
               </div>
               <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-background/80 backdrop-blur-md text-[10px] font-bold uppercase py-1 px-3 rounded-full border border-border/50">
                    {p.category}
                  </span>
                  {p.stock <= 5 && (
                    <span className="bg-rose-500 text-white text-[9px] font-bold uppercase py-1 px-3 rounded-full shadow-lg">
                      Critical Stock
                    </span>
                  )}
               </div>
            </div>

            <div className="p-8">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg leading-tight line-clamp-1">{p.name}</h3>
                  <p className="font-bold text-primary">{p.priceFormatted}</p>
               </div>
               
               {/* Gifting Metadata Visualization */}
               <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
                       <Heart size={10} /> Recipients:
                    </div>
                    {p.recipient?.map(r => (
                      <span key={r} className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">{r}</span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
                       <Gift size={10} /> Occasions:
                    </div>
                    {p.occasion?.map(o => (
                      <span key={o} className="text-[9px] font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded">{o}</span>
                    ))}
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-border/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <span className={`w-2.5 h-2.5 rounded-full ${p.stock > 10 ? "bg-emerald-500" : p.stock > 0 ? "bg-amber-500" : "bg-rose-500"}`} />
                     <span className={`text-xs font-semibold ${p.stock <= 5 ? "text-rose-500 font-bold" : ""}`}>
                        {p.stock === 0 ? "Out of Stock" : `${p.stock} in stock`}
                     </span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-background bg-muted overflow-hidden">
                        <img src={`https://i.pravatar.cc/50?u=${p.id}${i}`} alt="User" />
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                      +12
                    </div>
                  </div>
               </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6"
          >
            <div className="bg-foreground text-background p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-3xl">
               <div className="flex items-center gap-4 pl-4">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {selectedIds.length}
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-background/80">Selected Items</p>
               </div>
               
               <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleBulkRestock}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-11 px-6 font-bold text-xs gap-2"
                  >
                    <RefreshCw size={14} /> Bulk Restock (+50)
                  </Button>
                  <Button 
                    onClick={handleBulkDelete}
                    variant="destructive"
                    className="rounded-xl h-11 px-6 font-bold text-xs gap-2"
                  >
                    <Trash2 size={14} /> Delete Selected
                  </Button>
                  <Button 
                    onClick={() => setSelectedIds([])}
                    variant="ghost"
                    size="icon"
                    className="w-11 h-11 rounded-xl text-white hover:bg-white/10"
                  >
                    <X size={20} />
                  </Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
