"use client";
import { motion } from "framer-motion";
import { Check, Zap, Building2, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "For brands just getting started with AI content",
    color: "border-white/10",
    badge: null,
    features: [
      "Post up to 2 briefs/month",
      "Browse all 18+ creators",
      "AI brief builder (5 uses/month)",
      "Basic match scores",
      "10% platform fee on transactions",
    ],
    cta: "Get Started Free",
    href: "/login",
  },
  {
    name: "Growth",
    price: "₹4,999",
    period: "/month",
    desc: "For growing brands running regular campaigns",
    color: "border-violet-500/40",
    badge: "Most Popular",
    features: [
      "Unlimited briefs",
      "Priority creator matching",
      "AI brief builder (unlimited)",
      "Explainable match scores",
      "Side-by-side creator comparison",
      "Budget estimator",
      "8% platform fee (save 2%)",
      "Dedicated support",
    ],
    cta: "Start Growth Plan",
    href: "/login",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For agencies and large brands with high volume",
    color: "border-cyan-500/30",
    badge: null,
    features: [
      "Everything in Growth",
      "Custom creator vetting",
      "Dedicated account manager",
      "White-label options",
      "API access",
      "5% platform fee",
      "SLA guarantees",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    href: "mailto:hello@cinegen.ai",
  },
];

const METRICS = [
  { label: "Avg. brief value", value: "₹50,000", icon: DollarSign },
  { label: "Platform take rate", value: "10%", icon: TrendingUp },
  { label: "Monthly briefs (target)", value: "1,000", icon: Zap },
  { label: "Monthly GMV potential", value: "₹5Cr", icon: Building2 },
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Simple, transparent pricing
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-4xl sm:text-5xl mb-4"
        >
          Pay as you grow
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          CineGen earns 10% on every transaction. No hidden fees. No subscriptions required to get started.
        </motion.p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className={`glass rounded-2xl border ${plan.color} p-6 relative flex flex-col`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs font-semibold rounded-full">
                {plan.badge}
              </div>
            )}
            <div className="mb-6">
              <h2 className="font-display font-bold text-xl mb-1">{plan.name}</h2>
              <p className="text-muted-foreground text-sm mb-4">{plan.desc}</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-3xl gradient-text">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                plan.badge
                  ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:opacity-90 shadow-xl shadow-violet-500/25"
                  : "glass border border-white/10 hover:bg-white/5"
              }`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Business metrics */}
      <div className="glass rounded-2xl border border-violet-500/20 p-8">
        <h2 className="font-display font-bold text-2xl mb-2 text-center">Business Model</h2>
        <p className="text-muted-foreground text-center mb-8">
          Transaction-based revenue. We win when creators and brands win.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-3">
                <m.icon className="w-5 h-5 text-violet-400" />
              </div>
              <div className="font-display font-bold text-2xl gradient-text mb-1">{m.value}</div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6 pt-6 border-t border-white/5">
          At 1,000 active briefs/month × ₹50,000 avg. value × 10% fee = <span className="text-foreground font-semibold">₹50 lakh monthly GMV</span>
        </p>
      </div>
    </div>
  );
}
