import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminData } from "@/context/AdminDataContext";
import { Search as SearchIcon, Star, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import WishlistButton from "@/components/WishlistButton";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import PageTransition from "@/components/PageTransition";
import { getProductImage } from "@/lib/utils";

const Search = () => {
  const { products: adminProducts } = useAdminData();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { addItem } = useCart();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const searchLower = query.toLowerCase();
    return adminProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
    );
  }, [query, adminProducts]);

  return (
    <PageTransition>
      <StickyNav />
      <main className="pt-32 pb-20 min-h-screen">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-bold flex items-center gap-3">
              <SearchIcon className="text-primary" size={32} />
              {query ? `Results for "${query}"` : "Search Products"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {results.length} {results.length === 1 ? "result" : "results"} found
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group"
                >
                  <Link to={`/product/${p.id}`} className="block">
                    <div className="relative overflow-hidden rounded-2xl bg-muted mb-4 shadow-sm border border-border/10">
                      <img
                        src={getProductImage(p.images[0])}
                        alt={p.name}
                        loading="lazy"
                        className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <WishlistButton
                        productId={p.id}
                        productName={p.name}
                        className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm"
                      />
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({ productId: p.id, name: p.name, price: p.price, image: getProductImage(p.images[0]) });
                        }}
                        className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 py-2.5 rounded-full bg-background/90 backdrop-blur-md text-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-border/50"
                      >
                        <ShoppingBag size={15} /> Quick Add
                      </motion.button>
                    </div>
                  </Link>
                  <Link to={`/product/${p.id}`}>
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-1">{p.category}</p>
                    <h3 className="font-heading text-sm sm:text-base font-semibold group-hover:text-primary transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-0.5">
                        <Star size={12} className="fill-primary text-primary" />
                        <span className="text-xs font-medium">{p.rating}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">({p.reviewCount} reviews)</span>
                    </div>
                    <p className="text-sm font-bold text-foreground mt-1.5">{p.priceFormatted}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-muted/30 rounded-3xl border border-dashed border-border/50">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon size={32} className="text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">No results found</h2>
              <p className="text-muted-foreground mb-8">
                Try searching for something else or browse our collections.
              </p>
              <Link to="/shop">
                <Button className="rounded-full px-8 gap-2">
                  Browse All Products <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default Search;
