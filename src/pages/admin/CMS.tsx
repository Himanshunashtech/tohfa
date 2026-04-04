import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Palette, 
  Layout, 
  Image as ImageIcon, 
  Type, 
  Save, 
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  Smartphone,
  Monitor,
  Eye,
  Star
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminCMS = () => {
  const { cmsContent, updateCMSContent, isLoading } = useAdminData();
  const [activeSection, setActiveSection] = useState<string>("home_hero");
  const [editedContent, setEditedContent] = useState<any>(null);

  useEffect(() => {
    const section = cmsContent.find(c => c.section_key === activeSection);
    if (section) {
      if (typeof section.content === 'string') {
        try {
          setEditedContent(JSON.parse(section.content));
        } catch (e) {
          setEditedContent(section.content);
        }
      } else {
        setEditedContent(JSON.parse(JSON.stringify(section.content)));
      }
    } else {
      // Default templates
      if (activeSection === "home_hero") {
        setEditedContent({
          title: "The Art of Thoughtful Gifting",
          subtitle: "Discover exquisite handcrafted treasures from India's finest artisans, delivered to your doorstep with love.",
          cta_primary: "Explore Collection",
          cta_primary_link: "/shop",
          cta_secondary: "Meet the Makers",
          cta_secondary_link: "/artisans",
          image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2574&auto=format&fit=crop"
        });
      } else if (activeSection === "home_featured") {
        setEditedContent({
          title: "Curated Creations",
          subtitle: "Discover our most-loved artisan treasures, selected specifically for your taste.",
          product_ids: []
        });
      } else if (activeSection === "home_about") {
        setEditedContent({
          title: "The Artisan Journey",
          content: "Every gift starts with a pair of skilled hands and a heart full of tradition...",
          image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2574&auto=format&fit=crop"
        });
      } else if (activeSection === "footer_info") {
        setEditedContent({
          copyright: "© 2026 TofhaVerse Luxe. All rights reserved.",
          email: "concierge@tofhaverse.com",
          phone: "+91 9876543210"
        });
      } else {
        setEditedContent({});
      }
    }
  }, [activeSection, cmsContent]);

  const handleUpdate = async () => {
    try {
      await updateCMSContent(activeSection, editedContent);
      toast.success(`${activeSection} updated successfully`);
    } catch (err) {
      toast.error("Failed to update CMS content");
    }
  };

  if (isLoading && !editedContent) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Site Content Manager</h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Control every word and image on your storefront without writing code. Changes are pushed to production instantly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl border-border/50"
            onClick={() => window.open('/', '_blank')}
          >
            <ExternalLink size={16} className="mr-2" /> View Live Site
          </Button>
          <Button 
            className="rounded-xl shadow-lg shadow-primary/20"
            onClick={handleUpdate}
          >
            <Save size={16} className="mr-2" /> Publish Changes
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 shrink-0 space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-4 mb-3">Pages & Sections</p>
          {[
            { id: "home_hero", label: "Landing Hero", icon: Layout },
            { id: "home_featured", label: "Featured Section", icon: Star },
            { id: "home_about", label: "Our Story Snippet", icon: Type },
            { id: "footer_info", label: "Global Footer", icon: ImageIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-[1.25rem] transition-all text-sm font-medium ${
                activeSection === item.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "bg-background border border-border/40 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}

          <div className="pt-6">
             <Button variant="ghost" className="w-full justify-start rounded-xl text-muted-foreground hover:text-primary">
               <Plus size={16} className="mr-2" /> Add New Section
             </Button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 space-y-6">
          <Tabs defaultValue="editor" className="w-full">
            <div className="flex items-center justify-between mb-4">
               <TabsList className="bg-muted/50 p-1 rounded-xl border border-border/50">
                 <TabsTrigger value="editor" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Palette size={14} className="mr-2" /> Editor
                 </TabsTrigger>
                 <TabsTrigger value="preview" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Eye size={14} className="mr-2" /> Local Preview
                 </TabsTrigger>
               </TabsList>

               <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-border/20">
                  <Monitor size={14} />
                  <Smartphone size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest ml-1">Responsive Config</span>
               </div>
            </div>

            <TabsContent value="editor" className="mt-0 space-y-6">
              {activeSection === "home_hero" && editedContent && (
                <Card className="border-border/50 shadow-sm rounded-[2rem] overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b border-border/50 p-8">
                    <CardTitle className="text-xl">Hero Section Configuration</CardTitle>
                    <CardDescription>Main attention-grabber on the homepage</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="font-bold flex items-center gap-2">
                            <Type size={14} className="text-primary" /> Headline Title
                          </label>
                          <Input 
                            value={editedContent.title || ""} 
                            onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-bold flex items-center gap-2">
                             Sub-headline Description
                          </label>
                          <Textarea 
                            rows={4}
                            value={editedContent.subtitle || ""} 
                            onChange={(e) => setEditedContent({...editedContent, subtitle: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl resize-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="font-bold flex items-center gap-2">
                            <ImageIcon size={14} className="text-primary" /> Hero Visual (URL)
                          </label>
                          <Input 
                            value={editedContent.image || ""} 
                            onChange={(e) => setEditedContent({...editedContent, image: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl"
                          />
                          <div className="mt-2 aspect-video rounded-2xl overflow-hidden border border-border/50 relative group">
                             <img 
                              src={editedContent.image} 
                              alt="Hero preview" 
                              className="w-full h-full object-cover"
                             />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <Button size="sm" variant="secondary" className="rounded-xl">Replace Asset</Button>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                       <div className="space-y-2">
                          <label className="font-bold text-primary">Primary CTA Text</label>
                          <Input 
                            value={editedContent.cta_primary || ""} 
                            onChange={(e) => setEditedContent({...editedContent, cta_primary: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="font-bold">Primary Link</label>
                          <Input 
                            value={editedContent.cta_primary_link || ""} 
                            onChange={(e) => setEditedContent({...editedContent, cta_primary_link: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl"
                          />
                       </div>
                    </div>

                    <div className="pt-6 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                       <div className="space-y-2">
                          <label className="font-bold text-muted-foreground">Secondary CTA Text</label>
                          <Input 
                            value={editedContent.cta_secondary || ""} 
                            onChange={(e) => setEditedContent({...editedContent, cta_secondary: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="font-bold">Secondary Link</label>
                          <Input 
                            value={editedContent.cta_secondary_link || ""} 
                            onChange={(e) => setEditedContent({...editedContent, cta_secondary_link: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl"
                          />
                       </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === "home_featured" && editedContent && (
                <Card className="border-border/50 shadow-sm rounded-[2rem] overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b border-border/50 p-8">
                    <CardTitle className="text-xl">Featured Section Configuration</CardTitle>
                    <CardDescription>Curate the featured products display</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="font-bold">Section Heading</label>
                        <Input 
                          value={editedContent.title || ""} 
                          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
                          className="bg-muted/30 border-none rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-bold">Section Sub-heading</label>
                        <Input 
                          value={editedContent.subtitle || ""} 
                          onChange={(e) => setEditedContent({...editedContent, subtitle: e.target.value})}
                          className="bg-muted/30 border-none rounded-xl"
                        />
                      </div>
                      <div className="pt-4 border-t border-border/50">
                        <label className="font-bold flex items-center gap-2 mb-4 text-emerald-600">
                           <Star size={14} fill="currentColor" /> Active Product IDs
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                           {(editedContent.product_ids || []).map((id: string, idx: number) => (
                             <div key={idx} className="flex gap-2">
                               <Input 
                                 value={id} 
                                 onChange={(e) => {
                                   const newIds = [...editedContent.product_ids];
                                   newIds[idx] = e.target.value;
                                   setEditedContent({...editedContent, product_ids: newIds});
                                 }}
                                 className="bg-muted/30 border-none rounded-xl h-10"
                               />
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="rounded-xl text-rose-500 hover:bg-rose-50"
                                 onClick={() => {
                                   const newIds = editedContent.product_ids.filter((_: any, i: number) => i !== idx);
                                   setEditedContent({...editedContent, product_ids: newIds});
                                 }}
                               >
                                 <Trash2 size={16} />
                               </Button>
                             </div>
                           ))}
                           <Button 
                             variant="outline" 
                             className="rounded-xl border-dashed border-border/50 h-10 text-xs mt-2"
                             onClick={() => setEditedContent({...editedContent, product_ids: [...(editedContent.product_ids || []), ""]})}
                           >
                             <Plus size={14} className="mr-2" /> Add ID
                           </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === "home_about" && editedContent && (
                <Card className="border-border/50 shadow-sm rounded-[2rem] overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b border-border/50 p-8">
                    <CardTitle className="text-xl">About Section Configuration</CardTitle>
                    <CardDescription>Control the story narration on homepage</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="font-bold">Story Headline</label>
                          <Input 
                            value={editedContent.title || ""} 
                            onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-bold">Narrative Content</label>
                          <Textarea 
                            rows={8}
                            value={editedContent.content || ""} 
                            onChange={(e) => setEditedContent({...editedContent, content: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl resize-none"
                          />
                        </div>
                       </div>
                       <div className="space-y-2">
                          <label className="font-bold">Visual Context (URL)</label>
                          <Input 
                            value={editedContent.image || ""} 
                            onChange={(e) => setEditedContent({...editedContent, image: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl"
                          />
                          <div className="mt-4 aspect-[4/5] rounded-3xl overflow-hidden border border-border/50 shadow-inner">
                            <img src={editedContent.image} className="w-full h-full object-cover" alt="Story preview" />
                          </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === "footer_info" && editedContent && (
                <Card className="border-border/50 shadow-sm rounded-[2rem] overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b border-border/50 p-8">
                    <CardTitle className="text-xl">Global Footer Configuration</CardTitle>
                    <CardDescription>Contact info and legal boilerplate</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="font-bold">Concierge Email</label>
                          <Input 
                            value={editedContent.email || ""} 
                            onChange={(e) => setEditedContent({...editedContent, email: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="font-bold">Support Hotline</label>
                          <Input 
                            value={editedContent.phone || ""} 
                            onChange={(e) => setEditedContent({...editedContent, phone: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="font-bold">Copyright Statement</label>
                          <Input 
                            value={editedContent.copyright || ""} 
                            onChange={(e) => setEditedContent({...editedContent, copyright: e.target.value})}
                            className="bg-muted/30 border-none rounded-xl"
                          />
                       </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex items-center justify-end gap-3 mt-8">
                 <Button variant="ghost" className="rounded-xl">
                   <RotateCcw size={16} className="mr-2" /> Reset Section
                 </Button>
                 <Button 
                   className="rounded-xl px-10 shadow-lg shadow-primary/20"
                   onClick={handleUpdate}
                 >
                   Save Progress
                 </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
               <div className="bg-background rounded-[2.5rem] border border-border/50 shadow-2xl overflow-hidden relative min-h-[600px] flex items-center justify-center p-12">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-muted/50 border border-border/20 text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                     <Eye size={10} /> Local Browser Context
                  </div>
                  
                  {/* Realtime Preview Simulation */}
                  {editedContent && activeSection === "home_hero" && (
                    <div className="max-w-4xl w-full text-center space-y-8">
                       <h2 className="text-5xl md:text-7xl font-heading font-bold text-foreground tracking-tight leading-[1.1]">
                          {editedContent.title}
                       </h2>
                       <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                          {editedContent.subtitle}
                       </p>
                       <div className="pt-4 flex items-center justify-center gap-4">
                          <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-xl shadow-primary/30">
                             {editedContent.cta_primary}
                          </Button>
                          <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg border-foreground/20">
                             {editedContent.cta_secondary}
                          </Button>
                       </div>
                    </div>
                  )}

                  <div className="absolute inset-0 z-[-1] opacity-10 pointer-events-none">
                     <img 
                      src={editedContent?.image} 
                      alt="bg-preview" 
                      className="w-full h-full object-cover blur-3xl scale-110"
                     />
                  </div>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminCMS;
