import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Globe,
  CreditCard,
  Truck,
  ShieldCheck,
  Bell,
  Mail,
  Save,
  RotateCcw,
  ExternalLink,
  Database,
  Tag,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminData } from "@/context/AdminDataContext";
import { toast } from "sonner";

const AdminSettings = () => {
  const { settings, updateSettings, isLoading } = useAdminData();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const defaultSettings = {
    storeName: "",
    email: "",
    currency: "USD",
    timezone: "UTC",
    payments: { stripe: { active: false, publicKey: "" }, paypal: { active: false, clientId: "" }, crypto: { active: false, wallet: "" } },
    shipping: { midnightSurcharge: 0, fixedTimeSurcharge: 0, standardDelivery: 0, freeThreshold: 0 },
    security: { twoFactor: false, ipWhitelist: [], isMaintenanceMode: false },
    notifications: { orderAlerts: false, lowStockAlerts: false, signupAlerts: false },
    emails: { confirmationTemplate: "", newsletterTemplate: "" }
  };

  const [formData, setFormData] = useState({ ...defaultSettings, ...settings });
  const [activeTab, setActiveTab] = useState("General Settings");

  useEffect(() => {
    if (settings && !isUpdatingStatus) {
      setFormData(prev => ({ ...prev, ...settings }));
    }
  }, [settings, isUpdatingStatus]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Warming up configuration engine...</p>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateSettings(formData);
    } catch (err) {
      // toast handled in context
    }
  };

  const handleReset = () => {
    setFormData(settings);
    toast.info("Settings reverted to last saved state.");
  };

  // Helper for nested updates
  const updateNested = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const tabs = [
    { name: "General Settings", icon: Globe },
    { name: "Payment Gateways", icon: CreditCard },
    { name: "Shipping & Surcharges", icon: Truck },
    { name: "Access & Security", icon: ShieldCheck },
    { name: "Notification Hub", icon: Bell },
    { name: "Email Templates", icon: Mail },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Global Store Settings</h1>
          <p className="text-sm text-muted-foreground">Configure TofhaVerse core engine, payments, and administrative preferences.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl h-11 bg-background shadow-sm border-border/50" onClick={handleReset}>
            <RotateCcw size={16} /> Reset
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-xl h-11 px-8 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 font-bold gap-2"
          >
            <Save size={18} /> Update Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {tabs.map(item => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.name ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" : "text-muted-foreground hover:bg-muted"
                }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span>{item.name}</span>
              </div>
              <ChevronRight size={14} className="opacity-40" />
            </button>
          ))}

          <div className="mt-12 p-6 rounded-3xl bg-muted/20 border border-border/10 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Database size={16} />
              <span className="text-[10px] uppercase font-bold tracking-widest">System Health</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              API V2.4.1 connected. Last backup: 4h ago. Core engine running at 100% efficiency.
            </p>
          </div>
        </div>

        {/* Configuration Content */}
        <div className="md:col-span-3 space-y-10 pb-20">
          {activeTab === "General Settings" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-8">
                <h2 className="text-xl font-bold">Store Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label>Storefront Name</Label>
                    <Input value={formData.storeName} onChange={(e) => setFormData({ ...formData, storeName: e.target.value })} className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Operational Email</Label>
                    <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Global Currency</Label>
                    <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Store Timezone</Label>
                    <Input value={formData.timezone} onChange={(e) => setFormData({ ...formData, timezone: e.target.value })} className="rounded-xl h-12" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Payment Gateways" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-8">
                <h2 className="text-xl font-bold">Payment Systems</h2>
                {[
                  { id: 'stripe', label: 'Stripe Payments', key: 'publicKey', placeholder: 'pk_test_...', icon: CreditCard },
                  { id: 'paypal', label: 'PayPal Checkout', key: 'clientId', placeholder: 'Client ID', icon: ExternalLink },
                  { id: 'crypto', label: 'Coinbase Commerce', key: 'wallet', placeholder: 'Wallet Address', icon: ShieldCheck },
                ].map(gate => (
                  <div key={gate.id} className="p-6 rounded-3xl bg-muted/10 border border-border/10 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary border border-border/50">
                          <gate.icon size={20} />
                        </div>
                        <div>
                          <p className="font-bold">{gate.label}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Primary Gateway</p>
                        </div>
                      </div>
                      <div
                        className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${formData.payments[gate.id as keyof typeof formData.payments].active ? "bg-primary" : "bg-muted"}`}
                        onClick={() => updateNested(`payments.${gate.id}.active`, !formData.payments[gate.id as keyof typeof formData.payments].active)}
                      >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${formData.payments[gate.id as keyof typeof formData.payments].active ? "left-6" : "left-1"}`} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Connect Credentials</Label>
                      <Input
                        placeholder={gate.placeholder}
                        value={formData.payments[gate.id as keyof typeof formData.payments][gate.key as 'publicKey' | 'clientId' | 'wallet']}
                        onChange={(e) => updateNested(`payments.${gate.id}.${gate.key}`, e.target.value)}
                        className="rounded-xl h-11 bg-background border-border/50 font-mono text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "Shipping & Surcharges" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-8">
                <h2 className="text-xl font-bold">Logistics & Premium Fees</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Midnight Surcharge", path: "shipping.midnightSurcharge", icon: Bell },
                    { label: "Fixed-Time Surcharge", path: "shipping.fixedTimeSurcharge", icon: RotateCcw },
                    { label: "Standard Delivery", path: "shipping.standardDelivery", icon: Truck },
                    { label: "Free Shipping Threshold", path: "shipping.freeThreshold", icon: Tag },
                  ].map(field => (
                    <div key={field.label} className="p-5 rounded-2xl bg-muted/10 border border-border/10 flex items-center justify-between group hover:bg-muted/30 transition-all">
                      <div className="flex items-center gap-3">
                        <field.icon size={16} className="text-muted-foreground" />
                        <p className="font-bold text-sm tracking-tight">{field.label}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={field.path.split('.').reduce((obj: any, key) => obj[key], formData)}
                          onChange={(e) => updateNested(field.path, parseFloat(e.target.value))}
                          className="w-20 rounded-lg bg-background font-bold text-center border-border/50 h-10"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Access & Security" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-8">
                <h2 className="text-xl font-bold">System Security Protocols</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 rounded-3xl bg-muted/10 border border-border/10">
                    <div>
                      <p className="font-bold">Two-Factor Authentication (2FA)</p>
                      <p className="text-xs text-muted-foreground mt-1">Require an OTP for all administrative logins.</p>
                    </div>
                    <div
                      className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${formData.security.twoFactor ? "bg-primary" : "bg-muted"}`}
                      onClick={() => updateNested("security.twoFactor", !formData.security.twoFactor)}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${formData.security.twoFactor ? "left-6" : "left-1"}`} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label>IP Whitelisting (One per line)</Label>
                    <Textarea
                      placeholder="192.168.1.1"
                      value={formData.security.ipWhitelist.join('\n')}
                      onChange={(e) => updateNested("security.ipWhitelist", e.target.value.split('\n'))}
                      className="rounded-2xl min-h-[120px] bg-muted/10 border-border/50 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-rose-950">Maintenance Mode</h3>
                    <p className="text-xs text-rose-800/80 leading-relaxed max-w-sm font-medium">
                      Enabling this will disable the storefront for all users during deployment.
                    </p>
                  </div>
                </div>
                <Button 
                  variant={formData.security.isMaintenanceMode ? "default" : "outline"}
                  disabled={isUpdatingStatus}
                  onClick={async () => {
                    setIsUpdatingStatus(true);
                    try {
                      const newValue = !formData.security.isMaintenanceMode;
                      const updatedData = {
                        ...formData,
                        security: {
                          ...formData.security,
                          isMaintenanceMode: newValue
                        }
                      };
                      setFormData(updatedData);
                      await updateSettings(updatedData);
                    } finally {
                      setIsUpdatingStatus(false);
                    }
                  }}
                  className={`rounded-xl h-11 border-rose-200 ${formData.security.isMaintenanceMode ? "bg-rose-600 hover:bg-rose-700" : "text-rose-600 hover:bg-rose-600 hover:text-white"} transition-all font-bold font-heading flex items-center gap-2`}
                >
                  {isUpdatingStatus ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  {formData.security.isMaintenanceMode ? "Go Live" : "Go Offline"}
                </Button>

              </div>
            </motion.div>
          )}

          {activeTab === "Notification Hub" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-8">
                <h2 className="text-xl font-bold">Event Log Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "New Order Pulse", path: "notifications.orderAlerts", desc: "Real-time alerts for conversions" },
                    { label: "Inventory Floor Watch", path: "notifications.lowStockAlerts", desc: "Alert when stock dips below 20%" },
                    { label: "Membership Signal", path: "notifications.signupAlerts", desc: "Alert for new TofhaVerse Club joiners" },
                  ].map(n => (
                    <div key={n.label} className="p-6 rounded-3xl bg-muted/10 border border-border/10 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">{n.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{n.desc}</p>
                      </div>
                      <div
                        className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${n.path.split('.').reduce((obj: any, key) => obj[key], formData) ? "bg-primary" : "bg-muted"}`}
                        onClick={() => updateNested(n.path, !n.path.split('.').reduce((obj: any, key) => obj[key], formData))}
                      >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${n.path.split('.').reduce((obj: any, key) => obj[key], formData) ? "left-6" : "left-1"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Email Templates" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-8">
                <h2 className="text-xl font-bold">Automated Workflow Templates</h2>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold text-primary tracking-widest">Order Confirmation (HTML)</Label>
                    <Textarea
                      value={formData.emails.confirmationTemplate}
                      onChange={(e) => updateNested("emails.confirmationTemplate", e.target.value)}
                      className="rounded-2xl min-h-[150px] bg-muted/10 border-border/50 font-mono text-sm p-6"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold text-primary tracking-widest">Newsletter Welcome (HTML)</Label>
                    <Textarea
                      value={formData.emails.newsletterTemplate}
                      onChange={(e) => updateNested("emails.newsletterTemplate", e.target.value)}
                      className="rounded-2xl min-h-[150px] bg-muted/10 border-border/50 font-mono text-sm p-6"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
