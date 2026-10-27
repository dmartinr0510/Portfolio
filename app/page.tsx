import { education, experience, profile, skills } from "./data/profile";
import { getProjects, type Project } from "./lib/github";
import { ThemeToggle } from "./components/ThemeToggle";
import { ContactTerminal } from "./components/ContactTerminal";
import { ArrowIcon, FileIcon, GitHubIcon, LinkedInIcon, StarIcon } from "./components/icons";

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
const accents = ["text-mauve", "text-blue", "text-green", "text-peach", "text-pink", "text-teal"];

const nav = [
  ["Sobre mí", "#sobre-mi"],
  ["Trayectoria", "#trayectoria"],
  ["Proyectos", "#proyectos"],
  ["Habilidades", "#habilidades"],
  ["Contacto", "#contacto"],
];

const githubUrl = `https://github.com/${profile.githubUser}`;

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 sm:px-8">
        <Hero />
        <About />
        <Journey />
        <Projects projects={projects} />
        <Skills />
        <Contact />
      </main>
      <footer className="border-t border-surface0 py-8 text-center text-sm text-overlay1">
        © {new Date().getFullYear()} {profile.name} · Hecho con Next.js y la paleta{" "}
        <a href="https://catppuccin.com" className="text-mauve hover:underline">
          Catppuccin
        </a>
      </footer>
    </>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-surface0/60 bg-base/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <a href="#" className="font-mono text-sm font-semibold">
          <span className="text-mauve">~/</span>
          {profile.githubUser}
        </a>
        <nav className="flex items-center gap-1">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="hidden rounded-lg px-3 py-2 text-sm text-subtext0 transition hover:bg-surface0 hover:text-text sm:block"
            >
              {label}
            </a>
          ))}
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
    <section className="grid items-center gap-12 py-20 sm:py-28 md:grid-cols-[1.2fr_1fr]">
      <div>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-surface1 bg-mantle px-3 py-1 text-xs text-subtext0">
          <span className="size-2 rounded-full bg-green" />
          Abierto a nuevas oportunidades
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Hola, soy{" "}
          <span className="bg-gradient-to-r from-mauve via-pink to-peach bg-clip-text text-transparent">
            {profile.name}
          </span>
        </h1>
        <p className="mt-3 text-xl text-lavender">{profile.role}</p>
        <p className="mt-6 max-w-xl leading-relaxed text-subtext1">{profile.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#proyectos"
            className="rounded-lg bg-mauve px-5 py-2.5 text-sm font-semibold text-crust transition hover:opacity-90"
          >
            Ver proyectos
          </a>
          <a
            href="#contacto"
            className="rounded-lg border border-surface1 px-5 py-2.5 text-sm font-semibold transition hover:border-mauve hover:text-mauve"
          >
            Contactar
          </a>
          {profile.cv && (
            <a
              href={profile.cv}
              className="inline-flex items-center gap-2 rounded-lg border border-surface1 px-5 py-2.5 text-sm font-semibold transition hover:border-peach hover:text-peach"
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

function CodeWindow() {
  const stack = skills.flatMap((s) => s.items).slice(0, 4);
  return (
    <div className="overflow-hidden rounded-xl border border-surface0 bg-mantle font-mono text-[13px] shadow-2xl shadow-crust/40">
      <div className="flex items-center gap-2 border-b border-surface0 bg-crust px-4 py-3">
        <span className="size-3 rounded-full bg-red" />
        <span className="size-3 rounded-full bg-yellow" />
        <span className="size-3 rounded-full bg-green" />
        <span className="ml-3 text-xs text-overlay1">sobre-mi.ts</span>
      </div>
      <pre className="overflow-x-auto p-5 leading-7">
        <code>
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
        </code>
      </pre>
    </div>
  );
}

function SectionTitle({ index, title, color }: { index: string; title: string; color: string }) {
  return (
    <h2 className="mb-10 flex items-baseline gap-3 text-2xl font-bold sm:text-3xl">
      <span className={`font-mono text-base ${color}`}>{index}.</span>
      {title}
      <span className="ml-2 h-px flex-1 self-center bg-surface0" />
    </h2>
  );
}

function About() {
  return (
    <section id="sobre-mi" className="py-16">
      <SectionTitle index="01" title="Sobre mí" color="text-mauve" />
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4 leading-relaxed text-subtext1">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
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
  const columns = [
    { title: "Experiencia", items: experience, dot: "bg-peach", color: "text-peach" },
    { title: "Formación", items: education, dot: "bg-mauve", color: "text-mauve" },
  ];
  return (
    <section id="trayectoria" className="py-16">
      <SectionTitle index="02" title="Trayectoria" color="text-teal" />
      <div className="grid gap-12 md:grid-cols-2">
        {columns.map((c) => (
          <div key={c.title}>
            <h3 className={`mb-6 font-mono text-sm ${c.color}`}>{c.title}</h3>
            <ol className="relative space-y-8 border-l border-surface1 pl-6">
              {c.items.map((t) => (
                <li key={t.title} className="relative">
                  <span className={`absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-base ${c.dot}`} />
                  <p className="font-mono text-xs text-overlay1">{t.date}</p>
                  <h4 className="mt-1 font-semibold">{t.title}</h4>
                  <p className="text-sm text-lavender">{t.place}</p>
                  {t.text && <p className="mt-2 text-sm text-subtext0">{t.text}</p>}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="proyectos" className="py-16">
      <SectionTitle index="03" title="Proyectos" color="text-blue" />
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

function ProjectCard({ project: p, accent }: { project: Project; accent: string }) {
  const updated = new Date(p.updatedAt).toLocaleDateString("es-ES", { month: "short", year: "numeric" });
  return (
    <article className="group relative flex flex-col rounded-xl border border-surface0 bg-mantle p-6 transition hover:-translate-y-1 hover:border-surface2">
      <div className="flex items-start justify-between gap-4">
        <h3 className={`text-lg font-semibold ${accent}`}>
          <a href={p.url} className="after:absolute after:inset-0">
            {p.title}
          </a>
        </h3>
        {p.featured && (
          <span className="shrink-0 rounded-full bg-surface0 px-2 py-0.5 text-xs text-yellow">Destacado</span>
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
      <div className="mt-5 flex items-center gap-4 text-xs text-overlay1">
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
          <GitHubIcon className="size-4 transition group-hover:text-text" />
        </span>
      </div>
    </article>
  );
}

function Skills() {
  return (
    <section id="habilidades" className="py-16">
      <SectionTitle index="04" title="Habilidades" color="text-green" />
      <div className="grid gap-5 sm:grid-cols-3">
        {skills.map((s, i) => (
          <div key={s.group} className="rounded-xl border border-surface0 bg-mantle p-6">
            <h3 className={`mb-4 font-mono text-sm ${accents[(i + 1) % accents.length]}`}>{s.group}</h3>
            <ul className="flex flex-wrap gap-2">
              {s.items.map((item) => (
                <li key={item} className="rounded-md border border-surface1 px-2.5 py-1 text-sm text-subtext1">
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
    <section id="contacto" className="py-16 pb-24">
      <SectionTitle index="05" title="Contacto" color="text-peach" />
      <div className="grid gap-10 md:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="text-subtext1">
            ¿Tienes una oferta, una idea o simplemente quieres hablar? Escríbeme desde la terminal: el mensaje me
            llega directamente al correo.
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
        </div>
        <ContactTerminal host={profile.githubUser} />
      </div>
    </section>
  );
}
