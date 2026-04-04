import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Send, 
  User, 
  LifeBuoy,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";

const SupportTicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { tickets, updateTicket } = useAdminData();
  const [replyMessage, setReplyMessage] = useState("");

  const ticket = useMemo(() => 
    tickets.find((t: any) => t.id === id),
    [tickets, id]
  );

  const handleSendReply = async () => {
    if (!id || !replyMessage.trim() || !user) return;

    const reply = {
      id: Math.random().toString(36).substring(7),
      message: replyMessage,
      sender: "User",
      senderName: user.name || user.email,
      timestamp: new Date().toISOString()
    };

    const updatedTicket = {
      status: "Open", // Reset to open if user replies
      replies: [...(ticket?.replies || []), reply]
    };

    try {
      await updateTicket(id, updatedTicket);
      setReplyMessage("");
      toast.success("Reply sent successfully");
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  const handleResolveTicket = async () => {
    if (!id) return;
    try {
      await updateTicket(id, { status: "Resolved" });
      toast.success("Ticket marked as resolved");
    } catch (error) {
      toast.error("Failed to update ticket");
    }
  };

  if (!ticket) {
    return (
      <PageTransition title="Ticket Not Found">
        <StickyNav />
        <main className="pt-32 pb-20 min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Ticket Not Found</h1>
            <p className="text-muted-foreground mb-8">The ticket you're looking for doesn't exist or you don't have access.</p>
            <Link to="/support">
              <Button className="rounded-full px-8">Back to Support</Button>
            </Link>
          </div>
        </main>
        <FooterSection />
      </PageTransition>
    );
  }

  return (
    <PageTransition title={`Ticket #${ticket.ticket_number || id?.slice(0, 8)}`} description={ticket.subject}>
      <StickyNav />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-2 mb-8">
            <Link to="/support">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft size={18} />
              </Button>
            </Link>
          </div>

          <div className="bg-background border border-border/50 rounded-[3rem] overflow-hidden shadow-sm shadow-primary/5 flex flex-col">
            {/* Header */}
            <div className="p-10 border-b border-border/50 bg-muted/10">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                       <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">
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
                    <h1 className="text-3xl font-heading font-bold mb-2">{ticket.subject}</h1>
                    <p className="text-sm text-muted-foreground">{ticket.category} • Created on {new Date(ticket.created_at).toLocaleDateString()}</p>
                  </div>
                  {ticket.status !== 'Resolved' && (
                    <Button 
                      onClick={handleResolveTicket}
                      variant="outline" 
                      className="rounded-2xl h-12 px-6 border-emerald-500/20 text-emerald-600 hover:bg-emerald-50"
                    >
                      Mark as Resolved
                    </Button>
                  )}
               </div>
            </div>

            {/* Conversation Area */}
            <div className="p-10 space-y-10 min-h-[400px]">
               {/* Original Message */}
               <div className="flex gap-4 max-w-[90%]">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0">
                     <User size={24} className="text-muted-foreground" />
                  </div>
                  <div className="bg-muted/30 p-8 rounded-[2.5rem] rounded-tl-none">
                     <div className="flex items-center gap-4 mb-3">
                        <span className="font-bold text-sm">{ticket.user_name || 'You'}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{new Date(ticket.created_at).toLocaleString()}</span>
                     </div>
                     <p className="text-lg leading-relaxed whitespace-pre-wrap">{ticket.message}</p>
                  </div>
               </div>

               {/* Replies */}
               <AnimatePresence>
                 {ticket.replies?.map((reply: any, idx: number) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className={`flex gap-4 max-w-[90%] ${reply.sender === 'Admin' ? 'flex-row-reverse ml-auto' : ''}`}
                   >
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${reply.sender === 'Admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                       {reply.sender === 'Admin' ? <LifeBuoy size={24} /> : <User size={24} />}
                     </div>
                     <div className={`p-8 rounded-[2.5rem] ${reply.sender === 'Admin' ? 'bg-primary text-white rounded-tr-none' : 'bg-muted/30 rounded-tl-none'}`}>
                        <div className={`flex items-center gap-4 mb-3 ${reply.sender === 'Admin' ? 'justify-end' : ''}`}>
                           <span className="font-bold text-sm">{reply.sender === 'Admin' ? 'Tofhaverse Concierge' : (reply.senderName || 'You')}</span>
                           <span className={`text-[10px] uppercase tracking-wider ${reply.sender === 'Admin' ? 'text-white/70' : 'text-muted-foreground'}`}>{new Date(reply.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-lg leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
            </div>

            {/* Reply Input */}
            {ticket.status !== 'Resolved' && (
              <div className="p-10 border-t border-border/50 bg-background">
                <div className="relative">
                   <Textarea 
                     value={replyMessage}
                     onChange={(e) => setReplyMessage(e.target.value)}
                     placeholder="Type your follow-up message here..."
                     className="min-h-[150px] rounded-[2rem] border-2 border-muted bg-muted/10 p-8 pr-24 focus:border-primary/50 transition-all resize-none text-lg"
                   />
                   <Button 
                     onClick={handleSendReply}
                     disabled={!replyMessage.trim()}
                     className="absolute bottom-6 right-6 rounded-2xl w-14 h-14 p-0 shadow-xl shadow-primary/20"
                   >
                      <Send size={24} />
                   </Button>
                </div>
                <div className="mt-6 flex items-center justify-between text-muted-foreground">
                   <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Secure Response</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Avg Response: 4 hrs</span>
                      </div>
                   </div>
                   <p className="text-[10px] italic">Our team will be notified of your reply</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default SupportTicketDetail;
