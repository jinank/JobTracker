import Script from "next/script";

/** Loads GA + Ads tags after the page is idle to improve mobile PageSpeed scores. */
export function GoogleAnalytics() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-L0WY604E6K"
        strategy="lazyOnload"
      />
      <Script id="google-gtag" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-L0WY604E6K');
          gtag('config', 'AW-18093007265');
        `}
      </Script>
    </>
  );
}
