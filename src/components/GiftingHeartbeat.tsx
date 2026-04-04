import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { generateHeartbeat, getNextEngagementInterval, getIdleNudge } from "@/lib/engagementIntelligence";
import { useAdminData } from "@/context/AdminDataContext";
import { ShoppingBag, Heart, Sparkles, Eye, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Autonomous Gifting Heartbeat (ASI Phase 3)
 * Generates live social proof and engagement nudges.
 */
const GiftingHeartbeat = () => {
  const { products } = useAdminData();
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);

  const triggerHeartbeat = () => {
    const activity = generateHeartbeat(products);
    if (!activity) return;

    const Icon = {
      shopping_bag: ShoppingBag,
      heart: Heart,
      sparkles: Sparkles,
      eye: Eye
    }[activity.icon as keyof typeof Icon] || Sparkles;

    toast.custom((t) => (
      <div className="bg-background/80 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl flex items-center gap-4 w-auto max-w-[calc(100vw-2rem)] md:max-w-sm animate-in slide-in-from-bottom-5">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
           <Icon className="text-primary" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase font-bold tracking-widest text-primary/60 mb-1 flex items-center gap-1.5">
            <MapPin size={10} /> Live Activity
          </p>
          <p className="text-xs font-bold leading-tight text-foreground line-clamp-2">
            {activity.message}
          </p>
          <Link 
            to={`/product/${activity.productSlug}`} 
            onClick={() => toast.dismiss(t)}
            className="text-[10px] font-bold text-primary hover:underline mt-1 inline-block"
          >
            Curate This Masterpiece →
          </Link>
        </div>
      </div>
    ), { 
      duration: 6000,
      position: 'bottom-left'
    });

    // Schedule next heartbeat
    heartbeatTimer.current = setTimeout(triggerHeartbeat, getNextEngagementInterval());
  };

  const triggerIdleNudge = () => {
    const trending = products.find(p => p.isBestSeller && p.rating >= 4.8);
    const message = getIdleNudge(trending);

    toast(message, {
      icon: <Sparkles className="text-amber-500" size={16} />,
      position: 'bottom-right',
      duration: 8000
    });
  };

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(triggerIdleNudge, 90000); // 90 seconds idle
  };

  useEffect(() => {
    // Start heartbeats after initial delay (10-20s)
    heartbeatTimer.current = setTimeout(triggerHeartbeat, 15000);
    
    // Setup idle detection
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    resetIdleTimer();

    return () => {
      if (heartbeatTimer.current) clearTimeout(heartbeatTimer.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('scroll', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
  }, [products]);

  return null; // Logic only component
};

export default GiftingHeartbeat;
