import { useSearch, Link } from "wouter";
import { CheckCircle, Package, MessageCircle, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/config/siteConfig"; 

export default function OrderSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const orderId = params.get("orderId") || "BSK-000000";
  const payLater = params.get("payLater") === "true";

  // DYNAMIC WHATSAPP MESSAGE
  const waMessage = payLater
    ? `Hi BabySilk! My Order ID is ${orderId}. I selected 'Pay Later' and would like to complete my payment now.`
    : `Hi BabySilk! My Order ID is ${orderId}. I have a question regarding my recent order.`;

  // Dynamic link pulling from config
  const waLink = `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center min-h-[75vh] flex flex-col justify-center animate-in fade-in duration-700">
      
      {/* HEADER ICON & TITLE */}
      <div className="mb-8 animate-in zoom-in-95 duration-500">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 ${payLater ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'}`}>
          {payLater ? (
            <Clock size={48} className="text-amber-500" />
          ) : (
            <CheckCircle size={48} className="text-green-500" />
          )}
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-maroon mb-3 tracking-tight">
          {payLater ? "Order Saved!" : "Payment Successful!"}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg font-medium">
          {payLater ? "Just one more step to confirm your order." : "Thank you for shopping with BabySilk."}
        </p>
      </div>

      {/* ORDER DETAILS CARD */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gold/20 mb-8 shadow-lg animate-in slide-in-from-bottom-6 fade-in duration-500 delay-150 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-maroon/20"></div>
        
        <p className="text-xs text-muted-foreground mb-2 font-bold uppercase tracking-widest">Order Reference</p>
        <p className="text-3xl md:text-4xl font-bold text-maroon font-mono mb-6 tracking-tight bg-cream/50 inline-block px-4 py-2 rounded-lg border border-gold/10">
          {orderId}
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-foreground bg-cream py-3 px-5 rounded-xl border border-gold/30 inline-flex shadow-sm">
          <Package size={18} className="text-maroon" />
          Estimated Delivery: 7-9 Business Days
        </div>

        {/* PAY LATER WARNING BOX */}
        {payLater && (
          <div className="mt-6 bg-amber-50 rounded-xl p-5 border border-amber-200 text-left flex items-start gap-4 shadow-sm">
            <ShieldCheck size={28} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-amber-900 leading-relaxed">
              Your order is currently on hold. Please message us on WhatsApp within 24 hours to complete your payment and secure your beautiful dresses!
            </p>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
        
        {/* PRIMARY WHATSAPP BUTTON (Styled Anchor Tag) */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full flex items-center justify-center gap-2 text-base md:text-lg py-5 px-6 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all hover:scale-[1.02] font-bold ${
            payLater 
              ? "bg-[#25D366] hover:bg-[#20bd5a] text-white" 
              : "bg-white border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5"
          }`}
        >
          <MessageCircle size={22} className={payLater ? "fill-white text-white" : "fill-[#25D366] text-[#25D366]"} />
          {payLater ? "Complete Payment on WhatsApp" : "Get Support on WhatsApp"}
        </a>

        {/* TRACK ORDER BUTTON (Styled Anchor Tag via Wouter Link) */}
        <Link href="/track-order">
          <a className="w-full flex items-center justify-center gap-2 bg-maroon hover:bg-maroon-dark text-gold font-bold text-base md:text-lg py-5 px-6 rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer">
            <Package size={20} />
            Track My Order
          </a>
        </Link>

        {/* CONTINUE SHOPPING */}
        <div className="pt-6">
          <Link href="/shop">
            <a className="inline-flex items-center gap-1.5 text-sm md:text-base font-bold text-muted-foreground hover:text-maroon transition-colors cursor-pointer bg-white px-5 py-2.5 rounded-full border border-gold/20 shadow-sm">
              Continue Shopping <ArrowRight size={16} />
            </a>
          </Link>
        </div>
        
      </div>
    </div>
  );
}