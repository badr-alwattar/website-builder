import type { FeaturesProps } from '@/types/builder';

const ICON_MAP: Record<string, string> = {
  Zap: '⚡',
  Shield: '🛡️',
  Palette: '🎨',
  BarChart2: '📊',
  Globe: '🌐',
  Headphones: '🎧',
  Star: '⭐',
  Heart: '❤️',
  Lock: '🔒',
  Cloud: '☁️',
  Code: '💻',
  Rocket: '🚀',
};

const columnClasses = {
  2: 'grid-cols-1 @sm:grid-cols-2',
  3: 'grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3',
  4: 'grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4',
};

export default function FeaturesSection({
  heading,
  subheading,
  items,
  columns = 3,
}: FeaturesProps) {
  return (
    <section className="@container py-16 @md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl @md:text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
          {subheading && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subheading}</p>
          )}
        </div>
        <div className={`grid gap-8 ${columnClasses[columns] || columnClasses[3]}`}>
          {items?.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-2xl mb-4 group-hover:bg-blue-200 transition-colors">
                {ICON_MAP[item.icon] || '✦'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
