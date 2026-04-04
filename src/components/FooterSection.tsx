import { motion } from "framer-motion";
import { Send, Instagram, Twitter, Facebook } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetSiteContentQuery } from "@/store/api/supabaseApi";

const FooterSection = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const { data: cmsData } = useGetSiteContentQuery();

  const footerContent = useMemo(() => {
    const footer = cmsData?.find(item => item.section_key === 'footer_info')?.content;
    return {
      email: footer?.email || "co@tofhaverse.com",
      phone: footer?.phone || "+91 9876543210",
      copyright: footer?.copyright || `© ${new Date().getFullYear()} Tofhaverse. All rights reserved.`
    };
  }, [cmsData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer>
      {/* Newsletter */}
      <section className="py-20 px-6" style={{ background: "var(--gradient-footer)" }}>
        <div className="container mx-auto max-w-xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Join the Tofhaverse Club
          </motion.h2>
          <p className="text-muted-foreground text-sm mb-8">Early access, exclusive collections, and gifting inspiration—right in your inbox.</p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-5 py-3 rounded-full bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px hsl(11 65% 63% / 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2"
            >
              {sent ? "Sent!" : "Subscribe"}
              <motion.span
                animate={sent ? { x: 30, opacity: 0 } : { x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Send size={14} />
              </motion.span>
            </motion.button>
          </form>
        </div>
      </section>

      {/* Footer links */}
      <div className="bg-foreground text-primary-foreground py-16 px-6">
        <div className="container mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Tofhaverse</h4>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">Gifts that speak volumes. Curated with love since 2024.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/40 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">Our Story</Link></li>
              <li><Link to="/artisans" className="hover:text-primary-foreground transition-colors">The Artisans</Link></li>
              <li><Link to="/sustainability" className="hover:text-primary-foreground transition-colors">Sustainability</Link></li>
              <li><Link to="/ethics" className="hover:text-primary-foreground transition-colors">Ethics</Link></li>
              <li><Link to="/careers" className="hover:text-primary-foreground transition-colors">Careers</Link></li>
              <li><Link to="/bulk-gifting" className="hover:text-primary-foreground transition-colors">Bulk Gifting</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/40 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/support" className="hover:text-primary-foreground transition-colors">Support Hub</Link></li>
              <li><Link to="/faq" className="hover:text-primary-foreground transition-colors">Safety & Trust</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-primary-foreground transition-colors">Shipping Info</Link></li>
              <li><Link to="/refund-policy" className="hover:text-primary-foreground transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/40 mb-4">Socials</h4>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary transition-colors"><Facebook size={20} /></a>
            </div>
            <div className="mt-8 pt-4 border-t border-primary-foreground/10">
              <p className="text-[10px] uppercase tracking-widest text-primary-foreground/40 mb-2">Concierge</p>
              <p className="text-sm font-medium">{footerContent.email}</p>
              <p className="text-sm font-medium">{footerContent.phone}</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto max-w-5xl mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/40">
          <p>{footerContent.copyright}</p>
          <div className="flex gap-6 uppercase tracking-widest">
            <Link to="/privacy-policy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
