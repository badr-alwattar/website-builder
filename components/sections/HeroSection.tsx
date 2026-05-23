import type { HeroProps } from '@/types/builder';

const alignmentClasses = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
};

export default function HeroSection({
  title,
  subtitle,
  backgroundImageUrl,
  ctaLabel,
  ctaHref,
  alignment = 'center',
  overlay,
}: HeroProps) {
  return (
    <section className="@container relative min-h-[480px] @md:min-h-[600px] flex items-center">
      {backgroundImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
      )}
      {overlay && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-20">
        <div className={`flex flex-col gap-6 max-w-3xl ${alignmentClasses[alignment]} ${alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''}`}>
          <h1 className="text-4xl @md:text-5xl @lg:text-6xl font-extrabold text-white leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg @md:text-xl text-white/80 leading-relaxed">
              {subtitle}
            </p>
          )}
          {ctaLabel && (
            <a
              href={ctaHref || '#'}
              className="inline-block self-start bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              style={alignment === 'center' ? { alignSelf: 'center' } : undefined}
            >
              {ctaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
