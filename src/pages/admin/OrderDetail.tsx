import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Printer, 
  Mail, 
  Trash2, 
  ChevronRight, 
  Truck, 
  Package, 
  Gift, 
  MapPin, 
  CreditCard, 
  Clock,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/context/AdminDataContext";
import { useGetOrderTimelineQuery } from "@/store/api/supabaseApi";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const { orders, updateOrderStatus, addMilestone, cancelOrder } = useAdminData();

  const order = orders.find(o => o.id.replace('#', '') === id?.replace('#', '') || o.id === id);
  
  const { data: rawTimeline = [], isLoading: timelineLoading } = useGetOrderTimelineQuery(order?.rawId || "", {
    skip: !order?.rawId
  });

  // Map timeline for UI
  const timeline = rawTimeline.map(t => ({
    status: t.status,
    location: t.location,
    description: t.description,
    time: new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    current: t.is_current
  }));

  const [milestoneForm, setMilestoneForm] = useState({ 
    status: "", 
    location: "", 
    description: "" 
  });

  const [fulfillment, setFulfillment] = useState({
    carrier: order?.shipping.carrier || "TofhaVerse Fleet",
    tracking: order?.shipping.tracking || ""
  });

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <h2 className="text-xl font-bold">Order not found</h2>
        <Link to="/admin/orders">
           <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const handleShip = () => {
    addMilestone(order.rawId, {
      status: "Shipped",
      location: "Distribution Hub",
      description: `Order shipped via ${fulfillment.carrier}. Tracking: ${fulfillment.tracking}`,
      carrier: fulfillment.carrier,
      tracking: fulfillment.tracking
    });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.status) return;
    addMilestone(order.rawId, milestoneForm);
    setMilestoneForm({ status: "", location: "", description: "" });
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/orders">
            <Button variant="ghost" size="icon" className="rounded-xl border border-border/50">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-heading font-bold">{order.id}</h1>
              <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                order.status === "Delivered" ? "bg-emerald-100 text-emerald-600" :
                order.status === "Shipped" ? "bg-blue-100 text-blue-600" :
                order.status === "Cancelled" ? "bg-rose-100 text-rose-600" :
                "bg-amber-100 text-amber-600"
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Placed on {order.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => cancelOrder(order.rawId)}
            disabled={order.status === "Shipped" || order.status === "Delivered" || order.status === "Cancelled"}
            className="rounded-xl gap-2 h-11 border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 size={16} /> {order.status === "Cancelled" ? "Cancelled" : "Cancel Order"}
          </Button>
          <Button variant="outline" className="rounded-xl gap-2 h-11 shrink-0">
            <Printer size={16} /> Print Invoice
          </Button>
          <Button 
            onClick={handleShip}
            disabled={order.status !== "Processing"}
            className="rounded-xl gap-2 h-11 px-6 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all font-bold"
          >
            <Package size={16} /> {order.status === "Processing" ? "Ship Items" : order.status}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Order Items */}
          <div className="bg-background rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-border/50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Package size={20} className="text-primary" /> Items Ordered
              </h2>
            </div>
            <div className="p-0">
               <table className="w-full text-left">
                  <thead className="bg-muted/10 border-b border-border/10">
                    <tr className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                      <th className="px-8 py-4">Product Details</th>
                      <th className="px-8 py-4 text-center">Quantity</th>
                      <th className="px-8 py-4 text-right">Unit Price</th>
                      <th className="px-8 py-4 text-right">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {order.items.map((item) => (
                      <tr key={item.id} className="group hover:bg-muted/5 transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex gap-4">
                              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted group-hover:scale-105 transition-transform">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col justify-center">
                                 <p className="font-bold text-sm leading-tight mb-1">{item.name}</p>
                                  <div className="mt-2 space-y-1">
                                    {typeof item.personalization === 'string' && item.personalization !== "N/A" ? (
                                      <p className="text-[10px] text-muted-foreground font-medium italic">"{item.personalization}"</p>
                                    ) : typeof item.personalization === 'object' && item.personalization !== null ? (
                                      <>
                                        {(item.personalization as any).monogram && (
                                          <p className="text-[10px] font-bold text-primary flex items-center gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-primary" /> Monogram: {(item.personalization as any).monogram}
                                          </p>
                                        )}
                                        {(item.personalization as any).videoMessage && (
                                          <p className="text-[10px] font-bold text-indigo-500 flex items-center gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-indigo-500" /> Video Message Included
                                          </p>
                                        )}
                                        {(item.personalization as any).waxSeal && (
                                          <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-amber-600" /> Signature Engraving Applied
                                          </p>
                                        )}
                                      </>
                                    ) : (
                                      <p className="text-[10px] text-muted-foreground italic">No personalization</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                     <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-bold uppercase tracking-widest">{item.sku}</span>
                                  </div>
                               </div>
                            </div>
                         </td>
                        <td className="px-8 py-6 text-sm font-bold text-center">x{item.qty}</td>
                        <td className="px-8 py-6 text-sm font-medium text-right">${item.price.toFixed(2)}</td>
                        <td className="px-8 py-6 text-sm font-bold text-right">${(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>

          {/* Logistics & Gifting Integration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Gifting Instructions */}
            <div className="bg-background rounded-[2.5rem] border border-border/50 shadow-sm p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Gift size={20} className="text-primary" /> Gift Package Details
                </h2>
                <div className="space-y-6">
                  {order.giftDetails ? (
                    <>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Recipient Name</p>
                        <p className="font-bold text-sm">{order.giftDetails.recipient}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Personal Message</p>
                        <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl relative">
                           <p className="text-xs italic text-muted-foreground leading-relaxed">"{order.giftDetails.message}"</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border/10">
                         <div className="flex flex-col">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Wrapping Style</p>
                            <p className="text-xs font-semibold">{order.giftDetails.wrapStyle}</p>
                         </div>
                         <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                            <Gift size={18} className="text-muted-foreground" />
                         </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic py-10 text-center">No gift instructions provided.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery & Tracking */}
            <div className="bg-background rounded-[2.5rem] border border-border/50 shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Truck size={20} className="text-primary" /> Delivery Logistics
              </h2>
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/10 flex items-center justify-between">
                   <div className="flex flex-col">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Delivery Slot</p>
                      <p className="text-xs font-bold text-primary">{order.slot}</p>
                   </div>
                   <Clock size={18} className="text-primary" />
                </div>
                
                <div className="space-y-4">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Carrier Information</p>
                   {order.status === "Processing" ? (
                     <div className="space-y-3">
                        <select 
                          className="w-full h-10 bg-muted/20 border border-border/10 rounded-xl px-4 text-xs appearance-none"
                          value={fulfillment.carrier}
                          onChange={e => setFulfillment({...fulfillment, carrier: e.target.value})}
                        >
                           <option>TofhaVerse Fleet</option>
                           <option>FedEx Priority</option>
                           <option>DHL Express</option>
                           <option>BlueDart Premium</option>
                        </select>
                        <input 
                          placeholder="Tracking ID"
                          className="w-full h-10 bg-muted/20 border border-border/10 rounded-xl px-4 text-xs font-mono"
                          value={fulfillment.tracking}
                          onChange={e => setFulfillment({...fulfillment, tracking: e.target.value})}
                        />
                     </div>
                   ) : (
                     <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-xs">{order.shipping.carrier}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded font-bold">Active</span>
                        </div>
                        <div className="flex items-center justify-between group">
                          <span className="text-xs font-mono text-muted-foreground">{order.shipping.tracking || "Awaiting Pickup"}</span>
                          {order.shipping.tracking && (
                            <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold gap-1 rounded-lg hover:bg-primary/5 hover:text-primary">
                              Track <ExternalLink size={10} />
                            </Button>
                          )}
                        </div>
                     </div>
                   )}
                </div>

                <div className="pt-4 border-t border-border/10 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Shipping Address</p>
                      <p className="text-xs font-medium leading-relaxed">{order.shipping.address}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Customer */}
        <div className="space-y-10">
          
          {/* Timeline */}
          <div className="bg-background rounded-[2.5rem] border border-border/50 shadow-sm p-8">
            <h2 className="text-lg font-bold mb-6">Delivery Timeline</h2>
            <div className="space-y-8 relative ml-1 pt-1">
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-border/20 z-0" />
              {timeline.length > 0 ? (
                timeline.slice().reverse().map((step, i) => (
                  <div key={i} className="flex gap-6 relative z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm shrink-0 ${
                      step.current ? "bg-primary text-white" : "bg-emerald-500 text-white"
                    }`}>
                      {step.current ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : <CheckCircle2 size={12} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                         <p className={`text-xs font-bold ${step.current ? "text-foreground" : "text-muted-foreground"}`}>{step.status}</p>
                         <p className="text-[10px] text-muted-foreground tracking-tighter whitespace-nowrap">{step.time}</p>
                      </div>
                      {step.description && <p className="text-[10px] text-muted-foreground mt-1 leading-normal">{step.description}</p>}
                      {step.location && (
                        <p className="text-[9px] font-bold text-primary uppercase mt-1 flex items-center gap-1">
                          <MapPin size={8} /> {step.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center space-y-2">
                   <Clock size={24} className="mx-auto text-muted-foreground/30" />
                   <p className="text-xs text-muted-foreground italic">Awaiting fulfillment start...</p>
                </div>
              )}
            </div>

            {/* Add Milestone Form */}
            <div className="mt-10 pt-8 border-t border-border/10">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Add Event</h3>
                  <div className="flex gap-2">
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={() => setMilestoneForm({ status: "In Studio", location: "Artisan Studio", description: "The master craftsman is currently hand-finishing your gift." })}
                       className="h-7 text-[9px] uppercase font-bold rounded-lg border border-border/50 hover:bg-primary/5 hover:text-primary"
                     >
                       In Studio
                     </Button>
                  </div>
               </div>
               <form onSubmit={handleAddMilestone} className="space-y-3">
                  <input 
                    placeholder="Status (e.g. Out for Delivery)" 
                    className="w-full h-10 bg-muted/20 border border-border/10 rounded-xl px-4 text-xs"
                    value={milestoneForm.status}
                    onChange={e => setMilestoneForm({...milestoneForm, status: e.target.value})}
                  />
                  <input 
                    placeholder="Location (Optional)" 
                    className="w-full h-10 bg-muted/20 border border-border/10 rounded-xl px-4 text-xs"
                    value={milestoneForm.location}
                    onChange={e => setMilestoneForm({...milestoneForm, location: e.target.value})}
                  />
                  <textarea 
                    placeholder="Brief Description" 
                    className="w-full p-4 bg-muted/20 border border-border/10 rounded-xl text-xs resize-none h-20"
                    value={milestoneForm.description}
                    onChange={e => setMilestoneForm({...milestoneForm, description: e.target.value})}
                  />
                  <Button type="submit" size="sm" className="w-full rounded-xl h-10 text-[10px] uppercase font-bold">Log Movement</Button>
               </form>
            </div>
          </div>

          {/* Customer Profile */}
          <div className="bg-background rounded-[2.5rem] border border-border/50 shadow-sm p-8">
            <h2 className="text-lg font-bold mb-6">Customer</h2>
            <div className="flex items-center gap-4 mb-6 p-4 rounded-3xl bg-muted/20 border border-border/10">
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden font-bold text-primary">
                  {order.customer.name.charAt(0)}
               </div>
               <div>
                  <h3 className="font-bold text-sm">{order.customer.name}</h3>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{order.customer.loyalty}</p>
               </div>
            </div>
            <div className="space-y-4 px-1">
               <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-2"><Mail size={12} /> Email:</span>
                  <span className="font-medium underline underline-offset-4 decoration-border/50">{order.customer.email}</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-2">Orders:</span>
                  <span className="font-bold">{order.customer.orders} Lifetime</span>
               </div>
            </div>
            <Link to="/admin/customers">
              <Button variant="outline" className="w-full mt-8 rounded-2xl h-12 text-xs font-bold gap-2">
                Customer Profile <ChevronRight size={14} />
              </Button>
            </Link>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-background rounded-[2.5rem] border border-border/50 shadow-sm p-8 divide-y divide-border/10">
            <div className="pb-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" /> Cost Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">${order.totals.delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gift Wrapping</span>
                  <span className="font-medium">${order.totals.giftWrap.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">${order.totals.tax.toFixed(2)}</span>
                </div>
                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span className="font-medium">Discount Applied</span>
                    <span className="font-bold">-${order.totals.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="pt-6">
               <div className="flex justify-between items-center bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <span className="font-bold">Paid Total</span>
                  <span className="text-2xl font-bold tracking-tighter">${order.total.toFixed(2)}</span>
               </div>
               <div className="mt-6 flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-1">
                  <span>Method: {order.payment.method}</span>
                  <span className={`${order.payment.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'} flex items-center gap-1`}>
                    {order.payment.status} <CheckCircle2 size={10} />
                  </span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
