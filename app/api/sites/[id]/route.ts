import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

const draftSchema = z.object({
  draftConfig: z.unknown(),
});

type RouteContext = { params: Promise<{ id: string }> };

/** PUT /api/sites/[id] — save draft config */
export async function PUT(req: NextRequest, { params }: RouteContext) {
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

  const parsed = draftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid config' }, { status: 400 });
  }

  const updated = await prisma.website.update({
    where: { id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { draftConfig: parsed.data.draftConfig as any },
  });

  return NextResponse.json({ id: updated.id, updatedAt: updated.updatedAt });
}

/** POST /api/sites/[id]/publish — handled in the nested route */
/** GET /api/sites/[id] — fetch site details */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const website = await prisma.website.findUnique({ where: { id } });
  if (!website || website.userId !== session.sub) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(website);
}
