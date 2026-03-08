import { MessageCircle, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8" data-testid="page-contact">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-maroon text-center mb-2" data-testid="text-contact-title">
        Contact Us
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
        We're here to help! Reach out to us anytime.
      </p>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-6 border border-gold/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <MessageCircle size={22} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold mb-1">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mb-1">+91 99999 99999</p>
              <p className="text-xs text-muted-foreground mb-3">We typically respond within 2 hours on WhatsApp</p>
              <a
                href="https://wa.me/919999999999?text=Hello%2C+I+need+help+with+my+order"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-green-600 text-white" data-testid="button-contact-whatsapp">
                  <MessageCircle size={16} className="mr-2" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gold/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Mail size={22} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">hello@babysilk.in</p>
              <p className="text-xs text-muted-foreground mt-1">We'll get back to you within 24 hours</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gold/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <Clock size={22} className="text-gold-dark" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold mb-1">Business Hours</h3>
              <p className="text-sm text-muted-foreground">Monday - Saturday</p>
              <p className="text-sm text-muted-foreground">9:00 AM - 7:00 PM IST</p>
              <p className="text-xs text-muted-foreground mt-1">Closed on Sundays and public holidays</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
