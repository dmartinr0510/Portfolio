"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { sendContact, type ContactResult } from "../actions/contact";

type Step = "name" | "email" | "message" | "confirm" | "sending" | "shell";
type Line = { kind: "cmd" | "out" | "err" | "ok" | "muted" | "answer"; text: ReactNode; q?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const questions: Record<"name" | "email" | "message" | "confirm", string> = {
  name: "? Nombre:",
  email: "? Email:",
  message: "? Mensaje:",
  confirm: "? ¿Enviar mensaje? [S/n]",
};

const MAX_LINES = 200;
const SPINNER = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";

const lineColor: Record<Line["kind"], string> = {
  cmd: "text-text",
  out: "text-subtext1",
  err: "text-red",
  ok: "text-green",
  muted: "text-overlay1",
  answer: "text-text",
};

// Aislado para que el tick de 90 ms solo re-renderice el spinner, no toda la terminal.
function Spinner() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 90);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-yellow">
      {SPINNER[frame % SPINNER.length]} Enviando mensaje...
    </div>
  );
}

const intro: Line[] = [
  { kind: "out", text: "Hola 👋 Rellena los campos y pulsa Enter para continuar." },
  { kind: "muted", text: "# En el mensaje usa Shift+Enter para saltos de línea. Escribe 'reset' para empezar de nuevo." },
];

