import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  LifeBuoy, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Archive,
  ArrowRight,
  User,
  Mail,
  Package,
  Calendar,
  Send,
  X,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AdminSupport = () => {
  const { tickets, updateTicket, returns, updateReturn } = useAdminData();
  const [search, setSearch] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [activeView, setActiveView] = useState<"tickets" | "returns">("tickets");

  const selectedTicket = useMemo(() => 
    tickets.find(t => t.id === selectedTicketId),
    [tickets, selectedTicketId]
  );

  const filteredTickets = useMemo(() => 
    tickets.filter(t => {
      const matchesSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || 
                           (t.ticket_number?.toLowerCase() || t.id.toLowerCase()).includes(search.toLowerCase()) ||
                           (t.user_name?.toLowerCase() || "").includes(search.toLowerCase());
      const matchesFilter = filterStatus === "All" || t.status === filterStatus;
      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [tickets, search, filterStatus]
  );

  const handleSendReply = async () => {
    if (!selectedTicketId || !replyMessage.trim()) return;

    const reply = {
      id: Math.random().toString(36).substring(7),
      message: replyMessage,
      sender: "Admin",
      timestamp: new Date().toISOString()
    };

    const updatedTicket = {
      status: "Replied",
      replies: [...(selectedTicket?.replies || []), reply]
    };

    await updateTicket(selectedTicketId, updatedTicket);
    setReplyMessage("");
    toast.success("Response sent to customer");
  };

  const handleResolveTicket = async (id: string) => {
    await updateTicket(id, { status: "Resolved" });
    toast.success("Ticket marked as Resolved");
  };

  return (
    <div className="space-y-8 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Customer Assistance</h1>
          <p className="text-sm text-muted-foreground">Manage support requests, tickets, and customer inquiries.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
             <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Open Tickets</p>
             <p className="text-2xl font-bold font-heading">{tickets.filter(t => t.status === 'Open').length}</p>
          </div>
          <div className="bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
             <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">Resolved Today</p>
             <p className="text-2xl font-bold font-heading">12</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Ticket List */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-background p-6 rounded-[2rem] border border-border/50 shadow-sm space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..." 
                className="w-full h-11 bg-muted/30 border-none rounded-xl pl-10 pr-4 text-sm"
              />
            </div>

            <div className="flex gap-2 p-1 bg-muted/30 rounded-2xl mb-6">
              <button
                onClick={() => setActiveView("tickets")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeView === "tickets" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                Tickets
              </button>
              <button
                onClick={() => setActiveView("returns")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeView === "returns" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                Returns
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {["All", "Open", "Replied", "Resolved"].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    filterStatus === status 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
               {activeView === "tickets" ? (
                 <>
                   {filteredTickets.map(ticket => (
                     <div
                       key={ticket.id}
                       onClick={() => setSelectedTicketId(ticket.id)}
                       className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                         selectedTicketId === ticket.id 
                           ? "bg-primary/5 border-primary shadow-sm" 
                           : "bg-muted/10 border-transparent hover:border-border/50"
                       }`}
                     >
                       <div className="flex justify-between items-start mb-3">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{ticket.ticket_number || ticket.id?.slice(0, 8)}</span>
                         <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                            ticket.status === 'Open' ? 'bg-amber-500/10 text-amber-500' : 
                            ticket.status === 'Replied' ? 'bg-primary/10 text-primary' : 
                            'bg-emerald-500/10 text-emerald-500'
                         }`}>
                            {ticket.status}
                         </span>
                       </div>
                       <h4 className="font-bold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">{ticket.subject}</h4>
                       <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{ticket.user_name}</p>
                          <p className="text-[10px] text-muted-foreground/50">{new Date(ticket.created_at).toLocaleDateString()}</p>
                       </div>
                     </div>
                   ))}
                   {filteredTickets.length === 0 && (activeView === "tickets") && (
                     <div className="text-center py-12">
                       <LifeBuoy size={32} className="mx-auto mb-4 text-muted-foreground/30" />
                       <p className="text-sm text-muted-foreground">No tickets match your filters.</p>
                     </div>
                   )}
                 </>
               ) : activeView === "returns" && selectedReturnId ? (
                <motion.div
                  key={selectedReturnId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-background border border-border/50 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-full min-h-[700px]"
                >
                  <div className="p-8 border-b border-border/50 bg-muted/10 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                           <RefreshCw size={24} />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold">Return {returns.find(r => r.id === selectedReturnId)?.return_number}</h3>
                           <p className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase font-bold tracking-widest mt-1">
                              <Package size={12} /> Order {returns.find(r => r.id === selectedReturnId)?.order_id}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <Button 
                           onClick={() => updateReturn(selectedReturnId, { status: "Approved" })}
                           className="rounded-xl h-11 px-6 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                           disabled={returns.find(r => r.id === selectedReturnId)?.status !== "Pending Review"}
                        >
                           Approve
                        </Button>
                        <Button 
                           onClick={() => updateReturn(selectedReturnId, { status: "Rejected" })}
                           variant="outline"
                           className="rounded-xl h-11 px-6 border-destructive/20 text-destructive hover:bg-destructive/10"
                           disabled={returns.find(r => r.id === selectedReturnId)?.status !== "Pending Review"}
                        >
                           Reject
                        </Button>
                     </div>
                  </div>
                  <div className="p-8 space-y-8">
                     <div className="bg-muted/10 p-8 rounded-[2.5rem] border border-border/50">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Reason for Return</h4>
                        <p className="text-lg leading-relaxed">{returns.find(r => r.id === selectedReturnId)?.reason}</p>
                     </div>
                  </div>
                </motion.div>
              ) : (
                 <>
                   {returns.map(ret => (
                     <div
                       key={ret.id}
                       onClick={() => setSelectedReturnId(ret.id)}
                       className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                         selectedReturnId === ret.id 
                           ? "bg-primary/5 border-primary shadow-sm" 
                           : "bg-muted/10 border-transparent hover:border-border/50"
                       }`}
                     >
                       <div className="flex justify-between items-start mb-3">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{ret.return_number}</span>
                         <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                            ret.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-500' : 
                            ret.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                            'bg-primary/10 text-primary'
                         }`}>
                            {ret.status}
                         </span>
                       </div>
                       <h4 className="font-bold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">Order {ret.order_id}</h4>
                       <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{ret.user_email}</p>
                          <p className="text-[10px] text-muted-foreground/50">{new Date(ret.created_at).toLocaleDateString()}</p>
                       </div>
                     </div>
                   ))}
                 </>
               )}
            </div>
          </div>
        </div>

        {/* Workspace area */}
        <div className="lg:w-2/3">
           <AnimatePresence mode="wait">
             {activeView === "tickets" && selectedTicket ? (
               <motion.div
                 key={selectedTicketId}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="bg-background border border-border/50 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-full min-h-[700px]"
               >
                 {/* Workspace Header */}
                 <div className="p-8 border-b border-border/50 bg-muted/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                          <User size={24} />
                       </div>
                       <div>
                          <h3 className="text-xl font-bold">{selectedTicket.user_name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase font-bold tracking-widest mt-1">
                             <Mail size={12} /> {selectedTicket.email}
                          </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <Button variant="outline" className="rounded-xl h-11 px-4 gap-2 border-border/50">
                          <Archive size={16} /> Archive
                       </Button>
                       {selectedTicket.status !== 'Resolved' && (
                         <Button 
                            onClick={() => handleResolveTicket(selectedTicket.id)}
                            className="rounded-xl h-11 px-6 gap-2 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                         >
                            <CheckCircle2 size={16} /> Mark Resolved
                         </Button>
                       )}
                    </div>
                 </div>

                 {/* Chat/Conversation Area */}
                 <div className="flex-1 p-8 space-y-8 overflow-y-auto max-h-[450px] custom-scrollbar bg-dots-pattern">
                    {/* User's Original Message */}
                    <div className="flex gap-4 max-w-[85%]">
                       <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                          <User size={18} className="text-muted-foreground" />
                       </div>
                       <div className="bg-muted/30 p-6 rounded-[2rem] rounded-tl-none">
                          <div className="flex items-center gap-3 mb-2">
                             <span className="text-xs font-bold">{selectedTicket.user_name}</span>
                             <span className="text-[10px] text-muted-foreground">{new Date(selectedTicket.created_at).toLocaleString()}</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 text-[9px] font-bold uppercase tracking-widest text-primary mb-3">
                             {selectedTicket.category}
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
                          {selectedTicket.orderId && selectedTicket.orderId !== "None" && (
                             <div className="mt-4 p-3 bg-background rounded-xl border border-border/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <Package size={16} className="text-primary" />
                                   <span className="text-xs font-bold">Related Order: {selectedTicket.order_id}</span>
                                </div>
                                <ArrowRight size={14} className="text-muted-foreground" />
                             </div>
                          )}
                       </div>
                    </div>

                    {/* Replies */}
                    {selectedTicket.replies?.map((reply: any, idx: number) => (
                      <div key={idx} className={`flex gap-4 max-w-[85%] ${reply.sender === 'Admin' ? 'flex-row-reverse ml-auto' : ''}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${reply.sender === 'Admin' ? 'bg-primary/10' : 'bg-muted'}`}>
                          {reply.sender === 'Admin' ? <LifeBuoy size={18} className="text-primary" /> : <User size={18} className="text-muted-foreground" />}
                        </div>
                        <div className={`p-6 rounded-[2rem] ${reply.sender === 'Admin' ? 'bg-primary text-white rounded-tr-none' : 'bg-muted/30 rounded-tl-none'}`}>
                          <div className={`flex items-center gap-3 mb-2 ${reply.sender === 'Admin' ? 'justify-end' : ''}`}>
                             <span className="text-xs font-bold">{reply.sender === 'Admin' ? 'You' : selectedTicket.userName}</span>
                             <span className={`text-[10px] ${reply.sender === 'Admin' ? 'text-white/70' : 'text-muted-foreground'}`}>{new Date(reply.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                        </div>
                      </div>
                    ))}
                 </div>

                 {/* Reply Editor */}
                 <div className="p-8 border-t border-border/50 bg-background">
                    <div className="relative">
                       <Textarea 
                         value={replyMessage}
                         onChange={(e) => setReplyMessage(e.target.value)}
                         placeholder="Type your response to the customer..."
                         className="min-h-[120px] rounded-3xl border-2 border-muted bg-muted/10 p-6 pr-20 focus:border-primary/50 transition-all resize-none"
                       />
                       <Button 
                         onClick={handleSendReply}
                         disabled={!replyMessage.trim()}
                         className="absolute bottom-4 right-4 rounded-2xl w-12 h-12 p-0 shadow-lg"
                       >
                          <Send size={20} />
                       </Button>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-muted-foreground">
                       <div className="flex gap-4">
                          <button className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Attach File</button>
                          <button className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Canned Responses</button>
                       </div>
                       <p className="text-[10px] italic">Customer will receive an automated email notification</p>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <div className="h-full flex items-center justify-center bg-muted/10 border-2 border-dashed border-border/50 rounded-[3rem]">
                 <div className="text-center p-12">
                   <LifeBuoy size={64} className="mx-auto mb-6 text-muted-foreground/20 animate-pulse-slow" />
                   <h3 className="text-2xl font-bold mb-2">Select a ticket to begin</h3>
                   <p className="text-muted-foreground max-w-sm mx-auto">
                     Pick a customer request from the list on the left to start assisting them.
                   </p>
                 </div>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
