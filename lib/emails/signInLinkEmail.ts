import { SITE_NAME, getSiteOrigin, getSupportEmail } from "@/lib/site";

export type SignInLinkEmailContent = {
  subject: string;
  html: string;
  text: string;
};

export function buildSignInLinkEmail(signInUrl: string): SignInLinkEmailContent {
  const siteName = SITE_NAME;
  const origin = getSiteOrigin();
  const supportEmail = getSupportEmail();
  const subject = `Sign in to ${siteName}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(15,23,42,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,#6B46FE 0%,#5B36E6 100%);padding:28px 32px;">
              <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.85);">${siteName}</p>
              <h1 style="margin:10px 0 0;font-size:24px;line-height:1.25;font-weight:700;color:#ffffff;">Your sign-in link</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#334155;">
                Tap the button below to sign in to your ${siteName} account. This link works once and expires in about an hour.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0;">
                <tr>
                  <td style="border-radius:12px;background:#6B46FE;">
                    <a href="${signInUrl}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">
                      Sign in to ${siteName}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#64748b;">
                If the button doesn&apos;t work, copy and paste this URL into your browser:
              </p>
              <p style="margin:0;font-size:12px;line-height:1.6;color:#6B46FE;word-break:break-all;">
                <a href="${signInUrl}" style="color:#6B46FE;text-decoration:underline;">${signInUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">
                Didn&apos;t request this? You can safely ignore this email.
                Questions? Contact us at
                <a href="mailto:${supportEmail}" style="color:#6B46FE;text-decoration:none;">${supportEmail}</a>.
              </p>
              <p style="margin:12px 0 0;font-size:11px;line-height:1.5;color:#cbd5e1;">
                ${siteName} · ${origin.replace(/^https?:\/\//, "")}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Sign in to ${siteName}`,
    "",
    "Use this link to sign in (expires in about an hour):",
    signInUrl,
    "",
    "If you didn't request this, you can ignore this email.",
    `Questions? ${supportEmail}`,
  ].join("\n");

  return { subject, html, text };
}