export function ContactTerminal({ host }: { host: string }) {
  const [step, setStep] = useState<Step>("name");
  const [lines, setLines] = useState<Line[]>(intro);
  const [value, setValue] = useState("");
  const [data, setData] = useState({ name: "", email: "", message: "" });
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const interacted = useRef(false);

  // Mantén el final de la terminal a la vista sin mover la página al cargar.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
    if (interacted.current) inputRef.current?.focus({ preventScroll: true });
  }, [lines, step]);

  const prompt = (
    <span className="shrink-0">
      <span className="text-green">visitante@{host}</span>
      <span className="text-overlay2">:</span>
      <span className="text-blue">~</span>
      <span className="text-overlay2">$ </span>
    </span>
  );

  function push(...l: Line[]) {
    setLines((prev) => [...prev, ...l].slice(-MAX_LINES));
  }

  // Vuelve exactamente al estado inicial: limpia el historial y muestra la bienvenida como al cargar la página.
  function reset() {
    setData({ name: "", email: "", message: "" });
    setLines(intro);
    setStep("name");
  }

  function restart(...note: Line[]) {
    setData({ name: "", email: "", message: "" });
    push(...note);
    setStep("name");
  }

  async function submit() {
    setStep("sending");
    let res: ContactResult;
    try {
      res = await sendContact({ ...data, website: honeypotRef.current?.value });
    } catch {
      res = { ok: false, error: "error de conexión" };
    }
    if (res.ok) {
      push(
        { kind: "ok", text: "✓ Mensaje enviado. ¡Gracias! Te responderé lo antes posible." },
        { kind: "muted", text: "# Escribe ./contacto.sh para enviar otro mensaje." },
      );
    } else {
      push({ kind: "err", text: `✗ Error: ${res.error}.` }, { kind: "muted", text: "# Escribe ./contacto.sh para reintentar." });
    }
    setStep("shell");
  }

  function runShell(cmd: string) {
    push({ kind: "cmd", text: cmd });
    if (!cmd) return;
    if (cmd.toLowerCase() === "reset") return reset();
    if (cmd === "./contacto.sh" || cmd === "contacto") return restart(...intro);
    if (cmd === "clear") return setLines([]);
    if (cmd === "help") {
      return push({ kind: "out", text: "Comandos: ./contacto.sh  reset  clear  help  whoami" });
    }
    if (cmd === "whoami") return push({ kind: "out", text: "visitante — gracias por pasarte 😊" });
    push({ kind: "err", text: `bash: ${cmd.split(" ")[0]}: orden no encontrada` });
  }

  function handleEnter() {
    const raw = value;
    const v = raw.trim();
    setValue("");

    if (step === "shell") return runShell(v);
    if (step === "sending") return;
    const answer: Line = { kind: "answer", q: questions[step], text: step === "message" ? `\n${raw}` : ` ${v}` };

    if (v.toLowerCase() === "reset") return reset();

    if (step === "name") {
      if (!v) return push(answer, { kind: "err", text: "✗ El nombre no puede estar vacío." });
      setData((d) => ({ ...d, name: v }));
      push(answer);
      setStep("email");
    } else if (step === "email") {
      if (!EMAIL_RE.test(v)) return push(answer, { kind: "err", text: "✗ Introduce un email válido." });
      setData((d) => ({ ...d, email: v }));
      push(answer);
      setStep("message");
    } else if (step === "message") {
      if (v.length < 5) return push(answer, { kind: "err", text: "✗ El mensaje es demasiado corto." });
      setData((d) => ({ ...d, message: v }));
      push(answer);
      setStep("confirm");
    } else if (step === "confirm") {
      push(answer);
      if (v === "" || /^s(i|í)?$/i.test(v) || /^y(es)?$/i.test(v)) {
        void submit();
      } else {
        push({ kind: "muted", text: "# Envío cancelado. Escribe ./contacto.sh para empezar de nuevo." });
        setStep("shell");
      }
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !(step === "message" && e.shiftKey)) {
      e.preventDefault();
      handleEnter();
    }
  }

  return (
    <div
      className="overflow-hidden rounded-xl border border-surface0 bg-mantle font-mono text-[13px] shadow-2xl shadow-crust/40"
      onClick={() => {
        interacted.current = true;
        inputRef.current?.focus({ preventScroll: true });
      }}
    >
      <div className="flex items-center gap-2 border-b border-surface0 bg-crust px-4 py-3">
        <span className="size-3 rounded-full bg-red" />
        <span className="size-3 rounded-full bg-yellow" />
        <span className="size-3 rounded-full bg-green" />
        <span className="ml-3 text-xs text-overlay1">contacto — bash</span>
      </div>

      <div ref={bodyRef} className="max-h-[26rem] min-h-64 cursor-text overflow-y-auto p-5 leading-7">
        <div className="flex">
          {prompt}
          <span>./contacto.sh</span>
        </div>
        {lines.map((l, i) =>
          l.kind === "cmd" ? (
            <div key={i} className="flex">
              {prompt}
              <span className="break-all">{l.text}</span>
            </div>
          ) : l.kind === "answer" ? (
            <div key={i} className="whitespace-pre-wrap break-words">
              <span className="text-mauve">{l.q}</span>
              <span className="text-peach">{l.text}</span>
            </div>
          ) : (
            <div key={i} className={`whitespace-pre-wrap break-words ${lineColor[l.kind]}`}>
              {l.text}
            </div>
          ),
        )}

        {step === "sending" ? (
          <Spinner />
        ) : (
          <label className="flex items-start">
            {step === "shell" ? prompt : <span className="mr-2 shrink-0 text-mauve">{questions[step]}</span>}
            {step === "message" ? (
              <textarea
                ref={inputRef}
                value={value}
                rows={Math.max(1, value.split("\n").length)}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => (interacted.current = true)}
                aria-label="Mensaje"
                maxLength={5000}
                spellCheck={false}
                className="block w-full flex-1 resize-none bg-transparent text-peach caret-mauve outline-none"
              />
            ) : (
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => (interacted.current = true)}
                aria-label={step === "shell" ? "Comando" : questions[step]}
                type={step === "email" ? "email" : "text"}
                autoComplete={step === "name" ? "name" : step === "email" ? "email" : "off"}
                enterKeyHint={step === "confirm" ? "send" : "next"}
                maxLength={step === "name" ? 100 : 200}
                spellCheck={false}
                className="w-full min-w-0 flex-1 bg-transparent text-peach caret-mauve outline-none"
              />
            )}
          </label>
        )}

        <input
          ref={honeypotRef}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute -left-[9999px] size-px opacity-0"
        />
      </div>

      <div className="flex items-center justify-between border-t border-surface0 bg-crust px-4 py-2 text-[11px] text-overlay1">
        <span>{step === "shell" ? "bash" : `paso ${Math.min(4, ["name", "email", "message", "confirm", "sending"].indexOf(step) + 1)}/4`}</span>
        <span>
          <kbd className="text-subtext0">Enter</kbd> {step === "message" ? "continuar · Shift+Enter nueva línea" : "continuar"}
        </span>
      </div>
    </div>
  );
}
