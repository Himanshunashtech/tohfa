import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAdminData } from "@/context/AdminDataContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Package,
  Box,
  Calendar,
  Gift,
  Zap,
  MessageSquare,
  ChevronDown,
  Palette,
  Tag,
  Globe,
  Truck,
  MapPin,
  HelpCircle,
  Layers
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { AdminAgent } from "./AdminAgent";
import { AdminCommandPalette } from "./AdminCommandPalette";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { currentArtisan, setArtisanPerspective } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Status metrics for the Agent
  useEffect(() => {
    // We could dispatch metrics to the agent here if needed
  }, []);

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin" },
    { name: "Product Catalog", icon: Package, path: "/admin/products" },
    { name: "Categories", icon: Layers, path: "/admin/categories" },
    { name: "Collections", icon: LayoutDashboard, path: "/admin/collections" },
    { name: "Stock Inventory", icon: Box, path: "/admin/inventory" },
    { name: "Order Management", icon: ShoppingBag, path: "/admin/orders" },
    { name: "Shipping & Fleet", icon: Truck, path: "/admin/shipping" },
    { name: "Artisan Registry", icon: MapPin, path: "/admin/artisans" },
    { name: "Customers", icon: Users, path: "/admin/customers" },
    { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { name: "Marketing", icon: Zap, path: "/admin/marketing" },
    { name: "Global Slots", icon: Calendar, path: "/admin/slots" },
    { name: "Elite Rewards", icon: Gift, path: "/admin/rewards" },
    { name: "Reviews", icon: MessageSquare, path: "/admin/reviews" },
    { name: "Site CMS", icon: Palette, path: "/admin/cms" },
    { id: 'promos', name: 'Promo Codes', icon: Tag, path: '/admin/promos' },
    { id: 'portals', name: 'Gifting Portals', icon: Globe, path: '/admin/portals' },
    { name: "Support Assistance", icon: HelpCircle, path: "/admin/support" },
    { id: 'settings', name: 'Store Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex text-foreground">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border/50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Gift className="text-primary-foreground" size={18} />
            </div>
            <span className="text-xl font-heading font-bold tracking-tight">
              Tofha<span className="text-primary italic">Verse</span>
            </span>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-8 rounded-2xl text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-background/50 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl hover:bg-muted lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div
              className="relative hidden md:block cursor-pointer group"
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" size={16} />
              <div className="bg-muted/50 border border-border/20 rounded-full h-10 w-64 pl-10 pr-4 text-sm flex items-center text-muted-foreground group-hover:bg-muted transition-all">
                Search entries...
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-muted-foreground hover:text-foreground">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-border/50">
              <div className="text-right">
                <p className="text-xs font-bold leading-none">{user?.name || "Admin User"}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-muted border-2 border-primary/20" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Productivity Enhancements */}
      <AdminCommandPalette />

      {/* Persistent AI Agent for Admin Panel */}
      <AdminAgent />
    </div>
  );
};

export default AdminLayout;
