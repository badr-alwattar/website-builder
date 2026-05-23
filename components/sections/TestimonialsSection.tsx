import type { TestimonialsProps } from '@/types/builder';

export default function TestimonialsSection({ heading, items }: TestimonialsProps) {
  return (
    <section className="@container py-16 @md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8">
        <h2 className="text-3xl @md:text-4xl font-bold text-gray-900 text-center mb-12">
          {heading}
        </h2>
        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-8">
          {items?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-6"
            >
              <div className="text-blue-500 text-3xl">&ldquo;</div>
              <p className="text-gray-700 leading-relaxed flex-1">{item.quote}</p>
              <div className="flex items-center gap-3">
                {/* Fallback initials always rendered behind the image.
                    If the image loads it covers the placeholder; if it fails, placeholder shows. */}
                <div className="relative w-10 h-10 shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold">
                    {item.authorName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  {item.avatarUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.avatarUrl}
                      alt={item.authorName}
                      className="absolute inset-0 w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.authorName}</p>
                  <p className="text-gray-500 text-xs">{item.authorRole}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
