import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Tag, 
  Gift, 
  Info,
  DollarSign,
  Layers,
  Heart,
  Sparkles,
  Upload,
  Loader2,
  Camera,
  Edit3,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/data/products";
import { useAdminData } from "@/context/AdminDataContext";
import { toast } from "sonner";
import { getProductImage } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, categories: dbCategories, artisans } = useAdminData();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    category: "Gift Sets",
    description: "",
    shortDesc: "",
    images: ["https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600&h=600&auto=format&fit=crop"],
    artisanId: "",
    story: "",
    specifications: [],
    recipient: [],
    occasion: [],
    details: [],
    vibe: [],
    isBestSeller: false,
    isNewArrival: false,
    stock: 10,
  });

  useEffect(() => {
    if (id && products.length > 0) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData(product);
      }
    }
  }, [id, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (id) {
        await updateProduct(id, formData);
      } else {
        await addProduct(formData);
      }
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving.");
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = (type: 'recipient' | 'occasion' | 'vibe' | 'details', value: string) => {
    if (!value) return;
    setFormData(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), value]
    }));
  };

  const removeTag = (type: 'recipient' | 'occasion' | 'vibe' | 'details', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: (prev[type] || []).filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    // Filter valid files
    const validFiles = selectedFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`Invalid file type for ${file.name}`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is over 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Determine start index for additions
    // If replacing an image, we only process the first selected file
    const startIndex = index ?? (formData.images?.length || 0);
    const filesToUpload = index !== undefined ? [validFiles[0]] : validFiles;
    
    // Update loading state using functional update
    setIsUploading(prev => {
      const next = { ...prev };
      filesToUpload.forEach((_, i) => {
        next[startIndex + i] = true;
      });
      return next;
    });

    try {
      const uploadResults: { index: number; path: string }[] = [];
      
      // Upload files sequentially or in parallel? Parallel is faster.
      await Promise.all(filesToUpload.map(async (file, i) => {
        const currentIndex = startIndex + i;
        const fileExt = file.name.split('.').pop();
        const sanitizedName = (formData.name || 'product')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-');
        const timestamp = Date.now() + i; 
        const fileName = `${sanitizedName}-${timestamp}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;
        uploadResults.push({ index: currentIndex, path: filePath });
      }));

      // Update formData with ALL results in one go to prevent race conditions
      setFormData(prev => {
        const newImgs = [...(prev.images || [])];
        uploadResults.forEach(({ index: idx, path }) => {
          if (idx < newImgs.length) {
            newImgs[idx] = path;
          } else {
            newImgs.push(path);
          }
        });
        return { ...prev, images: newImgs };
      });
      
      toast.success(filesToUpload.length > 1 ? `${filesToUpload.length} images added` : (index !== undefined ? "Image replaced" : "Image added"));
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(prev => {
        const next = { ...prev };
        filesToUpload.forEach((_, i) => {
          next[startIndex + i] = false;
        });
        return next;
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      setActiveImageIndex(null);
    }
  };

  const triggerFileUpload = (index?: number) => {
    setActiveImageIndex(index ?? null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link to="/admin/products">
            <Button variant="ghost" size="icon" className="rounded-xl border border-border/50">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <h1 className="text-3xl font-heading font-bold">
            {isEdit ? "Edit Gift Product" : "Add New Premium Gift"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/admin/products")} className="rounded-xl h-11">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || Object.values(isUploading).some(Boolean)}
            className="rounded-xl h-11 px-8 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 font-bold gap-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
            {isEdit ? "Save Changes" : "Publish Product"}
          </Button>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        multiple={activeImageIndex === null}
        onChange={(e) => handleFileUpload(e, activeImageIndex !== null ? activeImageIndex : undefined)}
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
              <Info size={18} className="text-primary" /> General Information
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Midnight Serenity Gift Box" className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortDesc">Short Tagline (Brief Summary)</Label>
                <Input id="shortDesc" value={formData.shortDesc} onChange={(e) => setFormData({...formData, shortDesc: e.target.value})} placeholder="e.g. Hand-poured soy candle with notes of cedar..." className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the crafting process, inclusions, and gifting appeal..." className="rounded-2xl min-h-[120px] resize-none" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="story">Product Story (The Maker's Narrative)</Label>
                <Textarea id="story" value={formData.story} onChange={(e) => setFormData({...formData, story: e.target.value})} placeholder="Shared by the artisan..." className="rounded-2xl min-h-[120px] bg-primary/5 italic" />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
               <Layers size={18} className="text-indigo-500" /> Technical Specifications
            </h2>
            <div className="space-y-4">
              {formData.specifications?.map((spec, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Label</Label>
                    <Input value={spec.label} onChange={(e) => {
                      const newSpecs = [...(formData.specifications || [])];
                      newSpecs[index].label = e.target.value;
                      setFormData({...formData, specifications: newSpecs});
                    }} className="rounded-xl" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Value</Label>
                    <Input value={spec.value} onChange={(e) => {
                      const newSpecs = [...(formData.specifications || [])];
                      newSpecs[index].value = e.target.value;
                      setFormData({...formData, specifications: newSpecs});
                    }} className="rounded-xl" />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => {
                    setFormData({...formData, specifications: (formData.specifications || []).filter((_, i) => i !== index)});
                  }}><Trash2 size={16} className="text-muted-foreground" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full rounded-xl border-dashed py-6 gap-2" onClick={() => {
                setFormData({...formData, specifications: [...(formData.specifications || []), {label: "", value: ""}]});
              }}><Plus size={16} /> Add Specification</Button>
            </div>
          </div>

          <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
              <Layers size={18} className="text-primary" /> Product Specifications & Details
            </h2>
            <div className="space-y-4">
               <div className="flex flex-wrap gap-2 mb-3">
                  {formData.details?.map((d, i) => (
                    <span key={i} className="bg-muted text-foreground text-xs font-medium px-3 py-1.5 rounded-xl border border-border/50 flex items-center gap-2">
                      {d} <X size={14} className="cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => removeTag('details', i)} />
                    </span>
                  ))}
               </div>
               <div className="flex gap-2">
                  <Input placeholder="Add detail (e.g. weight, dimensions, burn time)" id="detail-input" className="rounded-xl h-12 border-dashed" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const el = e.currentTarget;
                        addTag('details', el.value);
                        el.value = '';
                      }
                    }}
                  />
                  <Button type="button" variant="outline" className="rounded-xl h-12 px-6" onClick={() => {
                    const el = document.getElementById('detail-input') as HTMLInputElement;
                    addTag('details', el.value);
                    el.value = '';
                  }}>Add</Button>
               </div>
            </div>
          </div>

          <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-8">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                <DollarSign size={18} className="text-primary" /> Pricing & Inventory
              </h2>
              <p className="text-xs text-muted-foreground">Manage your product's commercial value and availability.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider">Base Price (USD)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                  <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="rounded-xl h-12 pl-8 font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider">Store Category</Label>
                  <Link to="/admin/settings" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter">Manage Categories</Link>
                </div>
                <div className="relative">
                  <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select 
                    id="category" 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})} 
                    className="flex h-12 w-full rounded-xl border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                  >
                    <option value="">Select Category...</option>
                    {dbCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider">Inventory Count (Stock)</Label>
                <div className="relative">
                  <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} className="rounded-xl h-12 pl-10 font-bold" />
                </div>
                {(formData.stock ?? 0) < 10 && (formData.stock ?? 0) > 0 && (
                  <p className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 mt-2 flex items-center gap-1.5 w-fit">
                    <Sparkles size={10} className="fill-amber-600" /> Low stock alert
                  </p>
                )}
                {(formData.stock ?? 0) === 0 && (
                  <p className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 mt-2 flex items-center gap-1.5 w-fit">
                    <X size={10} className="stroke-[3px]" /> Out of stock
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Gifting Metadata (The FNP Special) */}
          <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-primary" /> Gifting Discovery Engine
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">Attributed Artisan</Label>
                <select 
                  className="w-full bg-background border border-border/50 rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDE0IDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw3IDdMMTMgMSIgc3Ryb2tlPSIjOTA5MDkwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat"
                  value={formData.artisanId || ""}
                  onChange={(e) => setFormData({...formData, artisanId: e.target.value})}
                >
                  <option value="">Select Artisan...</option>
                  {(artisans || []).map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground italic">Product will be featured in the artisan's collection.</p>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2"><Heart size={14} className="text-rose-500" /> Target Recipients</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.recipient?.map((r, i) => (
                    <span key={i} className="bg-primary/10 text-primary text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
                      {r} <X size={10} className="cursor-pointer" onClick={() => removeTag('recipient', i)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add recipient (e.g. Mom, Partner)" id="rec-input" className="rounded-xl h-10 border-dashed" />
                  <Button type="button" variant="outline" size="sm" className="rounded-xl h-10" onClick={() => {
                    const el = document.getElementById('rec-input') as HTMLInputElement;
                    addTag('recipient', el.value);
                    el.value = '';
                  }}>Add</Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2"><Gift size={14} className="text-amber-500" /> Best Suited Occasions</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.occasion?.map((o, i) => (
                    <span key={i} className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-secondary/20 flex items-center gap-1.5">
                      {o} <X size={10} className="cursor-pointer" onClick={() => removeTag('occasion', i)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add occasion (e.g. Birthday, Farewell)" id="occ-input" className="rounded-xl h-10 border-dashed" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const el = e.currentTarget;
                        addTag('occasion', el.value);
                        el.value = '';
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" className="rounded-xl h-10" onClick={() => {
                    const el = document.getElementById('occ-input') as HTMLInputElement;
                    addTag('occasion', el.value);
                    el.value = '';
                  }}>Add</Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2"><Sparkles size={14} className="text-purple-500" /> Brand Vibe & Persona</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.vibe?.map((v, i) => (
                    <span key={i} className="bg-purple-500/10 text-purple-600 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-1.5">
                      {v} <X size={10} className="cursor-pointer" onClick={() => removeTag('vibe', i)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add vibe (e.g. Minimalist, Foodie)" id="vibe-input" className="rounded-xl h-10 border-dashed" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const el = e.currentTarget;
                        addTag('vibe', el.value);
                        el.value = '';
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" className="rounded-xl h-10" onClick={() => {
                    const el = document.getElementById('vibe-input') as HTMLInputElement;
                    addTag('vibe', el.value);
                    el.value = '';
                  }}>Add</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-10">
           {/* Media */}
           <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2"><ImageIcon size={18} /> Product Media</span>
                <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-widest">{formData.images?.length || 0} Assets</span>
              </h2>
              <div className="space-y-6">
                 {formData.images?.map((img, i) => (
                   <div key={i} className="space-y-3 relative group/img">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Image {i+1} URL</Label>
                        <div className="flex items-center gap-1">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-lg text-primary hover:bg-primary/5 transition-colors"
                            onClick={() => triggerFileUpload(i)}
                            disabled={isUploading[i]}
                          >
                            <Camera size={12} />
                          </Button>
                          {formData.images && formData.images.length > 1 && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                              onClick={() => {
                                const newImgs = [...(formData.images || [])];
                                newImgs.splice(i, 1);
                                setFormData({...formData, images: newImgs});
                              }}
                            >
                              <X size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                      <Input 
                        value={img} 
                        onChange={(e) => {
                          const newImgs = [...(formData.images || [])];
                          newImgs[i] = e.target.value;
                          setFormData({...formData, images: newImgs});
                        }} 
                        placeholder="https://... or product-images/name.jpg"
                        className="rounded-xl h-10" 
                      />
                      {img && (
                        <div className="aspect-square rounded-2xl overflow-hidden mt-2 border border-border/50 bg-muted/20 relative">
                          <img 
                            src={getProductImage(img)} 
                            alt={`Preview ${i+1}`}
                            className={`w-full h-full object-cover transition-all duration-500 ${isUploading[i] ? "blur-sm opacity-50" : "group-hover/img:scale-110"}`} 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=60";
                              target.onerror = null;
                            }}
                          />
                          
                          {isUploading[i] && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[2px]">
                              <Loader2 size={24} className="text-primary animate-spin mb-2" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Uploading...</span>
                            </div>
                          )}

                          <div 
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            onClick={() => triggerFileUpload(i)}
                          >
                             <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 flex items-center gap-2 text-white text-xs font-bold">
                               <Upload size={14} /> Replace
                             </div>
                          </div>
                        </div>
                      )}
                   </div>
                 ))}
                 <Button 
                   type="button" 
                   variant="ghost" 
                   className="w-full rounded-2xl border-dashed border-2 py-8 mt-2 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-xs gap-3 group"
                   onClick={() => triggerFileUpload()}
                   disabled={isUploading[formData.images?.length || 0]}
                 >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {isUploading[formData.images?.length || 0] ? (
                        <Loader2 size={16} className="animate-spin text-primary" />
                      ) : (
                        <Plus size={16} />
                      )}
                    </div>
                    {isUploading[formData.images?.length || 0] ? "Uploading..." : "Upload Additional Media"}
                 </Button>
              </div>
           </div>

             {/* Personalization Toggle */}
             <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                   <div>
                      <h2 className="text-lg font-bold">Personalization Engine</h2>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Advanced Customization Controls</p>
                   </div>
                   <div 
                      onClick={() => setFormData({...formData, hasPersonalization: !formData.hasPersonalization, personalization_config: formData.personalization_config || {
                        supportsMonogramming: false,
                        supportsVideoMessage: false,
                        supportsEngraving: false,
                        monogramPrice: 5,
                        videoPrice: 10,
                        engravingPrice: 12,
                        monogramLimit: 3
                      }})}
                      className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${formData.hasPersonalization ? "bg-primary" : "bg-primary/20"}`}
                   >
                      <motion.div 
                        animate={{ x: formData.hasPersonalization ? 16 : 4 }}
                        initial={false}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                      />
                   </div>
                </div>

                {formData.hasPersonalization && (
                  <div className="space-y-6 pt-4 border-t border-border/50">
                    {/* Monogramming */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
                       <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider"><Edit3 size={14} className="text-primary" /> Monogramming</Label>
                          <input 
                            type="checkbox" 
                            checked={formData.personalization_config?.supportsMonogramming} 
                            onChange={(e) => setFormData({
                              ...formData, 
                              personalization_config: {
                                ...(formData.personalization_config as any),
                                supportsMonogramming: e.target.checked
                              }
                            })} 
                          />
                       </div>
                       {formData.personalization_config?.supportsMonogramming && (
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                               <Label className="text-[10px] uppercase font-bold text-muted-foreground">Extra Charge ($)</Label>
                               <Input 
                                 type="number" 
                                 value={formData.personalization_config?.monogramPrice} 
                                 onChange={(e) => setFormData({
                                   ...formData, 
                                   personalization_config: {
                                     ...(formData.personalization_config as any),
                                     monogramPrice: Number(e.target.value)
                                   }
                                 })} 
                                 className="rounded-xl h-10" 
                               />
                            </div>
                            <div className="space-y-1.5">
                               <Label className="text-[10px] uppercase font-bold text-muted-foreground">Char Limit</Label>
                               <Input 
                                 type="number" 
                                 value={formData.personalization_config?.monogramLimit} 
                                 onChange={(e) => setFormData({
                                   ...formData, 
                                   personalization_config: {
                                     ...(formData.personalization_config as any),
                                     monogramLimit: Number(e.target.value)
                                   }
                                 })} 
                                 className="rounded-xl h-10" 
                               />
                            </div>
                         </div>
                       )}
                    </div>

                    {/* Video Message */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
                       <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider"><Camera size={14} className="text-primary" /> Video Message</Label>
                          <input 
                            type="checkbox" 
                            checked={formData.personalization_config?.supportsVideoMessage} 
                            onChange={(e) => setFormData({
                              ...formData, 
                              personalization_config: {
                                ...(formData.personalization_config as any),
                                supportsVideoMessage: e.target.checked
                              }
                            })} 
                          />
                       </div>
                       {formData.personalization_config?.supportsVideoMessage && (
                          <div className="space-y-1.5">
                             <Label className="text-[10px] uppercase font-bold text-muted-foreground">Service Charge ($)</Label>
                             <Input 
                               type="number" 
                               value={formData.personalization_config?.videoPrice} 
                               onChange={(e) => setFormData({
                                 ...formData, 
                                 personalization_config: {
                                   ...(formData.personalization_config as any),
                                   videoPrice: Number(e.target.value)
                                 }
                               })} 
                               className="rounded-xl h-10" 
                             />
                          </div>
                       )}
                    </div>

                    {/* Wax Seal / Engraving */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
                       <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider"><ShieldCheck size={14} className="text-primary" /> Signature Engraving</Label>
                          <input 
                            type="checkbox" 
                            checked={formData.personalization_config?.supportsEngraving} 
                            onChange={(e) => setFormData({
                              ...formData, 
                              personalization_config: {
                                ...(formData.personalization_config as any),
                                supportsEngraving: e.target.checked
                              }
                            })} 
                          />
                       </div>
                       {formData.personalization_config?.supportsEngraving && (
                          <div className="space-y-1.5">
                             <Label className="text-[10px] uppercase font-bold text-muted-foreground">Engraving Fee ($)</Label>
                             <Input 
                               type="number" 
                               value={formData.personalization_config?.engravingPrice} 
                               onChange={(e) => setFormData({
                                 ...formData, 
                                 personalization_config: {
                                   ...(formData.personalization_config as any),
                                   engravingPrice: Number(e.target.value)
                                 }
                               })} 
                               className="rounded-xl h-10" 
                             />
                          </div>
                       )}
                    </div>
                  </div>
                )}
             </div>

           {/* Tags & Collections */}
           <div className="bg-background p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Layers size={18} /> Collections
              </h2>
              <div className="space-y-3">
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-border group-hover:border-primary transition-colors flex items-center justify-center">
                       {formData.isBestSeller && <div className="w-2.5 h-2.5 bg-primary rounded-sm" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={formData.isBestSeller} 
                      onChange={(e) => setFormData({...formData, isBestSeller: e.target.checked})} 
                    />
                    <span className="text-sm font-medium">Bestseller</span>
                 </label>
                 
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-border group-hover:border-primary transition-colors flex items-center justify-center">
                       {formData.isNewArrival && <div className="w-2.5 h-2.5 bg-primary rounded-sm" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={formData.isNewArrival} 
                      onChange={(e) => setFormData({...formData, isNewArrival: e.target.checked})} 
                    />
                    <span className="text-sm font-medium">New Arrival</span>
                 </label>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
