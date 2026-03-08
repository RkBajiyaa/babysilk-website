export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8" data-testid="page-privacy-policy">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-maroon text-center mb-8" data-testid="text-privacy-title">
        Privacy Policy
      </h1>

      <div className="bg-white rounded-lg p-6 sm:p-8 border border-gold/10 prose prose-sm max-w-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <p className="text-muted-foreground text-xs mb-6">Last updated: March 2026</p>

        <h2 className="font-heading text-lg font-semibold text-maroon mt-6 mb-3">1. Information We Collect</h2>
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">
          When you place an order on BabySilk (babysilk.in), we collect the following information: your name, phone number, email address (if provided), shipping address including city, state, and pincode, and payment transaction details (UPI Transaction ID). We use this information solely to process and deliver your orders.
        </p>

        <h2 className="font-heading text-lg font-semibold text-maroon mt-6 mb-3">2. How We Use Your Information</h2>
        <p className="text-sm text-foreground/80 leading-relaxed mb-2">We use the information we collect to:</p>
        <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-1 mb-4">
          <li>Process and fulfill your orders</li>
          <li>Send order confirmation and shipping updates via WhatsApp or SMS</li>
          <li>Communicate with you regarding exchanges or queries</li>
          <li>Improve our products and services</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="font-heading text-lg font-semibold text-maroon mt-6 mb-3">3. Information Sharing</h2>
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">
          We do not sell, trade, or rent your personal information to third parties. We may share your shipping details with our delivery partners solely for the purpose of delivering your order. We may also disclose information if required by law or to protect our rights.
        </p>

        <h2 className="font-heading text-lg font-semibold text-maroon mt-6 mb-3">4. Data Security</h2>
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">
          We take reasonable precautions to protect your personal information. Your payment is processed through secure UPI channels, and we do not store any bank account or UPI PIN details. However, no method of transmission over the internet is 100% secure.
        </p>

        <h2 className="font-heading text-lg font-semibold text-maroon mt-6 mb-3">5. Cookies</h2>
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">
          Our website uses cookies and local storage to maintain your shopping cart and improve your browsing experience. These do not contain personally identifiable information and are stored locally on your device.
        </p>

        <h2 className="font-heading text-lg font-semibold text-maroon mt-6 mb-3">6. Your Rights</h2>
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">
          You have the right to access, correct, or request deletion of your personal data. To exercise these rights, please contact us on WhatsApp or email us at hello@babysilk.in.
        </p>

        <h2 className="font-heading text-lg font-semibold text-maroon mt-6 mb-3">7. Changes to This Policy</h2>
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page. We encourage you to review this policy periodically.
        </p>

        <h2 className="font-heading text-lg font-semibold text-maroon mt-6 mb-3">8. Contact Us</h2>
        <p className="text-sm text-foreground/80 leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at:<br />
          Email: hello@babysilk.in<br />
          WhatsApp: +91 99999 99999<br />
          Website: babysilk.in
        </p>
      </div>
    </div>
  );
}
