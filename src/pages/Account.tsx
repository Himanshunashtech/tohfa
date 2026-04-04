import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ExternalLink,
  CreditCard,
  Bell,
  Calendar,
  Sparkles,
  Trash2,
  Plus,
  CheckCircle2,
  Truck,
  AlertTriangle,
  X,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
  LifeBuoy
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import AccountRewards from "@/components/AccountRewards";
import { useIsMobile } from "@/hooks/use-mobile";

type AccountTab = "profile" | "orders" | "rewards" | "addresses" | "payments" | "occasions" | "support";

const Account = () => {
  const { logout } = useAuth();
  const { 
    user, 
    orders, 
    customers, 
    cancelOrder,
    updateProfile, 
    addAddress, 
    updateAddress, 
    removeAddress, 
    addPayment, 
    removePayment, 
    addOccasion, 
    removeOccasion,
    addReturn,
    updateOrderStatus,
    tickets,
    isLoading
  } = useAdminData();
  
  const userTickets = useMemo(() => 
    tickets.filter((t: any) => t.email === user?.email || t.user_id === user?.id),
    [tickets, user]
  );

  const currentCustomer = customers.find(c => 
    (c.userId && user?.id && c.userId === user.id) || 
    (c.email.toLowerCase() === user?.email?.toLowerCase())
  );
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Form States
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressData, setAddressData] = useState({ label: "", street: "", city: "", state: "", zip: "", isDefault: false });

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({ type: "Visa", last4: "", expiry: "" });

  const [showOccasionForm, setShowOccasionForm] = useState(false);
  const [occasionData, setOccasionData] = useState({ name: "", date: "", type: "Birthday" });
  const userOrders = orders.filter(o => 
    (o.userId && user?.id && o.userId === user.id) || 
    (o.customer.email.toLowerCase() === user?.email?.toLowerCase())
  );
  
  const [activeTab, setActiveTab] = useState<AccountTab | "hub">(() => {
    if (isMobile && !tab) return "hub";
    return (tab as AccountTab) || "profile";
  });

  useEffect(() => {
    if (isMobile && !tab) {
      setActiveTab("hub");
    } else if (tab) {
      setActiveTab(tab as AccountTab);
    }
  }, [tab, isMobile]);
  
  // Cancellation & Return States
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<any>(null);
  const [cancelStep, setCancelStep] = useState<'confirm' | 'reason' | 'success'>('confirm');
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returningOrder, setReturningOrder] = useState<any>(null);
  const [returnStep, setReturnStep] = useState<'reason' | 'success'>('reason');
  const [returnReason, setReturnReason] = useState("");
  const [isReturning, setIsReturning] = useState(false);
  
  useEffect(() => {
    const validTabs: AccountTab[] = ["profile", "orders", "rewards", "addresses", "payments", "occasions", "support"];
    if (tab && validTabs.includes(tab as AccountTab)) {
      setActiveTab(tab as AccountTab);
    }
  }, [tab]);

  const handleTabChange = (newTab: AccountTab | "hub") => {
    setActiveTab(newTab);
    if (newTab === "hub") {
      navigate("/account");
    } else {
      navigate(`/account/${newTab}`);
    }
  };

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileData);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      await updateAddress(editingAddressId, addressData);
      setEditingAddressId(null);
    } else {
      await addAddress(addressData);
    }
    setShowAddressForm(false);
    setAddressData({ label: "", street: "", city: "", state: "", zip: "", isDefault: false });
  };

  const startEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressData({ 
      label: addr.label, 
      street: addr.street_address || addr.street, 
      city: addr.city, 
      state: addr.state, 
      zip: addr.zip_code || addr.zip, 
      isDefault: addr.is_default || addr.isDefault 
    });
    setShowAddressForm(true);
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPayment(paymentData);
    setShowPaymentForm(false);
    setPaymentData({ type: "Visa", last4: "", expiry: "" });
  };

  const handleAddOccasion = (e: React.FormEvent) => {
    e.preventDefault();
    addOccasion(occasionData);
    setShowOccasionForm(false);
    setOccasionData({ name: "", date: "", type: "Birthday" });
  };

  const openCancelModal = (order: any) => {
    setCancellingOrder(order);
    setCancelStep('confirm');
    setCancelReason("");
    setIsCancelModalOpen(true);
  };

  const handleCancelSubmit = async () => {
    if (!cancellingOrder) return;
    setIsCancelling(true);
    try {
      await cancelOrder(cancellingOrder.rawId, cancelReason);
      setCancelStep('success');
    } catch (e) {
      console.error(e);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReturnSubmit = async () => {
    if (!returningOrder) return;
    setIsReturning(true);
    try {
      const returnRequest = {
        return_number: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
        order_id: returningOrder.id,
        raw_order_id: returningOrder.rawId,
        user_id: user?.id,
        user_email: user?.email,
        reason: returnReason,
        status: "Pending Review"
      };
      
      await addReturn(returnRequest);
      await updateOrderStatus(returningOrder.rawId, "Return Requested");
      setReturnStep('success');
    } catch (e) {
      console.error(e);
    } finally {
      setIsReturning(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "rewards", label: "Rewards", icon: Sparkles },
    { id: "occasions", label: "Occasions", icon: Calendar },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "support", label: "Support Tickets", icon: LifeBuoy },
  ];

  return (
    <PageTransition title="My Account" description="Manage your profile, orders, and addresses.">
      <StickyNav />
      <main className="pt-32 pb-20 bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-6xl px-6">
          <Breadcrumbs />
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar - Hidden on mobile if a tab is active */}
            {!isMobile && (
              <aside className="w-full md:w-64 space-y-2">
                <div className="bg-background p-6 rounded-3xl border border-border/50 shadow-sm mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User size={24} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground line-clamp-1">{user?.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{user?.email}</p>
                  </div>
                </div>

                {tabs.map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleTabChange(t.id as AccountTab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                        isActive 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10 font-semibold" 
                        : "bg-background text-muted-foreground hover:bg-accent hover:text-foreground border border-border/50"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{t.label}</span>
                      {isActive && <ChevronRight size={16} className="ml-auto" />}
                    </button>
                  );
                })}

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-background text-destructive hover:bg-destructive/10 transition-all duration-200 border border-border/50 mt-8"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </aside>
            )}

            {/* Content Area */}
            <div className="flex-1">
              {/* Mobile Mobile Back Button & Title */}
              {isMobile && activeTab !== "hub" && (
                <div className="flex items-center gap-4 mb-6">
                  <button 
                    onClick={() => handleTabChange("hub")}
                    className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center text-foreground shadow-sm active:scale-95 transition-transform"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h2 className="text-xl font-bold">
                    {tabs.find(t => t.id === activeTab)?.label || "Account"}
                  </h2>
                </div>
              )}

              <AnimatePresence mode="wait">
                {isMobile && activeTab === "hub" ? (
                  <motion.div
                    key="hub"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Compact Profile Card */}
                    <div className="bg-background p-6 rounded-[2.5rem] border border-border/50 shadow-sm flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                        <User size={28} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg font-bold text-foreground line-clamp-1">{user?.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{user?.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {tabs.map((t) => {
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.id}
                            onClick={() => handleTabChange(t.id as AccountTab)}
                            className="bg-background p-6 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex flex-col items-start gap-4 text-left group"
                          >
                            <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              <Icon size={20} />
                            </div>
                            <span className="font-bold text-sm">{t.label}</span>
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={logout}
                        className="col-span-2 bg-destructive/5 p-6 rounded-[2rem] border border-destructive/10 shadow-sm flex items-center justify-between group active:scale-[0.99] transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive group-hover:bg-destructive group-hover:text-white transition-colors">
                            <LogOut size={20} />
                          </div>
                          <span className="font-bold text-sm text-destructive">Logout</span>
                        </div>
                        <ArrowRight size={18} className="text-destructive/50 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* Support card */}
                    <div className="p-6 rounded-[2.5rem] bg-muted/30 border border-border/20 flex flex-col items-center text-center">
                       <h4 className="font-bold mb-1">Need help?</h4>
                       <p className="text-xs text-muted-foreground mb-4">Our support team is here for you 24/7</p>
                       <div className="flex gap-3 w-full">
                         <Button 
                           variant="outline" 
                           onClick={() => handleTabChange("support")}
                           className="flex-1 rounded-2xl border-primary/20 text-primary hover:bg-primary/5 h-12"
                         >
                            My Tickets
                         </Button>
                         <Link to="/support" className="flex-1">
                           <Button className="w-full rounded-2xl h-12 shadow-sm">Raise New</Button>
                         </Link>
                       </div>
                    </div>
                  </motion.div>
                ) : activeTab === "profile" ? (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold">Profile Settings</h2>
                      <div className="p-2 bg-muted rounded-full text-muted-foreground">
                        <Settings size={20} />
                      </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input 
                          id="name" 
                          value={profileData.name} 
                          onChange={(e) => setProfileData(p => ({ ...p, name: e.target.value }))}
                          className="rounded-xl h-11" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profileData.email} 
                          disabled
                          className="rounded-xl h-11 bg-muted/50" 
                        />
                        <p className="text-[10px] text-muted-foreground italic">Email change is disabled for security</p>
                      </div>
                      <div className="md:col-span-2 pt-4">
                        <Button type="submit" className="rounded-xl px-8 h-11">Save Changes</Button>
                      </div>
                    </form>

                    {userOrders.length >= 3 && (
                      <div className="mt-8 p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                               <Sparkles size={24} />
                            </div>
                            <div>
                               <p className="font-bold text-amber-900">Elite Member Status</p>
                               <p className="text-xs text-amber-700">You've unlocked exclusive 5% cashback on all gifts!</p>
                            </div>
                         </div>
                         <Link to="/rewards">
                            <Button variant="outline" className="rounded-xl h-9 text-xs border-amber-200 text-amber-700 hover:bg-amber-100">View Rewards</Button>
                         </Link>
                      </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-border/50">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Bell size={18} className="text-primary" /> Notifications
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/10">
                          <div>
                            <p className="text-sm font-semibold">Order Updates</p>
                            <p className="text-xs text-muted-foreground">Get notified about your shipment and delivery</p>
                          </div>
                          <div className="w-10 h-6 bg-primary rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/10">
                          <div>
                            <p className="text-sm font-semibold">Exclusive Offers</p>
                            <p className="text-xs text-muted-foreground">New collections and seasonal discounts</p>
                          </div>
                          <div className="w-10 h-6 bg-muted-foreground/20 rounded-full relative">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : activeTab === "orders" ? (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold">Order History</h2>
                      <span className="text-sm text-muted-foreground">{userOrders.length} orders found</span>
                    </div>

                    {userOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className={`bg-background rounded-3xl border border-border/50 shadow-sm overflow-hidden transition-all duration-300 ${
                          order.status === "Cancelled" ? "opacity-75 grayscale-[0.3]" : ""
                        }`}
                      >
                        <div className="p-6 border-b border-border/10 flex items-center justify-between bg-muted/10">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Package size={20} className="text-primary" />
                            </div>
                            <div>
                               <p className={`font-bold text-sm ${order.status === "Cancelled" ? "line-through text-muted-foreground" : ""}`}>Order {order.id}</p>
                               <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{order.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Total</p>
                              <p className={`font-bold text-sm tracking-tight ${order.status === "Cancelled" ? "line-through text-destructive" : ""}`}>
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary">
                              <ExternalLink size={14} />
                            </Button>
                          </div>
                        </div>

                        <div className="p-8">
                          <div className="relative mb-12">
                            {/* Track Line */}
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-muted -translate-y-1/2 z-0" />
                            <div 
                              className={`absolute top-1/2 left-0 h-[2px] -translate-y-1/2 z-0 transition-all duration-1000 ${
                                order.status === "Cancelled" ? "bg-destructive" : "bg-primary"
                              }`}
                              style={{ 
                                width: order.status === "Cancelled" ? "100%" :
                                       order.status === "Delivered" ? "100%" : 
                                       order.status === "Shipped" ? "75%" : 
                                       order.status === "Processing" ? "50%" : "25%" 
                              }}
                            />

                            {/* Track Points */}
                            <div className="relative z-10 flex justify-between items-center px-2">
                              {(order.status === "Cancelled" ? [
                                { label: "Placed", icon: CheckCircle2, done: true },
                                { label: "Cancelled", icon: X, done: true, isDestructive: true }
                              ] : [
                                { label: "Placed", icon: CheckCircle2, done: true },
                                { label: "Processing", icon: Settings, done: ["Processing", "Shipped", "Delivered"].includes(order.status) },
                                { label: "Shipped", icon: Truck, done: ["Shipped", "Delivered"].includes(order.status) },
                                { label: "Delivered", icon: MapPin, done: order.status === "Delivered" }
                              ]).map((step, i) => (
                                <div key={i} className="flex flex-col items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-background transition-colors ${
                                    step.done 
                                      ? (step.isDestructive ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground") 
                                      : "bg-muted text-muted-foreground"
                                  }`}>
                                    <step.icon size={16} />
                                  </div>
                                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                    step.done 
                                      ? (step.isDestructive ? "text-destructive" : "text-foreground") 
                                      : "text-muted-foreground"
                                  }`}>
                                    {step.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/5">
                            <div className="flex -space-x-4">
                              {order.items.slice(0, 3).map((item, i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-muted overflow-hidden shadow-sm group relative">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                  />
                                  {order.items.length > 3 && i === 2 && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold">
                                      +{order.items.length - 2}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-3">
                              {order.status === "Processing" && (
                                <button 
                                  onClick={() => openCancelModal(order)}
                                  className="text-[10px] uppercase font-bold tracking-widest text-destructive hover:underline"
                                >
                                  Cancel Order
                                </button>
                              )}
                              <Link to={`/track/${order.id.replace('#', '')}`}>
                                <Button variant="outline" size="sm" className="rounded-full text-[10px] uppercase font-bold tracking-widest h-8 px-4 border-primary/20 text-primary hover:bg-primary/5">
                                  Track Journey
                                </Button>
                              </Link>
                              {order.status === "Delivered" && (
                                <Button 
                                  onClick={() => {
                                    setReturningOrder(order);
                                    setReturnStep('reason');
                                    setReturnReason("");
                                    setIsReturnModalOpen(true);
                                  }}
                                  variant="outline" 
                                  size="sm" 
                                  className="rounded-full text-[10px] uppercase font-bold tracking-widest h-8 px-4 border-secondary/20 text-secondary hover:bg-secondary/5"
                                >
                                  Initiate Return
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {userOrders.length === 0 && (
                      <div className="text-center py-20 bg-background rounded-3xl border border-dashed border-border/50">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                          <Package size={32} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-8">When you buy something, it will appear here.</p>
                        <Button onClick={() => navigate('/shop')} className="rounded-full px-8">Start Shopping</Button>
                      </div>
                    )}
                  </motion.div>
                ) : activeTab === "rewards" ? (
                  currentCustomer ? (
                    <motion.div
                      key="rewards"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <AccountRewards customer={currentCustomer} />
                    </motion.div>
                  ) : isLoading ? (
                    <motion.div className="py-20 text-center bg-background rounded-3xl border border-border/10">
                       <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                       <p className="text-sm font-bold text-muted-foreground italic">Synchronizing rewards cluster...</p>
                    </motion.div>
                  ) : (
                    <motion.div className="py-20 text-center bg-background rounded-3xl border border-border/10">
                       <Sparkles size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                       <h3 className="text-xl font-bold mb-2">Rewards Program</h3>
                       <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8">You're not currently enrolled in our loyalty program. Shop to earn points!</p>
                       <Button onClick={() => navigate('/shop')} className="rounded-xl px-8 h-12">Start Earning</Button>
                    </motion.div>
                  )
                ) : activeTab === "addresses" ? (
                  <motion.div
                    key="addresses"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold">Saved Addresses</h2>
                      <Button 
                        variant={showAddressForm ? "ghost" : "outline"} 
                        onClick={() => {
                          setShowAddressForm(!showAddressForm);
                          setEditingAddressId(null);
                          setAddressData({ label: "", street: "", city: "", state: "", zip: "", isDefault: false });
                        }}
                        className="rounded-xl text-xs h-9"
                      >
                        {showAddressForm ? "Cancel" : "Add New"}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {showAddressForm && (
                        <motion.form 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          onSubmit={handleAddressSubmit}
                          className="grid grid-cols-2 gap-4 mb-10 p-6 bg-muted/20 rounded-2xl border border-border/10 overflow-hidden"
                        >
                          <div className="col-span-2 space-y-2">
                            <Label>Label (e.g. Home, Work)</Label>
                            <Input required value={addressData.label} onChange={e => setAddressData({...addressData, label: e.target.value})} />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <Label>Street Address</Label>
                            <Input required value={addressData.street} onChange={e => setAddressData({...addressData, street: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <Label>City</Label>
                            <Input required value={addressData.city} onChange={e => setAddressData({...addressData, city: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label>State</Label>
                              <Input required value={addressData.state} onChange={e => setAddressData({...addressData, state: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                              <Label>ZIP</Label>
                              <Input required value={addressData.zip} onChange={e => setAddressData({...addressData, zip: e.target.value})} />
                            </div>
                          </div>
                          <Button type="submit" className="col-span-2 rounded-xl mt-2">
                            {editingAddressId ? "Update Address" : "Save Address"}
                          </Button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {user?.addresses?.map((addr: any) => (
                        <div key={addr.id} className={`p-6 rounded-3xl border-2 transition-all relative ${addr.is_default ? "border-primary/20 bg-primary/5" : "border-border/50 hover:border-primary/10"}`}>
                          {addr.is_default && (
                            <div className="absolute top-4 right-4">
                              <span className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase">Default</span>
                            </div>
                          )}
                          <h3 className="font-bold mb-2">{addr.label}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {addr.street_address || addr.street}<br />
                            {addr.city}, {addr.state} {addr.zip_code || addr.zip}
                          </p>
                          <div className="mt-4 flex gap-3">
                            <button 
                              onClick={() => startEditAddress(addr)}
                              className="text-xs font-semibold text-primary hover:underline"
                            >
                               Edit
                            </button>
                            <button 
                              onClick={() => removeAddress(addr.id)}
                              className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}

                      {user?.addresses.length === 0 && !showAddressForm && (
                        <div className="col-span-full py-12 text-center border border-dashed border-border/50 rounded-[2rem]">
                          <p className="text-muted-foreground text-sm italic">No addresses saved yet.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : activeTab === "payments" ? (
                  <motion.div
                    key="payments"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm"
                  >
                    <h2 className="text-2xl font-bold mb-8">Payment Methods</h2>
                    
                    <div className="space-y-4">
                      {user?.payments?.map((card: any) => (
                        <div key={card.id} className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 hover:border-primary/10 transition-colors">
                          <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                            <CreditCard size={20} className="text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{card.type} ending in {card.last4}</p>
                            <p className="text-xs text-muted-foreground">Expires {card.expiry}</p>
                          </div>
                          <button 
                            onClick={() => removePayment(card.id)}
                            className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors px-2 py-1"
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      {showPaymentForm ? (
                        <motion.form 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          onSubmit={handleAddPayment}
                          className="p-6 bg-muted/20 rounded-2xl border border-border/10 space-y-4 overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Card Type</Label>
                              <select 
                                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm"
                                value={paymentData.type}
                                onChange={e => setPaymentData({...paymentData, type: e.target.value})}
                              >
                                <option>Visa</option>
                                <option>Mastercard</option>
                                <option>Amex</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label>Last 4 Digits</Label>
                              <Input maxLength={4} required value={paymentData.last4} onChange={e => setPaymentData({...paymentData, last4: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                              <Label>Expiry (MM/YY)</Label>
                              <Input placeholder="12/25" required value={paymentData.expiry} onChange={e => setPaymentData({...paymentData, expiry: e.target.value})} />
                            </div>
                            <div className="flex items-end">
                              <Button type="submit" className="w-full rounded-xl">Save Card</Button>
                            </div>
                          </div>
                          <Button variant="ghost" type="button" onClick={() => setShowPaymentForm(false)} className="w-full text-xs h-8">Cancel</Button>
                        </motion.form>
                      ) : (
                        <Button 
                          variant="outline" 
                          onClick={() => setShowPaymentForm(true)}
                          className="w-full h-12 rounded-xl mt-4 border-dashed border-2 hover:border-primary/30 hover:bg-primary/5 transition-all"
                        >
                          <Plus size={16} className="mr-2" /> Add New Payment Method
                        </Button>
                      )}

                      {user?.payments.length === 0 && !showPaymentForm && (
                        <div className="py-8 text-center bg-muted/5 rounded-2xl border border-dashed border-border/40">
                          <p className="text-xs text-muted-foreground italic">No payment methods saved.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : activeTab === "occasions" ? (
                  <motion.div
                    key="occasions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-bold">Occasions Calendar</h2>
                          <p className="text-sm text-muted-foreground">We'll remind you to send love on these special days.</p>
                        </div>
                        <Button 
                          variant={showOccasionForm ? "ghost" : "default"}
                          onClick={() => setShowOccasionForm(!showOccasionForm)}
                          className="rounded-xl px-6 h-11 flex items-center gap-2"
                        >
                          {showOccasionForm ? "Cancel" : <><Plus size={18} /> Add Occasion</>}
                        </Button>
                      </div>

                      <AnimatePresence>
                        {showOccasionForm && (
                          <motion.form 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            onSubmit={handleAddOccasion}
                            className="bg-muted/20 p-6 rounded-[2rem] border border-border/10 mb-8 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Whose Day? (e.g. Mom's Birthday)</Label>
                                <Input required value={occasionData.name} onChange={e => setOccasionData({...occasionData, name: e.target.value})} />
                              </div>
                              <div className="space-y-2">
                                <Label>When? (e.g. May 12)</Label>
                                <Input required placeholder="Month Day" value={occasionData.date} onChange={e => setOccasionData({...occasionData, date: e.target.value})} />
                              </div>
                              <div className="space-y-2">
                                <Label>Type</Label>
                                <select 
                                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm"
                                  value={occasionData.type}
                                  onChange={e => setOccasionData({...occasionData, type: e.target.value})}
                                >
                                  <option>Birthday</option>
                                  <option>Anniversary</option>
                                  <option>Graduation</option>
                                  <option>Other</option>
                                </select>
                              </div>
                              <Button type="submit" className="sm:col-start-3 rounded-xl">Save Occasion</Button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      <div className="space-y-4">
                        {user?.occasions.map((occ) => (
                          <div key={occ.id} className="flex items-center justify-between p-6 rounded-3xl border border-border/50 hover:border-primary/30 transition-all group">
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-bold uppercase text-primary leading-none">{occ.date.split(' ')[0]}</span>
                                <span className="text-xl font-bold text-foreground leading-none">{occ.date.split(' ')[1]}</span>
                              </div>
                              <div>
                                <p className="font-bold text-lg">{occ.name}</p>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-muted/50 text-muted-foreground`}>
                                  {occ.type}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
                                <Bell size={18} />
                              </Button>
                              <Button 
                                onClick={() => removeOccasion(occ.id)}
                                variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 size={18} />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {user?.occasions.length === 0 && !showOccasionForm && (
                          <div className="py-20 text-center bg-muted/5 rounded-[2.5rem] border border-dashed border-border/40">
                            <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground italic">No special dates in your calendar yet.</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-12 p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Sparkles size={32} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 italic">Never Miss a Moment</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                          Sign up for AI reminders and we'll send you curated gift recommendations 7 days before each occasion.
                        </p>
                        <Button variant="link" className="text-primary font-bold mt-2">Activate AI Reminders</Button>
                      </div>
                    </div>
                  </motion.div>
                ) : activeTab === "support" ? (
                  <motion.div
                    key="support"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                       <h2 className="text-2xl font-bold">Support Tickets</h2>
                       <Link to="/support">
                         <Button variant="outline" className="rounded-full shadow-sm gap-2 bg-background border-primary/20 text-primary h-9 text-xs">
                           <Plus size={14} /> New Request
                         </Button>
                       </Link>
                    </div>

                    {userTickets.length === 0 ? (
                      <div className="text-center py-20 bg-background rounded-3xl border border-dashed border-border/50">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                          <LifeBuoy size={32} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No active tickets</h3>
                        <p className="text-muted-foreground mb-8">If you've raised any support requests, they will appear here.</p>
                        <Link to="/support">
                          <Button className="rounded-full px-8">Contact Support</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userTickets.map((ticket, i) => (
                          <motion.div
                            key={ticket.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm group hover:shadow-md transition-all border-l-4 border-l-primary"
                          >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                               <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                     <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                       {ticket.ticket_number || ticket.id?.slice(0, 8)}
                                     </span>
                                     <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1.5 ${
                                        ticket.status === 'Open' ? 'bg-amber-500/10 text-amber-500' : 
                                        ticket.status === 'Replied' ? 'bg-primary/10 text-primary' : 
                                        'bg-emerald-500/10 text-emerald-500'
                                     }`}>
                                        {ticket.status}
                                     </span>
                                  </div>
                                  <h4 className="font-bold group-hover:text-primary transition-colors">{ticket.subject}</h4>
                                  <p className="text-xs text-muted-foreground line-clamp-1">{ticket.message}</p>
                               </div>
                               
                               <div className="flex flex-row md:flex-col md:items-end justify-between md:justify-center gap-4">
                                  <Link to={`/support/ticket/${ticket.id}`} className="w-full md:w-auto">
                                     <Button variant="ghost" size="sm" className="rounded-xl w-full h-10 border border-border/50 group-hover:bg-primary group-hover:text-white transition-all text-xs font-bold">
                                        View <ArrowRight size={14} className="ml-2" />
                                     </Button>
                                  </Link>
                               </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground italic">Tab content not found.</p>
                  </div>
                )}
              </AnimatePresence>

              {/* Cancellation Questionnaire Modal */}
              <AnimatePresence>
                {isCancelModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => !isCancelling && setIsCancelModalOpen(false)}
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />
                    <motion.div 
                      key={cancelStep}
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      className="relative w-full max-w-md bg-background rounded-[2.5rem] border border-border/50 shadow-2xl overflow-hidden p-8"
                    >
                      {cancelStep === 'confirm' && (
                        <div className="space-y-6 text-center">
                          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
                            <AlertTriangle size={32} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-2">Cancel Order?</h3>
                            <p className="text-muted-foreground">Are you sure you want to cancel order <span className="font-bold text-foreground">{cancellingOrder?.id}</span>?</p>
                          </div>
                          <div className="flex gap-4">
                            <Button variant="outline" className="flex-1 rounded-2xl h-12" onClick={() => setIsCancelModalOpen(false)}>No, Keep It</Button>
                            <Button variant="destructive" className="flex-1 rounded-2xl h-12" onClick={() => setCancelStep('reason')}>Yes, Cancel</Button>
                          </div>
                        </div>
                      )}

                      {cancelStep === 'reason' && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">Quick Feedback</h3>
                            <button onClick={() => setIsCancelModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                              <X size={20} />
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground">Help us improve! Why are you cancelling this order?</p>
                          
                          <div className="space-y-3">
                            {[
                              "Found a better price elsewhere",
                              "Changed my mind / Not needed",
                              "Delivery time is too long",
                              "Ordered by mistake",
                              "Shipping cost too high",
                              "Other reason"
                            ].map((reason) => (
                              <button
                                key={reason}
                                onClick={() => setCancelReason(reason)}
                                className={`w-full text-left p-4 rounded-2xl border-2 transition-all text-sm font-medium ${
                                  cancelReason === reason 
                                    ? "border-primary bg-primary/5 text-primary" 
                                    : "border-border/50 hover:border-primary/20 hover:bg-muted/30"
                                }`}
                              >
                                {reason}
                              </button>
                            ))}
                          </div>

                          <Button 
                            disabled={!cancelReason || isCancelling} 
                            onClick={handleCancelSubmit}
                            className="w-full rounded-2xl h-14 font-bold flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
                          >
                            {isCancelling ? "Processing..." : <>Confirm Cancellation <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                          </Button>
                        </div>
                      )}

                      {cancelStep === 'success' && (
                        <div className="space-y-6 text-center py-4">
                          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                            <CheckCircle2 size={32} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-2">Order Cancelled</h3>
                            <p className="text-muted-foreground">Successfully cancelled {cancellingOrder?.id}. Your refund (if applicable) will be processed shortly.</p>
                          </div>
                          <Button className="w-full rounded-2xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setIsCancelModalOpen(false)}>Done</Button>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Return Questionnaire Modal */}
              <AnimatePresence>
                {isReturnModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => !isReturning && setIsReturnModalOpen(false)}
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />
                    <motion.div 
                      key={returnStep}
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      className="relative w-full max-w-md bg-background rounded-[2.5rem] border border-border/50 shadow-2xl overflow-hidden p-8"
                    >
                      {returnStep === 'reason' && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                                  <RefreshCw size={20} />
                               </div>
                               <h3 className="text-xl font-bold font-heading italic">Initiate Return</h3>
                            </div>
                            <button onClick={() => setIsReturnModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                              <X size={20} />
                            </button>
                          </div>
                          
                          <div>
                             <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Select Return Reason</p>
                             <div className="space-y-3">
                               {[
                                 "Damaged on arrival",
                                 "Incorrect item received",
                                 "Not as described / Dissatisfied",
                                 "Quality issue",
                                 "Ordered by mistake / Change of mind"
                               ].map((reason) => (
                                 <button
                                   key={reason}
                                   onClick={() => setReturnReason(reason)}
                                   className={`w-full text-left p-4 rounded-2xl border-2 transition-all text-sm font-medium ${
                                     returnReason === reason 
                                       ? "border-secondary bg-secondary/5 text-secondary" 
                                       : "border-border/50 hover:border-secondary/20 hover:bg-muted/30"
                                   }`}
                                 >
                                   {reason}
                                 </button>
                               ))}
                             </div>
                          </div>

                          <Button 
                            disabled={!returnReason || isReturning} 
                            onClick={handleReturnSubmit}
                            className="w-full rounded-2xl h-14 font-bold flex items-center justify-center gap-2 group shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 text-white"
                          >
                            {isReturning ? "Processing Request..." : <>Submit Return Request <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                          </Button>
                        </div>
                      )}

                      {returnStep === 'success' && (
                        <div className="space-y-6 text-center py-4">
                          <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                            <CheckCircle2 size={40} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold font-heading mb-2 italic">Request Received</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed px-4">
                              Your return request for {returningOrder?.id} is being reviewed. You'll receive a confirmation email with next steps shortly.
                            </p>
                          </div>
                          <Button className="w-full rounded-2xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={() => setIsReturnModalOpen(false)}>Done</Button>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default Account;
