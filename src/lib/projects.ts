export interface Project {
  slug: string;
  number: string;
  year: string;
  tags: string[];
  galleryCount: number;
  resultCount: number;
}

export const projects: Project[] = [
  {
    slug: 'apex-commerce',
    number: '01',
    year: '2024',
    tags: ['Next.js', 'TypeScript', 'Headless CMS', 'Stripe', 'Vercel'],
    galleryCount: 4,
    resultCount: 4,
  },
  {
    slug: 'neural-dashboard',
    number: '02',
    year: '2024',
    tags: ['React', 'Python', 'OpenAI', 'PostgreSQL', 'WebSockets'],
    galleryCount: 4,
    resultCount: 4,
  },
  {
    slug: 'flow-crm',
    number: '03',
    year: '2025',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Resend'],
    galleryCount: 4,
    resultCount: 4,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(currentSlug: string): Project {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  const nextIndex = (currentIndex + 1) % projects.length;
  return projects[nextIndex];
}
