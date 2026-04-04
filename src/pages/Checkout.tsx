import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useAdminData, AdminOrder } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProductImage } from "@/lib/utils";
import { 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  ShoppingBag,
  ShieldCheck,
  Truck,
  Plus,
  Calendar,
  Clock,
  MessageSquare,
  Sparkles,
  Gift,
  Moon
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import { toast } from "sonner";


type CheckoutStep = "shipping" | "payment" | "review";

const TIME_SLOTS = [
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
  "07:00 PM - 08:00 PM",
];

const Checkout = () => {
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const { user } = useAuth();
  const navigate = useNavigate();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
    email: user?.email || "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    isGift: false,
    giftMessage: "",
    deliveryDate: defaultDate,
    deliveryTime: "Standard (9am - 6pm)",
    giftWrap: "None",
  });

  const [shippingTier, setShippingTier] = useState<"standard" | "fixed" | "midnight">("standard");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{code: string, discountPct: number} | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const { addOrder, promos, user: adminUser } = useAdminData();
  const { items, totalPrice, totalItems, clearCart } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    adminUser?.addresses?.find((a: any) => a.is_default)?.id || adminUser?.addresses?.[0]?.id || null
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    adminUser?.payments?.find((p: any) => p.isDefault)?.id || adminUser?.payments?.[0]?.id || null
  );
  
  const [showNewAddressForm, setShowNewAddressForm] = useState(!adminUser?.addresses?.length);
  const [showNewCardForm, setShowNewCardForm] = useState(!adminUser?.payments?.length);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: CheckoutStep) => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === "shipping" && showNewAddressForm) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    }

    if (currentStep === "payment") {
      if (showNewCardForm) {
        if (!formData.cardName.trim()) newErrors.cardName = "Cardholder name is required";
        if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
        if (!formData.expiry.trim()) newErrors.expiry = "Expiry is required";
      }
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step === "shipping") setStep("payment");
      else if (step === "payment") setStep("review");
    } else {
      toast.error("Please fill all required fields", { 
        icon: '⚠️',
        description: "Review highlighted fields to continue."
      });
    }
  };

  const prevStep = () => {
    if (step === "payment") setStep("shipping");
    else if (step === "review") setStep("payment");
  };

  const getShippingCost = () => {
    if (shippingTier === "midnight") return 15.00;
    if (shippingTier === "fixed") return 8.00;
    return 0.00;
  };

  const deliverySurcharge = getShippingCost();
  const wrapSurcharge = formData.giftWrap !== "None" ? 5 : 0;
  const subtotalWithSurcharges = totalPrice + deliverySurcharge + wrapSurcharge;
  const discountAmount = appliedPromo ? (subtotalWithSurcharges * appliedPromo.discountPct) / 100 : 0;
  const finalGrandTotal = subtotalWithSurcharges - discountAmount;

  const handleApplyPromo = () => {
    setPromoError("");
    const promo = promos.find(p => p.code.toUpperCase() === promoInput.toUpperCase() && p.status === "Active");
    if (promo) {
      const pct = parseInt(promo.discount.replace(/[^0-9]/g, ''));
      setAppliedPromo({ code: promo.code, discountPct: pct });
      setPromoInput("");
    } else {
      setPromoError("Invalid or expired code");
    }
  };

  const handlePlaceOrder = async () => {
    const orderId = `#TV-${Math.floor(1000 + Math.random() * 9000)}`;

    const selectedAddress = adminUser?.addresses?.find((a: any) => a.id === selectedAddressId);
    const selectedPayment = adminUser?.payments?.find((p: any) => p.id === selectedPaymentId);

    const paymentMethodDisplay = !showNewCardForm && selectedPayment
      ? `${selectedPayment.type} ending in ${selectedPayment.last4}`
      : `Visa ending in ${formData.cardNumber.slice(-4) || "4242"}`;

    const shippingAddressDisplay = !showNewAddressForm && selectedAddress
      ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.zip}`
      : `${formData.address}, ${formData.city}, ${formData.postalCode}`;

    const newOrder: AdminOrder = {
      id: orderId,
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: "",
        loyalty: user?.role === "admin" ? "Gold Member" : "Standard",
      },
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total: finalGrandTotal,
      status: "Processing",
      type: formData.isGift ? "Gift" : "Personal",
      slot: `${shippingTier === "midnight" ? "Midnight" : shippingTier === "fixed" ? "Fixed-Time" : "Standard"} (${formData.deliveryDate} ${formData.deliveryTime})`,
      items: items.map(item => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        qty: item.quantity,
        sku: `SKU-${item.productId.slice(0, 4).toUpperCase()}`,
        image: item.image,
        personalization: item.personalization
      })),
      shipping: {
        address: shippingAddressDisplay,
        method: shippingTier.charAt(0).toUpperCase() + shippingTier.slice(1),
        carrier: "TofhaVerse Fleet",
        tracking: `TVF-${Math.floor(100000 + Math.random() * 900000)}`
      },
      giftDetails: formData.isGift ? {
        recipient: formData.firstName,
        message: formData.giftMessage,
        wrapStyle: formData.giftWrap,
        slot: `${shippingTier === "midnight" ? "Midnight" : shippingTier === "fixed" ? "Fixed-Time" : "Standard"} (${formData.deliveryDate} ${formData.deliveryTime})`
      } : undefined,
      totals: {
        subtotal: totalPrice,
        tax: 0,
        delivery: deliverySurcharge,
        giftWrap: wrapSurcharge,
        discount: discountAmount,
        grandTotal: finalGrandTotal
      },
      payment: {
        method: paymentMethodDisplay,
        status: "Paid",
        transactionId: `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      },
      timeline: [
        { status: "Order Received", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), location: "TofhaVerse Core", current: false },
        { status: "Processing", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), location: "Artisan Workshop", current: true }
      ]
    };

    setIsVerifying(true);

    setTimeout(async () => {
      try {
        await addOrder(newOrder);
        clearCart();
        setIsVerifying(false);
        navigate("/order-success", { state: { orderId } });
      } catch (error) {
        setIsVerifying(false);
        // Error is already alerted via toast in the context
      }
    }, 2500);
  };

  if (items.length === 0) {
    return (
      <PageTransition>
        <StickyNav />
        <main className="pt-32 pb-20 flex flex-col items-center justify-center min-h-[70vh] px-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8 text-center max-w-sm">
            Add some beautiful gifts to your cart before checking out.
          </p>
          <Link to="/shop">
            <Button className="rounded-full px-8">Continue Shopping</Button>
          </Link>
        </main>
        <FooterSection />
      </PageTransition>
    );
  }

  const steps = [
    { id: "shipping", label: "Shipping", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: ShieldCheck },
  ];

  return (
    <PageTransition>
      <StickyNav />
      
      <AnimatePresence>
        {isVerifying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
          >
            <div className="relative w-24 h-24 mb-8">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full"
               />
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ delay: 0.5, duration: 0.5 }}
                 className="absolute inset-0 flex items-center justify-center"
               >
                 <ShieldCheck size={40} className="text-primary" />
               </motion.div>
            </div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-heading font-bold mb-2"
            >
              Securing Your Request
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground max-w-xs"
            >
              Communicating with our processing partner to finalize your artisanal selection...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-12 bg-background p-6 rounded-3xl border border-border/50 shadow-sm">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const isActive = step === s.id;
                  const isPast = steps.findIndex(x => x.id === step) > i;
                  
                  return (
                    <div key={s.id} className="flex items-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : 
                          isPast ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {isPast ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                        </div>
                        <span className={`text-xs font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {s.label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-12 h-[2px] mx-4 bg-border/50">
                          <div className={`h-full transition-all duration-500 bg-primary ${
                            steps.findIndex(x => x.id === step) > i ? "w-full" : "w-0"
                          }`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {step === "shipping" ? (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Truck size={24} className="text-primary" /> Shipping Details
                      </h2>

                      {/* Saved Addresses Selection */}
                      {adminUser?.addresses?.length > 0 && (
                        <div className="mb-10 space-y-4">
                          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Saved Addresses</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {adminUser.addresses.map((addr: any) => (
                              <button
                                key={addr.id}
                                type="button"
                                onClick={() => {
                                  setSelectedAddressId(addr.id);
                                  setShowNewAddressForm(false);
                                  // Update formData with saved address details for consistency
                                  setFormData(prev => ({
                                    ...prev,
                                    address: addr.street,
                                    city: addr.city,
                                    postalCode: addr.zip || "",
                                    country: addr.country || "United States"
                                  }));
                                }}
                                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                                  selectedAddressId === addr.id && !showNewAddressForm 
                                    ? "border-primary bg-primary/5" 
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                {addr.is_default && (
                                  <span className="absolute top-3 right-3 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Default</span>
                                )}
                                <div className="flex items-start gap-3">
                                  <MapPin size={18} className={selectedAddressId === addr.id && !showNewAddressForm ? "text-primary" : "text-muted-foreground"} />
                                  <div>
                                    <p className="font-bold text-sm">{addr.label || "Home"}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{addr.street}</p>
                                    <p className="text-xs text-muted-foreground">{addr.city}, {addr.zip}</p>
                                  </div>
                                </div>
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                setShowNewAddressForm(true);
                                setSelectedAddressId(null);
                              }}
                              className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                                showNewAddressForm ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                              }`}
                            >
                              <Plus size={20} className={showNewAddressForm ? "text-primary" : "text-muted-foreground"} />
                              <span className="text-xs font-bold uppercase tracking-wider">Add New Address</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {showNewAddressForm && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className={errors.firstName ? "text-destructive" : ""}>First Name</Label>
                            <Input 
                              id="firstName" 
                              value={formData.firstName} 
                              onChange={handleInputChange} 
                              placeholder="John" 
                              className={`rounded-xl h-11 ${errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}`} 
                            />
                            {errors.firstName && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.firstName}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className={errors.lastName ? "text-destructive" : ""}>Last Name</Label>
                            <Input 
                              id="lastName" 
                              value={formData.lastName} 
                              onChange={handleInputChange} 
                              placeholder="Doe" 
                              className={`rounded-xl h-11 ${errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}`} 
                            />
                            {errors.lastName && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.lastName}</p>}
                          </div>
                          <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="address" className={errors.address ? "text-destructive" : ""}>Shipping Address</Label>
                            <Input 
                              id="address" 
                              value={formData.address} 
                              onChange={handleInputChange} 
                              placeholder="123 Main St, Suite 100" 
                              className={`rounded-xl h-11 ${errors.address ? "border-destructive focus-visible:ring-destructive" : ""}`} 
                            />
                            {errors.address && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.address}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city" className={errors.city ? "text-destructive" : ""}>City</Label>
                            <Input 
                              id="city" 
                              value={formData.city} 
                              onChange={handleInputChange} 
                              placeholder="New York" 
                              className={`rounded-xl h-11 ${errors.city ? "border-destructive focus-visible:ring-destructive" : ""}`} 
                            />
                            {errors.city && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.city}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postalCode" className={errors.postalCode ? "text-destructive" : ""}>Postal Code</Label>
                            <Input 
                              id="postalCode" 
                              value={formData.postalCode} 
                              onChange={handleInputChange} 
                              placeholder="10001" 
                              className={`rounded-xl h-11 ${errors.postalCode ? "border-destructive focus-visible:ring-destructive" : ""}`} 
                            />
                            {errors.postalCode && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.postalCode}</p>}
                          </div>
                        </motion.div>
                      )}

                      {!showNewAddressForm && (
                        <div className="p-6 bg-muted/30 rounded-2xl border border-border/50 flex flex-col gap-4">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Confirm Recipient</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName" className={errors.firstName ? "text-destructive" : ""}>First Name</Label>
                              <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Recipient's First Name" className={`rounded-xl h-11 bg-background ${errors.firstName ? "border-destructive" : ""}`} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName" className={errors.lastName ? "text-destructive" : ""}>Last Name</Label>
                              <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Recipient's Last Name" className={`rounded-xl h-11 bg-background ${errors.lastName ? "border-destructive" : ""}`} />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-8 space-y-4">
                        <h3 className="font-bold text-lg">Delivery Method</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { id: "standard", name: "Standard", price: "$0.00", icon: Truck, desc: "3-5 Business Days" },
                            { id: "fixed", name: "Fixed-Time", price: "$8.00", icon: Clock, desc: "Choose your hour" },
                            { id: "midnight", name: "Midnight", price: "$15.00", icon: Moon, desc: "Wait for the magic" },
                          ].map((tier) => (
                            <button
                              key={tier.id}
                              type="button"
                              onClick={() => {
                                setShippingTier(tier.id as any);
                                if (tier.id === "standard") {
                                  setFormData(p => ({ ...p, deliveryTime: "Standard (9am - 6pm)" }));
                                } else if (tier.id === "midnight") {
                                  setFormData(p => ({ ...p, deliveryTime: "Midnight (11:50 PM)" }));
                                } else {
                                  setFormData(p => ({ ...p, deliveryTime: TIME_SLOTS[0] }));
                                }
                              }}
                              className={`p-4 rounded-2xl border-2 text-left transition-all ${shippingTier === tier.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <tier.icon size={20} className={shippingTier === tier.id ? "text-primary" : "text-muted-foreground"} />
                                <span className="text-sm font-bold">{tier.price}</span>
                               </div>
                              <p className="font-bold text-sm">{tier.name}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">{tier.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date & Time Selection Animation */}
                      <AnimatePresence>
                        {shippingTier !== "standard" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="bg-muted/30 p-6 rounded-[2.5rem] border border-border/50 space-y-6 overflow-hidden"
                          >
                             <div className="space-y-3">
                                <Label className="flex items-center gap-2">
                                  <Calendar size={16} className="text-primary" /> Select Delivery Date
                                </Label>
                                <Input 
                                  type="date" 
                                  value={formData.deliveryDate}
                                  onChange={(e) => setFormData(p => ({ ...p, deliveryDate: e.target.value }))}
                                  min={new Date().toISOString().split('T')[0]}
                                  className="rounded-xl h-11 bg-background"
                                />
                             </div>

                             {shippingTier === "fixed" && (
                               <div className="space-y-4">
                                  <Label className="flex items-center gap-2">
                                    <Clock size={16} className="text-primary" /> Select Preferred Time Slot
                                  </Label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {TIME_SLOTS.map((slot) => (
                                      <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, deliveryTime: slot }))}
                                        className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                                          formData.deliveryTime === slot 
                                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                                          : "bg-background border-border hover:border-primary/50 text-muted-foreground"
                                        }`}
                                      >
                                        {slot}
                                      </button>
                                    ))}
                                  </div>
                               </div>
                             )}

                             <div className="p-4 bg-primary/5 rounded-2xl flex gap-3 items-center">
                                <Sparkles size={16} className="text-primary" />
                                <p className="text-xs font-medium text-primary">
                                   Guaranteed delivery on <span className="font-bold underline">{formData.deliveryDate}</span> {shippingTier === "midnight" ? "at Midnight" : `during the ${formData.deliveryTime} slot`}.
                                </p>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="mt-12 pt-8 border-t border-border/50">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-bold flex items-center gap-2">
                            <Gift size={22} className="text-primary" /> Gifting Options
                          </h3>
                          <button 
                            onClick={() => setFormData(p => ({ ...p, isGift: !p.isGift }))}
                            className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 ${formData.isGift ? "bg-primary" : "bg-muted-foreground/20"}`}
                          >
                            <motion.div 
                              animate={{ x: formData.isGift ? 24 : 0 }}
                              className="w-6 h-6 bg-white rounded-full shadow-md shadow-black/10" 
                            />
                          </button>
                        </div>

                        <AnimatePresence>
                          {formData.isGift && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden space-y-8"
                            >
                              <div className="space-y-4">
                                <Label htmlFor="giftMessage" className="flex items-center gap-2">
                                  <MessageSquare size={16} className="text-primary" /> Personal Note
                                </Label>
                                <div className="relative">
                                  <textarea 
                                    id="giftMessage" 
                                    value={formData.giftMessage} 
                                    onChange={(e) => setFormData(p => ({ ...p, giftMessage: e.target.value }))}
                                    placeholder="Write a heartfelt message... (max 200 characters)" 
                                    className="w-full h-32 p-4 rounded-2xl bg-muted/30 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm italic resize-none"
                                    maxLength={200}
                                  />
                                  <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                    {formData.giftMessage.length}/200
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <Label className="flex items-center gap-2">
                                  <Sparkles size={16} className="text-primary" /> Gift Wrapping
                                </Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  {["None", "Matte Black", "Golden Ribbon", "Eco-Friendly"].map((wrap) => (
                                    <button
                                      key={wrap}
                                      onClick={() => setFormData(p => ({ ...p, giftWrap: wrap }))}
                                      className={`p-3 rounded-2xl border-2 text-xs font-bold transition-all ${
                                        formData.giftWrap === wrap 
                                        ? "border-primary bg-primary/5 text-primary" 
                                        : "border-border hover:border-primary/50 text-muted-foreground"
                                      }`}
                                    >
                                      {wrap}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <Button onClick={nextStep} className="w-full mt-10 h-12 rounded-xl group shadow-lg shadow-primary/10">
                        Continue to Payment <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                ) : step === "payment" ? (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <CreditCard size={24} className="text-primary" /> Payment Method
                      </h2>

                      {/* Saved Cards Selection */}
                      {adminUser?.payments?.length > 0 && (
                        <div className="mb-10 space-y-4">
                          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Saved Payment Methods</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {adminUser.payments.map((pm: any) => (
                              <button
                                key={pm.id}
                                type="button"
                                onClick={() => {
                                  setSelectedPaymentId(pm.id);
                                  setShowNewCardForm(false);
                                  // Update formData with saved payment details for consistency
                                  setFormData(prev => ({
                                    ...prev,
                                    cardNumber: `•••• •••• •••• ${pm.last4}`,
                                    expiry: pm.expiry,
                                    cardName: adminUser.name || ""
                                  }));
                                }}
                                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                                  selectedPaymentId === pm.id && !showNewCardForm 
                                    ? "border-primary bg-primary/5" 
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                {pm.isDefault && (
                                  <span className="absolute top-3 right-3 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Default</span>
                                )}
                                <div className="flex items-start gap-3">
                                  <CreditCard size={18} className={selectedPaymentId === pm.id && !showNewCardForm ? "text-primary" : "text-muted-foreground"} />
                                  <div>
                                    <p className="font-bold text-sm uppercase tracking-wider">{pm.type} ending in {pm.last4}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Expires {pm.expiry}</p>
                                  </div>
                                </div>
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                setShowNewCardForm(true);
                                setSelectedPaymentId(null);
                              }}
                              className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                                showNewCardForm ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                              }`}
                            >
                              <Plus size={20} className={showNewCardForm ? "text-primary" : "text-muted-foreground"} />
                              <span className="text-xs font-bold uppercase tracking-wider">Add New Card</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {showNewCardForm ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="cardName" className={errors.cardName ? "text-destructive" : ""}>Name on Card</Label>
                            <Input 
                              id="cardName" 
                              value={formData.cardName} 
                              onChange={handleInputChange} 
                              placeholder="JOHN DOE" 
                              className={`rounded-xl h-11 uppercase font-medium ${errors.cardName ? "border-destructive focus-visible:ring-destructive" : ""}`} 
                            />
                            {errors.cardName && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.cardName}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber" className={errors.cardNumber ? "text-destructive" : ""}>Card Number</Label>
                            <Input 
                              id="cardNumber" 
                              value={formData.cardNumber} 
                              onChange={handleInputChange} 
                              placeholder="0000 0000 0000 0000" 
                              className={`rounded-xl h-11 tracking-[0.2em] font-medium ${errors.cardNumber ? "border-destructive focus-visible:ring-destructive" : ""}`} 
                            />
                            {errors.cardNumber && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.cardNumber}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="expiry" className={errors.expiry ? "text-destructive" : ""}>Expiry Date</Label>
                              <Input 
                                id="expiry" 
                                value={formData.expiry} 
                                onChange={handleInputChange} 
                                placeholder="MM/YY" 
                                className={`rounded-xl h-11 ${errors.expiry ? "border-destructive focus-visible:ring-destructive" : ""}`} 
                              />
                              {errors.expiry && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.expiry}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv" className={errors.cvv ? "text-destructive" : ""}>CVV</Label>
                              <Input 
                                id="cvv" 
                                value={formData.cvv} 
                                onChange={handleInputChange} 
                                placeholder="123" 
                                className={`rounded-xl h-11 ${errors.cvv ? "border-destructive focus-visible:ring-destructive" : ""}`} 
                              />
                              {errors.cvv && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.cvv}</p>}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="p-6 bg-muted/30 rounded-2xl border border-border/50 space-y-4">
                          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Confirm Security Code</p>
                          <div className="max-w-[120px] space-y-2">
                            <Label htmlFor="cvv" className={errors.cvv ? "text-destructive" : ""}>CVV</Label>
                            <Input 
                              id="cvv" 
                              value={formData.cvv} 
                              onChange={handleInputChange} 
                              placeholder="123" 
                              className={`rounded-xl h-11 bg-background ${errors.cvv ? "border-destructive" : ""}`} 
                            />
                            {errors.cvv && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.cvv}</p>}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4 mt-10">
                        <Button variant="outline" onClick={prevStep} className="flex-1 h-12 rounded-xl border-2 font-bold uppercase tracking-widest text-xs">
                          <ArrowLeft className="mr-2" size={16} /> Back
                        </Button>
                        <Button onClick={nextStep} className="flex-[2] h-12 rounded-xl group font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                          Review Order <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <ShieldCheck size={24} className="text-primary" /> Order Review
                      </h2>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 border-b border-border/50">
                          <div>
                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Shipping To</h3>
                            <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
                            {!showNewAddressForm && adminUser?.addresses?.find((a: any) => a.id === selectedAddressId) ? (
                              <>
                                <p className="text-muted-foreground">{adminUser.addresses.find((a: any) => a.id === selectedAddressId).street}</p>
                                <p className="text-muted-foreground">
                                  {adminUser.addresses.find((a: any) => a.id === selectedAddressId).city}, {adminUser.addresses.find((a: any) => a.id === selectedAddressId).zip}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-muted-foreground">{formData.address}</p>
                                <p className="text-muted-foreground">{formData.city}, {formData.postalCode}</p>
                              </>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Payment Method</h3>
                            {!showNewCardForm && adminUser?.payments?.find((p: any) => p.id === selectedPaymentId) ? (
                              <>
                                <p className="font-semibold uppercase tracking-wider">
                                  {adminUser.payments.find((p: any) => p.id === selectedPaymentId).type} Card
                                </p>
                                <p className="text-muted-foreground">Ending in {adminUser.payments.find((p: any) => p.id === selectedPaymentId).last4}</p>
                                <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest mt-1">
                                  Exp: {adminUser.payments.find((p: any) => p.id === selectedPaymentId).expiry}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="font-semibold">Card Ending in {formData.cardNumber.slice(-4) || "••••"}</p>
                                <p className="text-muted-foreground">Exp: {formData.expiry}</p>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Order Items</h3>
                          {items.map((item) => (
                            <div key={item.cartId || item.productId} className="flex items-center gap-4 py-2">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 shadow-sm border border-border/10">
                                <img 
                                  src={getProductImage(item.image)} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover" 
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800";
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                                <div className="mt-1 flex flex-col gap-0.5">
                                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Qty: {item.quantity}</p>
                                  {typeof item.personalization === 'object' && item.personalization !== null && (
                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                                      {(item.personalization as any).monogram && (
                                        <span className="text-[8px] font-bold text-primary uppercase">Monogram: {(item.personalization as any).monogram}</span>
                                      )}
                                      {(item.personalization as any).videoMessage && (
                                        <span className="text-[8px] font-bold text-indigo-500 uppercase">Video Message Included</span>
                                      )}
                                      {(item.personalization as any).waxSeal && (
                                        <span className="text-[8px] font-bold text-amber-600 uppercase">Engraving Applied</span>
                                      )}
                                    </div>
                                  )}
                                  {typeof item.personalization === 'string' && item.personalization !== "N/A" && (
                                    <p className="text-[8px] text-muted-foreground italic font-medium">"{item.personalization}"</p>
                                  )}
                                </div>
                              </div>
                              <p className="font-heading text-sm font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        {formData.isGift && (
                          <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-3">
                            <h3 className="text-sm font-bold text-primary flex items-center gap-2 italic uppercase">
                              <Sparkles size={14} /> Gifting Summary
                            </h3>
                            <div className="space-y-1 text-xs">
                              {formData.giftMessage && <p className="italic text-muted-foreground">"{formData.giftMessage}"</p>}
                              <div className="flex justify-between items-center pt-2">
                                <span className="text-muted-foreground font-medium uppercase tracking-widest">Delivery:</span>
                                <span className="font-bold">{formData.deliveryDate} ({formData.deliveryTime})</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium uppercase tracking-widest">Wrapping:</span>
                                <span className="font-bold">{formData.giftWrap}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 mt-10">
                        <Button variant="outline" onClick={prevStep} className="flex-1 h-12 rounded-xl">
                          <ArrowLeft className="mr-2" /> Back
                        </Button>
                        <Button onClick={handlePlaceOrder} className="flex-[2] h-12 rounded-xl shadow-lg shadow-primary/20">
                          Complete Purchase — ${finalGrandTotal.toFixed(2)}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-[380px]">
              <div className="bg-background p-8 rounded-3xl border border-border/50 shadow-sm sticky top-32">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping ({formData.deliveryTime.split(' (')[0]})</span>
                    <span>{deliverySurcharge > 0 ? `$${deliverySurcharge.toFixed(2)}` : "Free"}</span>
                  </div>
                  {wrapSurcharge > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Gift Wrapping</span>
                      <span>$5.00</span>
                    </div>
                  )}
                  {appliedPromo && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex justify-between text-emerald-600 font-bold"
                    >
                      <span className="flex items-center gap-1"><Sparkles size={14} /> Code: {appliedPromo.code}</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </motion.div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="pt-4 border-t border-border flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${finalGrandTotal.toFixed(2)}</span>
                  </div>

                  {/* Loyalty Points Earning Preview */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Sparkles size={14} className="text-primary" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary leading-none mb-1">Earning Potential</p>
                          <p className="text-sm font-bold">{Math.floor(finalGrandTotal * 10)} TofhaPoints</p>
                       </div>
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">10x Multiplier</div>
                  </motion.div>
                </div>

                {/* Promo Code Input */}
                <div className="mb-6">
                  {!appliedPromo ? (
                    <div className="space-y-2">
                       <div className="flex gap-2">
                          <Input 
                            placeholder="Promo Code" 
                            value={promoInput}
                            onChange={(e) => {
                              setPromoInput(e.target.value);
                              setPromoError("");
                            }}
                            className="rounded-xl h-10 text-xs uppercase" 
                          />
                          <Button 
                            onClick={handleApplyPromo}
                            variant="secondary" 
                            className="rounded-xl h-10 px-4 text-xs font-bold"
                          >
                             Apply
                          </Button>
                       </div>
                       {promoError && <p className="text-[10px] text-rose-500 font-bold ml-1">{promoError}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Active Discount</span>
                          <span className="text-xs font-bold">{appliedPromo.code} Applied</span>
                       </div>
                       <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setAppliedPromo(null)}
                        className="h-8 w-8 rounded-lg text-emerald-700 hover:bg-emerald-100"
                       >
                          ×
                       </Button>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-muted/50 rounded-2xl flex gap-3 text-xs text-muted-foreground">
                  <ShieldCheck size={16} className="text-primary shrink-0" />
                  <p>Your transaction is secure and encrypted. We never store your full payment details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default Checkout;
