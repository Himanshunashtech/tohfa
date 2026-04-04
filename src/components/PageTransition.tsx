import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface PageTransitionProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const PageTransition = ({ children, title, description }: PageTransitionProps) => {
  useEffect(() => {
    const baseTitle = "Tofhaverse";
    document.title = title ? `${title} — ${baseTitle}` : `${baseTitle} — Gifts That Speak Volumes`;
    
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      }
    }
  }, [title, description]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
