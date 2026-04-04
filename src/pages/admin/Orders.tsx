import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  Calendar,
  Gift,
  Download,
  Plus,
  Zap,
  MessageSquare,
  Palette
} from "lucide-react";
import { useAdminData, AdminOrder } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";

const AdminOrders = () => {
  const { orders: allOrders, updateOrderStatus, syncData, currentArtisan, products } = useAdminData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const orders = currentArtisan
    ? allOrders.filter(o => o.items.some(item => products.some(p => p.id === item.id && p.artisan?.name === currentArtisan)))
    : allOrders;

  const filteredOrders = (filter === "All" ? orders : orders.filter(o => o.slot === filter || o.status === filter))
    .filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">Orders Management</h1>
          <p className="text-sm text-muted-foreground">Manage and track all customer orders and delivery slots.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl h-11 flex items-center gap-2" onClick={() => syncData()}>
            <Download size={18} /> Export CSV
          </Button>
          <Button className="rounded-xl h-11 flex items-center gap-2 shadow-lg shadow-primary/20" onClick={() => syncData()}>
            <Plus size={18} /> Sync Orders
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-background p-6 rounded-[2rem] border border-border/50 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl w-full md:w-auto">
          {["All", "Midnight", "Fixed-Time", "Standard"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Filter by customer or ID..."
              className="w-full h-11 bg-muted/30 border-none rounded-xl pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 bg-muted/30">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-background rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/10 border-b border-border/10">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order Info</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Logistics</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Gift Details</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Total</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {filteredOrders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <Link to={`/admin/orders/${order.id.replace('#', '')}`} className="font-bold text-sm tracking-tight hover:text-primary transition-colors cursor-pointer">
                        {order.id}
                      </Link>
                      <span className="text-xs text-foreground mt-0.5">{order.customer.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1.5">{order.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${order.slot === "Midnight" ? "bg-primary animate-pulse" : "bg-muted"}`} />
                        <span className="text-xs font-semibold">{order.slot}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        <Truck size={12} /> Standard Courier
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {order.type === "Gift" ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-primary">
                          <Gift size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Included Note</span>
                        </div>
                        {order.giftDetails?.message && (
                          <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl max-w-[200px]">
                            <p className="text-[10px] italic text-muted-foreground leading-relaxed">"{order.giftDetails.message}"</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No gifting options</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === "Delivered" ? "bg-emerald-100 text-emerald-600" :
                        order.status === "Shipped" ? "bg-blue-100 text-blue-600" :
                          "bg-amber-100 text-amber-600"
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-right tracking-tight">{order.total}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/admin/orders/${order.id.replace('#', '')}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                          <Eye size={16} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                        onClick={() => {
                          const statuses: AdminOrder["status"][] = ["Processing", "Shipped", "Delivered", "Cancelled", "Flagged"];
                          const currentIndex = statuses.indexOf(order.status);
                          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                          updateOrderStatus(order.id, nextStatus);
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
