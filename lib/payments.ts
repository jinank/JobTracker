/** PayPal payment link for SuperInterns Pro ($9.99/mo). Override with NEXT_PUBLIC_PAYPAL_PRO_URL. */
export const PAYPAL_PRO_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_PAYPAL_PRO_URL?.trim() ||
  "https://www.paypal.com/ncp/payment/6D25J3AW669TN";

/** PayPal payment link for SuperInterns Starter ($4.99/mo). Override with NEXT_PUBLIC_PAYPAL_STARTER_URL. */
export const PAYPAL_STARTER_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_PAYPAL_STARTER_URL?.trim() || PAYPAL_PRO_CHECKOUT_URL;

export function getPayPalProCheckoutUrl(): string {
  return PAYPAL_PRO_CHECKOUT_URL;
}

export function getPayPalStarterCheckoutUrl(): string {
  return PAYPAL_STARTER_CHECKOUT_URL;
}
