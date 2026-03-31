import { MessageCircle, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/config/siteConfig"; // 🔥 Connected to your config

export default function Contact() {
  // Format the number for display (+91 XXXXX XXXXX)
  const displayPhone = `+${SITE_CONFIG.WHATSAPP_NUMBER.slice(0, 2)} ${SITE_CONFIG.WHATSAPP_NUMBER.slice(2, 7)} ${SITE_CONFIG.WHATSAPP_NUMBER.slice(7)}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" data-testid="page-contact">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-maroon text-center mb-2" data-testid="text-contact-title">
        Contact Us
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
        We're here to help! Reach out to us anytime.
      </p>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-6 border border-gold/10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <MessageCircle size={22} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold mb-1">WhatsApp</h3>
              <p className="text-sm text-muted-foreground font-medium mb-1">{displayPhone}</p>
              <p className="text-xs text-muted-foreground mb-3">We typically respond within 2 hours on WhatsApp</p>
              <a
                // 🔥 Dynamic link pulling from config
                href={`https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=Hello%2C+I+need+help+with+my+order`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white transition-all shadow-sm" data-testid="button-contact-whatsapp">
                  <MessageCircle size={16} className="mr-2" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gold/10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Mail size={22} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground font-medium">hello@babysilk.in</p>
              <p className="text-xs text-muted-foreground mt-1">We'll get back to you within 24 hours</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gold/10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <Clock size={22} className="text-gold-dark" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold mb-1">Business Hours</h3>
              <p className="text-sm text-muted-foreground font-medium">Monday - Saturday</p>
              <p className="text-sm text-muted-foreground font-medium">9:00 AM - 7:00 PM IST</p>
              <p className="text-xs text-muted-foreground mt-1">Closed on Sundays and public holidays</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}