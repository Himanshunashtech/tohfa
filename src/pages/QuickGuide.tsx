import { motion } from "framer-motion";
import { 
  Sparkles, 
  Box, 
  Edit3, 
  Truck, 
  CheckCircle2, 
  MessageSquare, 
  Layout, 
  ArrowRight,
  ShieldCheck,
  Globe,
  FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StickyNav from "@/components/StickyNav";
import PageTransition from "@/components/PageTransition";
import FooterSection from "@/components/FooterSection";

const GuideSection = ({ icon: Icon, title, desc, steps, color, image, reverse = false }: any) => (
  <section className={`py-20 ${reverse ? 'bg-muted/30' : 'bg-background'}`}>
    <div className="container mx-auto max-w-6xl px-6">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, x: reverse ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-xl`}>
            <Icon size={28} />
          </div>
          <h2 className="text-4xl font-heading font-bold italic">{title}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{desc}</p>
          
          <div className="space-y-4 pt-4">
            {steps.map((step: string, i: number) => (
              <div key={i} className="flex gap-3 items-start group">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-all">
                  {i + 1}
                </div>
                <p className="text-sm font-medium">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-video bg-muted rounded-[3rem] overflow-hidden shadow-2xl border border-border/50"
        >
          <img 
            src={image} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${color.replace('bg-', 'from-')}`} />
        </motion.div>
      </div>
    </div>
  </section>
);

const QuickGuide = () => {
  return (
    <PageTransition title="Quick Order Guide" description="Master every feature of the TofhaVerse artisan gifting platform.">
      <StickyNav />
      
      <main className="pt-24 min-h-screen">
        {/* Hero */}
        <section className="relative py-32 overflow-hidden border-b border-border/10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary mb-8"
            >
              <ShieldCheck size={12} /> Full Platform Tour
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold italic mb-6">
              Gifting, <span className="text-primary not-italic">Simplified</span>.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed italic">
              From personal artisan finds to global corporate logistics, here's how to master the TofhaVerse experience.
            </p>
          </div>
        </section>

        {/* AI Assistant Section */}
        <GuideSection 
          icon={Sparkles}
          title="The Aria Concierge"
          desc="Our personal AI advisor, Aria, uses deep sentiment analysis to find gifts that perfectly match a recipient's unique vibe."
          color="bg-primary"
          image="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200"
          steps={[
            "Start a conversation via the 'Gift Assistant' button.",
            "Tell Aria about the recipient, occasion, and your preferred budget.",
            "Choose from a hand-picked, weighted selection of artisan curated items.",
            "One-click 'Quick Add' directly into your hunt gallery."
          ]}
        />

        {/* Corporate Architect Section */}
        <GuideSection 
          icon={Box}
          title="Gift Box Architect"
          desc="For high-stakes corporate gifting, use our visual builder to curate artisan sets for entire teams."
          color="bg-secondary"
          reverse={true}
          image="https://images.unsplash.com/photo-1549463591-24c1882bd396?q=80&w=1200"
          steps={[
            "Select your Box Vibe (Luxe, Eco-Minimalist, or Milestone).",
            "Pick up to 8 premium artisan pieces from our curated catalog.",
            "Upload your company logo for digital or physical branding previews.",
            "Submit for a white-glove quote from our logistics specialists."
          ]}
        />

        {/* Personalization Section */}
        <GuideSection 
          icon={Edit3}
          title="Artisan Personalization"
          desc="Every piece on TofhaVerse can be transformed into a personal treasure with custom engravings."
          color="bg-amber-600"
          image="https://images.unsplash.com/photo-1581373449483-37449f962b0c?q=80&w=1200"
          steps={[
            "Look for the 'Personalize' badge on qualifying artisan items.",
            "Enter your custom message, recipient name, or special date.",
            "Preview the engraving live on the product model before adding to cart.",
            "Our artisans will hand-engrave or foil-press your piece in the studio."
          ]}
        />

        {/* Global Logistics Section */}
        <GuideSection 
          icon={Globe}
          title="Bulk CSV fulfillment"
          desc="For orders of 50+ gifts, we handle the complexity of multi-address global shipping."
          color="bg-slate-900"
          reverse={true}
          image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200"
          steps={[
            "Download our standard Batch Fulfillment CSV template.",
            "List your recipient addresses and personalized messages in one file.",
            "Drop the CSV into your corporate dashboard for instant verification.",
            "Track individual deliveries globally with our real-time logistics hub."
          ]}
        />

        {/* Final CTA */}
        <section className="py-32 bg-primary text-white text-center">
           <div className="container mx-auto max-w-4xl px-6">
              <h2 className="text-4xl font-heading font-bold italic mb-8">Ready to start your hunt?</h2>
              <div className="flex flex-wrap justify-center gap-4">
                 <Link to="/gift-assistant">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 h-14 font-bold shadow-2xl">
                       Try Aria AI Assistant
                    </Button>
                 </Link>
                 <Link to="/corporate">
                    <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 rounded-full px-10 h-14 font-bold">
                       Explore Corporate
                    </Button>
                 </Link>
              </div>
           </div>
        </section>
      </main>
      
      <FooterSection />
    </PageTransition>
  );
};

export default QuickGuide;
