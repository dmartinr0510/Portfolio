import { profile, repoOverrides } from "../data/profile";

export type Project = {
  name: string;
  title: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  tags: string[];
  stars: number;
  updatedAt: string;
  featured: boolean;
};

type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

function prettify(name: string) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function getProjects(): Promise<Project[]> {
  let repos: GitHubRepo[] = [];
  try {
    const res = await fetch(
      `https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=pushed`,
      {
        headers: { Accept: "application/vnd.github+json" },
        // Se refresca cada hora: los repos nuevos aparecen solos.
        next: { revalidate: 3600 },
      },
    );
    if (res.ok) repos = await res.json();
  } catch {
    // Sin red o límite de la API: se muestra la sección vacía con enlace a GitHub.
  }

  return repos
    .filter((r) => !r.fork && !r.archived && !repoOverrides[r.name]?.hidden)
    .map((r) => {
      const o = repoOverrides[r.name] ?? {};
      return {
        name: r.name,
        title: o.title ?? prettify(r.name),
        description: o.description ?? r.description ?? "Sin descripción todavía.",
        url: r.html_url,
        homepage: r.homepage || null,
        language: r.language,
        tags: o.tags ?? r.topics ?? [],
        stars: r.stargazers_count,
        updatedAt: r.pushed_at,
        featured: o.featured ?? false,
      };
    })
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}
