import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createEmptyConfig } from '@/lib/site-utils';

/** GET /api/sites — return the user's draft (creates one if none exists) */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let website = await prisma.website.findFirst({
    where: { userId: session.sub },
    orderBy: { updatedAt: 'desc' },
  });

  if (!website) {
    website = await prisma.website.create({
      data: {
        userId: session.sub,
        draftConfig: createEmptyConfig() as object,
      },
    });
  }

  return NextResponse.json(website);
}
