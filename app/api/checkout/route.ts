import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/requirePaid";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (user.paid) {
    return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    customer_email: user.email,
    metadata: {
      userId: user.userId,
      email: user.email,
    },
    subscription_data: {
      metadata: {
        userId: user.userId,
        email: user.email,
      },
    },
    success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/`,
  });

  return NextResponse.json({ url: session.url });
}
