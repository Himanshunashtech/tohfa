import { useState, useEffect } from "react";
import { Search, ShoppingBag, User, Menu, X, Heart, LogOut, LayoutDashboard, Gift, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useAdminData } from "@/context/AdminDataContext";
import CartDrawer from "@/components/CartDrawer";

const StickyNav = () => {
  const { collections, filterOptions } = useAdminData();
  const { categories } = filterOptions;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingSearch, setTrendingSearch] = useState(["Artisan Candles", "Kintsugi", "Gift Boxes", "Leather Goods", "Silk"]);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "Occasions", href: "/occasions" },
    { label: "Our Campaign", href: "/campaign" },
    { label: "Gift Assistant", href: "/gift-assistant" },
    { label: "Corporate", href: "/corporate" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHomePage
          ? "bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className={`font-heading text-2xl font-bold tracking-wide transition-colors duration-300 ${scrolled || !isHomePage ? "text-foreground" : "text-white"}`}>
          Tofhaverse
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.label} className="relative group/nav">
              <Link
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 py-2 flex items-center gap-1 ${
                  scrolled || !isHomePage 
                    ? "text-muted-foreground hover:text-foreground" 
                    : "text-white hover:text-white"
                }`}
              >
                {link.label}
              </Link>
              
              {link.label === "Collections" && collections.length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 z-50">
                  <div className="w-80 bg-background/95 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl p-6 overflow-hidden">
                    <div className="mb-4">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Featured Curations</p>
                       <h4 className="text-sm font-bold">Explore Masterpieces</h4>
                    </div>
                    <div className="space-y-4">
                      {[...collections]
                        .filter(c => c.status === 'published')
                        .sort((a, b) => Number(b.is_featured || 0) - Number(a.is_featured || 0))
                        .slice(0, 3)
                        .map((col) => (
                        <Link 
                          key={col.id} 
                          to={`/collections/${col.slug}`}
                          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-muted transition-colors group/item"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border/10">
                            <img src={col.image_url} alt={col.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{col.name}</p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">{col.best_for}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-border/50">
                       <Link to="/collections" className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2 hover:gap-3 transition-all">
                          View All Collections <Gift size={12} />
                       </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            className={`transition-colors p-2 ${scrolled || !isHomePage ? "text-muted-foreground hover:text-foreground" : "text-white hover:text-white"}`}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <Link 
            to="/wishlist" 
            className={`relative transition-colors ${scrolled || !isHomePage ? "text-muted-foreground hover:text-foreground" : "text-white hover:text-white"}`} 
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <motion.span
                key={wishlistCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-primary-foreground text-[10px] font-bold flex items-center justify-center"
              >
                {wishlistCount}
              </motion.span>
            )}
          </Link>

          <button 
            onClick={() => setCartOpen(true)} 
            className={`relative transition-colors p-2 ${scrolled || !isHomePage ? "text-muted-foreground hover:text-foreground" : "text-white hover:text-white"}`} 
            aria-label="Cart"
          >
            <motion.div
              animate={totalItems > 0 && (Math.floor(Date.now() / 45000) % 2 === 0) ? { 
                scale: [1, 1.15, 1],
                color: ["currentColor", "#D4AF37", "currentColor"] 
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ShoppingBag size={20} />
            </motion.div>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 15 
                  }}
                  className="absolute top-0 right-0 w-4.5 h-4.5 min-w-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-lg shadow-primary/20 pointer-events-none"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {user ? (
            <div className="relative group">
              <button 
                className={`hidden md:flex items-center gap-2 transition-colors ${scrolled || !isHomePage ? "text-muted-foreground hover:text-foreground" : "text-white hover:text-white"}`} 
                aria-label="Account"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border overflow-hidden ${scrolled || !isHomePage ? "bg-primary/10 border-primary/20" : "bg-white/10 border-white/20"}`}>
                  {user.avatar ? <img src={user.avatar} alt={user.name} /> : <User size={18} className={scrolled || !isHomePage ? "text-primary" : "text-white"} />}
                </div>
              </button>
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-48 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-2">
                  <div className="px-3 py-2 border-b border-border/50 mb-1 text-xs">
                    <p className="font-semibold text-foreground line-clamp-1">{user.name}</p>
                    <p className="text-muted-foreground line-clamp-1">{user.email}</p>
                  </div>
                  <Link to="/account" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted text-sm transition-colors">
                    <User size={16} /> My Account
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-sm font-semibold transition-colors">
                      <LayoutDashboard size={16} /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-destructive/10 hover:text-destructive text-sm transition-colors text-left"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className={`hidden md:block transition-colors ${scrolled || !isHomePage ? "text-muted-foreground hover:text-foreground" : "text-white hover:text-white"}`} 
              aria-label="Login"
            >
              <User size={20} />
            </Link>
          )}

          <button
            className={`md:hidden transition-colors ${scrolled || !isHomePage ? "text-muted-foreground hover:text-foreground" : "text-white hover:text-white"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <ul className="flex flex-col gap-4 px-6 py-6 border-t border-border/50">
              {links.map((link) => (
                <li key={link.label}>
                  {link.label === "Shop" ? (
                    <div className="space-y-4">
                      <Link
                        to={link.href}
                        className="text-base font-medium text-foreground hover:text-primary transition-colors flex items-center justify-between"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                      
                      <div className="pl-4 space-y-3 border-l-2 border-primary/10">
                        <button 
                          onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                          className="flex items-center justify-between w-full text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                        >
                          Shop by Category
                          <motion.div
                            animate={{ rotate: mobileCategoriesOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown size={14} />
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {mobileCategoriesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col gap-3 py-2 pr-2">
                                {categories.map((cat) => (
                                  <Link
                                    key={cat}
                                    to={`/shop?category=${encodeURIComponent(cat)}`}
                                    className="flex items-center justify-between group/cat py-1"
                                    onClick={() => {
                                      setMobileOpen(false);
                                      setMobileCategoriesOpen(false);
                                    }}
                                  >
                                    <span className="text-sm font-medium text-foreground/70 group-hover/cat:text-primary transition-colors">{cat}</span>
                                    <div className="w-1 h-1 rounded-full bg-primary/20 group-hover/cat:bg-primary transition-colors" />
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-base font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              
              <li className="pt-2"></li>
              <li className="pt-4 border-t border-border/50">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/account"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm font-medium"
                      >
                        <User size={16} /> Account
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20"
                        >
                          <LayoutDashboard size={16} /> Admin
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold"
                  >
                    <User size={18} /> Sign In
                  </Link>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    
    {/* Global Search Overlay */}
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-2xl flex flex-col pt-12 md:pt-32 px-6"
        >
          <div className="container mx-auto max-w-4xl relative">
            <button 
              onClick={() => setSearchOpen(false)}
              className="absolute -top-12 md:-top-20 right-0 p-3 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            >
              <X size={24} />
            </button>
            
            <form onSubmit={handleSearch} className="mb-16">
              <div className="relative group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-primary" size={32} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="What can we help you find?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-border focus:border-primary px-12 py-6 text-2xl md:text-5xl font-heading font-medium placeholder:text-muted-foreground/30 focus:outline-none transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold text-sm shadow-xl shadow-primary/20 opacity-0 group-focus-within:opacity-100 transition-all"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Trending Searches</h3>
                <div className="flex flex-wrap gap-3">
                  {trendingSearch.map((term) => (
                    <button 
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        navigate(`/search?q=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="px-5 py-2.5 rounded-full border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="hidden md:block">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Curated Collections</h3>
                <div className="space-y-4">
                  {[
                    { name: "Artisan Living", desc: "Hand-crafted homeware", link: "/collections" },
                    { name: "Gourmet Kitchen", desc: "Ethical kitchen luxury", link: "collections" },
                    { name: "Wellness Rituals", desc: "Mindful self-care sets", link: "/collections" }
                  ].map((col) => (
                    <Link 
                      key={col.name}
                      to={col.link}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <Gift size={18} />
                      </div>
                      <div className="ml-4">
                        <p className="font-bold group-hover:text-primary transition-colors">{col.name}</p>
                        <p className="text-xs text-muted-foreground">{col.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default StickyNav;
