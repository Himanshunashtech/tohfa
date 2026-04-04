import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import StickyNav from "@/components/StickyNav";
import FooterSection from "@/components/FooterSection";

const LegalLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <PageTransition title={title} description={`Read our ${title} to understand your rights and our policies.`}>
    <StickyNav />
    <main className="pt-32 pb-20">
      <div className="container mx-auto max-w-4xl px-6">
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
    <p>Last Updated: April 4, 2026</p>
    <p>At Tofhaverse, we are deeply committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This comprehensive Privacy Policy describes how Tofhaverse ("we," "us," or "our") collects, uses, shares, and protects your personal information when you visit our website, use our services, or interact with us in any way. By using our website and services, you consent to the data practices described in this policy.</p>

    <h2>1. Introduction and Scope</h2>
    <p>This Privacy Policy applies to all users of the Tofhaverse platform, including visitors, registered customers, artisans, and partners. It covers information collected through our website, mobile applications, social media platforms, and offline interactions. Understanding how your data is used is crucial, and we encourage you to read this document in its entirety to understand our commitment to your privacy.</p>

    <h2>2. Information We Collect</h2>
    <p>We collect several types of information from and about users of our Services, including:</p>
    
    <h3>2.1 Personal Identification Information</h3>
    <p>When you create an account, place an order, or subscribe to our newsletter, we may collect personal identifiers such as your full name, email address, mailing address, billing address, and phone number. This information is essential for processing transactions and providing customer support.</p>
    
    <h3>2.2 Payment Information</h3>
    <p>To process your orders, we collect payment details, including credit/debit card numbers, bank account information, and billing addresses. Please note that Tofhaverse does not store full credit card numbers; we utilize secure, third-party payment processors (such as Stripe or PayPal) who are compliant with the Payment Card Industry Data Security Standard (PCI-DSS).</p>
    
    <h3>2.3 Account and Profile Data</h3>
    <p>If you register for an account, we collect your username, password, and any other information you choose to provide in your profile, such as your birthday, gifting preferences, and saved addresses. This data helps us personalize your experience and streamline future purchases.</p>
    
    <h3>2.4 Technical and Usage Data</h3>
    <p>As you navigate through our Services, we may use automatic data collection technologies to collect certain information about your equipment, browsing actions, and patterns. This includes your IP address, browser type, operating system, referring URLs, device information, and details about your interactions with our website, such as page views and time spent on specific sections.</p>
    
    <h3>2.5 Cookies and Tracking Technologies</h3>
    <p>We use cookies, web beacons, and similar tracking technologies to enhance your experience. Cookies are small files stored on your device that allow us to recognize your browser and capture certain information. We use both session cookies (which expire once you close your browser) and persistent cookies (which stay on your device until deleted). You can manage your cookie preferences through your browser settings, but please note that disabling certain cookies may affect the functionality of our website.</p>

    <h2>3. How We Use Your Information</h2>
    <p>We use the information we collect for various business purposes, including:</p>
    
    <h3>3.1 Providing and Improving Services</h3>
    <p>We use your personal information to process and fulfill your orders, manage your account, and provide customer support. We also analyze usage data to improve our website's functionality, develop new features, and enhance the overall user experience.</p>
    
    <h3>3.2 Personalization and Recommendations</h3>
    <p>To provide a more tailored experience, we use your browsing history and purchase data to suggest products, collections, and artisans that may interest you. This includes personalized marketing communications if you have opted in to receive them.</p>
    
    <h3>3.3 Marketing and Communications</h3>
    <p>With your consent, we may send you promotional emails about new products, special offers, and company updates. You can opt out of these communications at any time by clicking the "unsubscribe" link in the email or updating your account settings.</p>
    
    <h3>3.4 Security and Fraud Prevention</h3>
    <p>We use your information to protect our users and our business from fraudulent activities, unauthorized access, and other security threats. This includes monitoring for suspicious behavior and verifying your identity during sensitive transactions.</p>
    
    <h3>3.5 Legal Compliance</h3>
    <p>We may use or disclose your information as required by law, such as to comply with a subpoena, court order, or other legal process, or to protect our rights and the rights of others.</p>

    <h2>4. Sharing Your Information</h2>
    <p>We do not sell your personal information to third parties. However, we may share your information with trusted third parties in the following circumstances:</p>
    
    <h3>4.1 Service Providers</h3>
    <p>We share information with third-party service providers who assist us in operating our business, such as payment processors, shipping/logistics companies, email service providers, and data analytics firms. These providers are contractually obligated to protect your data and only use it for the specific purposes we define.</p>
    
    <h3>4.2 Artisans and Partners</h3>
    <p>When you purchase a handcrafted item from one of our artisans, we share the necessary information (such as your name and shipping address) to ensure the product is delivered correctly. Artisans are prohibited from using your data for any other purpose without your explicit consent.</p>
    
    <h3>4.3 Business Transfers</h3>
    <p>In the event of a merger, acquisition, reorganization, or sale of assets, your personal information may be transferred as part of the business assets. We will notify you of any such change in ownership and any choices you may have regarding your data.</p>
    
    <h3>4.4 Legal Disclosures</h3>
    <p>We may disclose your information if we believe in good faith that such disclosure is necessary to comply with legal obligations, protect the safety of our users, or defend against legal claims.</p>

    <h2>5. Data Retention</h2>
    <p>We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements. To determine the appropriate retention period, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure, and the applicable legal requirements.</p>

    <h2>6. Your Data Rights</h2>
    <p>Depending on your location, you may have certain rights regarding your personal information under laws such as the General Data Protection Regulation (GDPR) or the California Consumer Privacy Act (CCPA). These rights may include:</p>
    
    <ul>
      <li><strong>The Right to Access:</strong> You can request a copy of the personal data we hold about you.</li>
      <li><strong>The Right to Rectification:</strong> You can request that we correct any inaccurate or incomplete information.</li>
      <li><strong>The Right to Erasure:</strong> Also known as the "right to be forgotten," you can request that we delete your personal data under certain conditions.</li>
      <li><strong>The Right to Restrict Processing:</strong> You can request that we limit the way we use your data.</li>
      <li><strong>The Right to Data Portability:</strong> You can request that we transfer your data to another organization or directly to you.</li>
      <li><strong>The Right to Object:</strong> You can object to our processing of your personal data for specific purposes, such as direct marketing.</li>
    </ul>
    
    <p>To exercise any of these rights, please contact us at privacy@tofhaverse.com. We will respond to your request within the timeframe required by applicable law.</p>

    <h2>7. Security Measures</h2>
    <p>We implement a variety of technical and organizational security measures to protect the confidentiality and integrity of your personal information. These include encryption (SSL/TLS), firewalls, access controls, and regular security audits. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

    <h2>8. International Data Transfers</h2>
    <p>Tofhaverse is based in the United States, but we serve a global community. Therefore, your personal information may be transferred to and processed in countries other than your own. These countries may have different data protection laws. By using our Services, you acknowledge and consent to these international transfers.</p>

    <h2>9. Children's Privacy</h2>
    <p>Our Services are not intended for children under the age of 18. We do not knowingly collect personal information from individuals under this age. If we become aware that we have inadvertently collected data from a minor, we will take steps to delete it as soon as possible.</p>

    <h2>10. Third-Party Links</h2>
    <p>Our website may contain links to third-party websites or services that are not owned or controlled by Tofhaverse. We are not responsible for the privacy practices or the content of these third-party sites. We encourage you to read the privacy policies of any website you visit.</p>

    <h2>11. Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make changes, we will update the "Last Updated" date at the top of this policy and notify you through our website or via email if the changes are significant. Your continued use of our Services after the effective date of the updated policy constitutes your acceptance of the changes.</p>

    <h2>12. Contact Us</h2>
    <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer at:</p>
    <p>
      Tofhaverse HQ<br />
      Attn: Privacy Department<br />
      123 Artisan Way<br />
      Brooklyn, NY 11201<br />
      Email: privacy@tofhaverse.com
    </p>

    <p>By using Tofhaverse, you acknowledge that you have read and understood this Privacy Policy and agree to its terms. We are dedicated to maintaining the trust you place in us and will continue to prioritize the protection of your personal information as we grow our community of artisans and gift-givers.</p>

    <hr />
    <p>Note: This privacy policy is designed for a luxury, artisan-focused platform and covers various international standards. Given the high-touch nature of our "Concierge" and "AI Assistant" services, we take extra care in documenting how data fuels these experiences to provide you with the most meaningful gifting journey possible.</p>
  </LegalLayout>
);

