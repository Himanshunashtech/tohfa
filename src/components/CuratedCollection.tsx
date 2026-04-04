import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAdminData } from "@/context/AdminDataContext";
import collectionImgFallback from "@/assets/collection-signature.jpg";

const CuratedCollection = () => {
  const { collections, isLoading } = useAdminData();

  // Pick the first featured collection OR just the first available collection
  const collection = useMemo(() => {
    if (!collections || collections.length === 0) return null;
    const published = collections.filter(c => c.status === 'published');
    const featured = published.find(c => c.is_featured);
    return featured || published[0];
  }, [collections]);

  if (isLoading) {
    return (
      <div className="py-24 bg-muted flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!collection) return null;

  return (
    <section id="collections" className="py-24 px-6 bg-muted">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/5"
          >
            <img
              src={collection.image_url || collectionImgFallback}
              alt={collection.name}
              loading="lazy"
              width={960}
              height={1080}
              className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-1000"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary w-fit">
               The '{collection.name}'
            </div>
            
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {collection.name}
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-md italic">
              "{collection.description}"
            </p>
            
            <div className="flex items-center gap-4 py-2">
               <div className="h-[1px] w-12 bg-primary/20" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Best for {collection.best_for}</span>
            </div>

            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="w-fit"
            >
              <Link
                to={`/collections/${collection.slug}`}
                className="inline-block px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:shadow-[0_0_24px_hsl(var(--primary)/0.4)] transition-all"
              >
                Explore this Curation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CuratedCollection;
