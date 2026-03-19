import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import type Stripe from "stripe";

async function updateSubscriptionStatus(
  subscription: Stripe.Subscription,
  userId?: string
) {
  const email =
    (subscription.metadata?.email as string) ?? null;
  const uid = userId ?? (subscription.metadata?.userId as string);

  const isActive =
    subscription.status === "active" || subscription.status === "trialing";

  const endsAt = subscription.cancel_at
    ? new Date(subscription.cancel_at * 1000).toISOString()
    : subscription.ended_at
      ? new Date(subscription.ended_at * 1000).toISOString()
      : null;

  const update = {
    paid: isActive,
    subscription_status: subscription.status,
    stripe_subscription_id: subscription.id,
    stripe_customer_id:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id,
    subscription_ends_at: endsAt,
  };

  if (uid) {
    await supabase.from("users").update(update).eq("id", uid);
  } else if (email) {
    await supabase.from("users").update(update).eq("email", email);
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        await updateSubscriptionStatus(subscription, userId ?? undefined);
      }

      if (userId) {
        await supabase
          .from("users")
          .update({ paid: true, paid_at: new Date().toISOString() })
          .eq("id", userId);

        await supabase.from("payments").insert({
          user_id: userId,
          stripe_session_id: session.id,
          stripe_payment_intent:
            (session.payment_intent as string) ?? session.subscription,
          amount_cents: session.amount_total ?? 499,
          currency: session.currency ?? "usd",
          status: "completed",
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await updateSubscriptionStatus(subscription);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const cust = invoice.customer;
      const customerId =
        typeof cust === "string" ? cust : cust?.id ?? null;

      if (customerId) {
        await supabase
          .from("users")
          .update({ subscription_status: "past_due" })
          .eq("stripe_customer_id", customerId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
