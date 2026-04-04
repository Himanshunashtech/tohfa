import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import GiftConcierge from "@/components/GiftConcierge";

const GiftAssistant = () => {
  return (
    <PageTransition title="AI Gift Assistant" description="Let our intelligent gift finder help you discover the perfect present for any occasion.">
      <StickyNav />
      <main className="pt-24 pb-20 overflow-hidden">
        <section className="relative py-20 px-6">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549463591-24c1882bd396?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <Breadcrumbs />
            <div className="max-w-2xl mb-12">
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 italic text-primary">Need a little help?</h1>
              <p className="text-lg text-muted-foreground">Answer a few simple questions and our gifting experts (and some smart AI) will find the perfect match for you.</p>
            </div>
            
            <div className="bg-transparent rounded-[3rem] shadow-none overflow-visible">
              <GiftConcierge />
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default GiftAssistant;
