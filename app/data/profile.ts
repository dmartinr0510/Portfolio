// Edita este archivo con tu información personal.
// Todo lo que aparece en el portfolio (salvo la lista de repos) sale de aquí.

export const profile = {
  name: "Daniel Martín",
  githubUser: "dmartinr0510",
  role: "Desarrollador de Aplicaciones Web",
  location: "Cáceres, España",
  // El email no se muestra en la web: el formulario de contacto envía a CONTACT_TO_EMAIL (.env.local).
  linkedin: "", // p. ej. "https://www.linkedin.com/in/tu-usuario"
  cv: "/CV-Daniel-Martin-Rodriguez.pdf", // archivo en /public
  focus: "Backend → Full-Stack",
  tagline:
    "Estudiante de 2º de DAW. Me enfoco en el backend mientras me formo para ser Full-Stack, y disfruto resolviendo problemas de forma eficiente.",
  about: [
    "Estoy cursando 2º del ciclo de Desarrollo de Aplicaciones Web. Mi intención es especializarme en el backend, aunque me estoy desarrollando para ser Full-Stack.",
    "Me considero una persona resolutiva y autónoma: me gusta entender bien un problema y encontrar la solución más eficiente. Fuera de clase sigo aprendiendo con proyectos propios, desde apps de escritorio en Python hasta juegos de consola.",
  ],
  softSkills: ["Empatía", "Autonomía", "Resolutivo", "Actitud positiva"],
  languages: [
    { name: "Castellano", level: "Nativo" },
    { name: "Inglés", level: "Avanzado" },
  ],
};

export const skills: { group: string; items: string[] }[] = [
  { group: "Lenguajes", items: ["Java", "Python", "JavaScript"] },
  { group: "Web y bases de datos", items: ["HTML5", "CSS", "SQL", "SQLite"] },
  { group: "Herramientas", items: ["Git", "GitHub", "PySide6", "APIs REST"] },
];

type TimelineItem = { title: string; place: string; date: string; text?: string };

export const experience: TimelineItem[] = [
  {
    title: "Prácticas",
    place: "Asesoría José María Pascual Tornero",
    date: "May 2026 — Jun 2026",
  },
];

export const education: TimelineItem[] = [
  {
    title: "CFGS Desarrollo de Aplicaciones Web",
    place: "En curso · 2º curso",
    date: "Actualidad",
    text: "Programación, bases de datos, desarrollo web en entorno cliente y servidor.",
  },
  {
    title: "Bachillerato Tecnológico",
    place: "IES Virgen del Puerto · Plasencia",
    date: "2021 — 2023",
  },
  {
    title: "Educación Secundaria Obligatoria",
    place: "IES Sierra de Santa Bárbara · Plasencia",
    date: "2017 — 2020",
  },
];

// Ajustes por repositorio: descripción en español, etiquetas, destacar u ocultar.
// La clave es el nombre exacto del repo en GitHub.
export const repoOverrides: Record<
  string,
  { title?: string; description?: string; tags?: string[]; featured?: boolean; hidden?: boolean }
> = {
  "spectator-tool-league": {
    title: "Spectator Tool League",
    description:
      "App de escritorio para Windows que avisa cuando jugadores profesionales de League of Legends están en partida y permite espectearlos con un clic desde tu propio cliente.",
    tags: ["PySide6", "SQLite", "Riot API"],
    featured: true,
  },
  Dungeon_Console_Python: {
    title: "Dungeon Console",
    description:
      "Dungeon crawler por turnos que se juega en la terminal: mazmorras procedurales, combate, inventario y estética ASCII. Hecho con POO en Python, sin librerías gráficas.",
    tags: ["POO", "CLI", "Juego"],
    featured: true,
  },
  "PDFs-daw": {
    title: "PDFs DAW",
    description: "Colección de apuntes y documentación en PDF del ciclo de DAW.",
    tags: ["Apuntes"],
  },
  Portfolio: { hidden: true },
};
