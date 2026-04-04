import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah M.",
    role: "Verified Buyer",
    text: "The packaging alone made my friend cry. Tofhaverse truly understands the art of gifting. I'll never shop anywhere else.",
    initials: "SM",
  },
  {
    name: "James L.",
    role: "Verified Buyer",
    text: "I ordered the Signature Box for our anniversary and it was absolutely perfect. Premium quality, fast shipping, and beautifully presented.",
    initials: "JL",
  },
  {
    name: "Priya K.",
    role: "Verified Buyer",
    text: "Finally, a gift company that cares about sustainability AND luxury. Every detail was thoughtful and the eco-friendly packaging was gorgeous.",
    initials: "PK",
  },
];

const Testimonials = () => (
  <section className="py-24 px-6 relative overflow-hidden">
    {/* Subtle pattern bg */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='8' height='8' x='16' y='16' fill='%23000' rx='2'/%3E%3C/svg%3E")`,
    }} />

    <div className="container mx-auto max-w-5xl relative z-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-heading text-4xl md:text-5xl font-bold text-center text-foreground mb-14"
      >
        Hear From Our Happy Givers
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="glass-card rounded-2xl p-7 flex flex-col gap-4"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={14} className="fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-foreground leading-relaxed italic">"{r.text}"</p>
            <div className="flex items-center gap-3 mt-auto pt-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                {r.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
