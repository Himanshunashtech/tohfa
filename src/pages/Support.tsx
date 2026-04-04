import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  LifeBuoy, 
  ChevronRight, 
  Plus, 
  Minus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Send,
  User,
  Headphones,
  ArrowRight,
  ShieldCheck,
  Package,
  RefreshCw,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import { useAdminData } from "@/context/AdminDataContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const faqs = [
  {
    category: "Ordering & Shipping",
    questions: [
      { q: "What are your standard shipping times?", a: "Domestic orders typically arrive within 3-5 business days. International shipping varies by location." },
      { q: "Do you ship internationally?", a: "Yes! Tofhaverse delivers to over 42 countries worldwide." }
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      { q: "What is your return policy?", a: "We offer a 30-day return policy for unused items. Personalized gifts are generally non-returnable." },
      { q: "How do I start a return?", a: "To initiate a return, visit your Order History in the Account section and click 'Initiate Return'." }
    ]
  }
];

const Support = () => {
  const { user } = useAuth();
  const { tickets, addTicket, orders } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqs, setOpenFaqs] = useState<string[]>([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"faq" | "tickets">("faq");

  // Ticket Form State
  const [ticketCategory, setTicketCategory] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketOrder, setTicketOrder] = useState("");

  const userTickets = useMemo(() => 
    tickets.filter((t: any) => t.email === user?.email || t.user_id === user?.id),
    [tickets, user]
  );

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  const handleRaiseTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to raise a ticket");
      return;
    }

    const newTicket = {
      user_id: user.id,
      user_name: user.name,
      email: user.email,
      category: ticketCategory,
      subject: ticketSubject,
      message: ticketMessage,
      order_id: ticketOrder !== "None" ? ticketOrder : null,
      status: "Open",
      priority: "Normal"
    };

    await addTicket(newTicket);
    setShowTicketForm(false);
    setTicketSubject("");
    setTicketMessage("");
    setTicketCategory("");
    setTicketOrder("");
    setActiveTab("tickets");
  };

  const toggleFaq = (id: string) => {
    setOpenFaqs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <PageTransition title="Support Hub" description="Get help with your orders, account, and gifting experience.">
      <StickyNav />
      <main className="pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          
          {/* Hero Section */}
          <div className="relative mb-16 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-8"
            >
              <LifeBuoy size={14} /> 24/7 Support Presence
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight"
            >
              How can we <span className="text-primary italic">help</span> you?
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10"
            >
              Search our help center for instant answers or raise a support ticket and our team will get back to you within 4 hours.
            </motion.p>

            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="relative max-w-2xl mx-auto"
            >
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs, order status, returns..."
                className="h-16 pl-16 pr-8 rounded-[2rem] border-none bg-muted/40 text-lg shadow-inner focus:ring-primary/20"
              />
            </motion.div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar / Quick Links */}
            <aside className="lg:w-1/3 space-y-6">
              <div className="bg-background border border-border/50 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Headphones className="text-primary" size={20} /> Support Channels
                </h3>
                <div className="space-y-4">
                  <div 
                    onClick={() => setActiveTab("faq")}
                    className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all ${activeTab === 'faq' ? 'bg-primary text-white' : 'bg-muted/30 hover:bg-muted/50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <HelpCircle size={20} />
                      <div>
                        <p className="font-bold text-sm">Read FAQs</p>
                        <p className={`text-[10px] ${activeTab === 'faq' ? 'text-white/70' : 'text-muted-foreground'}`}>Instant solutions</p>
                      </div>
                    </div>
                    <ChevronRight size={18} />
                  </div>

                  <div 
                    onClick={() => setActiveTab("tickets")}
                    className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all ${activeTab === 'tickets' ? 'bg-primary text-white' : 'bg-muted/30 hover:bg-muted/50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <LifeBuoy size={20} />
                      <div>
                        <p className="font-bold text-sm">Support Tickets</p>
                        <p className={`text-[10px] ${activeTab === 'tickets' ? 'text-white/70' : 'text-muted-foreground'}`}>Track your requests</p>
                      </div>
                    </div>
                    <ChevronRight size={18} />
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-2xl bg-muted/30 hover:bg-muted/50 cursor-not-allowed group transition-all">
                    <div className="flex items-center gap-4">
                      <MessageSquare size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      <div>
                        <p className="font-bold text-sm">Live Chat</p>
                        <p className="text-[10px] text-muted-foreground italic">Temporarily unavailable</p>
                      </div>
                    </div>
                    <X size={16} className="text-muted-foreground/30" />
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8">
                 <h4 className="font-bold mb-2">Need a faster resolution?</h4>
                 <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                   Our automated concierge can help with common address changes or delivery updates.
                 </p>
                 <Button variant="outline" className="w-full rounded-xl border-primary/20 text-primary bg-background">
                   Talk to AI Assist
                 </Button>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:w-2/3">
              {activeTab === "faq" ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-heading font-bold italic">Popular Answers</h2>
                    {!showTicketForm && (
                      <Button onClick={() => setShowTicketForm(true)} className="rounded-full shadow-lg gap-2">
                        <Plus size={18} /> Raise a Ticket
                      </Button>
                    )}
                  </div>

                  {showTicketForm ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-background border-2 border-primary/20 rounded-[3rem] p-10 shadow-xl shadow-primary/5"
                    >
                      <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-bold">Describe your issue</h3>
                        <Button variant="ghost" size="icon" onClick={() => setShowTicketForm(false)} className="rounded-full">
                          <X size={20} />
                        </Button>
                      </div>

                      <form onSubmit={handleRaiseTicket} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Category</label>
                              <Select value={ticketCategory} onValueChange={setTicketCategory} required>
                                <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Order & Shipping">Order & Shipping</SelectItem>
                                  <SelectItem value="Return & Refund">Return & Refund</SelectItem>
                                  <SelectItem value="Product Issue">Product Issue</SelectItem>
                                  <SelectItem value="Account & Profile">Account & Profile</SelectItem>
                                  <SelectItem value="Payment Issue">Payment Issue</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Related Order (Optional)</label>
                              <Select value={ticketOrder} onValueChange={setTicketOrder}>
                                <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none">
                                  <SelectValue placeholder="Select order" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="None">No specific order</SelectItem>
                                  {orders.map(o => (
                                    <SelectItem key={o.id} value={o.id}>{o.id} ({o.status})</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Subject</label>
                           <Input 
                             value={ticketSubject}
                             onChange={(e) => setTicketSubject(e.target.value)}
                             required
                             placeholder="Summary of the issue..."
                             className="h-14 rounded-2xl bg-muted/30 border-none"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Detailed Description</label>
                           <Textarea 
                             value={ticketMessage}
                             onChange={(e) => setTicketMessage(e.target.value)}
                             required
                             placeholder="Please provide as much detail as possible..."
                             className="min-h-[150px] rounded-2xl bg-muted/30 border-none p-6"
                           />
                        </div>

                        <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold gap-3 shadow-lg shadow-primary/20">
                           Submit Ticket <Send size={20} />
                        </Button>
                      </form>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {filteredFaqs.map((cat, ci) => (
                        <div key={cat.category} className="mb-8">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-6 flex items-center gap-3">
                             {cat.category} <div className="h-[1px] flex-1 bg-border/40" />
                          </h4>
                          <div className="space-y-3">
                            {cat.questions.map((q, qi) => {
                              const id = `${ci}-${qi}`;
                              const isOpen = openFaqs.includes(id);
                              return (
                                <div 
                                  key={id}
                                  className={`rounded-3xl border transition-all duration-500 ${isOpen ? 'bg-primary/5 border-primary/20' : 'bg-background border-border/50 hover:border-primary/30'}`}
                                >
                                  <button 
                                    onClick={() => toggleFaq(id)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left"
                                  >
                                    <span className="font-bold text-lg">{q.q}</span>
                                    <div className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-primary text-white' : 'bg-muted/50 text-muted-foreground'}`}>
                                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                                    </div>
                                  </button>
                                  <AnimatePresence>
                                    {isOpen && (
                                       <motion.div
                                         initial={{ height: 0, opacity: 0 }}
                                         animate={{ height: "auto", opacity: 1 }}
                                         exit={{ height: 0, opacity: 0 }}
                                         className="overflow-hidden"
                                       >
                                         <div className="px-8 pb-8 text-muted-foreground leading-relaxed text-lg">
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
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-heading font-bold italic">My Support Tickets</h2>
                    <Button onClick={() => setShowTicketForm(true)} variant="outline" className="rounded-full shadow-sm gap-2 bg-background border-primary/20 text-primary">
                      <Plus size={18} /> New Request
                    </Button>
                  </div>

                  {userTickets.length === 0 ? (
                    <div className="text-center py-24 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50">
                       <LifeBuoy size={48} className="text-muted-foreground/30 mx-auto mb-6" />
                       <h3 className="text-xl font-bold mb-2">No active tickets</h3>
                       <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
                         You haven't raised any support requests yet. We're here if you need anything.
                       </p>
                       <Button onClick={() => setShowTicketForm(true)} className="rounded-full px-8">
                          Create your first ticket
                       </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {userTickets.map((ticket, i) => (
                        <motion.div
                          key={ticket.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-background border border-border/50 rounded-3xl p-8 shadow-sm group hover:shadow-md transition-all border-l-4 border-l-primary"
                        >
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                             <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                   <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                     {ticket.ticket_number || ticket.id?.slice(0, 8)}
                                   </span>
                                   <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1.5 ${
                                      ticket.status === 'Open' ? 'bg-amber-500/10 text-amber-500' : 
                                      ticket.status === 'Replied' ? 'bg-primary/10 text-primary' : 
                                      'bg-emerald-500/10 text-emerald-500'
                                   }`}>
                                      {ticket.status === 'Open' ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                                      {ticket.status}
                                   </span>
                                </div>
                                <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{ticket.subject}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{ticket.message}</p>
                             </div>
                             
                             <div className="flex flex-col md:items-end justify-between min-w-[150px]">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                   Last Update: {new Date(ticket.created_at).toLocaleDateString()}
                                </p>
                                <Link to={`/support/ticket/${ticket.id}`}>
                                   <Button variant="ghost" className="rounded-xl w-full md:w-auto h-11 border border-border/50 group-hover:bg-primary group-hover:text-white transition-all">
                                      View Details <ArrowRight size={16} className="ml-2" />
                                   </Button>
                                </Link>
                             </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Trust Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="p-8 rounded-[3rem] bg-background border border-border/50 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500">
                   <ShieldCheck size={32} />
                </div>
                <h5 className="text-lg font-bold mb-2">Secure Transactions</h5>
                <p className="text-sm text-muted-foreground">Every purchase is protected by industry-leading encryption and fraud detection.</p>
             </div>

             <div className="p-8 rounded-[3rem] bg-background border border-border/50 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-6 text-primary">
                   <Package size={32} />
                </div>
                <h5 className="text-lg font-bold mb-2">Global Satisfaction</h5>
                <p className="text-sm text-muted-foreground">Our concierge team ensures your gift arrives in pristine condition, anywhere in the world.</p>
             </div>

             <div className="p-8 rounded-[3rem] bg-background border border-border/50 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-[2rem] bg-secondary/10 flex items-center justify-center mb-6 text-secondary">
                   <RefreshCw size={32} />
                </div>
                <h5 className="text-lg font-bold mb-2">Hassle-Free Returns</h5>
                <p className="text-sm text-muted-foreground">Not quite right? Our simplified return process makes it easy to exchange or refund.</p>
             </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default Support;
