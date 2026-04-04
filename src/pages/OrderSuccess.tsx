import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight, ShoppingBag, Truck, Share2, Sparkles, Twitter, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import { Magnetic } from "@/components/Magnetic";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || "#TV-" + Math.random().toString(36).substr(2, 6).toUpperCase();
  const pointsEarned = location.state?.pointsEarned || 0;

  // Simple Confetti Simulation
  const confetti = Array.from({ length: 40 });

  return (
    <PageTransition title="Order Confirmed | TofhaVerse">
      <StickyNav />
      <main className="pt-32 pb-20 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50"></div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-primary/30"
        >
          <CheckCircle2 size={48} className="text-primary-foreground" />
          
          {/* Confetti Particles */}
          {confetti.map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ 
                x: (Math.random() - 0.5) * 600, 
                y: (Math.random() - 0.5) * 600, 
                opacity: 0,
                scale: [1, 1.5, 0],
                rotate: Math.random() * 720
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                ease: "circOut",
                delay: Math.random() * 0.5
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: ["#E11D48", "#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"][i % 5] 
              }}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl"
        >
          <h1 className="font-heading text-5xl font-bold text-foreground mb-4">Celebration Confirmed!</h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Thank you for choosing TofhaVerse. Your order <span className="font-bold text-foreground">{orderId}</span> has been received and is being prepared with artisan care.
          </p>
          
          {/* Points Earned Banner */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-primary/5 border border-primary/10 rounded-2xl mb-12 shadow-sm"
          >
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles size={16} className="text-primary" />
             </div>
             <p className="text-sm font-bold">
               You just earned <span className="text-primary tracking-tight">+{pointsEarned || "1,240"} TofhaPoints</span>
             </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
            <div className="bg-background/40 backdrop-blur-md border border-border/50 p-8 rounded-[2.5rem] hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <Package size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Artisan Status</h3>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">Your gift has been commissioned. You'll receive live photo updates directly from the studio as they hand-finish your selection.</p>
              
              <Link to={`/track/${orderId.replace('#', '')}`}>
                <Magnetic>
                  <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 group">
                    Track Journey <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Magnetic>
              </Link>
            </div>
            
            <div className="bg-background/40 backdrop-blur-md border border-border/50 p-8 rounded-[2.5rem] hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                    <Share2 size={24} />
                  </div>
                  <div className="flex gap-2">
                    <Twitter size={14} className="text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                    <Instagram size={14} className="text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                    <Facebook size={14} className="text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">Share the Joy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Inspire others with your thoughtful choice. Tag us to be featured in our Curated Stories.</p>
              </div>
              <Button variant="outline" className="w-full mt-8 rounded-xl h-12 font-bold border-2 shrink-0">
                Generate Gift Card
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/shop" className="w-full sm:w-auto">
                <Magnetic>
                  <Button variant="ghost" className="h-14 px-10 rounded-2xl font-bold text-base hover:bg-muted/50 w-full sm:w-auto">
                    Return to Shop
                  </Button>
                </Magnetic>
             </Link>
             <Link to="/account/orders" className="w-full sm:w-auto">
                <Magnetic>
                  <Button variant="outline" className="h-14 px-10 rounded-2xl font-bold text-base border-2 w-full sm:w-auto">
                    View My History
                  </Button>
                </Magnetic>
             </Link>
          </div>
        </motion.div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default OrderSuccess;
