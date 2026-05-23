import { nanoid } from 'nanoid';
import type { PageConfig } from '@/types/builder';

export function createEmptyConfig(name = 'My Landing Page'): PageConfig {
  return {
    version: '1.0',
    id: nanoid(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [],
  };
}

/** Validate a slug: lowercase letters, numbers, and hyphens only. */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 60;
}

/** Convert any string into a URL-friendly slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'my-site';
}
