import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { BuilderShell } from '@/components/builder/BuilderShell';
import prisma from '@/lib/prisma';
import { createEmptyConfig } from '@/lib/site-utils';
import type { PageConfig } from '@/types/builder';

export default async function BuilderPage() {
  const session = await getSession();
  if (!session) redirect('/?auth=login');

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

  return (
    <BuilderShell
      user={{ name: session.name, email: session.email }}
      siteId={website.id}
      initialConfig={website.draftConfig as unknown as PageConfig}
      publishedSlug={website.slug ?? null}
    />
  );
}
