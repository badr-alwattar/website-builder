import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { SECTION_REGISTRY } from '@/lib/section-registry';
import type { PageConfig, Section } from '@/types/builder';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const website = await prisma.website.findUnique({ where: { slug } });
  if (!website?.publishedConfig) return { title: 'Page not found' };
  const config = website.publishedConfig as unknown as PageConfig;
  return { title: config.name };
}

export default async function PublishedSitePage({ params }: Props) {
  const { slug } = await params;

  const website = await prisma.website.findUnique({ where: { slug } });

  if (!website?.publishedConfig) notFound();

  const config = website.publishedConfig as unknown as PageConfig;

  return (
    <main className="scroll-smooth">
      {config.sections.map((section: Section) => {
        const meta = SECTION_REGISTRY[section.type];
        if (!meta) return null;
        const Component = meta.component;
        return (
          <div key={section.id} id={section.id}>
            <Component {...section.props} />
          </div>
        );
      })}
    </main>
  );
}
