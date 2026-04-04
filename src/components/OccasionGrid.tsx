import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Gift, Heart, Home, Star, Sparkles } from "lucide-react";
import birthdayImg from "@/assets/occasion-birthday.jpg";
import anniversaryImg from "@/assets/occasion-anniversary.jpg";
import newhomeImg from "@/assets/occasion-newhome.jpg";
import justbecauseImg from "@/assets/occasion-justbecause.jpg";

const occasions = [
  { 
    title: "The Birthday Edit", 
    img: birthdayImg, 
    slug: "birthday",
    icon: Star,
    size: "lg",
    color: "bg-amber-500",
    desc: "Curated treasures for their special day."
  },
  { 
    title: "Eternal Anniversary", 
    img: anniversaryImg, 
    slug: "anniversary",
    icon: Heart,
    size: "md",
    color: "bg-rose-500",
    desc: "Commemorate your shared legacy."
  },
  { 
    title: "Modern New Home", 
    img: newhomeImg, 
    slug: "newhome",
    icon: Home,
    size: "md",
    color: "bg-emerald-500",
    desc: "Artisanal touches for new beginnings."
  },
  { 
    title: "Just Because", 
    img: justbecauseImg, 
    slug: "justbecause",
    icon: Sparkles,
    size: "sm",
    color: "bg-violet-500",
    desc: "Spontaneous gestures of pure joy."
  },
];

const OccasionGrid = () => {
  // We keep the visually curated list but ensure the slugs match the DB
  const displayOccasions = occasions;

  return (
  <section id="occasions" className="py-40 px-6 bg-background relative overflow-hidden">
    {/* Decorative background text */}
    <div className="absolute top-0 left-0 w-full text-center opacity-[0.02] pointer-events-none select-none">
       <span className="text-[20rem] font-bold font-heading whitespace-nowrap">CURATION</span>
    </div>

    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
        <div className="space-y-4 max-w-2xl">
          <h2 className="font-heading text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tighter">
            Every Moment <br /> Deserves A <span className="text-primary italic">Tofha.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
             Whether it's a milestone or a simple Tuesday, find the handcrafted piece that captures the essence of the moment.
          </p>
        </div>
        <Link to="/shop" className="group">
           <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary hover:gap-5 transition-all">
              Explore All Occasions <ArrowUpRight size={20} />
           </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[800px]">
        {occasions.map((o, i) => {
          const Icon = o.icon;
          return (
            <motion.div
              key={o.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative ${
                o.size === "lg" ? "md:col-span-2 md:row-span-2" : 
                o.size === "md" ? "md:col-span-2 md:row-span-1" :
                "md:col-span-2 md:row-span-1"
              }`}
            >
              <Link
                to={`/shop?occasion=${o.slug}`}
                className="group relative overflow-hidden rounded-[3rem] h-full block bg-muted shadow-2xl shadow-black/5 border border-border/50"
              >
                <img
                  src={o.img}
                  alt={o.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale-[0.3] group-hover:grayscale-0 transition-all"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                <div className="absolute inset-x-8 bottom-8 text-white">
                   <div className={`w-12 h-12 rounded-2xl ${o.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                      <Icon size={24} className="text-white" />
                   </div>
                   <h3 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-2">
                     {o.title}
                   </h3>
                   <p className="text-white/60 text-sm font-medium tracking-wide max-w-xs transition-opacity group-hover:text-white">
                     {o.desc}
                   </p>
                </div>

                <div className="absolute top-8 right-8 p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                   <ArrowUpRight size={20} className="text-white" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
  );
};

export default OccasionGrid;
