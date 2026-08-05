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

        {/* Expanded Narrative Sections */}
        <section className="container mx-auto max-w-6xl px-6 mb-32 space-y-32">
          
          {/* Chapter 1: Genesis */}
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
              <h2 className="font-heading text-xl text-primary font-bold tracking-[0.2em] uppercase mb-4">Chapter I</h2>
              <h3 className="font-heading text-3xl md:text-5xl font-bold mb-6">The Genesis of TofhaVerse</h3>
              <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-6">
                <p>
                  In an era increasingly defined by digital ephemera and fast-paced consumption, the profound art of gifting began to lose its soul. We found ourselves exchanging items that held little meaning, transactional tokens devoid of the deep emotional resonance that truly defines human connection. TofhaVerse was born from a profound yearning to resurrect this lost art. It started not as a business venture, but as a deeply personal quest to find gifts that could speak when words fell short.
                </p>
                <p>
                  Our founders, travelers and connoisseurs of culture, recognized a widening gap between the master artisans preserving centuries-old traditions in quiet corners of the globe, and the modern consumer desperately seeking authenticity. We saw breathtaking craftsmanship—intricate woodwork from the mountains of Kyoto, hand-loomed textiles from the valleys of Oaxaca, and delicate ceramics from the shores of the Mediterranean—remaining hidden, their stories untold.
                </p>
                <p>
                  We realized that true luxury isn't defined by a logo or a price tag, but by rarity, intent, and the unmistakable touch of a human hand. TofhaVerse was conceived to be the bridge across this gap. We set out to create a sanctuary where the act of gifting is elevated back to its rightful place: a deliberate, mindful celebration of the bonds that tie us together. Our genesis is a rebellion against the disposable, a triumphant return to the enduring, the meaningful, and the beautiful.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Chapter 2: Etymology */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 order-2 lg:order-1"
            >
              <h2 className="font-heading text-xl text-primary font-bold tracking-[0.2em] uppercase mb-4">Chapter II</h2>
              <h3 className="font-heading text-3xl md:text-5xl font-bold mb-6">The Etymology of Tofha</h3>
              <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-6">
                <p>
                  The name "Tofha" is not merely a brand identifier; it is a philosophy embedded in linguistic history. Drawn from its Arabic roots (تحفة), it roughly translates to a "masterpiece," a "rarity," or a deeply cherished "gift." But the true essence of the word transcends simple translation. It conveys the idea of an object so exquisitely crafted, so infused with intention, that it evokes a sense of wonder and awe.
                </p>
                <p>
                  When a piece is described as a 'Tofha,' it implies that the creator poured a fragment of their soul into the medium. It suggests an item worthy of being a family heirloom, passed down through generations. By appending 'Verse', we are actively building a universe—a cohesive ecosystem—where these masterpieces don't just exist, but thrive. It is a curated cosmos dedicated to celebrating these rare gifts. Every item you find on our platform has been rigorously vetted against this standard. If it doesn't evoke that profound sense of wonder, if it isn't a true 'Tofha', it doesn't belong in our universe.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-5 order-1 lg:order-2 bg-primary/5 p-12 rounded-[3rem] border border-primary/10 flex flex-col justify-center text-center aspect-square"
            >
              <span className="font-heading text-8xl font-bold text-primary opacity-20 mb-4">تحفة</span>
              <h4 className="text-3xl font-heading font-bold mb-4">Toh-fah</h4>
              <p className="text-muted-foreground text-lg">/ˈtɒfə/ • <span className="italic">noun</span></p>
              <p className="mt-6 text-foreground font-medium text-lg leading-relaxed">A masterpiece, a rarity, or a deeply cherished gift of exceptional craftsmanship.</p>
            </motion.div>
          </div>

          {/* Chapter 3: Global Collective */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1549463591-24c1882bd396?q=80&w=1200&auto=format&fit=crop" 
                alt="Artisan at work"
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-xl text-primary font-bold tracking-[0.2em] uppercase mb-4">Chapter III</h2>
              <h3 className="font-heading text-3xl md:text-5xl font-bold mb-6">The Global Artisan Collective</h3>
              <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-6">
                <p>
                  At the beating heart of TofhaVerse is our Global Artisan Collective—a meticulously curated network of over 250 master craftsmen spanning 42 countries. We do not source from mass-production factories or faceless supply chains. Instead, our sourcing team embarks on journeys across continents, navigating narrow cobblestone streets in Florence and dusty trails in the Andes, to find individuals who have dedicated their lives to a singular pursuit of perfection.
                </p>
                <p>
                  We seek out the hidden masters: the glassblower in Murano who uses formulas passed down for seven generations, the silversmith in Bali whose every hammer strike is a meditation, the leather worker in rugged Patagonia who understands the grain of hide better than anyone. When you purchase a gift from TofhaVerse, you are not merely acquiring an object. You are becoming a patron of the arts. You are directly funding an artisan's livelihood, empowering their local economy, and ensuring that heritage techniques are preserved in the face of relentless industrialization.
                </p>
                <p>
                  Our relationship with these makers is symbiotic. We provide them with a global stage and a community of appreciators who value their time and skill. We never negotiate their prices down; we pay fair, ethical rates that reflect the true mastery of their craft. In return, they provide us—and you—with creations imbued with unparalleled character, stories, and soul.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Chapter 4: Alchemy */}
          <div className="bg-muted/30 p-12 lg:p-24 rounded-[4rem] border border-border/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center relative z-10"
            >
              <h2 className="font-heading text-xl text-primary font-bold tracking-[0.2em] uppercase mb-4">Chapter IV</h2>
              <h3 className="font-heading text-3xl md:text-5xl font-bold mb-8">The Alchemy of Gifting</h3>
              <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-6 mx-auto">
                <p>
                  Gifting, when done with true intent, is an act of alchemy. It is the magical process of transmuting an intangible emotion—love, gratitude, sympathy, or celebration—into a tangible form. A thoughtful gift serves as a physical anchor for a memory, a permanent reminder of a fleeting moment in time when two individuals truly saw and understood each other.
                </p>
                <p>
                  We believe that the presentation of the gift is just as critical as the item itself. Unboxing should be a ritual, a slow, sensory unfolding that builds anticipation and signals the recipient that they are uniquely valued. This is why every TofhaVerse piece arrives in our signature, eco-luxury packaging. From the tactile resistance of the heavy-weight paper to the subtle whisper of the ribbon, every element is designed to elevate the sensory experience. We facilitate this alchemy, ensuring that the magic of your intention is perfectly preserved from the moment you click 'purchase' to the breathless moment they lift the lid.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Chapter 5 & 6: Ethics and Vision Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-xl text-primary font-bold tracking-[0.2em] uppercase mb-4">Chapter V</h2>
              <h3 className="font-heading text-3xl font-bold mb-6">Radical Transparency & Ethics</h3>
              <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-6">
                <p>
                  In the luxury sector, opacity is often used as a shield. At TofhaVerse, we use transparency as a mirror. We believe you have a fundamental right to know exactly where your gift came from, who made it, and the environmental cost of its creation. We meticulously trace our supply chain, mapping every material back to its geographic origin.
                </p>
                <p>
                  Our commitment to ethics is non-negotiable. We strictly enforce a fair-wage policy, ensuring that the lion's share of the value goes directly into the hands of the creator, not a web of middlemen. We actively reject materials sourced through exploitative labor or environmentally destructive practices. When you choose TofhaVerse, you can present your gift with absolute confidence, knowing its creation brought joy to the maker, not just the recipient.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-heading text-xl text-primary font-bold tracking-[0.2em] uppercase mb-4">Chapter VI</h2>
              <h3 className="font-heading text-3xl font-bold mb-6">The 2030 Vision</h3>
              <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-6">
                <p>
                  We are building an institution meant to outlast us. Our vision for 2030 is audacious but deeply necessary. We aim to become a completely closed-loop, regenerative enterprise. This means moving beyond "carbon neutral" to actively repairing the ecosystems we interact with. True 'Tofha' should heal, not harm.
                </p>
                <p>
                  We are pledging to transition 100% of our packaging to fully compostable, soil-enriching materials within the next four years. Furthermore, we are establishing the TofhaVerse Foundation, a trust designed to fund apprenticeships in endangered crafts, ensuring that the knowledge of the master artisans we partner with today is carried forward into the next century. Our journey is just beginning, and we invite you to be a part of this vital narrative. Welcome to a better way to give.
                </p>
              </div>
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
