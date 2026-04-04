import { motion } from "framer-motion";
import { Truck, Package, ShieldCheck, MapPin, Building2, User2, Warehouse, ArrowRight, Clock } from "lucide-react";

const LogisticsShowcase = () => {
  const steps = [
    { 
      icon: Building2, 
      title: "Artisan Creation", 
      desc: "Each gift is crafted by hand in authentic master studios.",
      color: "bg-amber-100 text-amber-700",
      accent: "border-amber-200"
    },
    { 
      icon: ShieldCheck, 
      title: "Human Curation", 
      desc: "Our quality specialists personally inspect every single item.",
      color: "bg-blue-100 text-blue-700",
      accent: "border-blue-200"
    },
    { 
      icon: Truck, 
      title: "White-Glove Fleet", 
      desc: "Temperature-controlled, secure transport for fragile treasures.",
      color: "bg-violet-100 text-violet-700",
      accent: "border-violet-200"
    },
    { 
      icon: User2, 
      title: "Hand-to-Hand Delivery", 
      desc: "Delivered with the grace and timing your gesture deserves.",
      color: "bg-emerald-100 text-emerald-700",
      accent: "border-emerald-200"
    }
  ];

  return (
    <section className="py-40 bg-muted/30 overflow-hidden relative">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center space-y-4 mb-24">
           <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight">The Anatomy of a <span className="text-primary italic">Gesture</span></h2>
           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">From the artisan's workbench to the recipient's hands, every mile is accounted for with scientific precision and human care.</p>
        </div>

        <div className="relative">
          {/* Connecting Path Line */}
          <div className="absolute top-10 left-0 w-full h-[2px] bg-border/50 hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group text-center lg:text-left"
              >
                <div className={`w-20 h-20 rounded-[2rem] ${step.color} border ${step.accent} mx-auto lg:mx-0 flex items-center justify-center mb-6 shadow-xl shadow-black/5 group-hover:scale-110 transition-transform duration-500`}>
                   <step.icon size={32} />
                </div>
                <div className="space-y-3">
                   <h3 className="text-xl font-bold">{step.title}</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
                
                {i < steps.length - 1 && (
                  <div className="mt-8 flex justify-center lg:justify-start lg:hidden">
                    <ArrowRight className="text-border" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Hub Notification */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="mt-32 p-8 md:p-12 bg-foreground text-background rounded-[3rem] relative overflow-hidden shadow-2xl"
        >
           <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <Warehouse size={120} />
           </div>
           
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-4 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-foreground/70">
                    <Clock size={12} /> Global Hub Network
                 </div>
                 <h4 className="text-3xl md:text-4xl font-heading font-bold">18 Logistics Hubs. 4 Continents. One TofhaVerse.</h4>
                 <p className="max-w-xl text-background/60 leading-relaxed">Our proprietary logistics core manages real-time fleet adjustments to ensure your "Midnight Surprise" is never a minute late.</p>
              </div>
              <div className="shrink-0 flex gap-4">
                 <div className="text-center px-6 py-2 border-r border-white/10">
                    <p className="text-3xl font-bold text-primary italic">99.8%</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">On-Time</p>
                 </div>
                 <div className="text-center px-6 py-2">
                    <p className="text-3xl font-bold text-primary italic">18min</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Avg Handover</p>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LogisticsShowcase;
