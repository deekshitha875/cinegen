import { NextRequest, NextResponse } from "next/server";

// Real Stripe payment intent creation
// Requires STRIPE_SECRET_KEY in .env.local
export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "inr", projectId, creatorName, milestoneTitle } = await request.json();

    // Check if Stripe key is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.includes("PLACEHOLDER")) {
      // Return a demo client secret so the UI still works for hackathon
      return NextResponse.json({
        clientSecret: "pi_demo_" + Math.random().toString(36).slice(2) + "_secret_demo",
        demo: true,
        message: "Demo mode — add STRIPE_SECRET_KEY to .env.local for real payments",
      });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects paise (smallest unit)
      currency,
      metadata: {
        projectId: projectId ?? "demo",
        creatorName: creatorName ?? "Creator",
        milestoneTitle: milestoneTitle ?? "Milestone Payment",
        platform: "CineGen",
      },
      description: `CineGen: ${milestoneTitle} — ${creatorName}`,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, demo: false });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