export const TermsOfService = () => (
  <LegalLayout title="Terms of Service">
    <p>Last Updated: April 4, 2026</p>
    <p>Welcome to Tofhaverse. These Terms of Service ("Terms") govern your access to and use of the Tofhaverse website, mobile applications, and services (collectively, the "Services"). Please read these Terms carefully before using our Services. By accessing or using any part of the Services, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any Services.</p>

    <h2>1. Acceptance of Terms</h2>
    <p>By using the Services, you represent that you are at least 18 years of age and have the legal capacity to enter into a binding agreement. If you are using the Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms. Tofhaverse reserves the right to update or modify these Terms at any time without prior notice. Your continued use of the Services following any changes constitutes your acceptance of the new Terms. We recommend that you check this page regularly to stay informed of any updates.</p>

    <h2>2. User Accounts and Security</h2>
    <p>To access certain features of our Services, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to keep your account information updated. You are solely responsible for maintaining the confidentiality of your account credentials, including your password, and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security. Tofhaverse will not be liable for any loss or damage arising from your failure to comply with these security obligations.</p>

    <h2>3. Prohibited Activities</h2>
    <p>You agree not to use the Services for any unlawful purpose or in any way that violates these Terms. Prohibited activities include, but are not limited to:</p>
    <ul>
      <li>Posting or transmitting any content that is defamatory, obscene, fraudulent, or otherwise objectionable.</li>
      <li>Interfering with or disrupting the integrity or performance of the Services or the data contained therein.</li>
      <li>Attempting to gain unauthorized access to the Services or its related systems or networks.</li>
      <li>Using any automated means, such as robots, spiders, or scrapers, to access the Services for any purpose without our express written permission.</li>
      <li>Engaging in any activity that imposes an unreasonable or disproportionately large load on our infrastructure.</li>
      <li>Impersonating any person or entity or falsely stating or otherwise misrepresenting your affiliation with a person or entity.</li>
      <li>Forging headers or otherwise manipulating identifiers in order to disguise the origin of any content transmitted through the Services.</li>
    </ul>

    <h2>4. Intellectual Property Rights</h2>
    <p>The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Tofhaverse, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
    <p>These Terms permit you to use the Services for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services, except as follows:</p>
    <ul>
      <li>Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials.</li>
      <li>You may store files that are automatically cached by your Web browser for display enhancement purposes.</li>
      <li>You may print or download one copy of a reasonable number of pages of the website for your own personal, non-commercial use and not for further reproduction, publication, or distribution.</li>
    </ul>

    <h2>5. User Content</h2>
    <p>Our Services may allow you to post, submit, publish, display, or transmit to other users or other persons content or materials (collectively, "User Contributions") on or through the Services. All User Contributions must comply with the Content Standards set out in these Terms.</p>
    <p>Any User Contribution you post to the site will be considered non-confidential and non-proprietary. By providing any User Contribution on the Services, you grant us and our affiliates and service providers, and each of their and our respective licensees, successors, and assigns the right to use, reproduce, modify, perform, display, distribute, and otherwise disclose to third parties any such material for any purpose.</p>
    <p>You represent and warrant that:</p>
    <ul>
      <li>You own or control all rights in and to the User Contributions and have the right to grant the license granted above to us and our affiliates and service providers.</li>
      <li>All of your User Contributions do and will comply with these Terms of Service.</li>
    </ul>

    <h2>6. Pricing and Payment</h2>
    <p>All prices displayed on the Tofhaverse website are in U.S. Dollars and are subject to change without notice. We reserve the right to modify or discontinue any product or service at any time. We also reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order.</p>
    <p>Payment must be made through our authorized payment processors. By providing your payment information, you represent and warrant that you have the legal right to use the chosen payment method and that the information you provide is true, accurate, and complete. In the event of a payment dispute, you agree to contact us before initiating a chargeback through your bank or credit card provider.</p>

    <h2>7. Third-Party Links and Services</h2>
    <p>The Services may contain links to third-party websites or services that are not owned or controlled by Tofhaverse. Tofhaverse has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that Tofhaverse shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.</p>

    <h2>8. Disclaimer of Warranties</h2>
    <p>YOU EXPRESSLY AGREE THAT USE OF THE SERVICES IS AT YOUR SOLE RISK. THE SERVICES AND ALL INFORMATION, CONTENT, MATERIALS, PRODUCTS (INCLUDING SOFTWARE) AND OTHER SERVICES INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THE SERVICES ARE PROVIDED BY TOFHAVERSE ON AN "AS IS" AND "AS AVAILABLE" BASIS, UNLESS OTHERWISE SPECIFIED IN WRITING. TOFHAVERSE MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE SERVICES, OR THE INFORMATION, CONTENT, MATERIALS, PRODUCTS (INCLUDING SOFTWARE) OR OTHER SERVICES INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THE SERVICES, UNLESS OTHERWISE SPECIFIED IN WRITING.</p>

    <h2>9. Limitation of Liability</h2>
    <p>TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL TOFHAVERSE, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICES, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE SERVICES OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.</p>

    <h2>10. Indemnification</h2>
    <p>You agree to defend, indemnify, and hold harmless Tofhaverse, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms of Service or your use of the Services, including, but not limited to, your User Contributions, any use of the Services' content, services, and products other than as expressly authorized in these Terms of Service or your use of any information obtained from the Services.</p>

    <h2>11. Governing Law and Jurisdiction</h2>
    <p>All matters relating to the Services and these Terms and any dispute or claim arising therefrom or related thereto (in each case, including non-contractual disputes or claims), shall be governed by and construed in accordance with the internal laws of the State of New York without giving effect to any choice or conflict of law provision or rule (whether of the State of New York or any other jurisdiction).</p>
    <p>Any legal suit, action, or proceeding arising out of, or related to, these Terms of Service or the Services shall be instituted exclusively in the federal courts of the United States or the courts of the State of New York, in each case located in the City of New York and County of New York, although we retain the right to bring any suit, action, or proceeding against you for breach of these Terms of Service in your country of residence or any other relevant country. You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.</p>

    <h2>12. Termination</h2>
    <p>We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
    <p>If you wish to terminate your account, you may simply discontinue using the Services. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</p>

    <h2>13. Entire Agreement</h2>
    <p>The Terms of Service, our Privacy Policy, and our Refund and Shipping Policies constitute the sole and entire agreement between you and Tofhaverse regarding the Services and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the Services.</p>

    <h2>14. Contact Information</h2>
    <p>To contact us regarding these Terms or any other matter, please reach out to our legal department at:</p>
    <p>
      Tofhaverse HQ<br />
      Attn: Legal Department<br />
      123 Artisan Way<br />
      Brooklyn, NY 11201<br />
      Email: legal@tofhaverse.com
    </p>

    <hr />
    <p>These terms are designed to facilitate a transparent and secure environment for our community of luxury gift-seekers and world-class artisans. We value your participation in the Tofhaverse ecosystem and are dedicated to maintaining the highest standards of service and integrity.</p>
  </LegalLayout>
);

