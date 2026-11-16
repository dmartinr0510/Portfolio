import { education, experience, profile, skills } from "./data/profile";
import { getProjects, type Project } from "./lib/github";
import { ThemeToggle } from "./components/ThemeToggle";
import { ContactTerminal } from "./components/ContactTerminal";
import { ArrowIcon, FileIcon, GitHubIcon, LinkedInIcon, PinIcon, StarIcon } from "./components/icons";

const languageColor: Record<string, string> = {
  Python: "bg-yellow",
  JavaScript: "bg-peach",
  TypeScript: "bg-blue",
  HTML: "bg-maroon",
  CSS: "bg-mauve",
  Java: "bg-red",
  PHP: "bg-lavender",
  Shell: "bg-green",
};

// Rota los acentos de Catppuccin entre tarjetas y grupos.
const accents = [
  { text: "text-mauve", bg: "bg-mauve" },
  { text: "text-blue", bg: "bg-blue" },
  { text: "text-green", bg: "bg-green" },
  { text: "text-peach", bg: "bg-peach" },
  { text: "text-pink", bg: "bg-pink" },
  { text: "text-teal", bg: "bg-teal" },
];

const nav = [
  ["Sobre mí", "#sobre-mi"],
  ["Trayectoria", "#trayectoria"],
  ["Proyectos", "#proyectos"],
  ["Habilidades", "#habilidades"],
  ["Contacto", "#contacto"],
];

const monthYear = new Intl.DateTimeFormat("es-ES", { month: "short", year: "numeric" });

const githubUrl = `https://github.com/${profile.githubUser}`;

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 sm:px-8">
        <Hero />
        <About projectCount={projects.length} />
        <Journey />
        <Projects projects={projects} />
        <Skills />
        <Contact />
      </main>
      <footer className="border-t border-surface0">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-overlay1 sm:flex-row sm:px-8">
          <p>
            © {new Date().getFullYear()} {profile.name} · Hecho con Next.js y la paleta{" "}
            <a href="https://catppuccin.com" className="text-mauve hover:underline">
              Catppuccin
            </a>
          </p>
          <a href="#" className="font-mono text-xs transition hover:text-mauve">
            cd ~ ↑
          </a>
        </div>
      </footer>
    </>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-surface0/60 bg-base/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <a href="#" className="group font-mono text-sm font-semibold">
          <span className="text-mauve">~/</span>
          {profile.githubUser}
          <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-mauve opacity-0 transition group-hover:opacity-100" />
        </a>
        <nav className="flex items-center gap-1">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="hidden rounded-lg px-3 py-2 text-sm text-subtext0 transition hover:bg-surface0 hover:text-text md:block"
            >
              {label}
            </a>
          ))}
          <span className="mx-2 hidden h-5 w-px bg-surface1 md:block" />
          <a
            href={githubUrl}
            aria-label="GitHub"
            className="grid size-9 place-items-center rounded-lg text-subtext0 transition hover:bg-surface0 hover:text-text"
          >
            <GitHubIcon />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative grid items-center gap-14 py-20 sm:py-28 md:grid-cols-[1.15fr_1fr]">
      {/* Fondo decorativo: rejilla y dos halos de color */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[-50vw] inset-y-0 -z-10 overflow-hidden">
        <div className="dot-grid absolute inset-0" />
        <div className="absolute left-1/2 top-10 size-[28rem] -translate-x-[70%] rounded-full bg-mauve/15 blur-3xl" />
        <div className="absolute left-1/2 top-40 size-[22rem] translate-x-[10%] rounded-full bg-blue/10 blur-3xl" />
      </div>

      <div>
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-surface1 bg-mantle/80 px-3 py-1 text-xs text-subtext0 backdrop-blur">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-green" />
          </span>
          Abierto a nuevas oportunidades
        </p>
        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Hola, soy
          <br />
          <span className="bg-gradient-to-r from-mauve via-pink to-peach bg-clip-text text-transparent">
            {profile.name}
          </span>
        </h1>
        <p className="mt-5 text-xl font-medium text-lavender">{profile.role}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-overlay1">
          <PinIcon className="size-4" /> {profile.location}
        </p>
        <p className="mt-6 max-w-xl leading-relaxed text-subtext1">{profile.tagline}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="#proyectos"
            className="inline-flex items-center gap-2 rounded-lg bg-mauve px-5 py-2.5 text-sm font-semibold text-crust shadow-lg shadow-mauve/20 transition hover:-translate-y-0.5 hover:shadow-mauve/40"
          >
            Ver proyectos <ArrowIcon className="size-4 rotate-45" />
          </a>
          <a
            href="#contacto"
            className="rounded-lg border border-surface1 bg-mantle/60 px-5 py-2.5 text-sm font-semibold transition hover:border-mauve hover:text-mauve"
          >
            Contactar
          </a>
          {profile.cv && (
            <a
              href={profile.cv}
              className="inline-flex items-center gap-2 rounded-lg border border-surface1 bg-mantle/60 px-5 py-2.5 text-sm font-semibold transition hover:border-peach hover:text-peach"
            >
              <FileIcon className="size-4" /> Descargar CV
            </a>
          )}
        </div>
      </div>
      <CodeWindow />
    </section>
  );
}

function WindowBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-surface0 bg-crust px-4 py-3">
      <span className="size-3 rounded-full bg-red" />
      <span className="size-3 rounded-full bg-yellow" />
      <span className="size-3 rounded-full bg-green" />
      <span className="ml-3 text-xs text-overlay1">{title}</span>
    </div>
  );
}

function CodeWindow() {
  const stack = skills.flatMap((s) => s.items).slice(0, 4);
  return (
    // El padding de 1px sobre un degradado dibuja un borde de color.
    <div className="rounded-xl bg-gradient-to-br from-mauve/60 via-surface0 to-blue/50 p-px shadow-2xl shadow-crust/50">
      <div className="overflow-hidden rounded-[11px] bg-mantle font-mono text-[13px]">
        <WindowBar title="sobre-mi.ts" />
        <pre className="overflow-x-auto p-5 leading-7">
          <code>
            <span className="text-overlay1">{"// ¡bienvenido!"}</span>
            {"\n"}
            <span className="text-mauve">const</span> <span className="text-blue">dev</span>{" "}
            <span className="text-sky">=</span> <span className="text-overlay2">{"{"}</span>
            {"\n  "}
            <span className="text-lavender">nombre</span>
            <span className="text-overlay2">:</span> <span className="text-green">&quot;{profile.name}&quot;</span>
            <span className="text-overlay2">,</span>
            {"\n  "}
            <span className="text-lavender">ubicación</span>
            <span className="text-overlay2">:</span> <span className="text-green">&quot;{profile.location}&quot;</span>
            <span className="text-overlay2">,</span>
            {"\n  "}
            <span className="text-lavender">stack</span>
            <span className="text-overlay2">: [</span>
            {stack.map((s, i) => (
              <span key={s}>
                {"\n    "}
                <span className="text-green">&quot;{s}&quot;</span>
                {i < stack.length - 1 && <span className="text-overlay2">,</span>}
              </span>
            ))}
            {"\n  "}
            <span className="text-overlay2">],</span>
            {"\n  "}
            <span className="text-lavender">foco</span>
            <span className="text-overlay2">:</span> <span className="text-green">&quot;{profile.focus}&quot;</span>
            <span className="text-overlay2">,</span>
            {"\n  "}
            <span className="text-lavender">aprendiendo</span>
            <span className="text-overlay2">:</span> <span className="text-peach">true</span>
            <span className="text-overlay2">,</span>
            {"\n"}
            <span className="text-overlay2">{"};"}</span>
            <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-mauve" />
          </code>
        </pre>
      </div>
    </div>
  );
}

