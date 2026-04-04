import { motion } from "framer-motion";
import { Heart, ShieldCheck, Globe, Users } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";

const About = () => {
  return (
    <PageTransition title="Our Story" description="Learn about Tofhaverse's mission and artisan partners.">
      <StickyNav />
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto max-w-6xl px-6 text-center mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 block"
          >
            The Tofhaverse Story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight"
          >
            Celebrating the Art of <span className="text-secondary italic">Thoughtful</span> Gifting
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Founded on the belief that a gift is more than just an object — it's a bridge between souls and a celebration of connection.
          </motion.p>
        </section>

        {/* Vision Section */}
        <section className="container mx-auto max-w-6xl px-6 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1000&auto=format&fit=crop" 
                alt="Art of gifting"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                In a world that moves too fast, we curate moments of pause. Tofhaverse was born from a simple desire: to make high-quality, artisan-made gifts accessible to those who value the story behind the product.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We travel the globe to partner with master craftsmen, ensuring every item in our collection meets rigorous standards of beauty, durability, and ethical production.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="bg-muted/30 py-24 mb-32 border-y border-border/10">
          <div className="container mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-bold text-center mb-16">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Heart, title: "Heartfelt Curation", desc: "Every product is hand-picked for its ability to convey emotion and care." },
                { icon: ShieldCheck, title: "Uncompromising Quality", desc: "We only partner with artisans who share our obsession with detail." },
                { icon: Globe, title: "Ethical Sourcing", desc: "Our supply chain empowers communities and respects the environment." },
                { icon: Users, title: "Community First", desc: "Building a bridge between global creators and thoughtful gifters." }
              ].map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <val.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{val.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team / Stats */}
        <section className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold mb-12">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: "250+", label: "Artisan Partners" },
              { val: "15k+", label: "Happy Givers" },
              { val: "42", label: "Countries Sourced" },
              { val: "99%", label: "Satisfaction Rate" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-4xl font-heading font-bold text-primary mb-1">{stat.val}</p>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default About;
