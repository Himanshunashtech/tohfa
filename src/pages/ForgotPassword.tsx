import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <PageTransition>
      <StickyNav />
      <main className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-background/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-xl shadow-primary/5">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-10">
                  <h1 className="font-heading text-3xl font-bold text-foreground mb-3">Reset Password</h1>
                  <p className="text-muted-foreground text-sm">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 h-12 rounded-xl bg-background/50 border-border/50"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? "Sending link..." : (
                      <>
                        Send Reset Link <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Sign In
                  </Link>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} className="text-primary" />
                </div>
                <h1 className="font-heading text-2xl font-bold text-foreground mb-3">Check your email</h1>
                <p className="text-muted-foreground text-sm mb-10">
                  We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>.
                </p>
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Didn't receive the email?{" "}
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-primary font-semibold hover:underline"
                    >
                      Click to retry
                    </button>
                  </p>
                  <Link to="/login">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-border/50">
                      Return to login
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default ForgotPassword;
