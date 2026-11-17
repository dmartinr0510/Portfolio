"use client";

import { useEffect, useRef } from "react";

// Elementos sobre los que el cursor cambia de modo (delegación de eventos, sin listeners por elemento).
const TEXT = "input:not([type=checkbox]):not([type=radio]):not([type=range]), textarea, [contenteditable=true], .cursor-text";
const INTERACTIVE = "a, button, [role=button], summary, select, label[for]";

type Mode = "default" | "link" | "text";

function modeFor(target: EventTarget | null): Mode {
  if (!(target instanceof Element)) return "default";
  if (target.closest("canvas")) return "default"; // p. ej. el minijuego de la terminal
  if (target.closest(TEXT)) return "text";
  if (target.closest(INTERACTIVE)) return "link";
  return "default";
}

// Cursor propio: un punto que sigue al ratón y un anillo que lo persigue con algo de inercia.
// Solo se activa con puntero fino (ratón/trackpad); en táctil no se renderiza nada visible.
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = matchMedia("(pointer: fine)");
    if (!fine.matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const root = document.documentElement;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

    let x = 0, y = 0, rx = 0, ry = 0;
    let raf = 0;
    let started = false;

    // El bucle solo corre mientras el anillo no ha alcanzado al puntero: en reposo no consume nada.
    const tick = () => {
      const k = reduceMotion.matches ? 1 : 0.2;
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!started) {
        // Primer movimiento: colócalo ya en su sitio para que no vuele desde la esquina.
        started = true;
        rx = x;
        ry = y;
        root.classList.add("custom-cursor");
      }
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      delete root.dataset.cursorHidden;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onOver = (e: PointerEvent) => {
      root.dataset.cursor = modeFor(e.target);
    };
    const onDown = () => (root.dataset.cursorDown = "");
    const onUp = () => delete root.dataset.cursorDown;
    const onLeave = () => (root.dataset.cursorHidden = "");

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    root.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      root.removeEventListener("mouseleave", onLeave);
      root.classList.remove("custom-cursor");
      delete root.dataset.cursor;
      delete root.dataset.cursorDown;
      delete root.dataset.cursorHidden;
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden className="cursor cursor-ring">
        <span />
      </div>
      <div ref={dotRef} aria-hidden className="cursor cursor-dot">
        <span />
      </div>
    </>
  );
}
