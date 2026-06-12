// Author data, ported from the mkdocs .authors.yml. Avatar self-hosted under
// public/img/ (no GitHub request per page-view) for the no-telemetry ethos.
export interface Author {
  name: string;
  description: string;
  avatar: string;
  url?: string;
}

export const AUTHORS: Record<string, Author> = {
  digitalgrease: {
    name: 'digitalgrease',
    description:
      'Engineer, hacker, maker. Writing about high tech, low tech, and the intersection thereof.',
    avatar: '/img/digitalgrease.png',
    url: 'https://digitalgrease.dev',
  },
};

export function getAuthors(keys: string[]): Author[] {
  return keys.map((k) => AUTHORS[k]).filter(Boolean);
}