function SectionTitle({ index, slug, title, color }: { index: string; slug: string; title: string; color: string }) {
  return (
    <div className="mb-12">
      <p className={`font-mono text-sm ${color}`}>
        {"// "}
        {index} · {slug}
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

function About({ projectCount }: { projectCount: number }) {
  const facts = [
    { label: "Ubicación", value: profile.location, color: "text-sky" },
    { label: "Foco", value: profile.focus, color: "text-mauve" },
    ...(projectCount > 0 ? [{ label: "Proyectos públicos", value: String(projectCount), color: "text-peach" }] : []),
  ];
  return (
    <section id="sobre-mi" className="reveal py-20">
      <SectionTitle index="01" slug="sobre-mi" title="Sobre mí" color="text-mauve" />
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="space-y-4 text-lg leading-relaxed text-subtext1">
            {profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="rounded-xl border border-surface0 bg-mantle px-4 py-3">
                <dt className="font-mono text-xs text-overlay1">{f.label}</dt>
                <dd className={`mt-1 text-sm font-semibold ${f.color}`}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-surface0 bg-mantle p-5">
            <h3 className="mb-3 font-mono text-sm text-sky">Idiomas</h3>
            <ul className="space-y-2 text-sm">
              {profile.languages.map((l) => (
                <li key={l.name} className="flex justify-between">
                  <span>{l.name}</span>
                  <span className="text-subtext0">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-surface0 bg-mantle p-5">
            <h3 className="mb-3 font-mono text-sm text-pink">Aptitudes</h3>
            <ul className="flex flex-wrap gap-2">
              {profile.softSkills.map((s) => (
                <li key={s} className="rounded-md bg-surface0 px-2.5 py-1 text-sm text-subtext1">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  // Una sola línea de tiempo: experiencia primero, luego formación.
  const items = [
    ...experience.map((t) => ({ ...t, kind: "Experiencia", color: "text-peach", dot: "bg-peach" })),
    ...education.map((t) => ({ ...t, kind: "Formación", color: "text-mauve", dot: "bg-mauve" })),
  ];
  return (
    <section id="trayectoria" className="reveal py-20">
      <SectionTitle index="02" slug="trayectoria" title="Trayectoria" color="text-teal" />
      <ol className="space-y-0">
        {items.map((t) => (
          <li key={t.kind + t.title} className="group/item grid md:grid-cols-[11rem_1fr] md:gap-8">
            <p className="hidden pt-5 text-right font-mono text-xs text-overlay1 md:block">{t.date}</p>
            <div className="relative border-l border-surface1 pb-6 pl-8 group-last/item:pb-0">
              <span className={`absolute -left-[7px] top-6 size-3.5 rounded-full border-[3px] border-base ${t.dot}`} />
              <div className="rounded-xl border border-surface0 bg-mantle p-5 transition hover:border-surface2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className={`font-mono text-xs ${t.color}`}>{t.kind}</span>
                  <span className="font-mono text-xs text-overlay1 md:hidden">· {t.date}</span>
                </div>
                <h3 className="mt-1.5 font-semibold">{t.title}</h3>
                <p className="text-sm text-lavender">{t.place}</p>
                {t.text && <p className="mt-2 text-sm text-subtext0">{t.text}</p>}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="proyectos" className="reveal py-20">
      <SectionTitle index="03" slug="proyectos" title="Proyectos" color="text-blue" />
      {projects.length === 0 ? (
        <p className="text-subtext0">
          No se pudieron cargar los repositorios ahora mismo. Puedes verlos directamente en{" "}
          <a href={githubUrl} className="text-blue hover:underline">
            GitHub
          </a>
          .
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.name} project={p} accent={accents[i % accents.length]} />
          ))}
        </div>
      )}
      <a
        href={`${githubUrl}?tab=repositories`}
        className="mt-8 inline-flex items-center gap-1 text-sm text-subtext0 transition hover:text-blue"
      >
        Ver todos los repositorios en GitHub <ArrowIcon />
      </a>
    </section>
  );
}

function ProjectCard({ project: p, accent }: { project: Project; accent: (typeof accents)[number] }) {
  const updated = monthYear.format(new Date(p.updatedAt));
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-surface0 bg-mantle p-6 transition duration-300 hover:-translate-y-1 hover:border-surface2 hover:shadow-2xl hover:shadow-crust/40">
      {/* Línea de acento que se dibuja al pasar el ratón */}
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${accent.bg}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20 ${accent.bg}`}
      />
      <div className="flex items-start justify-between gap-4">
        <h3 className={`text-lg font-semibold ${accent.text}`}>
          <a href={p.url} className="after:absolute after:inset-0">
            {p.title}
          </a>
        </h3>
        {p.featured && (
          <span className="shrink-0 rounded-full border border-yellow/30 bg-yellow/10 px-2 py-0.5 text-xs text-yellow">
            ★ Destacado
          </span>
        )}
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-subtext1">{p.description}</p>
      {p.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t} className="rounded-md bg-surface0 px-2 py-1 font-mono text-xs text-subtext0">
              {t}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-5 flex items-center gap-4 border-t border-surface0 pt-4 text-xs text-overlay1">
        {p.language && (
          <span className="flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full ${languageColor[p.language] ?? "bg-overlay1"}`} />
            {p.language}
          </span>
        )}
        {p.stars > 0 && (
          <span className="flex items-center gap-1">
            <StarIcon className="size-3.5" /> {p.stars}
          </span>
        )}
        <span>Actualizado {updated}</span>
        <span className="ml-auto flex items-center gap-3">
          {p.homepage && (
            <a href={p.homepage} className="relative z-[1] hover:text-text">
              Demo
            </a>
          )}
          <ArrowIcon className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-text" />
        </span>
      </div>
    </article>
  );
}

function Skills() {
  return (
    <section id="habilidades" className="reveal py-20">
      <SectionTitle index="04" slug="habilidades" title="Habilidades" color="text-green" />
      <div className="divide-y divide-surface0 rounded-xl border border-surface0 bg-mantle">
        {skills.map((s, i) => (
          <div key={s.group} className="grid gap-3 p-6 sm:grid-cols-[13rem_1fr] sm:items-center">
            <h3 className={`font-mono text-sm ${accents[(i + 1) % accents.length].text}`}>{s.group}</h3>
            <ul className="flex flex-wrap gap-2">
              {s.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-surface1 bg-base px-3 py-1.5 text-sm text-subtext1 transition hover:border-surface2 hover:text-text"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const links = [
    { label: `github.com/${profile.githubUser}`, href: githubUrl, icon: <GitHubIcon />, color: "hover:text-mauve hover:border-mauve" },
    ...(profile.linkedin
      ? [{ label: "LinkedIn", href: profile.linkedin, icon: <LinkedInIcon />, color: "hover:text-blue hover:border-blue" }]
      : []),
  ];
  return (
    <section id="contacto" className="reveal py-20 pb-28">
      <SectionTitle index="05" slug="contacto" title="Hablemos" color="text-peach" />
      <div className="grid gap-10 md:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="text-lg leading-relaxed text-subtext1">
            ¿Tienes una oferta, una idea o simplemente quieres hablar? Escríbeme desde la terminal: el mensaje me llega
            directamente al correo.
          </p>
          <div className="mt-8 flex flex-col items-start gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`inline-flex items-center gap-3 rounded-lg border border-surface1 bg-mantle px-4 py-3 text-sm transition ${l.color}`}
              >
                {l.icon}
                {l.label}
              </a>
            ))}
          </div>
          <p className="mt-8 inline-flex items-center gap-1.5 text-sm text-overlay1">
            <PinIcon className="size-4" /> {profile.location}
          </p>
        </div>
        <ContactTerminal host={profile.githubUser} />
      </div>
    </section>
  );
}
