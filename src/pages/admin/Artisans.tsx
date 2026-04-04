import { useState, useRef, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  MapPin, 
  Star, 
  TrendingUp,
  Image as ImageIcon,
  Trash2,
  Edit2,
  ExternalLink,
  Package,
  Camera,
  Upload,
  Loader2,
  X as CloseIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Artisan } from "@/data/products";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { getProductImage } from "@/lib/utils";

const AdminArtisans = () => {
  const { artisans, addArtisan, updateArtisan, deleteArtisan } = useAdminData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtisan, setEditingArtisan] = useState<Partial<Artisan> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const studioInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Artisan>>({
    name: "",
    role: "Master Artisan",
    location: "",
    bio: "",
    photo: "",
    studioImages: [],
    slug: ""
  });

  useEffect(() => {
    if (editingArtisan) {
      setFormData(editingArtisan);
    } else {
      setFormData({
        name: "",
        role: "Master Artisan",
        location: "",
        bio: "",
        photo: "",
        studioImages: [],
        slug: ""
      });
    }
  }, [editingArtisan, isModalOpen]);

  const filteredArtisans = artisans.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: "Total Artisans", value: artisans.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Studios", value: artisans.length, icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Avg Rating", value: "4.9", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Workload", value: "84%", icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) setEditingArtisan(null);
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'studio') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const bucket = type === 'photo' ? 'avatars' : 'studio-images';
    setIsUploading(type);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${bucket}/${fileName}`;

      const { error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) throw error;

      if (type === 'photo') {
        setFormData(prev => ({ ...prev, photo: filePath }));
        toast.success("Profile photo uploaded");
      } else {
        setFormData(prev => ({ 
          ...prev, 
          studioImages: [...(prev.studioImages || []), filePath] 
        }));
        toast.success("Studio image added to gallery");
      }
    } catch (e: any) {
      toast.error(`Upload failed: ${e.message}`);
    } finally {
      setIsUploading(null);
      if (event.target) event.target.value = '';
    }
  };

  const removeStudioImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      studioImages: (prev.studioImages || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast.error("Please fill in the required fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const finalData = { ...formData, slug };
      
      if (editingArtisan?.id) {
        await updateArtisan(editingArtisan.id, finalData);
      } else {
        await addArtisan(finalData);
      }
      setIsModalOpen(false);
    } catch (e) {
      // toast.error covered by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artisan Registry</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your global network of master craftsmen and their legacies.</p>
        </div>
        <Button onClick={handleToggleModal} className="rounded-xl shadow-lg shadow-primary/20 gap-2">
          <Plus size={18} /> Onboard New Artisan
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 bg-card border border-border/50 rounded-2xl shadow-sm"
          >
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} w-fit mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-card p-4 border border-border/50 rounded-2xl shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search by name, location, or craft..." 
            className="pl-10 h-11 rounded-xl bg-background border-border/50 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl h-11 gap-2 border-border/50">
            <Filter size={18} /> Filters
          </Button>
        </div>
      </div>

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredArtisans.map((artisan) => (
            <motion.div
              key={artisan.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-card border border-border/50 rounded-[2.5rem] p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-background shadow-lg shadow-black/5">
                    <img src={artisan.photo} alt={artisan.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-xl shadow-lg border-2 border-background">
                    <ImageIcon size={12} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg truncate">{artisan.name}</h3>
                      <p className="text-primary font-medium text-xs tracking-wide uppercase">{artisan.role}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => {
                        setEditingArtisan(artisan);
                        setIsModalOpen(true);
                      }}>
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => {
                        if(confirm(`Are you sure you want to remove ${artisan.name}?`)) {
                          deleteArtisan(artisan.id);
                        }
                      }}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground font-medium uppercase tracking-tight">
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary/70" /> {artisan.location}</span>
                    <span className="flex items-center gap-1.5"><Package size={12} className="text-primary/70" /> {artisan.stats?.productsCount || 0} Products</span>
                    <span className="flex items-center gap-1.5 text-amber-600"><Star size={12} className="fill-amber-600" /> {artisan.stats?.rating || "N/A"}</span>
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {artisan.bio}
                  </p>

                  <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
                     <div className="flex -space-x-2">
                        {(artisan.studioImages || []).slice(0, 3).map((img, i) => (
                           <div key={i} className="w-8 h-8 rounded-lg border-2 border-background overflow-hidden bg-muted">
                              <img src={img} className="w-full h-full object-cover" />
                           </div>
                        ))}
                        {(artisan.studioImages?.length || 0) > 3 && (
                           <div className="w-8 h-8 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                              +{(artisan.studioImages?.length || 0) - 3}
                           </div>
                        )}
                     </div>
                     <Link to={`/artisan/${artisan.slug}`} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                        View Legacy <ExternalLink size={12} />
                     </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {artisans.length === 0 && (
         <div className="text-center py-20 bg-card/50 border border-dashed border-border/50 rounded-3xl">
            <Users className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
            <h2 className="text-xl font-bold">No Artisans Onboarded</h2>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Click the button above to begin curating your global network of master creators.</p>
         </div>
      )}

      {/* Onboarding Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-heading">
              {editingArtisan ? "Evolve Artisan Legacy" : "Onboard New Master Artisan"}
            </DialogTitle>
            <DialogDescription>
              {editingArtisan ? "Update the details and studio credentials for this master craftsman." : "Add a new creator to the TofhaVerse global network of artisans."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="artisan-name">Full Name</Label>
                <Input 
                  id="artisan-name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Master Kazuya" 
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artisan-role">Craft / Role</Label>
                <Input 
                  id="artisan-role" 
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})} 
                  placeholder="e.g. Kintsugi Master" 
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artisan-location">Location</Label>
                <Input 
                  id="artisan-location" 
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})} 
                  placeholder="e.g. Kyoto, Japan" 
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden relative group border border-border/50">
                    <img src={getProductImage(formData.photo || "")} className="w-full h-full object-cover" />
                    {isUploading === 'photo' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white" size={16} />
                      </div>
                    )}
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl gap-2"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={isUploading !== null}
                  >
                    <Camera size={14} /> {formData.photo ? "Change" : "Upload"}
                  </Button>
                  <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo')} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="artisan-bio">Legacy & Bio</Label>
              <Textarea 
                id="artisan-bio" 
                value={formData.bio} 
                onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                placeholder="Tell the story of their craft..." 
                className="rounded-xl min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Studio Gallery</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary gap-1 font-bold"
                  onClick={() => studioInputRef.current?.click()}
                  disabled={isSubmitting || isUploading !== null}
                >
                  <Plus size={14} /> Add Image
                </Button>
                <input type="file" ref={studioInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'studio')} />
              </div>
              
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {formData.studioImages?.map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden relative group border border-border/50">
                    <img src={getProductImage(img)} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <button 
                      type="button"
                      onClick={() => removeStudioImage(i)}
                      className="absolute top-1 right-1 p-1 bg-background/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                    >
                      <CloseIcon size={12} />
                    </button>
                  </div>
                ))}
                {isUploading === 'studio' && (
                  <div className="aspect-square rounded-xl bg-primary/5 flex items-center justify-center border border-dashed border-primary/30">
                    <Loader2 size={16} className="animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="pt-6 border-t">
              <Button type="button" variant="ghost" className="rounded-xl" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="rounded-xl px-8 shadow-lg shadow-primary/20" disabled={isSubmitting || isUploading !== null}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Authenticating...
                  </>
                ) : (
                  editingArtisan ? "Update Legacy" : "Onboard Artisan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArtisans;
