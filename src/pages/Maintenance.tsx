import { motion } from "framer-motion";
import { Hammer, ArrowLeft, Instagram, Twitter, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Maintenance = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full bg-white/50 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left: Beautiful Hero Image */}
        <div className="w-full md:w-1/2 h-[300px] md:h-auto relative overflow-hidden bg-muted">
          <img 
            src="/assets/maintenance-refining.png" 
            alt="Artisan at work" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <div className="text-white space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] uppercase font-bold tracking-widest mb-2">
                 <Sparkles size={10} className="text-amber-400 fill-amber-400" /> Refining the Craft
              </div>
              <h2 className="text-2xl font-heading font-bold italic">Excellence Takes Time</h2>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center space-y-8 bg-background/40">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
               <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
                  <Hammer size={32} className="animate-pulse" />
               </div>
            </div>
            <h1 className="text-4xl font-heading font-bold italic tracking-tight text-foreground">
              Heritage in <span className="text-primary tracking-tighter not-italic font-sans">Progress.</span>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
              We are currently enhancing the TofhaVerse engine to bring you a more seamless artisan gifting experience. We'll be back shortly with a refined collection.
            </p>
          </div>

          <div className="flex flex-col gap-3">
             <Button 
               onClick={() => navigate("/")}
               className="rounded-2xl h-14 bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-between px-8"
             >
                Return to Home <ArrowLeft size={18} className="rotate-180" />
             </Button>
             
             <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Follow Our Journey</span>
                <div className="flex gap-4 text-muted-foreground">
                   <a href="#" className="hover:text-primary transition-colors"><Instagram size={18} /></a>
                   <a href="#" className="hover:text-primary transition-colors"><Twitter size={18} /></a>
                   <a href="#" className="hover:text-primary transition-colors"><Mail size={18} /></a>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-12 text-center"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
          TofhaVerse Global &copy; 2026 • The Ultimate Gifting Heritage
        </p>
      </motion.div>
    </div>
  );
};

export default Maintenance;
