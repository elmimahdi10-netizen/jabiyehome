// lib/services/email.service.ts — Production email service using Resend
import { resend, FROM_EMAIL } from "@/lib/resend";
import { emailWrapper, emailButton, emailSection, BRAND } from "@/emails/base";

// ─── Welcome Email ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, firstName: string): Promise<void> {
  const content = emailSection(`
    <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:${BRAND.navyColor};">
      Welcome to Jabiyehome, ${firstName}! 🎉
    </h1>
    <p style="margin:0 0 24px;color:${BRAND.mutedColor};font-size:16px;line-height:1.6;">
      Your account is ready. You can now manage your security system, track orders, and protect what matters most.
    </p>
    <div style="background:#f8fafc;border-radius:12px;padding:20px;margin:0 0 28px;">
      ${["Browse 280+ security products", "Get free shipping on orders over $299", "Track your orders in real time", "Access exclusive member pricing"].map(item =>
        `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <span style="color:${BRAND.primaryColor};font-weight:700;">✓</span>
          <span style="color:${BRAND.navyColor};font-size:14px;">${item}</span>
        </div>`
      ).join("")}
    </div>
    <div style="text-align:center;">
      ${emailButton("Shop now", `${BRAND.siteUrl}/products`)}
    </div>
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Welcome to Jabiyehome, ${firstName}`,
    html: emailWrapper(content, `Welcome to Jabiyehome — your account is ready`),
  });
}

// ─── Password Reset ───────────────────────────────────────────────────────────

export async function sendPasswordReset(to: string, resetUrl: string): Promise<void> {
  const content = emailSection(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:color-mix(in srgb, ${BRAND.primaryColor} 12%, white);border-radius:50%;padding:20px;">
        <span style="font-size:32px;">🔒</span>
      </div>
    </div>
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${BRAND.navyColor};text-align:center;">
      Reset your password
    </h1>
    <p style="margin:0 0 8px;color:${BRAND.mutedColor};font-size:15px;line-height:1.6;text-align:center;">
      Someone requested a password reset for your Jabiyehome account.
    </p>
    <p style="margin:0 0 28px;color:${BRAND.mutedColor};font-size:14px;text-align:center;">
      This link expires in <strong>1 hour</strong>.
    </p>
    <div style="text-align:center;margin-bottom:24px;">
      ${emailButton("Reset my password", resetUrl)}
    </div>
    <p style="margin:0;color:${BRAND.mutedColor};font-size:13px;text-align:center;">
      If you didn't request this, you can safely ignore this email. Your password won't change.
    </p>
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your Jabiyehome password",
    html: emailWrapper(content, "Reset your Jabiyehome password — link expires in 1 hour"),
  });
}

// ─── Order Confirmation ───────────────────────────────────────────────────────

export async function sendOrderConfirmation(
  to: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
): Promise<void> {
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  const itemRows = items.map(item => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:${BRAND.navyColor};">
        ${item.name} <span style="color:${BRAND.mutedColor};">×${item.quantity}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:${BRAND.navyColor};text-align:right;font-weight:600;">
        ${formatter.format(item.price * item.quantity)}
      </td>
    </tr>
  `).join("");

  const content = emailSection(`
    <div style="background:${BRAND.navyColor};padding:32px;margin:-0px;border-radius:16px 16px 0 0;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">✅</div>
      <h1 style="margin:0;font-size:26px;font-weight:700;color:white;">Order confirmed!</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:15px;">
        Order <strong style="color:${BRAND.primaryColor};">#${orderNumber}</strong>
      </p>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 24px;color:${BRAND.mutedColor};font-size:15px;line-height:1.6;">
        Thank you for your order! We'll process it within 1 business day and send you a tracking link once it ships.
      </p>

      <h3 style="margin:0 0 16px;font-size:16px;font-weight:600;color:${BRAND.navyColor};">Order items</h3>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${itemRows}
        <tr>
          <td style="padding:16px 0 0;font-size:15px;font-weight:700;color:${BRAND.navyColor};">Total</td>
          <td style="padding:16px 0 0;font-size:18px;font-weight:700;color:${BRAND.navyColor};text-align:right;">
            ${formatter.format(total)}
          </td>
        </tr>
      </table>

      <div style="margin-top:28px;text-align:center;">
        ${emailButton("View order", `${BRAND.siteUrl}/account/orders`)}
      </div>

      <div style="margin-top:28px;background:#f8fafc;border-radius:12px;padding:16px;">
        <p style="margin:0;font-size:13px;color:${BRAND.mutedColor};line-height:1.6;">
          📦 Questions about your order? Reply to this email or contact us at
          <a href="mailto:support@Jabiyehome.com">support@Jabiyehome.com</a>
        </p>
      </div>
    </div>
  `, "0px", "0px");

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Order confirmed — #${orderNumber}`,
    html: emailWrapper(content, `Your Jabiyehome order #${orderNumber} is confirmed`),
  });
}

// ─── Shipping Confirmation ────────────────────────────────────────────────────

export async function sendShippingConfirmation(
  to: string,
  orderNumber: string,
  trackingNumber: string,
  trackingUrl: string,
  estimatedDelivery: string
): Promise<void> {
  const content = emailSection(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:56px;margin-bottom:12px;">📦</div>
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:${BRAND.navyColor};">
        Your order has shipped!
      </h1>
      <p style="margin:0;color:${BRAND.mutedColor};font-size:15px;">
        Order <strong>#${orderNumber}</strong> is on its way
      </p>
    </div>

    <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <span style="font-size:13px;color:${BRAND.mutedColor};">Tracking number</span>
        <strong style="font-size:14px;color:${BRAND.navyColor};">${trackingNumber}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <span style="font-size:13px;color:${BRAND.mutedColor};">Estimated delivery</span>
        <strong style="font-size:14px;color:${BRAND.navyColor};">${estimatedDelivery}</strong>
      </div>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      ${emailButton("Track your package", trackingUrl)}
    </div>

    <p style="margin:0;font-size:13px;color:${BRAND.mutedColor};text-align:center;">
      Having trouble? <a href="${BRAND.siteUrl}/contact">Contact us</a>
    </p>
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your order #${orderNumber} has shipped`,
    html: emailWrapper(content, `Your Jabiyehome order is on its way — track it now`),
  });
}

// ─── Admin: New Order Notification ────────────────────────────────────────────

export async function sendAdminOrderNotification(
  orderNumber: string,
  customerEmail: string,
  total: number,
  itemCount: number
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@Jabiyehome.com";
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  const content = emailSection(`
    <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${BRAND.navyColor};">
      🛍️ New order received
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:${BRAND.mutedColor};">Order number</td>
        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:${BRAND.navyColor};text-align:right;font-weight:600;">#${orderNumber}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:${BRAND.mutedColor};">Customer</td>
        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:${BRAND.navyColor};text-align:right;">${customerEmail}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:${BRAND.mutedColor};">Items</td>
        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:${BRAND.navyColor};text-align:right;">${itemCount}</td>
      </tr>
      <tr>
        <td style="padding:14px 0 0;font-size:15px;font-weight:700;color:${BRAND.navyColor};">Total</td>
        <td style="padding:14px 0 0;font-size:18px;font-weight:700;color:${BRAND.primaryColor};text-align:right;">${formatter.format(total)}</td>
      </tr>
    </table>
    <div style="margin-top:24px;text-align:center;">
      ${emailButton("View in admin", `${BRAND.siteUrl}/admin/orders`)}
    </div>
  `);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `New order #${orderNumber} — ${formatter.format(total)}`,
    html: emailWrapper(content, `New order from ${customerEmail}`),
  });
}
