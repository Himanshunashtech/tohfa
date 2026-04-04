import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";
import Breadcrumbs from "@/components/Breadcrumbs";

const LegalLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <PageTransition title={title} description={`Read our ${title} to understand your rights and our policies.`}>
    <StickyNav />
    <main className="pt-32 pb-20">
      <div className="container mx-auto max-w-4xl px-6">
        <Breadcrumbs />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">Last Updated: March 31, 2024</p>
        </motion.div>
        
        <div className="prose prose-stone max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground">
          {children}
        </div>
      </div>
    </main>
    <FooterSection />
  </PageTransition>
);

export const PrivacyPolicy = () => (
  <LegalLayout title="Privacy Policy">
    <p>At Tofhaverse, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
    <h2>1. Information We Collect</h2>
    <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email address, shipping address, and payment information.</p>
    <h2>2. How We Use Your Information</h2>
    <p>We use your information to process your orders, communicate with you about your purchases, and improve our services.</p>
    <h2>3. Data Security</h2>
    <p>We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or destruction.</p>
  </LegalLayout>
);

export const TermsOfService = () => (
  <LegalLayout title="Terms of Service">
    <p>By using Tofhaverse, you agree to these terms. Please read them carefully.</p>
    <h2>1. Use of Our Services</h2>
    <p>You must be at least 18 years old to use our services. You are responsible for maintaining the confidentiality of your account information.</p>
    <h2>2. Intellectual Property</h2>
    <p>All content on Tofhaverse, including text, graphics, and logos, is the property of Tofhaverse and protected by copyright laws.</p>
    <h2>3. Limitation of Liability</h2>
    <p>Tofhaverse shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our services.</p>
  </LegalLayout>
);

export const RefundPolicy = () => (
  <LegalLayout title="Refund Policy">
    <p>We want you to be completely satisfied with your Tofhaverse gift. If you're not, we're here to help.</p>
    <h2>1. Returns</h2>
    <p>You have 30 days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it.</p>
    <h2>2. Refunds</h2>
    <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your original method of payment.</p>
  </LegalLayout>
);

export const ShippingPolicy = () => (
  <LegalLayout title="Shipping Policy">
    <p>We strive to get your Tofhaverse gifts to you as quickly and safely as possible.</p>
    <h2>1. Shipping Rates</h2>
    <p>Shipping rates are calculated based on the weight of your order and your destination. We offer free shipping on domestic orders over $75.</p>
    <h2>2. Delivery Times</h2>
    <p>Estimated delivery times are provided at checkout. Please note that these are estimates and not guarantees.</p>
    <h2>3. International Shipping</h2>
    <p>We currently ship to over 42 countries. Customers are responsible for any customs duties or taxes incurred.</p>
  </LegalLayout>
);
