import { motion, useScroll, useTransform } from "framer-motion";
import { Award, Gift, Star, Zap, ChevronRight, Sparkles, Coins, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAdminData } from "@/context/AdminDataContext";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Rewards = () => {
  const { user } = useAuth();
  const { customers } = useAdminData();
  
  // Find current user in admin data to get real points
  const activeCustomer = customers.find(c => c.email === user?.email);
  
  const currentPoints = activeCustomer?.points || 0;
  const currentTier = activeCustomer?.tier || "Silver";
  
  const tierConfigs = {
    Silver: { next: "Gold", target: 1000, color: "text-muted-foreground" },
    Gold: { next: "Platinum", target: 5000, color: "text-amber-500" },
    Platinum: { next: "Diamond", target: 15000, color: "text-primary" },
    Diamond: { next: "Elite", target: 50000, color: "text-purple-500" }
  };

  const config = tierConfigs[currentTier as keyof typeof tierConfigs] || tierConfigs.Silver;
  const progress = Math.min((currentPoints / config.target) * 100, 100);
  const remaining = Math.max(config.target - currentPoints, 0);

  return (
    <PageTransition title="Elite Rewards" description="Unlock exclusive perks and benefits with the Tofhaverse Elite loyalty program.">
      <StickyNav />
      <main className="pt-24 overflow-hidden bg-background">
        <div className="bg-foreground text-background py-4">
          <Breadcrumbs />
        </div>
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center bg-foreground text-background">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549463591-24c1882bd396?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-foreground via-transparent to-foreground"></div>
          </div>
          
          <div className="container mx-auto max-w-4xl px-6 relative z-10 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-20 h-20 bg-primary rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-primary/40"
            >
              <Award size={40} className="text-primary-foreground" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-heading font-bold mb-6"
            >
              Tofhaverse <span className="text-primary italic">Elite</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-background/70 mb-10 max-w-2xl mx-auto"
            >
              An exclusive loyalty program for the world's most thoughtful gifters. Earn points, unlock artisanal perks, and transcend the ordinary.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {!user ? (
                <>
                  <Link to="/register">
                    <Button size="lg" className="rounded-full px-12 h-14 text-base font-bold bg-primary text-primary-foreground hover:scale-105 transition-transform">
                      Join the Circle
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="rounded-full px-12 h-14 text-base font-bold border-background/20 text-background hover:bg-background hover:text-foreground">
                      Sign In
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="w-full max-w-2xl bg-background/10 backdrop-blur-xl border border-background/20 p-8 rounded-[3rem] shadow-2xl">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-left">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Your Elite Status</p>
                      <h3 className="text-3xl font-bold text-background mb-4 flex items-center gap-3">
                        {currentTier} Tier <Sparkles className="text-primary" size={24} />
                      </h3>
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[10px] text-background/50 uppercase font-bold tracking-wider">Current Balance</p>
                          <p className="text-2xl font-bold flex items-center gap-2">
                             <Coins size={18} className="text-primary" /> {currentPoints.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-[1px] h-10 bg-background/20" />
                        <div>
                          <p className="text-[10px] text-background/50 uppercase font-bold tracking-wider">Next Tier At</p>
                          <p className="text-2xl font-bold text-background/80">{config.target.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-48 space-y-3">
                       <div className="flex justify-between items-end mb-1">
                         <span className="text-[10px] font-bold uppercase text-background/60">Progress</span>
                         <span className="text-[10px] font-bold uppercase text-primary italic">{Math.round(progress)}% to {config.next}</span>
                       </div>
                       <div className="w-full h-3 bg-background/10 rounded-full overflow-hidden border border-background/20 mt-2">
                         <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-primary shadow-[0_0_15px_rgba(255,107,83,0.5)]" 
                         />
                       </div>
                       <p className="text-[10px] text-background/40 italic">You need {remaining.toLocaleString()} more points for {config.next}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Ways to Earn */}
        <section className="py-32 bg-background">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Ways to Earn Points</h2>
              <p className="text-muted-foreground">Every interaction with Tofhaverse brings you closer to your next reward.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Coins, title: "1 point per $1", desc: "Earn for every purchase you make on our store." },
                { icon: Users, title: "Refer a Friend", desc: "Get 500 points when they make their first order." },
                { icon: Star, title: "Review a Product", desc: "Earn 100 points for sharing your gift experience." },
                { icon: Zap, title: "Sign Up Bonus", desc: "Get 200 points just for joining our elite circle." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-muted/30 p-8 rounded-[2.5rem] border border-border/10 hover:border-primary/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <item.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="py-32 bg-muted/20">
          <div className="container mx-auto max-w-5xl px-6">
            <h2 className="text-center text-3xl font-heading font-bold mb-20">Membership Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector line */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-border/50 hidden md:block -translate-y-1/2 z-0"></div>
              
              {[
                { name: "Silver", points: "0 - 1,000", perks: ["Standard Shipping", "Standard Support"] },
                { name: "Gold", points: "1,001 - 5,000", perks: ["Free Shipping", "Priority Support", "Early Access"] },
                { name: "Platinum", points: "5,000+", perks: ["Concierge Gifting", "Instant Support", "Exclusive Previews", "Annual Gift"] }
              ].map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative z-10 space-y-6 flex flex-col items-center"
                >
                  <div className={`w-20 h-20 rounded-full border-4 ${i === 2 ? "border-primary bg-primary shadow-2xl shadow-primary/20" : "border-border bg-background"} flex items-center justify-center mb-4`}>
                    <p className={`font-bold ${i === 2 ? "text-primary-foreground" : "text-muted-foreground"}`}>{tier.name[0]}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{tier.points} Points</p>
                  </div>
                  <ul className="space-y-3 pt-6 border-t border-border w-full">
                    {tier.perks.map((perk, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
                        <ChevronRight size={14} className="text-primary" /> {perk}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-40 bg-foreground text-background">
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase mb-8">
              <Sparkles size={14} /> Only for the thoughtful
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-10 leading-tight">Elevate Your Gifting Experience Today</h2>
            <Link to="/register">
              <Button size="lg" className="rounded-full px-16 h-16 text-lg font-bold bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-2xl shadow-primary/40">
                Join Tofhaverse Elite
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default Rewards;
