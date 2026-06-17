/** PayPal payment link for SuperInterns Pro ($9.99/mo). Override with NEXT_PUBLIC_PAYPAL_PRO_URL. */
export const PAYPAL_PRO_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_PAYPAL_PRO_URL?.trim() ||
  "https://www.paypal.com/ncp/payment/6D25J3AW669TN";

export function getPayPalProCheckoutUrl(): string {
  return PAYPAL_PRO_CHECKOUT_URL;
}
