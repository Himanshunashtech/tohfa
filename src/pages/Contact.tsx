import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsLoading(false);
  };

  const contactInfos = [
    { icon: Mail, label: "Email Us", value: "hello@tofhaverse.com", desc: "Expect a response within 24 hours" },
    { icon: Phone, label: "Call Us", value: "+1 (555) 000-0000", desc: "Mon-Fri from 9am to 6pm EST" },
    { icon: MapPin, label: "Visit Our Studio", value: "123 Artisan Way, NY 10001", desc: "Consultations by appointment" },
  ];

  return (
    <PageTransition title="Contact Us" description="Get in touch with the Tofhaverse customer care team.">
      <StickyNav />
      <main className="pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-4xl md:text-5xl font-bold mb-6"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              Have a question about our collections, customized gifts, or an existing order? Our team is here to help you make every gift perfect.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {contactInfos.map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-3xl bg-muted/40 border border-border/50 hover:shadow-lg transition-shadow"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <info.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{info.label}</h3>
                  <p className="text-foreground font-semibold mb-1">{info.value}</p>
                  <p className="text-xs text-muted-foreground">{info.desc}</p>
                </motion.div>
              ))}

              <div className="p-8 rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
                <h3 className="font-bold text-xl mb-4">Want a personal curation?</h3>
                <p className="text-sm opacity-90 leading-relaxed mb-6">
                  Schedule a 15-minute video call with our master curator for bespoke corporate gifting solutions.
                </p>
                <Button variant="secondary" className="w-full rounded-2xl h-12 shadow-inner">
                  Book Consultation
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-background p-8 md:p-12 rounded-[3rem] border border-border/50 shadow-xl shadow-primary/5"
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="John Doe"
                        required
                        className="rounded-2xl h-14 bg-muted/30 border-border/10 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="name@example.com"
                        required
                        className="rounded-2xl h-14 bg-muted/30 border-border/10 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                      placeholder="Custom gift inquiry / Order support"
                      required
                      className="rounded-2xl h-14 bg-muted/30 border-border/10 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us a bit about what you're looking for..."
                      required
                      className="rounded-2xl min-h-[160px] bg-muted/30 border-border/10 focus:ring-primary/20 p-6"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto px-12 h-14 rounded-full bg-primary text-primary-foreground font-bold text-base shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-transform"
                  >
                    {isLoading ? "Sending..." : (
                      <>
                        Send Message <Send size={18} />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* FAQ Placeholder */}
              <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Clock size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Standard Support Hours</p>
                    <p className="text-xs text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <MessageCircle size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Live Chat</p>
                    <p className="text-xs text-muted-foreground">Available during support hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default Contact;
