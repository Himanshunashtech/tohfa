import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Star, Minus, Plus, ShoppingBag, Truck, Leaf, RotateCcw, Edit3, X, Check, Trash2, Sparkles, ShieldCheck, Package } from "lucide-react";
import { Product } from "@/data/products";
import { useAdminData } from "@/context/AdminDataContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import WishlistButton from "@/components/WishlistButton";
import StickyNav from "@/components/StickyNav";
import PageTransition from "@/components/PageTransition";
import FooterSection from "@/components/FooterSection";
import ReviewList from "@/components/ReviewList";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArtisanCard from "@/components/ArtisanCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Magnetic } from "@/components/Magnetic";
import StudioStatus from "@/components/StudioStatus";
import { getProductImage } from "@/lib/utils";
import { autoHealPersonalization, getSmartCrossSells } from "@/lib/discoveryIntelligence";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products: adminProducts, addReview, awardPoints } = useAdminData();
  const { user } = useAuth();
  const product = adminProducts.find(p => p.id === id || p.slug === id);
  const { addItem } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  
  // Advanced Personalization State
  const [personalization, setPersonalization] = useState({
    monogram: "",
    videoMessage: false,
    waxSeal: false
  });
  
  const [appliedPersonalization, setAppliedPersonalization] = useState<any>(null);

  // Autonomous Personalization Config (Self-Healing)
  const config = useMemo(() => {
    if (!product) return null;
    return autoHealPersonalization(product) || {
      supportsMonogramming: false,
      supportsVideoMessage: false,
      supportsEngraving: false,
      monogramPrice: 15,
      videoPrice: 20,
      engravingPrice: 25,
      monogramLimit: 5
    };
  }, [product]);

  const isPersonalizable = config?.supportsMonogramming || config?.supportsVideoMessage || config?.supportsEngraving;

  if (!product) {
    return (
      <PageTransition>
        <StickyNav />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20">
          <h1 className="font-heading text-3xl font-bold text-foreground">Product Not Found</h1>
          <Link to="/" className="text-primary hover:underline text-sm">← Back to Home</Link>
        </div>
      </PageTransition>
    );
  }

  const calculateSurcharges = () => {
    let extra = 0;
    if (!config) return 0;
    if (appliedPersonalization?.monogram) extra += config.monogramPrice;
    if (appliedPersonalization?.videoMessage) extra += config.videoPrice;
    if (appliedPersonalization?.waxSeal) extra += 5; // Default for wax seal
    return extra;
  };

  const handleAddToCart = () => {
    const extraPrice = calculateSurcharges();
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price + extraPrice,
      image: getProductImage(product.images[0]),
      personalization: appliedPersonalization,
    });
    
    setQuantity(1);
    setAppliedPersonalization(null);
    setPersonalization({ monogram: "", videoMessage: false, waxSeal: false });
  };

  // Autonomous Cross-Sells (Discovery Intelligence)
  const related = useMemo(() => getSmartCrossSells(product, adminProducts), [product, adminProducts]);

  return (
    <PageTransition title={product.name} description={product.shortDesc}>
      <StickyNav />
      <main className="pt-24 pb-16">
        <Breadcrumbs />

        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-2xl bg-muted mb-4 relative"
                >
                  <img
                    src={getProductImage(product.images[selectedImage])}
                    alt={product.name}
                    className="w-full aspect-square object-cover"
                  />
                  {appliedPersonalization?.monogram && selectedImage === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="bg-black/10 backdrop-blur-[1px] p-4 rounded-lg transform -rotate-12 border border-white/20">
                        <p className="text-white/90 font-heading text-4xl md:text-5xl font-bold tracking-tighter opacity-80 mix-blend-overlay">
                          {appliedPersonalization.monogram}
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {appliedPersonalization?.videoMessage && (
                    <div className="absolute top-4 left-4 bg-primary text-white p-2 rounded-xl shadow-lg flex items-center gap-2">
                       <Sparkles size={14} className="animate-pulse" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Video Message Included</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-3">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === i ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={getProductImage(img)} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20 shadow-sm">
                  {product.category}
                </span>
                {product.isBestSeller && (
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-500/20 shadow-sm flex items-center gap-1.5">
                    <Sparkles size={10} className="fill-amber-600" /> Bestseller
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight">{product.name}</h1>
                <WishlistButton productId={product.id} productName={product.name} size={24} className="mt-2 shrink-0" />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className={j < product.rating ? "fill-primary text-primary" : "text-border"} />
                  ))}
                </div>
                <a href="#reviews" className="text-sm text-muted-foreground hover:text-primary transition-colors">({product.reviewCount} reviews)</a>
              </div>

              <div className="flex items-center justify-between mb-2 mt-6">
                <div className="text-3xl font-bold text-foreground">{product.priceFormatted}</div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100 shadow-sm">
                   <ShieldCheck size={12} /> Artisan Verified
                </div>
              </div>

              <div className="mt-4 mb-2">
               <div className="mt-4 mb-6 p-4 bg-muted/30 rounded-2xl border border-border/50 max-w-sm">
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${product.stock > 0 ? "bg-green-500/10 text-green-600" : "bg-rose-500/10 text-rose-600 shadow-rose-100 shadow-md"}`}>
                     {product.stock > 0 ? <Package size={20} /> : <X size={20} />}
                   </div>
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none mb-1">Availability</p>
                     <p className={`text-sm font-bold ${product.stock === 0 ? "text-rose-600" : product.stock <= 5 ? "text-amber-600" : "text-green-600"}`}>
                       {product.stock === 0 ? "Out of Stock" : `${product.stock} items left in stock`}
                     </p>
                   </div>
                 </div>
               </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.shortDesc}</p>

              {isPersonalizable && !appliedPersonalization && (
                <button 
                  onClick={() => setIsPersonalizing(true)}
                  className="mt-6 flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all text-primary group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform"><Edit3 size={18} /></div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Personalize this gift</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Add monogram, video, or wax seal</p>
                  </div>
                </button>
              )}

              {appliedPersonalization && (
                <div className="mt-6 p-5 rounded-[2rem] border border-primary/20 bg-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center"><Check size={16} /></div>
                      <p className="text-sm font-bold">Personalization Applied</p>
                    </div>
                    <button onClick={() => setAppliedPersonalization(null)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-11">
                    {appliedPersonalization.monogram && (
                      <div className="text-[10px] font-bold bg-white/50 px-2 py-1 rounded-lg border border-primary/10">MONOGRAM: {appliedPersonalization.monogram}</div>
                    )}
                    {appliedPersonalization.videoMessage && (
                      <div className="text-[10px] font-bold bg-white/50 px-2 py-1 rounded-lg border border-primary/10">VIDEO MESSAGE</div>
                    )}
                    {appliedPersonalization.waxSeal && (
                      <div className="text-[10px] font-bold bg-white/50 px-2 py-1 rounded-lg border border-primary/10">WAX SEAL</div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                <div className="flex items-center border border-border rounded-full bg-background h-12">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Minus size={16} /></button>
                  <span className="w-8 text-center text-sm font-bold text-foreground">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock} className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"><Plus size={16} /></button>
                </div>

                <div className="flex-1 flex gap-3 w-full">
                  <Magnetic strength={0.2} className="flex-1">
                    <Button onClick={handleAddToCart} disabled={product.stock === 0} className={`w-full h-12 rounded-full font-bold text-sm tracking-wide transition-all ${product.stock === 0 ? "bg-muted text-muted-foreground cursor-not-allowed border border-border" : "bg-primary text-primary-foreground shadow-lg shadow-primary/20"}`}>
                      <ShoppingBag size={18} className="mr-2" /> {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </Magnetic>
                  <Magnetic strength={0.2} className="flex-1">
                    <Link to="/checkout" className="w-full">
                       <Button variant="outline" className="w-full h-12 rounded-full font-bold text-sm tracking-wide border-primary/30 text-primary hover:bg-primary/5">Quick Checkout</Button>
                    </Link>
                  </Magnetic>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-border">
                <div className="flex items-center gap-2.5"><Truck size={18} className="text-secondary" /><span className="text-xs text-muted-foreground">Free shipping over $75</span></div>
                <div className="flex items-center gap-2.5"><Leaf size={18} className="text-secondary" /><span className="text-xs text-muted-foreground">Eco-friendly packaging</span></div>
                <div className="flex items-center gap-2.5"><RotateCcw size={18} className="text-secondary" /><span className="text-xs text-muted-foreground">30-day returns</span></div>
              </div>

              <div className="mt-10">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Artisan Context */}
                {product.artisan && (
                  <div className="mb-8">
                    <StudioStatus artisan={product.artisan} />
                  </div>
                )}

                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">Details</h3>
                <ul className="space-y-2">
                  {product.details.map((d: string) => (
                    <li key={d} className="text-sm text-muted-foreground flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />{d}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {product.artisan && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container mx-auto max-w-6xl px-6 mt-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
               <div>
                  <h2 className="text-4xl font-heading font-bold italic mb-2">The <span className="text-primary not-italic">Artisan</span> Story</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="text-muted-foreground text-sm">Every gift starts with a pair of skilled hands.</p>
                    <Link to="/ethics" className="group/ethics flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-widest hover:underline decoration-primary/30 underline-offset-4 decoration-2">
                       Learn about our Ethics <ArrowRight size={12} className="group-hover/ethics:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
               </div>
               <Link to="/artisans">
                  <button className="text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-primary/20 pb-1 hover:border-primary transition-all">View All Makers</button>
               </Link>
            </div>
            <ArtisanCard artisan={product.artisan} />
          </motion.div>
        )}

        <section className="container mx-auto max-w-6xl px-6 mt-24">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-10">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <Link to={`/product/${p.slug || p.id}`} className="group block">
                  <div className="overflow-hidden rounded-2xl bg-muted mb-4 shadow-sm"><img src={getProductImage(p.images[0])} alt={p.name} className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                  <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.priceFormatted}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="reviews" className="container mx-auto max-w-4xl px-6 mt-24 pt-24 border-t border-border">
          <ReviewList productId={product.id} />
        </section>
      </main>

      <AnimatePresence>
        {isPersonalizing && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPersonalizing(false)} className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-background rounded-[3rem] shadow-2xl p-10 border border-border/50 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsPersonalizing(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"><X size={20} /></button>
              
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20"><Sparkles size={32} /></div>
                <h2 className="text-3xl font-heading font-bold mb-2">Personalize Your Gift</h2>
                <p className="text-sm text-muted-foreground">Select the premium touches you'd like to add.</p>
              </div>

              <div className="space-y-6">
                {config?.supportsMonogramming && (
                  <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="monogram" className="text-base font-bold">Monogramming</Label>
                      <span className="text-xs font-bold text-primary">+${config.monogramPrice.toFixed(2)}</span>
                    </div>
                    <Input 
                      id="monogram" 
                      value={personalization.monogram} 
                      onChange={(e) => setPersonalization({ ...personalization, monogram: e.target.value.toUpperCase() })} 
                      placeholder="E.g. A.B.C" 
                      className="rounded-xl h-12 text-center font-heading text-xl tracking-widest" 
                      maxLength={config.monogramLimit}
                    />
                    <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
                       {personalization.monogram.length} / {config.monogramLimit} Characters
                    </p>
                  </div>
                )}

                {config?.supportsVideoMessage && (
                  <div 
                    onClick={() => setPersonalization({ ...personalization, videoMessage: !personalization.videoMessage })}
                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 ${personalization.videoMessage ? "bg-primary/5 border-primary shadow-lg shadow-primary/5" : "bg-muted/30 border-border/50"}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${personalization.videoMessage ? "bg-primary text-white" : "bg-white text-primary border border-primary/20"}`}>
                      <Package size={24} />
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center justify-between">
                         <h4 className="font-bold text-sm text-foreground">Elite Video Message</h4>
                         <span className="text-xs font-bold text-primary">+${config.videoPrice.toFixed(2)}</span>
                       </div>
                       <p className="text-[10px] text-muted-foreground leading-tight mt-1 uppercase font-bold tracking-wider">A digital QR code on the tag links to your recorded video</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${personalization.videoMessage ? "bg-primary border-primary" : "border-border"}`}>
                      {personalization.videoMessage && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                )}

                <div 
                  onClick={() => setPersonalization({ ...personalization, waxSeal: !personalization.waxSeal })}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 ${personalization.waxSeal ? "bg-primary/5 border-primary shadow-lg shadow-primary/5" : "bg-muted/30 border-border/50"}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${personalization.waxSeal ? "bg-primary text-white" : "bg-white text-primary border border-primary/20"}`}>
                    <ShieldCheck size={24} />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between">
                       <h4 className="font-bold text-sm text-foreground">Signature Wax Seal</h4>
                       <span className="text-xs font-bold text-primary">+$5.00</span>
                     </div>
                     <p className="text-[10px] text-muted-foreground leading-tight mt-1 uppercase font-bold tracking-wider">A premium wax seal applied to the handwritten note</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${personalization.waxSeal ? "bg-primary border-primary" : "border-border"}`}>
                    {personalization.waxSeal && <Check size={14} className="text-white" />}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button variant="outline" onClick={() => setIsPersonalizing(false)} className="flex-1 rounded-2xl h-14 font-bold uppercase tracking-widest text-xs">Cancel</Button>
                  <Button 
                    onClick={() => { setAppliedPersonalization(personalization); setIsPersonalizing(false); }} 
                    className="flex-1 rounded-2xl h-14 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-xs"
                  >
                    Confirm Extras
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <FooterSection />
    </PageTransition>
  );
};

export default ProductDetail;
