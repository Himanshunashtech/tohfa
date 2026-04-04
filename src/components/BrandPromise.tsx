import { motion } from "framer-motion";
import { Gift, Rocket, Leaf } from "lucide-react";

const features = [
  { icon: Gift, title: "Curated by Experts", desc: "Every item is hand-selected by our team of gift connoisseurs." },
  { icon: Rocket, title: "Fast & Sustainable Shipping", desc: "Carbon-neutral delivery to your doorstep, on time every time." },
  { icon: Leaf, title: "Eco-Friendly Packaging", desc: "Beautiful packaging that's kind to the planet." },
];

const BrandPromise = () => (
  <section className="py-24 px-6">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
          whileHover={{ y: -6 }}
          className="glass-card rounded-2xl p-8 text-center transition-all duration-300"
        >
          <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
            <f.icon size={26} className="text-primary" />
          </div>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{f.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default BrandPromise;
