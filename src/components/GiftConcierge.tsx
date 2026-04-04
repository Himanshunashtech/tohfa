import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Sparkles, 
  DollarSign, 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Gift,
  Send,
  RefreshCw,
  MessageSquare,
  ShoppingBag
} from "lucide-react";
import { Product } from "@/data/products";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { getProductImage } from "@/lib/utils";

type Message = {
  id: string;
  type: "bot" | "user";
  text: string;
  options?: string[];
  step?: string;
};

// Predefined bot-filtered vibes for a cleaner conversation
const curatedVibes = ["Luxe", "Artisanal", "Eco-Minimalist", "Cozy", "Modernist"];

const GiftConcierge = () => {
  const { addItem } = useCart();
  const { products, filterOptions } = useAdminData();
  const { recipients, occasions, vibes } = filterOptions;
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [deliberationText, setDeliberationText] = useState("Aria is analyzing your preferences...");

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial Bot Message
  useEffect(() => {
    const startChat = async () => {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1000));
      setMessages([
        { 
          id: "1", 
          type: "bot", 
          text: "Hello! I'm Aria, your personal Gifting Concierge. I'm here to help you find a gift that truly resonates. Shall we start by knowing who this special gift is for?",
          options: recipients,
          step: "recipient"
        }
      ]);
      setIsTyping(false);
    };
    startChat();
  }, []);

  const handleOptionClick = async (option: string, step: string) => {
    // Add User Message
    const newUserMsg: Message = { id: Date.now().toString(), type: "user", text: option };
    setMessages(prev => [...prev, newUserMsg]);
    
    // Save Answer
    const newAnswers = { ...answers, [step]: option };
    setAnswers(newAnswers);

    // AI Response Logic
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1200));

    let nextBotMsg: Message;

    if (step === "recipient") {
      nextBotMsg = {
        id: Date.now().toString() + "b",
        type: "bot",
        text: `Wonderful. And what's the beautiful occasion we're celebrating for them?`,
        options: occasions.filter(o => o !== "justbecause").slice(0, 5),
        step: "occasion"
      };
    } else if (step === "occasion") {
      nextBotMsg = {
        id: Date.now().toString() + "b",
        type: "bot",
        text: `Got it. To make it truly personal, how would you describe their "vibe" or personality?`,
        options: curatedVibes,
        step: "vibe"
      };
    } else if (step === "vibe") {
      nextBotMsg = {
        id: Date.now().toString() + "b",
        type: "bot",
        text: `Perfect. Lastly, what budget range shall I keep in mind for this masterpiece?`,
        options: ["Under $50", "$50 - $150", "$150 - $300", "Unlimited"],
        step: "budget"
      };
    } else {
      // Results Phase with Deliberation
      setIsTyping(false);
      setIsDeliberating(true);
      
      const deliberatingSteps = [
        "Analyzing artisan availability...",
        "Matching vibe with heritage catalogs...",
        "Curating the perfect selection for you...",
        "Almost there..."
      ];

      for (let i = 0; i < deliberatingSteps.length; i++) {
        setDeliberationText(deliberatingSteps[i]);
        await new Promise(r => setTimeout(r, 1000));
      }

      setShowResults(true);
      setIsDeliberating(false);
      return;
    }

    setMessages(prev => [...prev, nextBotMsg]);
    setIsTyping(false);
  };

  const filteredProducts = useMemo(() => {
    if (!showResults) return [];
    
    return products.filter(p => {
      const matchRecipient = p.recipient.includes(answers.recipient);
      const matchOccasion = p.occasion.includes(answers.occasion);
      const matchVibe = p.vibe?.includes(answers.vibe);
      
      let matchBudget = true;
      if (answers.budget === "Under $50") matchBudget = p.price < 50;
      if (answers.budget === "$50 - $150") matchBudget = p.price >= 50 && p.price <= 150;
      if (answers.budget === "$150 - $300") matchBudget = p.price > 150 && p.price <= 300;
      
      // Weighting: Recipient AND (Occasion OR Vibe OR Budget)
      return matchRecipient && (matchOccasion || matchVibe || matchBudget);
    }).sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [showResults, answers]);

  const reset = () => {
    setMessages([]);
    setAnswers({});
    setShowResults(false);
    // Restart logic
    const startChat = async () => {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1000));
      setMessages([
        { 
          id: "1", 
          type: "bot", 
          text: "Let's try again! Who is the lucky recipient this time?",
          options: recipients,
          step: "recipient"
        }
      ]);
      setIsTyping(false);
    };
    startChat();
  };

  return (
    <div className={`flex flex-col w-full max-w-4xl mx-auto bg-background/40 backdrop-blur-3xl border border-border/50 shadow-2xl overflow-hidden transition-all duration-500 ${
      isMobile ? "h-[calc(100vh-120px)] rounded-t-[3rem]" : "h-[700px] rounded-[3rem]"
    }`}>
      
      {/* Header */}
      <div className={`${isMobile ? "p-4" : "p-8"} border-b border-border/10 flex items-center justify-between bg-primary/5`}>
        <div className="flex items-center gap-3">
          <div className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20`}>
            <Sparkles size={isMobile ? 20 : 24} />
          </div>
          <div>
            <h3 className={`font-heading font-bold ${isMobile ? "text-lg" : "text-xl"}`}>Aria Concierge</h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Personal AI Advisor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={reset} className="rounded-full hover:bg-primary/10 hover:text-primary">
             <RefreshCw size={18} />
           </Button>
           {isMobile && (
             <Link to="/">
               <Button variant="ghost" size="icon" className="rounded-full">
                 <ArrowLeft size={18} />
               </Button>
             </Link>
           )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? "p-6" : "p-10"} space-y-8 scrollbar-thin scrollbar-thumb-primary/10`}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`${isMobile ? "max-w-[90%]" : "max-w-[80%]"} p-6 rounded-[2rem] shadow-sm ${
                msg.type === "user" 
                ? "bg-primary text-white rounded-tr-none" 
                : "bg-white border border-border/50 rounded-tl-none"
              }`}>
                <p className={`${isMobile ? "text-xs" : "text-sm"} leading-relaxed font-medium`}>{msg.text}</p>
                
                {msg.type === "bot" && msg.options && !messages.some(m => m.type === "user" && messages.indexOf(m) > messages.indexOf(msg)) && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {msg.options.map((opt) => (
                      <motion.button
                        key={opt}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOptionClick(opt, msg.step!)}
                        className={`${isMobile ? "px-4 py-2 text-[10px]" : "px-5 py-2.5 text-xs"} rounded-full bg-primary/5 text-primary border border-primary/20 font-bold hover:bg-primary hover:text-white transition-all capitalize`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-border/50 p-4 rounded-3xl flex gap-1">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
              </div>
            </motion.div>
          )}

          {isDeliberating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-12 gap-6 bg-primary/5 rounded-[3rem] border border-primary/10 border-dashed"
            >
               <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-primary">
                     <Sparkles size={24} />
                  </div>
               </div>
               <p className="text-sm font-bold italic animate-pulse text-primary">{deliberationText}</p>
            </motion.div>
          )}

          {showResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-10"
            >
              <div className="text-center mb-10">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Check size={12} /> Exquisite Matches Found
                 </div>
                 <h4 className={`font-heading font-bold italic mb-2 ${isMobile ? "text-2xl" : "text-3xl"}`}>Aria's Top Artisan Curations</h4>
                 <p className="text-[10px] text-muted-foreground">Hand-picked based on your {answers.vibe} preference.</p>
              </div>

              <div className={`grid grid-cols-1 ${isMobile ? "" : "md:grid-cols-3"} gap-8 mb-10 px-4`}>
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="group bg-white rounded-[2.5rem] p-4 border border-border/50 hover:shadow-2xl transition-all"
                  >
                    <Link to={`/product/${product.id}`}>
                      <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-muted mb-4 border border-border/50 relative">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-4 left-4">
                           <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest text-primary shadow-sm">
                              98% Match
                           </div>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="px-2">
                      <h5 className="font-heading font-bold text-base mb-1 line-clamp-1">{product.name}</h5>
                      <p className="text-primary font-bold text-sm mb-4">{product.priceFormatted}</p>
                      
                      <div className="flex gap-2">
                        <Link to={`/product/${product.id}`} className="flex-1">
                           <Button variant="outline" className="w-full rounded-2xl text-[10px] h-10 font-bold">Details</Button>
                        </Link>
                        <Button 
                          onClick={() => {
                            addItem({ productId: product.id, name: product.name, price: product.price, image: getProductImage(product.images[0]) });
                            toast.success(`'${product.name}' added to your hunt!`);
                          }}
                          className="flex-[2] rounded-2xl text-[10px] h-10 font-bold gap-2"
                        >
                           <ShoppingBag size={12} /> Add
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className={`flex ${isMobile ? "flex-col" : "justify-center"} gap-4 border-t border-border/10 pt-10`}>
                 <Button onClick={reset} variant="outline" className="rounded-full px-8 gap-2 h-12">
                    <RefreshCw size={16} /> New Hunt
                 </Button>
                 <Link to="/shop" className="w-full">
                   <Button className="w-full rounded-full px-8 gap-2 h-12">
                      <ShoppingBag size={16} /> All Products
                   </Button>
                 </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Placeholder (Visual Only) */}
      <div className={`${isMobile ? "p-4" : "p-6"} bg-muted/20 border-t border-border/10`}>
         <div className="relative flex items-center">
            <input 
              readOnly 
              placeholder={isMobile ? "Select an option..." : "Select an option above to continue..."} 
              className="w-full h-14 bg-white border border-border/50 rounded-2xl px-6 pr-16 text-sm italic text-muted-foreground"
            />
            <div className="absolute right-3 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary/30">
               <Send size={18} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default GiftConcierge;
