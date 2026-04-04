import { motion, useInView } from "framer-motion";
import { Leaf, TreePine, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import natureImg from "@/assets/sustainability-nature.jpg";

const Sustainability = () => {
  const counterRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(counterRef, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = 5247;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <img
        src={natureImg}
        alt="Lush green forest"
        loading="lazy"
        width={1920}
        height={800}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/60" />

      <div className="relative z-10 container mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <TreePine size={40} className="mx-auto text-secondary mb-6" />
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Gifting with Purpose
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10">
            We plant a tree for every order. Because the best gifts also give back to the planet.
          </p>

          <div ref={counterRef} className="flex items-center justify-center gap-3">
            <Leaf size={22} className="text-secondary animate-leaf-sway" />
            <span className="font-heading text-5xl font-bold text-primary-foreground">
              {count.toLocaleString()}+
            </span>
            <span className="text-primary-foreground/70 text-sm">Trees Planted</span>
          </div>

          {/* Progress bar */}
          <div className="mt-8 mx-auto max-w-md h-2 rounded-full bg-primary-foreground/20 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "52%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-secondary"
            />
          </div>
          <p className="text-xs text-primary-foreground/50 mt-2">Goal: 10,000 trees by 2027</p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex justify-center"
          >
            <Link 
              to="/ethics" 
              className="group flex items-center gap-2 px-8 py-3 bg-white text-foreground rounded-full font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-black/20"
            >
              Learn about our Ethics <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Sustainability;
