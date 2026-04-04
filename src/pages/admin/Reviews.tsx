import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  MoreVertical,
  ThumbsUp,
  MessageSquare,
  User,
  ShieldCheck
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminReviews = () => {
  const { 
    reviews: allReviews, 
    deleteReview, 
    updateReviewHelpful,
    moderateReview,
    submitAdminReply,
    products 
  } = useAdminData();
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const filteredReviews = allReviews.filter(r => {
    const matchesSearch = r.userName.toLowerCase().includes(search.toLowerCase()) || 
                          r.comment.toLowerCase().includes(search.toLowerCase());
    const matchesRating = filterRating === 'all' || r.rating === filterRating;
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const getProductName = (id: string) => {
    return products.find(p => p.id === id)?.name || "Unknown Product";
  };

  const handleApprove = async (id: string) => {
    await moderateReview(id, 'approved');
  };

  const handleReject = async (id: string) => {
    await moderateReview(id, 'rejected');
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);
    await submitAdminReply(id, replyText);
    setReplyText("");
    setReplyingTo(null);
    setIsSubmittingReply(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Customer Reviews</h1>
          <p className="text-sm text-muted-foreground text-balance max-w-xl">
            Monitor and moderate customer feedback. High-quality reviews build trust and drive conversions.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-background p-2 rounded-2xl border border-border/50 shadow-sm">
           <div className="px-4 py-2 text-center border-r border-border/50">
              <p className="text-xs font-bold text-muted-foreground uppercase">Average</p>
              <p className="text-xl font-bold text-primary">4.8</p>
           </div>
           <div className="px-4 py-2 text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase">Total</p>
              <p className="text-xl font-bold">{allReviews.length}</p>
           </div>
        </div>
      </div>

      {/* Tools */}
      <div className="bg-background p-6 rounded-[2rem] border border-border/50 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by user or comment..." 
            className="w-full h-11 bg-muted/30 border-none rounded-xl pl-10 pr-4 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-2 mr-2">
            <span className="text-xs font-bold text-muted-foreground uppercase whitespace-nowrap">Filter:</span>
            {[5, 4, 3, 2, 1].map(r => (
              <button 
                key={r}
                onClick={() => setFilterRating(filterRating === r ? 'all' : r)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterRating === r ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {r} <Star size={10} className={filterRating === r ? "fill-white" : "fill-muted-foreground"} />
              </button>
            ))}
          </div>
          <div className="h-6 w-[1px] bg-border/50 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase whitespace-nowrap">Status:</span>
            {['all', 'pending', 'approved', 'rejected'].map(s => (
              <button 
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                  filterStatus === s ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="h-6 w-[1px] bg-border/50 hidden md:block" />
          <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 border border-border/20">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {/* Review List */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="bg-background rounded-[2.5rem] border border-border/50 shadow-sm p-8 group hover:border-primary/20 transition-all"
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* User Info */}
                <div className="w-full md:w-56 shrink-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                      <User size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground truncate">{review.userName}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{review.userEmail}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 pt-2">
                    {review.isVerified && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit">
                        <ShieldCheck size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Verified Buyer</span>
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-1">{review.date}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={16} className={j < review.rating ? "fill-primary text-primary" : "text-muted"} />
                        ))}
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Item: <span className="text-primary hover:underline cursor-pointer">{getProductName(review.productId)}</span>
                      </p>
                    </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mr-2 ${
                         review.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                         review.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 
                         'bg-amber-100 text-amber-600'
                       }`}>
                         {review.status}
                       </div>
                       {review.status !== 'approved' && (
                         <Button 
                           variant="outline" 
                           size="sm" 
                           onClick={() => handleApprove(review.id)}
                           className="rounded-xl h-10 border-border/50 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                         >
                            <CheckCircle2 size={16} className="mr-2" /> Approve
                         </Button>
                       )}
                       {review.status !== 'rejected' && (
                         <Button 
                           variant="outline" 
                           size="sm" 
                           onClick={() => handleReject(review.id)}
                           className="rounded-xl h-10 border-border/50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                         >
                            <Trash2 size={16} className="mr-2" /> Reject
                         </Button>
                       )}
                       <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteReview(review.id)}
                        className="rounded-xl h-10 border-border/50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                       >
                          <Trash2 size={16} className="mr-2" /> Delete
                       </Button>
                       <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                          <MoreVertical size={16} />
                       </Button>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-muted/20 border border-border/5 text-foreground/80 text-sm leading-relaxed relative">
                    <AlertCircle size={40} className="absolute -top-4 -right-4 text-primary/5 -rotate-12" />
                    "{review.comment}"
                  </div>

                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => updateReviewHelpful(review.id)}
                      className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                       <ThumbsUp size={12} /> {review.helpfulCount} people found this helpful
                    </button>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                       <MessageSquare size={12} /> {review.adminReply ? '1 Reply' : '0 Replies'}
                    </div>
                  </div>

                  {/* Admin Reply Section */}
                  <div className="pt-4 border-t border-border/50">
                    {review.adminReply ? (
                      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck size={14} className="text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Admin Response</span>
                          <span className="text-[10px] text-muted-foreground ml-auto">{review.repliedAt}</span>
                        </div>
                        <p className="text-sm text-foreground/80 italic">"{review.adminReply}"</p>
                      </div>
                    ) : replyingTo === review.id ? (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <textarea 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your response to the customer..."
                          className="w-full h-24 bg-muted/30 border border-border/50 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => { setReplyingTo(null); setReplyText(""); }}
                            className="text-xs h-8"
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            disabled={!replyText.trim() || isSubmittingReply}
                            onClick={() => handleReply(review.id)}
                            className="bg-primary text-primary-foreground text-xs h-8 px-4 font-bold"
                          >
                            {isSubmittingReply ? "Posting..." : "Post Reply"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setReplyingTo(review.id)}
                        className="text-primary hover:text-primary/80 hover:bg-primary/5 text-xs font-bold gap-2 p-0 h-auto"
                      >
                        <MessageSquare size={14} /> Reply to this review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredReviews.length === 0 && (
          <div className="bg-background rounded-[3rem] p-20 text-center border border-dashed border-border/50">
             <MessageSquare size={48} className="mx-auto text-muted-foreground/30 mb-6" />
             <h2 className="text-2xl font-heading font-bold mb-2">No Reviews Found</h2>
             <p className="text-muted-foreground">We couldn't find any reviews matching your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
