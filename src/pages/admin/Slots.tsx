import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Moon,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useAdminData } from "@/context/AdminDataContext";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input as UiInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminSlots = () => {
  const { settings, updateSettings } = useAdminData();
  const [isAdding, setIsAdding] = useState(false);
  const [newSlot, setNewSlot] = useState({
    title: "",
    time: "",
    capacity: "Unlimited",
    fee: 0,
    active: true
  });

  const slots = settings?.slots || [
    { id: "std", title: "Standard Delivery", time: "09:00 AM - 06:00 PM", capacity: "Unlimited", fee: 0, active: true, color: "bg-blue-100 text-blue-600", icon: Clock },
    { id: "fixed", title: "Fixed-Time Delivery", time: "Choose 1h Slot", capacity: "20 / hour", fee: 5, active: true, color: "bg-amber-100 text-amber-600", icon: Zap },
    { id: "midnight", title: "Midnight Surprise", time: "11:30 PM - 12:15 AM", capacity: "50 total", fee: 15, active: true, color: "bg-primary/10 text-primary", icon: Moon },
  ];

  const handleToggleSlot = (id: string) => {
    const updatedSlots = slots.map((s: any) => 
      s.id === id ? { ...s, active: !s.active } : s
    );
    updateSettings({ ...settings, slots: updatedSlots });
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `slot-${Date.now()}`;
    const updatedSlots = [...slots, { ...newSlot, id }];
    updateSettings({ ...settings, slots: updatedSlots });
    setIsAdding(false);
    setNewSlot({ title: "", time: "", capacity: "Unlimited", fee: 0, active: true });
  };

  const handleDeleteSlot = (id: string) => {
    if (confirm("Delete this delivery window?")) {
      const updatedSlots = slots.filter((s: any) => s.id !== id);
      updateSettings({ ...settings, slots: updatedSlots });
    }
  };

  const maintenanceDates = [
    { date: "Dec 25, 2023", reason: "Christmas Day - No Midnight Delivery", type: "Blackout" },
    { date: "Jan 01, 2024", reason: "New Year - Standard Only", type: "Partial" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Delivery Slots & Capacity</h1>
          <p className="text-sm text-muted-foreground">Configure delivery windows, surcharges, and holiday blackout dates.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="rounded-xl h-11 flex items-center gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 font-bold text-white">
          <Plus size={18} /> Create Special Slot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {slots.map((slot: any, i: number) => (
          <motion.div
            key={slot.id || slot.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm relative overflow-hidden group transition-all ${!slot.active ? 'grayscale opacity-60' : 'hover:shadow-xl hover:border-primary/20'}`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150 ${slot.color ? slot.color.split(' ')[0] : 'bg-primary'}`} />
            
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${slot.color || 'bg-primary/10 text-primary'}`}>
                {slot.icon ? <slot.icon size={24} /> : <Clock size={24} />}
              </div>
              <h3 className="text-xl font-bold mb-1">{slot.title}</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-6">{slot.time}</p>
              
              <div className="space-y-4 pt-6 border-t border-border/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-bold">{slot.capacity}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Service Fee:</span>
                  <span className="font-bold text-primary">{typeof slot.fee === 'number' ? `$${slot.fee.toFixed(2)}` : slot.fee}</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button 
                  variant={slot.active ? "outline" : "default"} 
                  onClick={() => handleToggleSlot(slot.id)}
                  className="flex-1 rounded-xl h-10 text-xs font-bold"
                >
                  {slot.active ? "Deactivate" : "Activate"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="h-10 w-10 border border-border/50 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Blackout Dates */}
         <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
               <Calendar size={20} className="text-primary" /> Blackout & Partial Dates
            </h2>
            <div className="space-y-4">
               {maintenanceDates.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-muted/20 border border-border/10">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === "Blackout" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"}`}>
                           <AlertTriangle size={18} />
                        </div>
                        <div>
                           <p className="font-bold text-sm">{item.date}</p>
                           <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{item.reason}</p>
                        </div>
                     </div>
                     <Button variant="ghost" size="icon" className="rounded-full">
                        <Trash2 size={16} className="text-muted-foreground" />
                     </Button>
                  </div>
               ))}
               <Button variant="outline" className="w-full h-12 rounded-2xl border-dashed border-2 mt-4">
                  + Add Restriction Date
               </Button>
            </div>
         </div>

         {/* Courier Integration */}
         <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Logistics Partners</h2>
              <p className="text-xs text-muted-foreground mb-8">Currently connected courier services and API status.</p>
              
              <div className="space-y-6">
                {[
                  { name: "FedEx Global", status: "Operational", ping: "42ms" },
                  { name: "Local Gifting Fleet", status: "Operational", ping: "12ms" },
                  { name: "Midnight Courier X", status: "Connected", ping: "156ms" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-sm font-bold">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{p.ping}</span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-center gap-4">
               <AlertTriangle className="text-amber-500 shrink-0" size={24} />
               <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                 High traffic predicted for Valentine's Week (Feb 7-14). We recommend increasing "Midnight Surprise" capacity by 20% in advance.
               </p>
            </div>
         </div>
      </div>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] p-8 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading font-bold">Provision New Slot</DialogTitle>
              <DialogDescription>Define a new delivery window or custom service tier.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSlot} className="space-y-6 py-4">
               <div className="space-y-2">
                  <Label>Slot Title</Label>
                  <UiInput 
                    placeholder="e.g. Express Morning" 
                    required 
                    value={newSlot.title}
                    onChange={e => setNewSlot({...newSlot, title: e.target.value})}
                    className="rounded-xl"
                  />
               </div>
               <div className="space-y-2">
                  <Label>Time Window</Label>
                  <UiInput 
                    placeholder="e.g. 06:00 AM - 09:00 AM" 
                    required 
                    value={newSlot.time}
                    onChange={e => setNewSlot({...newSlot, time: e.target.value})}
                    className="rounded-xl"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Capacity</Label>
                    <UiInput 
                      placeholder="Unlimited" 
                      value={newSlot.capacity}
                      onChange={e => setNewSlot({...newSlot, capacity: e.target.value})}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Service Fee ($)</Label>
                    <UiInput 
                      type="number"
                      value={newSlot.fee}
                      onChange={e => setNewSlot({...newSlot, fee: parseFloat(e.target.value)})}
                      className="rounded-xl"
                    />
                  </div>
               </div>
               <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl font-bold">Cancel</Button>
                  <Button type="submit" className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20">Add Delivery Slot</Button>
               </DialogFooter>
            </form>
          </DialogContent>
       </Dialog>
    </div>
  );
};

export default AdminSlots;
