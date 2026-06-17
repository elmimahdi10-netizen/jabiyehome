// emails/base.ts — Shared HTML email template builder
// Pure HTML strings compatible with all email clients (no JSX required)

export const BRAND = {
  name: "Jabiyehome",
  primaryColor: "#06b6d4",
  navyColor: "#0a1628",
  textColor: "#0a0f1e",
  mutedColor: "#64748b",
  bgColor: "#f8fafc",
  cardColor: "#ffffff",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jabiyehome.com",
};

export function emailWrapper(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${BRAND.name}</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${BRAND.bgColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    * { box-sizing: border-box; }
    a { color: ${BRAND.primaryColor}; }
  </style>
</head>
<body>
  <!-- Preview text -->
  <div style="display:none;font-size:1px;color:${BRAND.bgColor};max-height:0;overflow:hidden;opacity:0;">
    ${previewText}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.bgColor};padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:0 0 24px 0;text-align:center;">
          <a href="${BRAND.siteUrl}" style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;">
            <div style="background:${BRAND.navyColor};border-radius:12px;padding:10px;display:inline-block;">
              <span style="font-size:24px;">🛡️</span>
            </div>
            <span style="font-family:'Plus Jakarta Sans',sans-serif;font-size:22px;font-weight:700;color:${BRAND.navyColor};">
  Jabiye<span style="color:${BRAND.primaryColor};">home</span>
</span>
          </a>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:${BRAND.cardColor};border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px;text-align:center;">
          <p style="margin:0;font-size:12px;color:${BRAND.mutedColor};">
            ${BRAND.name} · 1234 Security Ave · San Francisco, CA 94105
          </p>
          <p style="margin:8px 0 0;font-size:12px;color:${BRAND.mutedColor};">
            <a href="${BRAND.siteUrl}/privacy" style="color:${BRAND.mutedColor};">Privacy</a> ·
            <a href="${BRAND.siteUrl}/terms" style="color:${BRAND.mutedColor};">Terms</a> ·
            <a href="${BRAND.siteUrl}/unsubscribe" style="color:${BRAND.mutedColor};">Unsubscribe</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function emailButton(text: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:${BRAND.primaryColor};color:${BRAND.navyColor};font-weight:700;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:10px;">${text}</a>`;
}

export function emailSection(content: string, paddingTop = "32px", paddingBottom = "32px"): string {
  return `<div style="padding:${paddingTop} 40px ${paddingBottom};">${content}</div>`;
}
