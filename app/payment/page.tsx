"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, DollarSign, Shield, Check, Lock, ArrowLeft, Sparkles, Calendar, Building2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, desc: "Visa, Mastercard, Amex", recommended: true },
  { id: "upi", name: "UPI", icon: DollarSign, desc: "PhonePe, GPay, Paytm", recommended: false },
  { id: "netbanking", name: "Net Banking", icon: Building2, desc: "All major banks", recommended: false },
];

export default function PaymentPage() {
  const [method, setMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const amount = 12500; // $125 project milestone
  const serviceFee = 1250; // 10%
  const total = amount + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(false);
    toast.success("Payment Successful! ₹13,750 paid to Aryan Kapoor");
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/projects/proj-001" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Project
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="font-display font-bold text-3xl mb-2">Complete Payment</h1>
            <p className="text-muted-foreground">Milestone 1: Initial Concept & Storyboard</p>
          </div>

          {/* Payment Method Selection */}
          <div className="glass rounded-2xl border border-white/5 p-6 mb-6">
            <h2 className="font-semibold text-lg mb-4">Select Payment Method</h2>
            <div className="grid grid-cols-1 gap-3">
              {PAYMENT_METHODS.map((pm) => (
                <motion.button
                  key={pm.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setMethod(pm.id)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    method === pm.id
                      ? "bg-violet-500/10 border-violet-500/40"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method === pm.id ? "bg-violet-500/20" : "bg-white/10"}`}>
                      <pm.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{pm.name}</span>
                        {pm.recommended && (
                          <span className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full font-medium">Recommended</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{pm.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === pm.id ? "border-violet-500 bg-violet-500" : "border-white/20"}`}>
                      {method === pm.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Card Details Form */}
          <div className="glass rounded-2xl border border-white/5 p-6">
            <h2 className="font-semibold text-lg mb-4">Card Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 placeholder:text-muted-foreground transition-all"
                    required
                  />
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Expiry Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        setExpiry(value);
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 placeholder:text-muted-foreground transition-all"
                      required
                    />
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">CVV</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      placeholder="123"
                      maxLength={3}
                      className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 placeholder:text-muted-foreground transition-all"
                      required
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Cardholder Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ARJUN MEHTA"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 placeholder:text-muted-foreground transition-all uppercase"
                  required
                />
              </div>

              {/* Demo Notice */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-300 mb-1">Hackathon Demo Mode</h4>
                    <p className="text-xs text-muted-foreground">This is a simulated payment flow. Use test card: 4242 4242 4242 4242 with any future expiry and CVV.</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-xl shadow-violet-500/30"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </span>
                ) : (
                  `Pay ₹${total.toLocaleString()}`
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-green-400" />
                <span>Secured by Stripe · PCI DSS Level 1 Compliant</span>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl border border-white/5 p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

            {/* Project details */}
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-4">
                <img
                  src="https://picsum.photos/seed/aryan/200/200"
                  alt="Aryan Kapoor"
                  className="w-12 h-12 rounded-xl border-2 border-background object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm">Aryan Kapoor</h3>
                  <p className="text-xs text-muted-foreground">AI Filmmaker & Visual Storyteller</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="font-medium text-sm mb-1">90-Second AI Brand Film</h4>
                <p className="text-xs text-muted-foreground mb-3">Cinematic storytelling with AI-generated visuals and motion design</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Milestone Payment</span>
                  <span className="text-violet-300 font-semibold">1 of 3</span>
                </div>
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-3 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Milestone Amount</span>
                <span className="font-medium">₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="text-xs text-muted-foreground">(10%)</span>
                </div>
                <span className="font-medium">₹{serviceFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mb-6">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-display font-bold text-2xl gradient-text">₹{total.toLocaleString()}</span>
            </div>

            {/* Security badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="w-4 h-4 text-green-400" />
                <span>Funds held in escrow until delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="w-4 h-4 text-green-400" />
                <span>Dispute resolution & money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="w-4 h-4 text-green-400" />
                <span>256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