export const RefundPolicy = () => (
  <LegalLayout title="Refund Policy">
    <p>Last Updated: April 4, 2026</p>
    <p>At Tofhaverse, we take immense pride in the quality and craftsmanship of the artisanal gifts curated through our platform. We understand that gifting is a personal experience, and our goal is to ensure that both the giver and the recipient are completely satisfied with every purchase. This Refund and Return Policy ("Policy") outlines the conditions under which returns, exchanges, and refunds are processed for products purchased on the Tofhaverse website.</p>

    <h2>1. General Principles</h2>
    <p>Given the nature of our marketplace, which features many handmade, one-of-a-kind, and personalized items, our return policies are designed to balance the needs of our customers with the unique constraints of our artisanal partners. We encourage you to review product descriptions, dimensions, and materials carefully before completing your purchase. If you have any questions about a specific item, our Gifting Concierge is available to provide additional details or photos prior to your order.</p>

    <h2>2. Eligibility for Returns</h2>
    <p>To be eligible for a return, your item must meet the following criteria:</p>
    <ul>
      <li>The return request must be initiated within 30 calendar days from the date of delivery.</li>
      <li>The item must be unused, unwashed, and in the same condition as when you received it.</li>
      <li>The item must be in its original packaging, including all tags, certificates of authenticity, and protective materials.</li>
      <li>The item must not be listed as "Final Sale" or "Non-Returnable" at the time of purchase.</li>
    </ul>

    <h2>3. Non-Returnable and Non-Refundable Items</h2>
    <p>To maintain the integrity of our curated collections and support our artisans, the following categories of items are generally explicitly excluded from returns and refunds:</p>
    
    <h3>3.1 Personalized and Custom-Made Items</h3>
    <p>Any product that has been personalized, engraved, monogrammed, or custom-built to your specifications is considered final sale. These items are crafted specifically for you and cannot be resold. We recommend double-checking all spelling and customization options before placing your order.</p>
    
    <h3>3.2 Perishable Goods</h3>
    <p>Gifts that involve food, flowers, or other perishable items are not eligible for return due to health and safety regulations, as well as the nature of the products. If a perishable item arrives damaged or spoiled, please refer to Section 7 for our Damaged Goods policy.</p>
    
    <h3>3.3 Digital Products and Gift Cards</h3>
    <p>All digital downloads, virtual gift cards, and electronic vouchers are non-refundable once the delivery email has been sent or the code has been accessed.</p>
    
    <h3>3.4 Intimate and Hygiene Products</h3>
    <p>For health and hygiene reasons, certain items such as earrings, beauty products, and specific apparel items cannot be returned once the protective seal has been broken or the item has been removed from its original packaging.</p>

    <h2>4. The Return Process</h2>
    <p>If your item is eligible for return, please follow these steps to ensure a smooth process:</p>
    
    <h3>4.1 Initiation</h3>
    <p>Log into your Tofhaverse account, navigate to your "Order History," and select the item you wish to return. Click on "Request Return" and provide a brief explanation for the return. You will receive a Return Authorization (RA) number and a prepaid return shipping label via email within 24-48 hours.</p>
    
    <h3>4.2 Packaging</h3>
    <p>Securely package the item in its original box, ensuring that all protective materials are included to prevent damage during transit. Affix the provided return shipping label to the outside of the package, covering any previous labels.</p>
    
    <h3>4.3 Shipping</h3>
    <p>Drop the package off at an authorized carrier location. We recommend obtaining a receipt for your records to track the journey of your return. Please note that return shipping costs may be deducted from your final refund amount unless the return is due to an error on our part or a defective product.</p>

    <h2>5. Inspection and Refund Approval</h2>
    <p>Once your returned item is received at our fulfillment center or the artisan's studio, it will undergo a thorough quality inspection. This process typically takes 3-5 business days. We will notify you via email once the inspection is complete.</p>
    <p>If the return is approved, we will initiate a refund to your original method of payment. You will receive a confirmation email detailing the amount refunded. Please note that original shipping charges are non-refundable.</p>

    <h2>6. Refund Timelines</h2>
    <p>After the refund is initiated, the time it takes for the funds to appear in your account depends on your financial institution. Generally, the timelines are as follows:</p>
    <ul>
      <li><strong>Credit/Debit Cards:</strong> 5-10 business days.</li>
      <li><strong>PayPal:</strong> 3-5 business days.</li>
      <li><strong>Tofhaverse Store Credit:</strong> Immediate (once approved).</li>
    </ul>
    <p>If you have not received your refund after 14 business days, please contact your bank first, and then reach out to our support team at rewards@tofhaverse.com.</p>

    <h2>7. Damaged, Defective, or Incorrect Items</h2>
    <p>We take great care in packaging our premium gifts, but we recognize that accidents can happen during transit. If you receive an item that is damaged, defective, or not what you ordered, please contact us immediately (within 48 hours of delivery).</p>
    <p>To expedite the process, please provide your order number and clear photographs of the damage or the incorrect item. We will arrange for a replacement to be sent at no additional cost to you, or we will provide a full refund if a replacement is not available. You will not be responsible for return shipping costs in these instances.</p>

    <h2>8. Exchanges</h2>
    <p>We currently only offer exchanges for different sizes of the same apparel or jewelry item, subject to availability. To initiate an exchange, please follow the return process and indicate your desired size in the "Reason for Return" section. If you wish to exchange for a different product, we recommend returning the original item for store credit and placing a new order.</p>

    <h2>9. International Returns</h2>
    <p>For orders shipped outside of the United States, return shipping costs and any customs duties/taxes paid at the time of delivery are the responsibility of the customer. Due to the complexities of international logistics, we cannot provide prepaid return labels for international orders. We recommend using a trackable shipping service and purchasing shipping insurance, as we cannot guarantee that we will receive your returned item.</p>

    <h2>10. Holiday Extension</h2>
    <p>To provide peace of mind during the festive season, orders placed between November 1st and December 25th are eligible for return until January 31st of the following year, provided they meet all other eligibility criteria.</p>

    <h2>11. Contact Us</h2>
    <p>If you have any questions regarding our Refund and Return Policy, or if you need assistance with a specific order, please reach out to our customer care team:</p>
    <p>
      Tofhaverse Support<br />
      Email: support@tofhaverse.com<br />
      Phone: +1 (555) TOFHA-88
    </p>

    <hr />
    <p>Note: This policy is designed to uphold the premium standards of the Tofhaverse experience while respecting the dedicated work of the artisans behind our collections. We thank you for your understanding and for choosing to support independent craftsmanship.</p>
  </LegalLayout>
);

