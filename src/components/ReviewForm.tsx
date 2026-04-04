import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Camera, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminData } from "@/context/AdminDataContext";
import { useAuth } from "@/context/AuthContext";
import { Review } from "@/data/products";

interface ReviewFormProps {
  productId: string;
  onClose: () => void;
}

const ReviewForm = ({ productId, onClose }: ReviewFormProps) => {
  const { user } = useAuth();
  const { addReview, awardPoints } = useAdminData();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    const newReview: Review = {
      id: `rev-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      userName: user?.name || "Anonymous",
      userEmail: user?.email || "anonymous@example.com",
      userId: user?.id,
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      helpfulCount: 0,
      isVerified: !!user,
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addReview(newReview);
    if (user?.email) {
      awardPoints(user.email, 50, `Feedback Reward: ${productId}`);
    }
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-foreground/60 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-background rounded-[3rem] shadow-2xl overflow-hidden border border-border/50"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-10"
            >
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={32} />
                </div>
                <h2 className="text-3xl font-heading font-bold mb-2">Share Your Experience</h2>
                <p className="text-muted-foreground text-sm">How would you rate this gift?</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Star Rating */}
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <Star 
                          size={40} 
                          className={`transition-colors duration-200 ${
                            star <= (hover || rating) 
                              ? "fill-primary text-primary" 
                              : "text-muted-foreground/30"
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-xs font-bold text-primary uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                      {["Disappointing", "Fair", "Good", "Great", "Exceptional!"][rating - 1]}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea 
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you love about it? How was the gifting experience?"
                      className="rounded-2xl min-h-[120px] resize-none border-border/50 focus:border-primary/50"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-dashed border-border/50">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-muted-foreground">
                      <Camera size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold">Add Photos</p>
                      <p className="text-[10px] text-muted-foreground">Show others how it looks in real life (Mock)</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="text-xs font-bold text-primary">Browse</Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={rating === 0 || isSubmitting}
                  className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Publishing...
                    </div>
                  ) : "Post Review"}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-20 text-center"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <Check size={48} className="stroke-[3px]" />
              </div>
              <h2 className="text-3xl font-heading font-bold mb-4">Review Submitted!</h2>
              <p className="text-muted-foreground">
                Thank you for helping others discover premium gifts. Your review is now live!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReviewForm;
