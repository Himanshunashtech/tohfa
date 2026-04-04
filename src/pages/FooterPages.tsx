import { motion } from "framer-motion";
import { Briefcase, Heart, Globe, Users, Gift, ShieldCheck, MapPin, ArrowRight, Palette, CheckCircle2 as CheckIcon } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { CatalogModal } from "@/components/CatalogModal";
import { useAdminData } from "@/context/AdminDataContext";

// --- CAREERS ---
export const Careers = () => (
  <PageTransition title="Careers" description="Join the Tofhaverse team and help us redefine the art of gifting.">
    <StickyNav />
    <main className="pt-24 pb-20 overflow-hidden">
      <div className="bg-foreground text-background py-32 px-6 text-center relative">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto max-w-3xl relative z-10">
          <Breadcrumbs />
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">Build the Future of <span className="text-primary italic">Gifting</span></h1>
          <p className="text-lg md:text-xl text-background/70 mb-10">We're looking for thinkers, creators, and doers to help us craft meaningful connections across the globe.</p>
          <Button size="lg" className="rounded-full px-12 h-14 bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform">View Open Positions</Button>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {[
            { icon: Heart, title: "Our Culture", desc: "A supportive environment where empathy and innovation go hand-in-hand." },
            { icon: Globe, title: "Remote Friendly", desc: "Work from anywhere in the world—we empower a truly global team." },
            { icon: ShieldCheck, title: "Premium Benefits", desc: "Health, dental, vision, and wellness programs designed for humans." }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6"><item.icon size={28} /></div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <section>
          <h2 className="text-3xl font-heading font-bold mb-12">Open Opportunities</h2>
          <div className="space-y-4">
            {[
              { role: "Senior Product Designer", dept: "Design", loc: "Remote / NYC" },
              { role: "Creative Content Strategist", dept: "Marketing", loc: "Remote / London" },
              { role: "Full Stack Engineer (React/Node)", dept: "Engineering", loc: "Remote" },
              { role: "Customer Experience Specialist", dept: "Operations", loc: "Remote" }
            ].map((job, i) => (
              <motion.div key={i} whileHover={{ x: 10 }} className="p-8 bg-muted/30 rounded-[2.5rem] border border-border/10 flex items-center justify-between group cursor-pointer">
                <div>
                  <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{job.role}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {job.dept}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.loc}</span>
                  </div>
                </div>
                <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
    <FooterSection />
  </PageTransition>
);

// --- SUSTAINABILITY ---
export const Sustainability = () => (
  <PageTransition title="Sustainability" description="Our commitment to the planet and responsible gifting.">
    <StickyNav />
    <main className="overflow-hidden bg-white text-slate-900">
      {/* NEW: 4K Forest Hero Reveal */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/images/sustainability/lush_forest.png"
            className="w-full h-full object-cover opacity-60"
            alt="Lush Forest"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80" />
        </motion.div>
        <div className="container mx-auto px-6 relative z-10 text-center">

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-9xl font-heading font-bold mb-8 tracking-tighter"
          >
            Our Roots <span className="text-primary italic">Run Deep</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-3xl opacity-80 leading-relaxed max-w-2xl mx-auto font-light"
          >
            Every gift plants a seed for a more vibrant, sustainable future
          </motion.p>

        </div>
      </section>

      {/* Original Packaging Section (Restored) */}
      <div className="container mx-auto max-w-6xl px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">Legacy Craft</div>
            <h2 className="text-4xl md:text-6xl font-heading font-bold leading-[1.1] text-slate-900">100% Recyclable Luxury Packaging</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-light">We've spent two years perfecting a packaging experience that feels premium to the touch but leaves zero waste behind. No plastics, just FSC-certified paper and soy-based inks.</p>
            <div className="flex gap-12 pt-4">
              {[
                { label: "Recyclable", value: "98%" },
                { label: "Carbon Footprint", value: "-42%" }
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-5xl font-heading font-bold text-primary">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 uppercase mt-2 tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="rounded-[4rem] overflow-hidden shadow-2xl relative border border-slate-100">
            <img src="https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" />
            <div className="absolute inset-0 ring-1 ring-black/5 rounded-[4rem]" />
          </motion.div>
        </div>
      </div>

      {/* NEW: 4K Water Wisdom Section */}
      <section className="py-32 bg-slate-50 border-y border-slate-100 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-8"
            >
              <h2 className="text-4xl md:text-6xl font-heading font-bold leading-none text-slate-900">Water <span className="text-primary italic font-light">Wisdom</span></h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Clean water is the lifeline of our artisans' communities. We've implemented water recycling systems in our partner workshops, reducing waste by 60%.
              </p>
              <ul className="space-y-4">
                {[
                  "Zero-waste water discharge",
                  "Natural rainwater harvesting",
                  "Eco-safe filtration systems"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm font-medium tracking-wide uppercase text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 rounded-[4rem] overflow-hidden aspect-video shadow-xl group border border-slate-200"
            >
              <img src="/images/sustainability/river.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Water Conservation" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW: Circular Materials Section (Updated with 4k plants) */}
      <section className="relative py-40 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img src="/images/sustainability/macro_leaf.png" className="w-full h-full object-cover opacity-10" alt="Nature Macro" />
          <div className="absolute inset-0 bg-white/80" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-7xl font-heading font-bold mb-8 italic text-slate-900">The Circular <span className="text-primary not-italic">Economy</span></h2>
            <p className="text-xl text-slate-600 font-light italic">
              "We design with the end in mind. Our materials are selected for their ability to return to the Earth."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "100% Recyclable", desc: "Our luxury boxes are crafted from FSC-certified cardboard and soy inks." },
              { icon: ShieldCheck, title: "Toxin Free", desc: "No harmful chemicals or microplastics used in any part of our process." },
              { icon: Users, title: "Artisan Ethical", desc: "Fair wages ensure sustainable lifestyles for the hands that create." }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:border-primary/30 transition-all group shadow-sm hover:shadow-md"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Eco Packaging Section (Restored context with 4k packaging) */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 rounded-[4rem] overflow-hidden aspect-square shadow-2xl border border-slate-100"
            >
              <img src="/images/sustainability/eco_packaging.png" className="w-full h-full object-cover" alt="Eco Packaging" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 space-y-10"
            >
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs">Innovation Meets Heritage</span>
              <h2 className="text-5xl md:text-8xl font-heading font-bold leading-none italic text-slate-900">Unbox the <span className="text-primary not-italic underline decoration-primary/20 underline-offset-8">Future</span></h2>
              <p className="text-xl text-slate-600 leading-relaxed font-light">
                Our signature packaging is made from repurposed cedar wood and hemp fiber, designed to be kept for generations or composted within 90 days.
              </p>
              <div className="space-y-6 max-w-md">
                {[
                  { t: "Plastic Free", v: "100%" },
                  { t: "Recycled Content", v: "84%" },
                  { t: "Biodegradable", v: "Yes" }
                ].map((d, i) => (
                  <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-slate-500 text-sm font-medium tracking-widest uppercase">{d.t}</span>
                    <span className="text-3xl font-heading font-bold text-primary">{d.v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 container mx-auto px-6 text-center">
        <div className="bg-slate-50 rounded-[5rem] p-16 md:p-32 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-heading font-bold mb-8 leading-none italic text-slate-900">Become a <span className="text-primary not-italic font-light">Sustainable Giver</span></h2>
            <p className="text-xl text-slate-500 mb-12 font-light">
              Join our community of conscious curators. Get our monthly impact report and early access to eco-first collections.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input placeholder="Enter your email" className="h-16 flex-1 bg-white border border-slate-200 rounded-full px-8 outline-none focus:border-primary/50 transition-all font-light" />
              <Button className="h-16 rounded-full px-12 bg-primary font-bold text-lg hover:scale-105 transition-transform tracking-tight text-white">Join Our Mission</Button>
            </form>
          </div>
        </div>
      </section>

      <div className="bg-slate-900 text-white py-40 px-6 text-center relative overflow-hidden h-[90vh] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-60 grayscale-[0.1]"
        />
        <div className="container mx-auto max-w-4xl relative z-10">
          <Breadcrumbs />
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-9xl font-heading font-bold mb-8 tracking-tighter"
          >
            Gifting <span className="text-primary italic">Greener</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-3xl opacity-80 leading-relaxed max-w-2xl mx-auto font-light"
          >
            Our mission is to minimize our footprint while maximizing the impact of your gestures.
          </motion.p>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.4em] opacity-40">Scroll to Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </main>
    <FooterSection />
  </PageTransition>
);



// --- ARTISANS ---
export const Artisans = () => {
  const { artisans } = useAdminData();

  return (
    <PageTransition title="Artisans" description="Meet the hands behind our curated gifts.">
      <StickyNav />
      <main className="pt-24 pb-20">
        <div className="container mx-auto max-w-6xl px-6 py-20">
          <Breadcrumbs />
          <div className="max-w-3xl mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary mb-4">
              <Heart size={12} /> Supporting Local Economy
            </div>
            <h1 className="text-5xl md:text-8xl font-heading font-bold mb-6 italic">Meet Our <span className="text-primary not-italic">Makers</span></h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              TofhaVerse is a tapestry of talent. We partner with independent artisans who preserve heritage techniques while pushing the boundaries of modern design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {artisans.map((maker, i) => (
              <motion.div
                key={maker.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group space-y-8"
              >
                <Link to={`/artisan/${maker.slug}`} className="block relative rounded-[4rem] overflow-hidden aspect-[4/5] shadow-2xl border border-border/50 bg-muted">
                  <img src={maker.photo} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-8 left-8">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-xl">
                      Master Artisan
                    </div>
                  </div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-70">{maker.role}</p>
                    <h3 className="text-4xl font-heading font-bold">{maker.name}</h3>
                  </div>
                </Link>

                <div className="px-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Palette size={14} /> Heritage Craft</p>
                    <p className="text-muted-foreground text-xs flex items-center gap-1"><MapPin size={12} /> {maker.location}</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-8 line-clamp-2 italic">
                    "{maker.bio}"
                  </p>
                  <Link to={`/artisan/${maker.slug}`}>
                    <Button variant="outline" className="rounded-full px-8 h-12 font-bold group-hover:bg-primary group-hover:text-white transition-all gap-2">
                      View Legacy <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}

            {artisans.length === 0 && (
              <div className="col-span-full py-40 text-center bg-muted/30 rounded-[4rem] border border-dashed border-border/50">
                <Users size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-2xl font-bold">The Registry is Growing</h3>
                <p className="text-muted-foreground mt-2">New world-class artisans are joining our collective soon.</p>
              </div>
            )}
          </div>

          <section className="mt-40 bg-foreground text-background rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1549463591-24c1882bd396?q=80&w=2000')] bg-cover bg-center" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8">Empowering <span className="text-primary">10,000+</span> Makers by 2030</h2>
              <p className="text-lg opacity-60 mb-10 leading-relaxed">
                Every purchase on TofhaVerse goes directly towards sustaining heritage crafts and supporting the families of these incredible creators.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/sustainability">
                  <Button size="lg" className="rounded-full h-14 px-10 bg-primary font-bold">Our Impact Report</Button>
                </Link>
                <Link to="/bulk-gifting">
                  <Button variant="outline" className="rounded-full h-14 px-10 border-background/20 text-background hover:bg-background hover:text-foreground font-bold">Artisan Partnerships</Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

// --- BULK GIFTING ---
export const BulkGifting = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Bulk inquiry sent! Our specialists will contact you shortly.");
      (e.target as HTMLFormElement).reset();
    }, 2000);
  };

  return (
    <PageTransition title="Bulk Gifting" description="Elevated bulk gifting for your clients and team.">
      <StickyNav />
      <main className="pt-24 pb-20">
        <div className="container mx-auto max-w-6xl px-6 py-20">
          <Breadcrumbs />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight uppercase italic">
                Bulk <span className="text-primary not-italic">Elegance</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Whether it's for 50 clients or 5,000 employees, we curate premium gifting experiences that align perfectly with your brand identity.
              </p>

              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, title: "Custom Branding", desc: "Your logo, your message, elegantly integrated." },
                  { icon: Globe, title: "Global Fulfillment", desc: "We ship to almost every corner of the world." },
                  { icon: Users, title: "Dedicated Concierge", desc: "A single point of contact for your entire campaign." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0 text-primary"><item.icon size={22} /></div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <Button
                  size="lg"
                  onClick={() => document.getElementById('bulk-inquiry')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full px-10 h-16 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                >
                  Inquire Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsCatalogOpen(true)}
                  className="rounded-full px-10 h-16 text-lg font-bold border-2 hover:bg-muted/50 transition-all font-heading"
                >
                  View Catalog
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 translate-y-12">
                  <img src="https://images.unsplash.com/photo-1549463591-24c1882bd396?q=80&w=800" className="rounded-3xl h-64 w-full object-cover shadow-xl" />
                  <img src="https://images.unsplash.com/photo-1512909006721-3d6018887183?q=80&w=800" className="rounded-3xl h-80 w-full object-cover shadow-xl" />
                </div>
                <div className="space-y-4">
                  <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800" className="rounded-3xl h-80 w-full object-cover shadow-xl" />
                  <img src="https://images.unsplash.com/photo-1512418490979-92798ccc13b0?q=80&w=800" className="rounded-3xl h-64 w-full object-cover shadow-xl" />
                </div>
              </div>
            </div>
          </div>




          {/* Bulk Inquiry Form Section */}
          <section id="bulk-inquiry" className="mt-32 pt-24 border-t border-border/10 scroll-mt-24">
            <div className="bg-primary rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 italic leading-tight">Scale your <span className="text-white/80 not-italic underline decoration-white/20 underline-offset-8">impact</span>.</h2>
                  <p className="text-primary-foreground/80 mb-10 text-lg leading-relaxed">
                    Whether you're planning a holiday gala or a global product launch, we provide the logistics and artistry to make your brand shine.
                  </p>

                  <div className="space-y-4">
                    {["Tiered bulk pricing", "Custom artwork matching", "Individual drop-shipping", "Eco-safe packaging"].map((text, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <CheckIcon size={14} className="text-white" />
                        </div>
                        <span className="font-medium">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required placeholder="Your Name" className="h-14 bg-white/10 border border-white/20 rounded-2xl px-6 text-sm placeholder:text-white/50 focus:bg-white/20 outline-none transition-all" />
                    <input required placeholder="Work Email" type="email" className="h-14 bg-white/10 border border-white/20 rounded-2xl px-6 text-sm placeholder:text-white/50 focus:bg-white/20 outline-none transition-all" />
                  </div>
                  <input required placeholder="Company Name" className="w-full h-14 bg-white/10 border border-white/20 rounded-2xl px-6 text-sm placeholder:text-white/50 focus:bg-white/20 outline-none transition-all" />
                  <textarea required placeholder="Tell us about your project..." className="w-full p-6 bg-white/10 border border-white/20 rounded-3xl text-sm placeholder:text-white/50 focus:bg-white/20 outline-none transition-all h-32 resize-none" />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 bg-white text-primary hover:bg-white/90 rounded-2xl font-bold text-lg shadow-xl shadow-black/20 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? "Sending Inquiry..." : "Submit Inquiry"}
                  </Button>
                </form>
              </div>
            </div>
          </section>
        </div>
        <CatalogModal isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />
      </main>
      <FooterSection />
    </PageTransition>
  );
};
// --- ETHICS ---
export const Ethics = () => (
  <PageTransition title="Our Ethics" description="At TofhaVerse, ethics isn't a policy—it's the heartbeat of every gift.">
    <StickyNav />
    <main className="pt-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="bg-slate-50 py-32 px-6 border-b border-slate-100 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <Breadcrumbs />
          <h1 className="text-5xl md:text-8xl font-heading font-bold mb-8 italic">The Art of <span className="text-primary not-italic underline decoration-primary/20 underline-offset-[12px]">Responsibility</span></h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
            "Every purchase directly supports our community of certified independent artisans."
          </p>
        </div>
      </section>

      {/* Julian Kross Feature */}
      <section className="py-40 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="relative"
             >
                <div className="rounded-[4rem] overflow-hidden aspect-[4/5] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100">
                   <img src="https://images.unsplash.com/photo-1549463591-24c1882bd396?q=80&w=2000" className="w-full h-full object-cover" alt="Julian Kross at Work" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
                   <div className="absolute top-10 left-10 flex flex-col gap-3">
                      <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-xl w-fit">
                        Master Artisan
                      </div>
                      <div className="bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-xl w-fit">
                        Hand-Signed
                      </div>
                   </div>
                </div>
                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 max-w-[280px] hidden md:block">
                   <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1 font-heading">Geological Craftsman</p>
                   <h3 className="text-2xl font-bold text-slate-900 leading-tight">Julian Kross</h3>
                   <p className="text-muted-foreground text-xs font-medium uppercase tracking-tight mt-1 flex items-center gap-1.5 leading-none">
                      <MapPin size={12} /> Reykjavik, Iceland
                   </p>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="space-y-10"
             >
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-heading font-bold text-slate-900 leading-none">The <span className="text-primary italic">Maker</span> Behind the Craft</h2>
                  <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light italic">
                    "Julian works exclusively with volcanic materials, bridging the gap between raw earth and refined luxury."
                  </p>
                </div>

                <div className="space-y-6 pt-6">
                   <div className="flex gap-6">
                      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-100"><ShieldCheck size={28} /></div>
                      <div>
                         <h4 className="font-bold text-lg mb-1 leading-none">Certified Independence</h4>
                         <p className="text-slate-500 text-sm leading-relaxed font-light">We verify every workshop to ensure fair wages and dignified working conditions for all our creators.</p>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-primary/20"><Heart size={28} /></div>
                      <div>
                         <h4 className="font-bold text-lg mb-1 leading-none">Heritage Preservation</h4>
                         <p className="text-slate-500 text-sm leading-relaxed font-light">Supporting artisans like Julian helps keep centuries-old geological crafting techniques alive for future generations.</p>
                      </div>
                   </div>
                </div>

                <div className="pt-10 flex flex-wrap gap-4">
                   <Link to="/artisans">
                      <Button className="h-16 rounded-full px-10 bg-primary font-bold text-lg hover:scale-105 transition-transform tracking-tight text-white group gap-2">
                        View All Makers <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                   </Link>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Core Ethics Statement */}
      <section className="py-40 bg-slate-50 text-slate-900">
        <div className="container mx-auto max-w-4xl px-6 text-center">
           <h2 className="text-4xl md:text-7xl font-heading font-bold mb-12 italic leading-none">Our Promise <span className="text-primary font-light not-italic">to You</span></h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              {[
                { title: "Transparency First", desc: "No hidden supply chains. We trace every material back to its ethical origin." },
                { title: "Artisan First", desc: "Our profit-sharing models ensure artisans receive the majority value of their craftsmanship." },
                { title: "Planet First", desc: "Sustainability is not an option; it's the foundation of our material selection." },
                { title: "Community First", desc: "We invest 10% of our annual revenue back into local artisan education programs." }
              ].map((p, i) => (
                <div key={i} className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
                   <p className="text-primary font-bold text-[10px] uppercase tracking-widest mb-3 opacity-60">Principle {i + 1}</p>
                   <h4 className="text-xl font-bold mb-3">{p.title}</h4>
                   <p className="text-slate-500 text-sm leading-relaxed font-light">{p.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-white container mx-auto px-6 text-center">
         <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-heading font-bold italic leading-tight text-slate-900">
               Support <span className="text-primary not-italic">Ethical Luxury</span> Today.
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
               <Link to="/shop">
                  <Button size="lg" className="h-16 rounded-full px-12 bg-primary font-bold text-lg hover:scale-110 transition-all font-heading tracking-tight shadow-2xl shadow-primary/30">Shop the Collections</Button>
               </Link>
               <Link to="/artisans">
                  <Button variant="outline" size="lg" className="h-16 rounded-full px-12 border-slate-200 text-slate-900 font-bold text-lg hover:bg-slate-50 transition-all font-heading tracking-tight">Meet the Artisans</Button>
               </Link>
            </div>
         </div>
      </section>
    </main>
    <FooterSection />
  </PageTransition>
);
