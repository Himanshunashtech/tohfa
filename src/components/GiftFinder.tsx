import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Sparkles, 
  DollarSign, 
  ArrowLeft, 
  Gift
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Step = "recipient" | "occasion" | "budget" | "results";

const GiftFinder = () => {
  const { products, filterOptions } = useAdminData();
  const { occasions, recipients } = filterOptions;
  const [step, setStep] = useState<Step>("recipient");
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [budget, setBudget] = useState<[number, number] | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchRecipient = !selectedRecipient || p.recipient?.some(r => r.toLowerCase() === selectedRecipient.toLowerCase());
      const matchOccasion = !selectedOccasion || p.occasion?.some(o => o.toLowerCase() === selectedOccasion.toLowerCase());
      const matchBudget = !budget || (p.price >= budget[0] && p.price <= budget[1]);
      return matchRecipient && matchOccasion && matchBudget;
    }).slice(0, 4);
  }, [selectedRecipient, selectedOccasion, budget, products]);

  const reset = () => {
    setStep("recipient");
    setSelectedRecipient(null);
    setSelectedOccasion(null);
    setBudget(null);
  };

  const steps: Record<Step, { title: string; subtitle: string }> = {
    recipient: { title: "Who is it for?", subtitle: "Choose the lucky person receiving your gift." },
    occasion: { title: "What's the occasion?", subtitle: "Tell us why you're celebrating." },
    budget: { title: "What's your budget?", subtitle: "Select a range that works for you." },
    results: { title: "Our Top Picks", subtitle: "Curated specifically for your needs." },
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold mb-2">{steps[step].title}</h2>
        <p className="text-muted-foreground">{steps[step].subtitle}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {step === "recipient" && (
            <div className="flex flex-col gap-4">
              {recipients.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSelectedRecipient(r);
                    setStep("occasion");
                  }}
                  className={`p-5 rounded-3xl border-2 transition-all flex items-center justify-between group ${
                    selectedRecipient === r 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <User size={28} />
                    <span className="font-bold text-base capitalize">{r}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <ArrowLeft size={14} className="rotate-180" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === "occasion" && (
            <div className="flex flex-col gap-4">
              {occasions.filter(o => o !== "justbecause").map((o) => (
                <button
                  key={o}
                  onClick={() => {
                    setSelectedOccasion(o);
                    setStep("budget");
                  }}
                  className={`p-5 rounded-3xl border-2 transition-all flex items-center justify-between group ${
                    selectedOccasion === o 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="font-bold capitalize">{o}</span>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Sparkles size={14} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === "budget" && (
            <div className="flex flex-col gap-4">
              {[
                { label: "Under $50", range: [0, 50] as [number, number] },
                { label: "$50 - $150", range: [51, 150] as [number, number] },
                { label: "$150+", range: [151, 1000] as [number, number] }
              ].map((b) => (
                <button
                  key={b.label}
                  onClick={() => {
                    setBudget(b.range);
                    setStep("results");
                  }}
                  className="p-5 rounded-3xl border-2 border-border hover:border-primary transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <DollarSign size={20} />
                    </div>
                    <span className="font-bold text-lg">{b.label}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <ArrowLeft size={14} className="rotate-180" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === "results" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="group relative"
                    >
                      <Link to={`/product/${product.id}`}>
                        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-muted mb-4 relative shadow-sm group-hover:shadow-xl transition-all">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm text-primary shadow-sm hover:bg-primary hover:text-white transition-colors">
                            <Gift size={16} />
                          </div>
                        </div>
                        <h4 className="font-bold text-sm text-foreground line-clamp-1">{product.name}</h4>
                        <p className="text-primary font-bold text-sm mt-1">{product.priceFormatted}</p>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/30 rounded-[3rem] border-2 border-dashed">
                    No exact matches found. Try broadening your criteria.
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-4">
                <Button onClick={reset} variant="outline" className="rounded-full px-8">Start Over</Button>
                <Link to="/shop">
                  <Button className="rounded-full px-8">Visit the Shop</Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
     {step === "recipient" && (
  <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
    {recipients.map((r) => (
      <button
        key={r}
        onClick={() => {
          setSelectedRecipient(r);
          setStep("occasion");
        }}
        className="flex-shrink-0 w-40 p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 snap-start"
        // ... rest of styling
      >
        <User size={32} />
        <span className="font-bold text-sm capitalize">{r}</span>
      </button>
    ))}
  </div>
)}
    </div>
  );
};

export default GiftFinder;