export const ShippingPolicy = () => (
  <LegalLayout title="Shipping Policy">
    <p>Last Updated: April 4, 2026</p>
    <p>At Tofhaverse, we believe that the delivery of a gift should be as exceptional as the gift itself. Our shipping and logistics framework is designed to ensure that every item, whether it's a delicate piece of jewelry or a bespoke artisan sculpture, reaches its destination in perfect condition and within the expected timeframe. This Shipping Policy explains our shipping methods, costs, delivery estimates, and the precautions we take to protect your precious purchases.</p>

    <h2>1. General Shipping Overview</h2>
    <p>We partner with leading global carriers and specialized white-glove delivery services to provide a seamless shipping experience. Since many of our products are handcrafted by independent artisans located around the world, shipping times and methods may vary depending on the origin of the item. We strive to provide complete transparency throughout the shipping process, from the moment an order is placed to the final delivery at your doorstep.</p>

    <h2>2. Shipping Methods and Rates</h2>
    <p>We offer several shipping options to meet your needs, ranging from standard delivery to expedited services. Shipping rates are calculated at checkout based on the weight, dimensions, and destination of your order, as well as the chosen shipping method.</p>
    
    <h3>2.1 Standard Shipping</h3>
    <p>Our most economical option, standard shipping, typicaly utilizes major carriers such as FedEx, UPS, or DHL. For domestic orders within the United States, we are pleased to offer **Free Standard Shipping on all orders over $75**. For orders below this threshold, a flat-rate or weight-based fee will apply.</p>
    
    <h3>2.2 Expedited and Overnight Shipping</h3>
    <p>For those urgent gifting moments, we offer expedited (2-3 business days) and overnight shipping options for most items. Please note that these timelines refer to the transit time after the item has been dispatched from the artisan's studio or our fulfillment center. Expedited shipping availability may be limited for certain oversized or extremely fragile items.</p>
    
    <h3>2.3 White-Glove and Specialized Delivery</h3>
    <p>For high-value, oversized, or extremely delicate items (such as large furniture pieces or intricate glasswork), we may utilize specialized white-glove delivery services. This service includes scheduled delivery, room-of-choice placement, and removal of packaging materials. If your order requires white-glove service, our Logistics Coordinator will contact you directly to arrange the details.</p>

    <h2>3. Processing and Dispatch Timelines</h2>
    <p>The time it takes for your order to ship is composed of two parts: processing time and transit time.</p>
    
    <h3>3.1 Ready-to-Ship Items</h3>
    <p>Items that are currently in stock are typically processed and dispatched within 1-2 business days.</p>
    
    <h3>3.2 Made-to-Order and Artisanal Items</h3>
    <p>Many Tofhaverse products are created specifically for you after an order is placed. The creation time (or "lead time") for these items is clearly stated on the product page. Lead times can range from a few days to several weeks, depending on the complexity of the craft. Once the artisan completes your item, it is immediately prepared for shipment.</p>
    
    <h3>3.3 Personalization Time</h3>
    <p>If you have requested personalization (such as engraving or custom embroidery), please allow an additional 3-5 business days for our master craftsman to complete your request with the precision it deserves.</p>

    <h2>4. Delivery Estimates</h2>
    <p>Estimated delivery dates provided at checkout are our best projections based on current carrier performance and artisan lead times. While we make every effort to meet these dates, they are not guaranteed. Factors such as inclement weather, carrier delays, or customs inspections for international orders can occasionally impact delivery timelines. We will notify you promptly if we become aware of any significant delays affecting your order.</p>

    <h2>5. Tracking Your Order</h2>
    <p>Once your order has been dispatched, you will receive a shipping confirmation email containing a tracking number and a link to the carrier's website. You can also track your order status directly within your Tofhaverse account under "Order History." For multi-item orders, items may ship from different locations and arrive in separate packages at different times. You will receive a unique tracking number for each shipment.</p>

    <h2>6. Shipping Destinations and International Logistics</h2>
    <p>Tofhaverse currently ships to over 42 countries across North America, Europe, Asia, and Oceania. We are constantly working to expand our reach to more gift-givers around the world.</p>
    
    <h3>6.1 International Duties and Taxes</h3>
    <p>For international orders, the recipient is the importer of record and must comply with all laws and regulations of the destination country. Orders shipped outside of the United States may be subject to import taxes, customs duties, and fees levied by the destination country ("Import Fees"). Customary Import Fees are the responsibility of the recipient. Tofhaverse has no control over these charges and cannot predict what they may be.</p>
    
    <h3>6.2 Customs Clearance</h3>
    <p>Customs policies vary widely from country to country. When customs clearance procedures are required, it can cause delays beyond our original delivery estimates. We provide all necessary documentation to facilitate a smooth clearance process, but we cannot intervene in the official customs procedures of any sovereign nation.</p>

    <h2>7. Packaging and Presentation</h2>
    <p>We believe the unboxing experience is a vital part of the gift. All Tofhaverse items are shipped in our signature premium packaging, designed to be both beautiful and highly protective. Our packaging materials are 100% recyclable and FSC-certified, reflecting our commitment to sustainability. For an extra touch of elegance, you may select "Premium Gift Wrap" at checkout, which includes artisanal paper, silk ribbons, and a hand-written note.</p>

    <h2>8. Lost, Stolen, or Damaged Shipments</h2>
    <p>We take full responsibility for your order until it is successfully delivered. If your tracking information indicates that your package was delivered but you have not received it, please check with neighbors and your local post office before contacting us.</p>
    
    <h3>8.1 Damaged Items</h3>
    <p>If your gift arrives damaged, please take photographs of the packaging and the item immediately and contact support@tofhaverse.com within 48 hours. We will arrange for a priority replacement or a full refund. Please keep all original packaging materials as they may be required for a carrier insurance claim.</p>
    
    <h3>8.2 Lost Shipments</h3>
    <p>If a shipment is deemed lost by the carrier (e.g., no tracking updates for 10 consecutive business days), we will initiate a replacement or refund at no cost to you.</p>

    <h2>9. Address Changes and Failed Deliveries</h2>
    <p>Please double-check your shipping address before completing your order. If you realize there is an error, contact us immediately. Once an order has been dispatched, we cannot guarantee that the carrier will be able to redirect the package.</p>
    <p>If a package is returned to us due to an incorrect address provided by the customer or multiple failed delivery attempts, the customer will be responsible for the cost of re-shipping the item.</p>

    <h2>10. Shipping to P.O. Boxes and APO/FPO Addresses</h2>
    <p>While we can ship many items to P.O. Boxes via standard postal services, certain oversized or high-value items, as well as expedited shipments, require a physical street address for delivery. We proudly support our service members and ship to APO/FPO/DPO addresses whenever carrier limitations allow.</p>

    <h2>11. Contact Our Logistics Team</h2>
    <p>If you have a complex shipping request, such as multi-address corporate gifting or international freight inquiries, please contact our dedicated logistics department:</p>
    <p>
      Tofhaverse Logistics<br />
      Email: logistics@tofhaverse.com<br />
      Mon-Fri, 9am-6pm EST
    </p>

    <hr />
    <p>Note: Our shipping policies are designed to accommodate the intricate nature of global artisanal trade. We appreciate your patience and your passion for world-class craftsmanship. Every mile your gift travels is a testament to the effort and care we put into our curated community.</p>
  </LegalLayout>
);
