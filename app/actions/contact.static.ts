// Sustituye a contact.ts en la versión de GitHub Pages (web estática, sin servidor).
// Allí no se puede enviar correo con la API key de Resend, así que el formulario
// avisa al visitante y le indica otra vía de contacto.
import type { ContactInput, ContactResult } from "./contact";

export type { ContactInput, ContactResult };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function sendContact(_input: ContactInput): Promise<ContactResult> {
  return {
    ok: false,
    error: "el formulario no está disponible en esta versión de la web; escríbeme por GitHub o LinkedIn",
  };
}
