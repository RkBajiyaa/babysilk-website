import { RefreshCw, Package, MessageCircle, CheckCircle } from "lucide-react";

export default function Returns() {
  const steps = [
    {
      icon: MessageCircle,
      title: "Step 1: Contact Us",
      desc: "Send us a message on WhatsApp within 7 days of receiving your order. Share your Order ID and reason for exchange.",
    },
    {
      icon: Package,
      title: "Step 2: Ship the Item",
      desc: "Pack the item in its original packaging and ship it back to us. We'll share the return address on WhatsApp.",
    },
    {
      icon: RefreshCw,
      title: "Step 3: Get Your Exchange",
      desc: "Once we receive and inspect the item, we'll ship your replacement within 3-5 business days.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" data-testid="page-returns">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-maroon text-center mb-2" data-testid="text-returns-title">
        Returns & Exchange
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
        We want you to be happy with your purchase
      </p>

      <div className="bg-white rounded-lg p-6 border border-gold/10 mb-6">
        <h2 className="font-heading text-lg font-semibold text-maroon mb-4">Our Exchange Policy</h2>
        <ul className="space-y-3 text-sm text-foreground/80" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {[
            "Exchange available within 7 days from delivery date",
            "Exchange only - no refunds",
            "Item must be unused and unworn",
            "Original packaging must be intact",
            "Tags should not be removed",
            "Initiate exchange via WhatsApp only",
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle size={16} className="text-teal shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="font-heading text-lg font-semibold text-maroon mb-4 text-center">How It Works</h2>
      <div className="space-y-4 mb-8">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-white rounded-lg p-5 border border-gold/10 flex gap-4" data-testid={`card-return-step-${idx}`}>
            <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
              <step.icon size={22} className="text-teal" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-sm text-foreground/70" style={{ fontFamily: "'Poppins', sans-serif" }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <a
          href="https://wa.me/919999999999?text=Hello%2C+I+want+to+initiate+an+exchange"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md font-medium"
          data-testid="button-exchange-whatsapp"
        >
          <MessageCircle size={18} />
          Start Exchange on WhatsApp
        </a>
      </div>
    </div>
  );
}
