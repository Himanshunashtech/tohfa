import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Search, ArrowLeft, Home, ShoppingBag } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageTransition>
      <StickyNav />
      <main className="min-h-screen pt-32 pb-20 flex items-center justify-center relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: "2s" }}></div>

        <div className="container mx-auto max-w-2xl px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="relative inline-block">
              <h1 className="text-[12rem] md:text-[16rem] font-heading font-bold text-foreground/5 leading-none select-none">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search size={80} className="text-primary/20 animate-bounce" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Lost in the <span className="text-primary italic">Verse</span>?</h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto leading-relaxed">
              We couldn't find the gift you're looking for at this address. Perhaps it's moved to a different collection?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/">
                <Button size="lg" className="rounded-full px-8 h-14 font-bold gap-2 shadow-xl shadow-primary/20">
                  <Home size={18} /> Back to Home
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14 font-bold gap-2">
                  <ShoppingBag size={18} /> Explore Shop
                </Button>
              </Link>
            </div>

            <div className="mt-16 pt-8 border-t border-border/50 text-sm text-muted-foreground">
              <p>Requested path: <code className="bg-muted px-2 py-1 rounded text-foreground font-mono">{location.pathname}</code></p>
            </div>
          </motion.div>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default NotFound;
