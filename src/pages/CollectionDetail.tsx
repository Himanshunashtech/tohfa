import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useGetCollectionBySlugQuery } from "@/store/api/supabaseApi";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Sparkles, 
  ChevronRight,
  Heart,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import { useAdminData } from "@/context/AdminDataContext";
import { getProductImage } from "@/lib/utils";

const CollectionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { collections, isLoading: contextLoading } = useAdminData();
  
  // Find current collection from context first (most reliable for navigation)
  const collectionFromContext = collections.find(c => 
    c.slug?.toLowerCase().trim() === slug?.toLowerCase().trim()
  );

  const { data: collectionFromApi, isLoading: apiLoading, error: apiError } = useGetCollectionBySlugQuery(slug || "", {
    skip: !!collectionFromContext // Only fetch if not already in context
  });

  const collection = collectionFromContext || collectionFromApi;
  const isLoading = contextLoading || (apiLoading && !collectionFromContext);
  const error = !collectionFromContext ? apiError : null;
  
  // Scroll to top on mount/slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  const otherCollections = collections.filter(c => c.slug !== slug && c.status === 'published').slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-heading font-bold mb-4">Collection Not Found</h1>
        <p className="text-muted-foreground mb-8 text-lg">The curation you're looking for doesn't exist or has been moved.</p>
        <Link to="/collections">
          <Button className="rounded-2xl h-12 px-8 gap-2">
            <ArrowLeft size={18} /> Back to All Collections
          </Button>
        </Link>
      </div>
    );
  }

  const products = [...(collection?.products || [])]
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((p: any) => p.products)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <StickyNav />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={getProductImage(collection.image_url)} 
            alt={collection.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </motion.div>

        <div className="container relative z-10 px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles size={14} className="text-primary" /> Curated Collection
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight drop-shadow-2xl">
              {collection.name}
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed italic">
              "{collection.description}"
            </p>

            <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
               <div className="bg-primary/90 backdrop-blur-xl px-8 py-4 rounded-3xl shadow-2xl shadow-primary/20 flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">Our Recommendation</span>
                  <span className="text-sm font-bold text-white uppercase">{collection.best_for}</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-white/30" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Explore Curation</span>
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="py-24 container px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-2">
          <div className="space-y-2">
            <h2 className="text-4xl font-heading font-bold tracking-tight">The Selection</h2>
            <p className="text-muted-foreground text-lg italic">Hand-picked items that embody the spirit of this curation.</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">{products.length} Masterpieces</span>
             <div className="h-[1px] w-12 bg-primary/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product: any, idx: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-32 text-center border-2 border-dashed border-border/20 rounded-[3rem] bg-muted/5">
            <ShoppingBag size={48} className="mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-xl font-medium text-muted-foreground">This collection is being finalized.</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Check back soon for curated excellence.</p>
          </div>
        )}
      </section>

      {/* Discover More Section */}
      {otherCollections.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="container px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4">Keep Exploring</p>
              <h2 className="text-4xl font-heading font-bold">Discover More Curations</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherCollections.map((col) => (
                <Link key={col.id} to={`/collections/${col.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-6 shadow-xl shadow-primary/5">
                    <img 
                      src={col.image_url} 
                      alt={col.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{col.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{col.description}</p>
                </Link>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/collections">
                <Button variant="outline" className="rounded-2xl h-12 px-8 border-primary/20 hover:bg-primary/5 text-primary">
                  View All Collections
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <FooterSection />
    </div>
  );
};

export default CollectionDetail;
