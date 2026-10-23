"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Shield, Check, Lock, ArrowLeft, Sparkles, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Real Stripe.js loaded dynamically to avoid SSR issues
let stripePromise: any = null;
function getStripe() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (key && !key.includes("PLACEHOLDER")) {
      import("@stripe/stripe-js").then(({ loadStripe }) => {
        stripePromise = loadStripe(key);
      });
    }
  }
  return stripePromise;
}

const PAYMENT_METHODS = [
  { id: "card", name: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, Amex", recommended: true },
];

function PaymentContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") ?? "proj-001";
  const creatorName = searchParams.get("creator") ?? "Aryan Kapoor";
  const projectTitle = searchParams.get("title") ?? "90-Second AI Brand Film";
  const milestoneAmt = Number(searchParams.get("amount") ?? "12500");

  const [method, setMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const serviceFee = Math.round(milestoneAmt * 0.1);
  const total = milestoneAmt + serviceFee;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").substring(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").substring(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Step 1: Create PaymentIntent on server
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "inr",
          projectId,
          creatorName,
          milestoneTitle: `Milestone — ${projectTitle}`,
        }),
      });
      const { clientSecret, demo, error } = await res.json();

      if (error) throw new Error(error);

      if (demo) {
        // Demo mode — Stripe not yet configured
        setIsDemo(true);
        await new Promise(r => setTimeout(r, 1500));
        setSuccess(true);
        toast.success(`Demo: ₹${total.toLocaleString()} payment recorded`);
        setProcessing(false);
        return;
      }

      // Step 2: Confirm payment with Stripe.js
      const stripe = await getStripe();
      if (!stripe) throw new Error("Stripe failed to load");

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // In production you'd use Stripe Elements here
            // For now we use the test card details
            number: cardNumber.replace(/\s/g, ""),
            exp_month: expiry.split("/")[0],
            exp_year: "20" + expiry.split("/")[1],
            cvc: cvv,
          },
          billing_details: { name },
        },
      });

      if (stripeError) throw new Error(stripeError.message);

      setSuccess(true);
      toast.success(`✅ ₹${total.toLocaleString()} paid to ${creatorName}!`);
    } catch (err: any) {
      toast.error(err.message || "Payment failed. Please try again.");
    }

    setProcessing(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-green-400" />
          </motion.div>
          <h1 className="font-display font-bold text-3xl mb-3">Payment {isDemo ? "Recorded (Demo)" : "Successful"}!</h1>
          <p className="text-muted-foreground mb-2">
            ₹{total.toLocaleString()} {isDemo ? "would be sent" : "sent"} to {creatorName}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Funds held in escrow until project delivery is confirmed
          </p>
          {isDemo && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-300">
              <Sparkles className="w-4 h-4 inline mr-2" />
              Demo mode — add real Stripe keys to process live payments
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Link href={`/projects/${projectId}`}
              className="px-6 py-3 glass border border-white/10 rounded-xl font-semibold hover:bg-white/5 transition-all">
              Back to Project
            </Link>
            <Link href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all">
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Project
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1">Complete Payment</h1>
            <p className="text-muted-foreground">Milestone 1 · {projectTitle}</p>
          </div>

          {/* Payment Method */}
          <div className="glass rounded-2xl border border-white/5 p-6">
            <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((pm) => (
                <motion.button
                  key={pm.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setMethod(pm.id)}
                  className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-3 ${
                    method === pm.id
                      ? "bg-violet-500/10 border-violet-500/40"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method === pm.id ? "bg-violet-500/20" : "bg-white/10"}`}>
                    <pm.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{pm.name}</span>
                      {pm.recommended && (
                        <span className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full">Recommended</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{pm.desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${method === pm.id ? "border-violet-500 bg-violet-500" : "border-white/20"}`}>
                    {method === pm.id && <Check className="w-full h-full text-white p-0.5" />}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Card Details */}
          <div className="glass rounded-2xl border border-white/5 p-6">
            <h2 className="font-semibold text-lg mb-4">Card Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 placeholder:text-muted-foreground transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Expiry</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 placeholder:text-muted-foreground transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">CVV</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="•••"
                      maxLength={3}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 placeholder:text-muted-foreground transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Cardholder Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="ARJUN MEHTA"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 placeholder:text-muted-foreground transition-all uppercase tracking-wide"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-semibold text-base hover:opacity-90 transition-all disabled:opacity-50 shadow-xl shadow-violet-500/25"
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
                <span>Secured by Stripe · PCI DSS Level 1 · 256-bit SSL</span>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl border border-white/5 p-6 sticky top-24 space-y-6">
            <h2 className="font-semibold text-lg">Order Summary</h2>

            <div className="flex items-start gap-3">
              <img
                src={`https://picsum.photos/seed/${creatorName.split(" ")[0].toLowerCase()}/200/200`}
                alt={creatorName}
                className="w-12 h-12 rounded-xl border-2 border-background object-cover flex-shrink-0"
              />
              <div>
                <div className="font-semibold text-sm">{creatorName}</div>
                <div className="text-xs text-muted-foreground">AI Creator</div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl">
              <div className="font-medium text-sm mb-1">{projectTitle}</div>
              <div className="text-xs text-muted-foreground mb-3">AI-generated cinematic content</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Milestone</span>
                <span className="text-violet-300 font-semibold">1 of 3</span>
              </div>
            </div>

            <div className="space-y-2 pb-4 border-b border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Milestone Amount</span>
                <span>₹{milestoneAmt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (10%)</span>
                <span>₹{serviceFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-display font-bold text-2xl gradient-text">₹{total.toLocaleString()}</span>
            </div>

            <div className="space-y-2.5">
              {[
                "Funds held in escrow until delivery",
                "Full refund if project not delivered",
                "Dispute resolution included",
              ].map((txt) => (
                <div key={txt} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
