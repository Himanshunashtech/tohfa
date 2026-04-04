import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, HelpCircle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import Breadcrumbs from "@/components/Breadcrumbs";

const faqs = [
  {
    category: "Ordering & Shipping",
    questions: [
      {
        q: "What are your standard shipping times?",
        a: "Domestic orders typically arrive within 3-5 business days. International shipping varies by location but generally takes 7-14 business days. Priority shipping is available at checkout."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes! Tofhaverse delivers to over 42 countries worldwide. Shipping costs and taxes will be calculated at checkout based on your destination."
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order ships, you'll receive a confirmation email with a tracking number and a link to monitor your package's journey."
      }
    ]
  },
  {
    category: "Gifting & Customization",
    questions: [
      {
        q: "Can I include a personalized message?",
        a: "Yes, every gift can include a hand-written note. You can enter your message on the product page or during the checkout process."
      },
      {
        q: "Do you offer corporate gifting solutions?",
        a: "We specialize in corporate gifting! For orders of 10 or more items, please contact our team via the Contact page or schedule a consultation for tailored solutions."
      },
      {
        q: "What does your eco-friendly packaging consist of?",
        a: "Our boxes are made from 100% recycled materials and are FSC-certified. We use biodegradable packing peanuts and soy-based inks for all our printed materials."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy for unused and non-perishable items. Please note that personalized gifts cannot be returned unless they arrive damaged."
      },
      {
        q: "How do I start a return?",
        a: "To initiate a return, visit your Order History in the Account section and click the 'Return Item' button next to the relevant order, or reach out to hello@tofhaverse.com."
      }
    ]
  }
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <PageTransition title="Frequently Asked Questions" description="Answers to your most common questions about Tofhaverse gifting.">
      <StickyNav />
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-4xl px-6">
          <Breadcrumbs />
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <HelpCircle size={24} className="text-primary" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-4xl md:text-5xl font-bold mb-6"
            >
              Common Questions
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative max-w-xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 rounded-full border-border/50 bg-muted/30 focus:ring-primary/20 text-lg shadow-inner"
              />
            </motion.div>
          </div>

          <div className="space-y-12">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((cat, ci) => (
                <div key={cat.category}>
                  <h2 className="text-xl font-bold mb-6 text-foreground/80 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-primary"></span> {cat.category}
                  </h2>
                  <div className="space-y-4">
                    {cat.questions.map((q, qi) => {
                      const id = `${ci}-${qi}`;
                      const isOpen = openItems.includes(id);
                      return (
                        <div
                          key={id}
                          className={`rounded-3xl border transition-all duration-300 ${
                            isOpen ? "border-primary/20 bg-primary/5 shadow-sm shadow-primary/5" : "border-border/50 bg-background hover:bg-muted/10 border-transparent"
                          }`}
                        >
                          <button
                            onClick={() => toggleItem(id)}
                            className="w-full flex items-center justify-between p-6 text-left"
                          >
                            <span className="font-semibold text-lg leading-tight">{q.q}</span>
                            <div className={`p-2 rounded-full transition-colors ${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                              {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                            </div>
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                                  {q.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-[3rem] border border-dashed border-border/50">
                <Search size={48} className="text-muted-foreground/30 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-2">No matching questions</h3>
                <p className="text-muted-foreground mb-8 text-center max-w-sm mx-auto">
                  Try adjusting your search terms or view our most common topics above.
                </p>
                <Button onClick={() => setSearchQuery("")} variant="outline" className="rounded-full">
                  Clear Search
                </Button>
              </div>
            )}
          </div>

          <div className="mt-24 p-12 bg-primary/5 rounded-[4rem] border border-primary/10 text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Our support team is always ready to help you find the perfect gift or resolve any order issues.
            </p>
            <Link to="/contact">
              <Button size="lg" className="rounded-full px-10 gap-2 shadow-xl shadow-primary/20">
                Contact Customer Care <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default FAQ;
