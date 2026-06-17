// lib/resend.ts — Lazy Resend client (safe during build and without env vars)
import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set. Add it to your .env.local file.");
    _resend = new Resend(key);
  }
  return _resend;
}

export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getResend() as any)[prop];
  },
});

export const FROM_EMAIL =
  process.env.EMAIL_FROM ?? "jabiyehome <noreply@Jabiyehome.com>";
