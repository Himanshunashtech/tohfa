import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Box,
  History,
  RefreshCw,
  Search,
  TriangleAlert,
  BarChart3,
  TrendingDown,
  Trash2,
  ChevronDown,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu as Dropdown,
  DropdownMenuContent as DropdownContent,
  DropdownMenuItem as DropdownItem,
  DropdownMenuTrigger as DropdownTrigger
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminData } from "@/context/AdminDataContext";
import { getProductImage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const AdminInventory = () => {
  const {
    products,
    inventoryLogs,
    syncArtisanInventory,
    globalRestock,
    bulkDeleteProducts,
    bulkRestockProducts
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = products.filter(p => (p.stock || 0) < 5);
  const recentLogs = inventoryLogs.slice(0, 10);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkRestock = async (amount: number) => {
    setIsProcessing(true);
    await bulkRestockProducts(selectedIds, amount);
    setSelectedIds([]);
    setIsProcessing(false);
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      setIsProcessing(true);
      await bulkDeleteProducts(selectedIds);
      setSelectedIds([]);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold italic">Inventory <span className="text-primary not-italic">Heartbeat</span></h2>
          <p className="text-muted-foreground text-sm">Real-time supply chain monitoring & artisan stock sync.</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={globalRestock}
            className="rounded-full gap-2 px-6 h-12 border-primary/20 text-primary hover:bg-primary/5 transition-all active:scale-95"
          >
            <RefreshCw size={18} /> Global Restock
          </Button>
          <Button onClick={syncArtisanInventory} className="rounded-full gap-2 px-8 h-12 shadow-xl shadow-primary/20 transition-all active:scale-95">
            <Activity size={18} className="animate-pulse" /> Establish Heartbeat
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
              <Box size={24} />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total SKU Count</p>
          </div>
          <p className="text-4xl font-bold">{products.length}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
              <TriangleAlert size={24} />
            </div>
            <p className="text-sm font-bold text-amber-700 uppercase tracking-widest">Low Stock Alerts</p>
          </div>
          <p className="text-4xl font-bold text-amber-900">{lowStockItems.length}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <BarChart3 size={24} />
            </div>
            <p className="text-sm font-bold text-indigo-700 uppercase tracking-widest">Sync Health</p>
          </div>
          <p className="text-4xl font-bold text-indigo-900">Optimal</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory List */}
        <div className="lg:col-span-2 bg-background border border-border/50 rounded-[3rem] overflow-hidden shadow-sm flex flex-col">
          <div className="p-8 border-b border-border/50 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Activity size={18} className="text-primary" /> Active Stock Levels
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Filter products..."
                  className="pl-10 h-10 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-primary/5 border-b border-primary/10 px-8 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-primary">{selectedIds.length} Products Selected</span>
                  <div className="h-4 w-[1px] bg-primary/20 mx-2" />
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                      onClick={() => handleBulkRestock(50)}
                      disabled={isProcessing}
                    >
                      +50 Stock
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                      onClick={() => handleBulkRestock(100)}
                      disabled={isProcessing}
                    >
                      +100 Stock
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider text-destructive hover:bg-destructive/5"
                  onClick={handleBulkDelete}
                  disabled={isProcessing}
                >
                  <Trash2 size={14} className="mr-1" /> Delete Selected
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                  <th className="px-6 py-4 w-10 text-center">
                    <Checkbox
                      checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-8 py-4 text-left">Product</th>
                  <th className="px-8 py-4 text-center">Stock</th>
                  <th className="px-8 py-4 text-center">Status</th>
                  <th className="px-8 py-4 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className={`hover:bg-muted/5 transition-colors ${selectedIds.includes(p.id) ? "bg-primary/5" : ""}`}>
                    <td className="px-6 py-6 text-center">
                      <Checkbox
                        checked={selectedIds.includes(p.id)}
                        onCheckedChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td className="px-8 py-6">
                      <Link to={`/admin/products/${p.id}`} className="flex items-center gap-4 text-xs group">
                        <img src={getProductImage(p.images[0])} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-border/50 group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="font-bold group-hover:text-primary transition-colors">{p.name}</p>
                          <p className="text-muted-foreground opacity-60 uppercase font-mono text-[9px] tracking-tight">ID: {p.id.substring(0, 8)}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`font-bold text-sm ${p.stock < 5 ? "text-red-500" : "text-foreground"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.stock === 0 ? "bg-red-100 text-red-600" :
                          p.stock < 10 ? "bg-amber-100 text-amber-600" :
                            "bg-emerald-100 text-emerald-600"
                        }`}>
                        {p.stock === 0 ? "Out of Stock" : p.stock < 10 ? "Reorder Soon" : "Healthy"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <TrendingDown size={16} className="ml-auto text-muted-foreground opacity-30" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="py-20 text-center text-muted-foreground italic text-sm">
                No products found matching your search heartrate.
              </div>
            )}
          </div>
        </div>

        {/* Sync Logs */}
        <div className="bg-background border border-border/50 rounded-[3rem] overflow-hidden shadow-sm flex flex-col h-[700px]">
          <div className="p-8 border-b border-border/50">
            <h3 className="font-bold flex items-center gap-2">
              <History size={18} className="text-primary" /> Movement Log
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {recentLogs.length > 0 ? recentLogs.map((log) => (
              <div key={log.id} className="flex gap-4 relative">
                <div className="absolute left-[15px] top-8 bottom-[-1.5rem] w-[2px] bg-muted last:hidden" />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${log.change > 0 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                  }`}>
                  {log.change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold truncate pr-2">{log.productName}</p>
                    <span className="text-[10px] font-bold text-muted-foreground shrink-0">{log.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    <span className={`font-bold ${log.change > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {log.change > 0 ? `+${log.change}` : log.change} units
                    </span> — {log.reason}
                  </p>
                </div>
              </div>
            )) : <p className="text-xs text-muted-foreground italic text-center py-20">No recent stock movements detected.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
