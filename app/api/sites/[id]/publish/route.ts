import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { isValidSlug } from '@/lib/site-utils';

const schema = z.object({
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(60, 'Slug must be at most 60 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug may only contain lowercase letters, numbers and hyphens',
    ),
});

type RouteContext = { params: Promise<{ id: string }> };

/** POST /api/sites/[id]/publish — publish a draft with a given slug */
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const website = await prisma.website.findUnique({ where: { id } });
  if (!website || website.userId !== session.sub) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid slug' },
      { status: 400 },
    );
  }

  const { slug } = parsed.data;

  // Check if slug is taken by another site
  const existing = await prisma.website.findUnique({ where: { slug } });
  if (existing && existing.id !== id) {
    return NextResponse.json(
      { error: 'This URL is already taken. Please choose another.' },
      { status: 409 },
    );
  }

  const updated = await prisma.website.update({
    where: { id },
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      publishedConfig: website.draftConfig as any,
      slug,
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({
    id: updated.id,
    slug: updated.slug,
    publishedAt: updated.publishedAt,
  });
}
