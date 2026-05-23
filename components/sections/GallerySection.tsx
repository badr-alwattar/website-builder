import type { GalleryProps } from '@/types/builder';

const columnClasses = {
  2: 'grid-cols-1 @sm:grid-cols-2',
  3: 'grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3',
  4: 'grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4',
};

export default function GallerySection({ heading, images, columns = 3 }: GalleryProps) {
  return (
    <section className="@container py-16 @md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8">
        {heading && (
          <h2 className="text-3xl @md:text-4xl font-bold text-gray-900 text-center mb-12">
            {heading}
          </h2>
        )}
        <div className={`grid gap-4 ${columnClasses[columns] || columnClasses[3]}`}>
          {images?.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 group"
            >
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                {img.url ? 'Image unavailable' : 'No image'}
              </div>
              {img.url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={img.url}
                  alt={img.alt || ''}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
