"use server";

import { headers } from "next/headers";

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  website?: string; // honeypot: los humanos no lo ven, los bots lo rellenan
};

export type ContactResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Límite simple por IP (en memoria, por instancia): frena el abuso básico.
// Para una garantía global en Vercel usa Upstash Ratelimit o similar.
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  if (hits.size > 1000) hits.clear(); // evita que el Map crezca sin límite
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

// Envía el mensaje a tu buzón usando la API de Resend (https://resend.com).
// Necesita RESEND_API_KEY y CONTACT_TO_EMAIL en .env.local (o en Vercel).
export async function sendContact(input: ContactInput): Promise<ContactResult> {
  if (input.website) return { ok: true };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return { ok: false, error: "demasiados intentos, prueba en unos minutos" };

  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const message = input.message?.trim() ?? "";

  if (!name || name.length > 100) return { ok: false, error: "nombre no válido" };
  if (!EMAIL_RE.test(email) || email.length > 200) return { ok: false, error: "email no válido" };
  if (message.length < 5 || message.length > 5000) return { ok: false, error: "mensaje demasiado corto o largo" };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Falta RESEND_API_KEY o CONTACT_TO_EMAIL");
    return { ok: false, error: "el servicio de correo no está configurado" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `Portfolio · Mensaje de ${name}`,
        text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><b>Nombre:</b> ${escapeHtml(name)}<br><b>Email:</b> ${escapeHtml(email)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      }),
    });
    if (!res.ok) {
      console.error("Resend:", res.status, await res.text());
      return { ok: false, error: "no se pudo enviar, inténtalo más tarde" };
    }
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "error de red al enviar" };
  }
}
