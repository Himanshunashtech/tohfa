import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

interface WishlistButtonProps {
  productId: string;
  productName?: string;
  size?: number;
  className?: string;
}

const WishlistButton = ({ productId, productName, size = 18, className = "" }: WishlistButtonProps) => {
  const { toggleItem, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(productId);

  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(productId, productName);
      }}
      whileTap={{ scale: 0.8 }}
      className={`flex items-center justify-center rounded-full transition-colors ${className}`}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <motion.div
        animate={wishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          size={size}
          className={
            wishlisted
              ? "fill-destructive text-destructive"
              : "text-muted-foreground hover:text-destructive transition-colors"
          }
        />
      </motion.div>
    </motion.button>
  );
};

export default WishlistButton;
