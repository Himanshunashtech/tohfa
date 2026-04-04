import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background max-w-md w-full rounded-[3rem] p-12 text-center border border-border/50 shadow-2xl shadow-primary/5"
          >
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-8 text-destructive">
              <AlertTriangle size={40} />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-4 text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              An unexpected error occurred. We've been notified and are working to fix it.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => window.location.reload()}
                className="rounded-full h-12 gap-2"
              >
                <RefreshCcw size={18} /> Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={this.handleReset}
                className="rounded-full h-12 gap-2"
              >
                <Home size={18} /> Return Home
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-muted rounded-2xl text-left overflow-auto max-h-40">
                <p className="text-[10px] font-mono text-destructive">{this.state.error?.toString()}</p>
              </div>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
