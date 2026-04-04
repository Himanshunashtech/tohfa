import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AdminDataProvider } from "@/context/AdminDataContext";
import { Navigate } from "react-router-dom";
import Index from "./pages/Index.tsx";
import Shop from "./pages/Shop.tsx";
import Collections from "./pages/Collections.tsx";
import CollectionDetail from "./pages/CollectionDetail.tsx";
import Occasions from "./pages/Occasions.tsx";
import GiftGuide from "./pages/GiftGuide.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import OrderTracking from "./pages/OrderTracking.tsx";
import CorporateGifting from "./pages/CorporateGifting.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import Search from "./pages/Search.tsx";
import Checkout from "./pages/Checkout.tsx";
import OrderSuccess from "./pages/OrderSuccess.tsx";
import Account from "./pages/Account.tsx";
import CartPage from "./pages/CartPage.tsx";
import Rewards from "./pages/Rewards";
import GiftAssistant from "./pages/GiftAssistant";
import About from "./pages/About.tsx";
import QuickGuide from "./pages/QuickGuide.tsx";
import Contact from "./pages/Contact.tsx";
import FAQ from "./pages/FAQ.tsx";
import Support from "./pages/Support.tsx";
import { PrivacyPolicy, TermsOfService, RefundPolicy, ShippingPolicy } from "./pages/Legal.tsx";
import { Careers, Sustainability, Artisans, BulkGifting, Ethics } from "./pages/FooterPages.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import AdminProducts from "./pages/admin/Products";
import AdminProductForm from "./pages/admin/ProductForm";
import AdminCustomers from "./pages/admin/Customers";
import AdminCustomerDetail from "./pages/admin/CustomerDetail";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminMarketing from "./pages/admin/Marketing";
import AdminSettings from "./pages/admin/Settings";
import AdminSlots from "./pages/admin/Slots";
import AdminReviews from "./pages/admin/Reviews";
import AdminPortals from "./pages/admin/Portals";
import AdminArtisans from "./pages/admin/Artisans";
import AdminShipping from "./pages/admin/Shipping";
import AdminRewards from "./pages/admin/AdminRewards";
import AdminCMS from "./pages/admin/CMS";
import AdminInventory from "./pages/admin/Inventory";
import AdminSupport from "./pages/admin/Support";
import AdminCollections from "./pages/admin/Collections";
import ArtisanDetail from "./pages/ArtisanDetail";
import PortalView from "./pages/PortalView";
import Maintenance from "./pages/Maintenance.tsx";
import SupportTicketDetail from "./pages/SupportTicketDetail.tsx";
import { useAdminData } from "@/context/AdminDataContext";


import { Provider } from "react-redux";
import { store } from "./store";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { settings } = useAdminData();

  const isMaintenanceMode = settings?.security?.isMaintenanceMode;
  const isHome = location.pathname === "/";
  const isAdmin = location.pathname.startsWith("/admin");
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(location.pathname);

  if (isMaintenanceMode && !isHome && !isAdmin && !isAuthPage) {
    return (
      <AnimatePresence mode="wait">
        <Maintenance />
      </AnimatePresence>
    );
  }

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products" element={<Navigate to="/shop" replace />} />
          <Route path="/product" element={<Navigate to="/shop" replace />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="/occasions" element={<Occasions />} />
          <Route path="/gift-guide" element={<GiftGuide />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/track/:id" element={<OrderTracking />} />
          <Route path="/corporate" element={<CorporateGifting />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/search" element={<Search />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/gift-assistant" element={<GiftAssistant />} />
          <Route path="/account/:tab?" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/about" element={<About />} />
          <Route path="/guide" element={<QuickGuide />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/ticket" element={<Navigate to="/support" replace />} />
          <Route path="/support/ticket/:id" element={<SupportTicketDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/artisans" element={<Artisans />} />
          <Route path="/bulk-gifting" element={<BulkGifting />} />
          <Route path="/ethics" element={<Ethics />} />
          <Route path="/artisan/:slug" element={<ArtisanDetail />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id" element={<AdminProductForm />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="customers/:id" element={<AdminCustomerDetail />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="marketing" element={<AdminMarketing />} />
            <Route path="slots" element={<AdminSlots />} />
            <Route path="rewards" element={<AdminRewards />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="cms" element={<AdminCMS />} />
            <Route path="promos" element={<AdminMarketing />} />
            <Route path="portals" element={<AdminPortals />} />
            <Route path="artisans" element={<AdminArtisans />} />
            <Route path="shipping" element={<AdminShipping />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="collections" element={<AdminCollections />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="/portal/:slug" element={<PortalView />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

import GiftingHeartbeat from "./components/GiftingHeartbeat";

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <AdminDataProvider>
                <BrowserRouter>
                  <Toaster />
                  <Sonner />
                  <GiftingHeartbeat />
                  <AnimatedRoutes />
                </BrowserRouter>
              </AdminDataProvider>
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
