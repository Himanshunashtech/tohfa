import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, SlidersHorizontal, X, ChevronDown, Filter, ImageIcon, Trash2, Edit2, ExternalLink, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/WishlistButton";
import StickyNav from "@/components/StickyNav";
import { useAdminData } from "@/context/AdminDataContext";
import FooterSection from "@/components/FooterSection";
import PageTransition from "@/components/PageTransition";
import { ProductGridSkeleton } from "@/components/SkeletonLoader";
import ProductCard from "@/components/ProductCard";
import { Magnetic } from "@/components/Magnetic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const { products: adminProducts, filterOptions } = useAdminData();
  const { categories, occasions, recipients, vibes } = filterOptions;
  const { addItem } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  // Filter States synced with URL
  const category = searchParams.get("category") || "All";
  const occasion = searchParams.get("occasion") || "All";
  const recipient = searchParams.get("recipient") || "All";
  const vibe = searchParams.get("vibe") || "All";
  const sort = (searchParams.get("sort") as SortOption) || "featured";
  const maxPrice = Number(searchParams.get("price")) || 500;
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "All") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const filtered = useMemo(() => {
    let list = [...adminProducts];

    if (category !== "All") list = list.filter((p) => p.category === category);
    if (occasion !== "All") list = list.filter((p) => p.occasion?.some(o => o.toLowerCase() === occasion.toLowerCase()));
    if (recipient !== "All") list = list.filter((p) => p.recipient?.some(r => r.toLowerCase() === recipient.toLowerCase()));
    if (vibe !== "All") list = list.filter((p) => p.vibe?.some(v => v.toLowerCase() === vibe.toLowerCase()));
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    
    list = list.filter((p) => p.price <= maxPrice);

    if (!showOutOfStock) {
      list = list.filter(p => p.stock > 0);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      default:
        // Already features the primary sort
        break;
    }
    return list;
  }, [category, occasion, recipient, sort, maxPrice]);

  const activeFilterCount = [category, occasion, recipient, vibe].filter(f => f !== "All").length + (maxPrice < 500 ? 1 : 0);

  return (
    <PageTransition title="Shop Our Collection">
      <StickyNav />
      <main className="pt-24 pb-20 bg-muted/20 min-h-screen">
        <div className="container mx-auto max-w-7xl px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground tracking-tight">Curated Gifts</h1>
              <p className="text-muted-foreground mt-4 text-lg">
                Showing {filtered.length} unique treasures
                {searchQuery && (
                  <span className="ml-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    Search: "{searchQuery}"
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
               {/* Mobile Filter Toggle */}
               <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className={`lg:hidden rounded-full px-6 h-11 border-border/50 bg-background flex gap-2 items-center transition-all ${activeFilterCount > 0 ? "border-primary/50 text-primary" : ""}`}
              >
                <Filter size={16} />
                Filters
              </Button>

               <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className={`hidden lg:flex rounded-full px-6 h-11 border-border/50 bg-background gap-2 items-center transition-all ${activeFilterCount > 0 ? "border-primary/50 text-primary" : ""}`}
              >
                <Filter size={16} />
                {showFilters ? "Hide Filters" : "Show Filters"}
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center ml-1">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <Select value={sort} onValueChange={(v) => updateFilter("sort", v)}>
                <SelectTrigger className="w-[180px] h-11 bg-background border-border/50 rounded-full px-5 text-sm">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-muted-foreground" />
                    <SelectValue placeholder="Sort By" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/50 p-1">
                  <SelectItem value="featured" className="rounded-xl">Most Relevant</SelectItem>
                  <SelectItem value="price-asc" className="rounded-xl">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc" className="rounded-xl">Price: High to Low</SelectItem>
                  <SelectItem value="rating" className="rounded-xl">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Extended Filters Sidebar */}
            <AnimatePresence>
              {showFilters && (
                <motion.aside 
                  initial={{ opacity: 0, x: -20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 280 }}
                  exit={{ opacity: 0, x: -20, width: 0 }}
                  className="hidden lg:block shrink-0 space-y-10"
                >
                  <div className="sticky top-32 space-y-10">
                    <FilterGroup 
                      title="Category" 
                      options={["All", ...categories]} 
                      current={category} 
                      onChange={(v) => updateFilter("category", v)} 
                    />
                    <FilterGroup 
                      title="Occasion" 
                      options={["All", ...occasions.map(o => o.charAt(0).toUpperCase() + o.slice(1))]} 
                      current={occasion} 
                      onChange={(v) => updateFilter("occasion", v)} 
                    />
                    <FilterGroup 
                      title="Recipient" 
                      options={["All", ...recipients.map(r => r.charAt(0).toUpperCase() + r.slice(1))]} 
                      current={recipient} 
                      onChange={(v) => updateFilter("recipient", v)} 
                    />
                    <FilterGroup 
                      title="Vibe" 
                      options={["All", ...vibes.map(v => v.charAt(0).toUpperCase() + v.slice(1))]} 
                      current={vibe} 
                      onChange={(v) => updateFilter("vibe", v)} 
                    />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Price Range</h3>
                        <span className="text-xs font-bold text-primary font-mono select-none">Under ${maxPrice}</span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="500" 
                        step="10"
                        value={maxPrice} 
                        onChange={(e) => updateFilter("price", e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                       <input 
                         type="checkbox" 
                         id="out-of-stock"
                         checked={showOutOfStock}
                         onChange={(e) => setShowOutOfStock(e.target.checked)}
                         className="w-4 h-4 accent-primary rounded border-border"
                       />
                       <label htmlFor="out-of-stock" className="text-xs font-bold uppercase tracking-widest text-muted-foreground cursor-pointer">
                         Show Out of Stock
                       </label>
                    </div>

                    {activeFilterCount > 0 && (
                      <Button 
                        variant="ghost" 
                        onClick={() => setSearchParams({})}
                        className="w-full justify-start text-xs font-bold text-muted-foreground hover:text-destructive flex gap-2 p-0"
                      >
                        <X size={14} /> Reset All Filters
                      </Button>
                    )}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            <div className="flex-1">
              {isLoading ? (
                <ProductGridSkeleton count={8} />
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                  {filtered.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              ) : (
                <div className="bg-background rounded-[3rem] p-20 text-center border border-dashed border-border/50">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Filter className="text-muted-foreground" size={32} />
                  </div>
                  <h2 className="text-3xl font-heading font-bold mb-4">No matching gifts found</h2>
                  <p className="text-muted-foreground mb-10 max-w-md mx-auto">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <Button 
                    onClick={() => setSearchParams({})}
                    className="rounded-full px-10 h-14 text-base font-bold shadow-xl shadow-primary/20"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-[60]">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowFilters(false)}
                 className="absolute inset-0 bg-black/40 backdrop-blur-sm"
               />
               <motion.div
                 initial={{ x: "100%" }}
                 animate={{ x: 0 }}
                 exit={{ x: "100%" }}
                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
                 className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background shadow-2xl p-8 overflow-y-auto"
               >
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-heading font-bold">Filters</h2>
                    <button onClick={() => setShowFilters(false)} className="p-2 -mr-2">
                       <X size={20} />
                    </button>
                 </div>
                 
                 <div className="space-y-12">
                   <FilterGroup 
                      title="Category" 
                      options={["All", ...categories]} 
                      current={category} 
                      onChange={(v) => updateFilter("category", v)} 
                    />
                    <FilterGroup 
                      title="Occasion" 
                      options={["All", ...occasions.map(o => o.charAt(0).toUpperCase() + o.slice(1))]} 
                      current={occasion} 
                      onChange={(v) => updateFilter("occasion", v)} 
                    />
                    <FilterGroup 
                      title="Recipient" 
                      options={["All", ...recipients.map(r => r.charAt(0).toUpperCase() + r.slice(1))]} 
                      current={recipient} 
                      onChange={(v) => updateFilter("recipient", v)} 
                    />
                    <FilterGroup 
                      title="Vibe" 
                      options={["All", ...vibes.map(v => v.charAt(0).toUpperCase() + v.slice(1))]} 
                      current={vibe} 
                      onChange={(v) => updateFilter("vibe", v)} 
                    />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Price Range</h3>
                        <span className="text-xs font-bold text-primary">Under ${maxPrice}</span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="500" 
                        step="10"
                        value={maxPrice} 
                        onChange={(e) => updateFilter("price", e.target.value)}
                        className="w-full accent-primary h-1.5 bg-muted rounded-full appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                       <input 
                         type="checkbox" 
                         id="m-out-of-stock"
                         checked={showOutOfStock}
                         onChange={(e) => setShowOutOfStock(e.target.checked)}
                         className="w-5 h-5 accent-primary rounded-lg"
                       />
                       <label htmlFor="m-out-of-stock" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                         Show Out of Stock
                       </label>
                    </div>

                    <Button 
                      className="w-full h-14 rounded-2xl font-bold shadow-xl shadow-primary/20"
                      onClick={() => setShowFilters(false)}
                    >
                      Show {filtered.length} Results
                    </Button>
                 </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

const FilterGroup = ({ title, options, current, onChange }: { title: string, options: string[], current: string, onChange: (v: string) => void }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full group"
      >
        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pt-1 pb-2">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => onChange(opt)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    current === opt
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-2 ring-primary/20"
                      : "bg-background border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;

