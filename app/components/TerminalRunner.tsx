"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

// Easter egg de la terminal: un "runner" en el que el prompt >_ salta errores.
// Todo el estado del juego vive en un ref y se pinta en un <canvas>: React solo se entera de los cambios de fase.

type Phase = "ready" | "running" | "paused" | "over";
type Obstacle = { x: number; w: number; h: number; label: string };
type Note = { x: number; y: number; text: string };

const H = 150; // alto del canvas en px CSS
const GROUND = 126; // y de la línea de suelo
const PLAYER_X = 28;
const PLAYER = 24;
const GRAVITY = 2300; // px/s²
const JUMP_V = 640; // px/s → salto de ~89 px
const JUMP_BUFFER_MS = 120; // un salto pulsado justo antes de aterrizar se ejecuta al tocar suelo
const START_SPEED = 280;
const MAX_SPEED = 960;
const ACCEL = 16; // px/s por segundo: llega a la velocidad máxima en ~40 s
const TOKENS = ["404", "NaN", "null", "undefined", "{}", ";", "bug", "500"];
const NOTES = ["// TODO", "/* FIXME */", "console.log()", "git push -f", "// funciona en mi máquina", "rm -rf node_modules"];
const HI_KEY = "terminal-runner-hi";

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function readBest() {
  try {
    return Number(localStorage.getItem(HI_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value: number) {
  try {
    localStorage.setItem(HI_KEY, String(value));
  } catch {}
}

type Game = { action: () => void; pause: () => void; result: () => { score: number; best: number } };

export function TerminalRunner({ onExit }: { onExit: (score: number, best: number) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    wrap.focus({ preventScroll: true });

    // Colores del tema actual; se vuelven a leer si cambia Mocha/Latte en mitad de la partida.
    const colors: Record<string, string> = {};
    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      for (const name of ["mauve", "peach", "red", "surface1", "surface2", "overlay1", "subtext0"]) {
        colors[name] = css.getPropertyValue(`--ctp-${name}`).trim();
      }
    };
    readColors();
    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const font = getComputedStyle(canvas).fontFamily;
    let W = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = wrap.clientWidth;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);

    // --- estado de la partida ---
    let phaseNow: Phase = "ready";
    let y = 0; // altura sobre el suelo
    let vy = 0;
    let speed = START_SPEED;
    let dist = 0;
    let gapLeft = 0;
    let noteGap = 0;
    let jumpPressedAt = -Infinity;
    let obstacles: Obstacle[] = [];
    let notes: Note[] = [];
    let score = 0;
    let best = readBest();

    const setP = (p: Phase) => {
      phaseNow = p;
      setPhase(p);
    };

    const reset = () => {
      y = vy = dist = score = 0;
      speed = START_SPEED;
      gapLeft = 260;
      noteGap = 0;
      obstacles = [];
      notes = [];
    };

    const jump = () => {
      if (y === 0) vy = JUMP_V;
      else jumpPressedAt = performance.now();
    };

    const spawnObstacle = () => {
      ctx.font = `bold 11px ${font}`;
      const make = (x: number): Obstacle => {
        const label = pick(TOKENS);
        return { x, label, w: Math.ceil(ctx.measureText(label).width) + 12, h: Math.random() < 0.3 ? 28 : 20 };
      };
      const first = make(W + 10);
      obstacles.push(first);
      // A partir de cierta velocidad, a veces vienen dos errores seguidos.
      if (speed > 420 && Math.random() < 0.3) obstacles.push(make(first.x + first.w + 4));
      const minGap = speed * 0.55 + 150;
      gapLeft = rand(minGap, minGap + 300);
    };

    const update = (dt: number) => {
      speed = Math.min(MAX_SPEED, speed + ACCEL * dt);
      const dx = speed * dt;
      dist += dx;
      score = Math.floor(dist / 12);

      if (y > 0 || vy > 0) {
        vy -= GRAVITY * dt;
        y += vy * dt;
        if (y <= 0) {
          y = 0;
          vy = 0;
          if (performance.now() - jumpPressedAt < JUMP_BUFFER_MS) vy = JUMP_V;
        }
      }

      for (const o of obstacles) o.x -= dx;
      obstacles = obstacles.filter((o) => o.x + o.w > -10);
      gapLeft -= dx;
      if (gapLeft <= 0) spawnObstacle();

      for (const n of notes) n.x -= dx * 0.25; // parallax
      notes = notes.filter((n) => n.x > -200);
      noteGap -= dx * 0.25;
      if (noteGap <= 0) {
        notes.push({ x: W + 10, y: rand(22, 70), text: pick(NOTES) });
        noteGap = rand(220, 420);
      }

      // Colisión con algo de margen para que no parezca injusta.
      const top = GROUND - y - PLAYER;
      for (const o of obstacles) {
        const hitX = PLAYER_X + 4 < o.x + o.w - 2 && PLAYER_X + PLAYER - 4 > o.x + 2;
        const hitY = GROUND - y - 3 > GROUND - o.h + 2 && top + 4 < GROUND;
        if (hitX && hitY) {
          if (score > best) {
            best = score;
            saveBest(best);
          }
          setP("over");
          return;
        }
      }
    };

    const centerText = (text: string, yPos: number, color: string, size = 12, weight = "normal") => {
      ctx.font = `${weight} ${size}px ${font}`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(text, W / 2, yPos);
      ctx.textAlign = "left";
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      ctx.font = `10px ${font}`;
      ctx.fillStyle = colors.surface2;
      for (const n of notes) ctx.fillText(n.text, n.x, n.y);

      ctx.strokeStyle = colors.surface1;
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 8]);
      ctx.lineDashOffset = dist % 14;
      ctx.beginPath();
      ctx.moveTo(0, GROUND + 0.5);
      ctx.lineTo(W, GROUND + 0.5);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = `bold 11px ${font}`;
      ctx.textAlign = "center";
      for (const o of obstacles) {
        ctx.beginPath();
        ctx.roundRect(o.x, GROUND - o.h, o.w, o.h, 4);
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = colors.red;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = colors.red;
        ctx.stroke();
        ctx.fillStyle = colors.red;
        ctx.fillText(o.label, o.x + o.w / 2, GROUND - o.h / 2 + 4);
      }
      ctx.textAlign = "left";

      // El jugador: el mismo >_ del favicon (coordenadas de un lienzo de 64 px escaladas).
      ctx.save();
      ctx.translate(PLAYER_X, GROUND - y - PLAYER);
      ctx.scale(PLAYER / 64, PLAYER / 64);
      ctx.lineWidth = 9;
      ctx.lineCap = ctx.lineJoin = "round";
      ctx.strokeStyle = phaseNow === "over" ? colors.red : colors.mauve;
      ctx.beginPath();
      ctx.moveTo(12, 14);
      ctx.lineTo(32, 32);
      ctx.lineTo(12, 50);
      ctx.stroke();
      ctx.fillStyle = phaseNow === "over" ? colors.red : colors.peach;
      ctx.beginPath();
      ctx.roundRect(36, 44, 22, 8, 4);
      ctx.fill();
      ctx.restore();

      ctx.font = `11px ${font}`;
      ctx.fillStyle = colors.overlay1;
      ctx.textAlign = "right";
      const pad = (n: number) => String(n).padStart(5, "0");
      ctx.fillText(`HI ${pad(best)}  ${pad(score)}`, W - 4, 14);
      ctx.textAlign = "left";

      if (phaseNow === "ready") centerText("pulsa espacio o toca para empezar", 64, colors.subtext0);
      if (phaseNow === "paused") centerText("pausa · espacio para seguir", 64, colors.subtext0);
      if (phaseNow === "over") {
        centerText("Segmentation fault (core dumped)", 56, colors.red, 13, "bold");
        centerText("espacio para reintentar · Esc para salir", 78, colors.subtext0, 11);
      }
    };

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      // Tope de 50 ms: al volver de otra pestaña no se teletransporta todo de golpe.
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (phaseNow === "running") update(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    gameRef.current = {
      action() {
        if (phaseNow === "running") return jump();
        if (phaseNow === "over") reset();
        if (phaseNow === "ready" || phaseNow === "over") jump();
        last = performance.now();
        setP("running");
      },
      pause() {
        if (phaseNow === "running") setP("paused");
      },
      result: () => ({ score, best }),
    };

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      gameRef.current = null;
    };
  }, []);

  function exit() {
    const r = gameRef.current?.result() ?? { score: 0, best: readBest() };
    onExit(r.score, r.best);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "Enter") {
      e.preventDefault(); // que el espacio no haga scroll en la página
      gameRef.current?.action();
    } else if (e.key === "Escape" || e.key === "q") {
      e.preventDefault();
      exit();
    }
  }

  const message = {
    ready: "Minijuego listo. Pulsa espacio para empezar y Escape para salir.",
    running: "Partida en curso.",
    paused: "Partida en pausa.",
    over: "Fin de la partida. Espacio para reintentar, Escape para salir.",
  }[phase];

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onBlur={() => gameRef.current?.pause()}
      onClick={(e) => e.stopPropagation()}
      className="relative my-1 rounded-md outline-none ring-mauve/40 focus-visible:ring-1"
      aria-label="Minijuego: salta los errores"
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: H }}
        className="block touch-manipulation"
        onPointerDown={(e) => {
          e.preventDefault();
          wrapRef.current?.focus({ preventScroll: true });
          gameRef.current?.action();
        }}
      />
      <button
        type="button"
        onClick={exit}
        className="absolute left-1 top-0.5 text-[11px] text-overlay1 transition hover:text-red"
      >
        ✕ salir
      </button>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
