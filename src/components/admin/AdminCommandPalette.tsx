import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { 
  BarChart3, 
  Box, 
  CreditCard, 
  LayoutDashboard, 
  Layers, 
  Users, 
  Settings, 
  Truck,
  Zap,
  Search,
  ShoppingCart,
  MessageSquare,
  Gift,
  Plus
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";

export function AdminCommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { products, orders, customers } = useAdminData();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search entries..." />
      <CommandList className="max-h-[450px]">
        <CommandEmpty>No results found for your search heartbeat.</CommandEmpty>
        
        <CommandGroup heading="Quick Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/admin"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Executive Dashboard</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/admin/inventory"))}>
            <Layers className="mr-2 h-4 w-4" />
            <span>Inventory Command Center</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/admin/orders"))}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Orders & Fulfillment</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/admin/customers"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Customer CRM</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/admin/cms"))}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Dynamic CMS Content</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/admin/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Global Configurations</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Catalog Registry">
          <CommandItem onSelect={() => runCommand(() => navigate("/admin/products/new"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Add New Product SKU</span>
          </CommandItem>
          {products.slice(0, 5).map((p) => (
            <CommandItem key={p.id} onSelect={() => runCommand(() => navigate(`/admin/products/${p.id}`))}>
              <Box className="mr-2 h-4 w-4" />
              <span>{p.name}</span>
              <CommandShortcut className="text-[8px] bg-primary/5 px-2 rounded">{p.category}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Transactions">
          {orders.slice(0, 5).map((o) => (
            <CommandItem key={o.id} onSelect={() => runCommand(() => navigate(`/admin/orders/${o.id.replace('#', '')}`))}>
              <CreditCard className="mr-2 h-4 w-4 text-primary/60" />
              <span>Order {o.id}</span>
              <CommandShortcut className="text-[8px]">{o.status}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Intelligence">
          <CommandItem onSelect={() => runCommand(() => navigate("/admin/analytics"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Performance Analytics</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/admin/marketing"))}>
            <Gift className="mr-2 h-4 w-4" />
            <span>Campaign Manager</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/admin/reviews"))}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Review Moderation</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
