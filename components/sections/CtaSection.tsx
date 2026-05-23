import type { CtaProps } from '@/types/builder';

export default function CtaSection({
  heading,
  subheading,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  backgroundColor,
}: CtaProps) {
  return (
    <section
      style={{ backgroundColor: backgroundColor || '#1d4ed8' }}
      className="@container py-16 @md:py-24"
    >
      <div className="max-w-4xl mx-auto px-4 @sm:px-6 @lg:px-8 text-center">
        <h2 className="text-3xl @md:text-4xl font-bold text-white mb-4">{heading}</h2>
        {subheading && (
          <p className="text-lg text-white/80 mb-10">{subheading}</p>
        )}
        <div className="flex flex-col @sm:flex-row gap-4 justify-center">
          {primaryLabel && (
            <a
              href={primaryHref || '#'}
              className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              {primaryLabel}
            </a>
          )}
          {secondaryLabel && (
            <a
              href={secondaryHref || '#'}
              className="inline-block bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
