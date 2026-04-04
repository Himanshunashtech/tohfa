import { useState, useMemo } from "react";
import { Star, ThumbsUp, User, CheckCircle2, MessageSquarePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminData } from "@/context/AdminDataContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface ReviewListProps {
  productId: string;
}

const ReviewList = ({ productId }: ReviewListProps) => {
  const { reviews: allReviews, products } = useAdminData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  
  const product = products.find(p => p.id === productId);
  const reviews = useMemo(() => 
    allReviews.filter(r => r.productId === productId), 
    [allReviews, productId]
  );

  const starBreakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach(r => counts[r.rating - 1]++);
    return counts.reverse().map((count, i) => ({
      stars: 5 - i,
      percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
      count
    }));
  }, [reviews]);

  return (
    <div className="space-y-12">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-2xl font-heading font-bold">Customer Feedback</h3>
          <div className="flex items-center gap-4">
            <span className="text-5xl font-heading font-bold text-foreground">{product?.rating || 0}</span>
            <div className="space-y-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < (product?.rating || 0) ? "fill-primary text-primary" : "text-muted"} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-medium">Based on {reviews.length} reviews</p>
            </div>
          </div>
          
          {user ? (
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full h-12 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 shadow-none font-bold gap-2"
            >
              <MessageSquarePlus size={18} /> Write a Review
            </Button>
          ) : (
            <div className="p-6 rounded-2xl bg-muted/30 border border-dashed border-border flex flex-col items-center text-center gap-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Share Your Thoughts</p>
              <p className="text-xs text-muted-foreground">Sign in to write a review and earn loyalty points.</p>
              <Button 
                onClick={() => navigate("/login")}
                variant="outline"
                className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary/5 h-10 text-xs font-bold gap-2"
              >
                <LogIn size={14} /> Login to Write a Review
              </Button>
            </div>
          )}
        </div>

        {/* Star Bars */}
        <div className="lg:col-span-2 space-y-3">
          {starBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-4 group">
              <div className="flex items-center gap-1.5 w-12 shrink-0">
                <span className="text-sm font-bold">{item.stars}</span>
                <Star size={12} className="fill-muted-foreground/30 text-muted-foreground/30" />
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full group-hover:bg-primary/80 transition-colors"
                />
              </div>
              <span className="text-xs font-bold text-muted-foreground w-8 text-right">{Math.round(item.percentage)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-8 pt-8 border-t border-border/10">
        <AnimatePresence mode="popLayout">
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 rounded-[2.5rem] bg-background border border-border/50 shadow-sm relative group overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-2 h-full bg-primary/5 group-hover:bg-primary/20 transition-colors" />

                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                      <User size={24} className="text-secondary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground">{review.userName}</p>
                        {review.isVerified && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <CheckCircle2 size={10} />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Verified Buyer</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} size={14} className={j < review.rating ? "fill-primary text-primary" : "text-muted"} />
                          ))}
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-foreground/80 text-sm leading-relaxed max-w-2xl">
                  {review.comment}
                </p>

                <div className="mt-8 pt-6 border-t border-border/10 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group">
                    <ThumbsUp size={14} className="group-hover:scale-110 transition-transform" />
                    Helpful ({review.helpfulCount})
                  </button>
                  <button className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-rose-500 transition-colors">
                    Report Issue
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-[3rem] border border-dashed border-border/50">
               <MessageSquarePlus size={32} className="mx-auto text-muted-foreground mb-4" />
               <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No reviews yet for this gift.</p>
               <p className="text-xs text-muted-foreground mt-2">Be the first to share your thoughts!</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <ReviewForm 
            productId={productId} 
            onClose={() => setShowForm(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewList;
