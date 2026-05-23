import type { FaqProps } from '@/types/builder';

export default function FaqSection({ heading, items }: FaqProps) {
  return (
    <section className="@container py-16 @md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 @sm:px-6 @lg:px-8">
        {heading && (
          <h2 className="text-3xl @md:text-4xl font-bold text-gray-900 text-center mb-12">
            {heading}
          </h2>
        )}
        <div className="space-y-4">
          {items?.map((item) => (
            <details
              key={item.id}
              className="group border border-gray-200 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                <span>{item.question}</span>
                <span className="text-gray-400 transition-transform group-open:rotate-180 text-lg">
                  ▾
                </span>
              </summary>
              <div className="px-6 py-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 bg-gray-50">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
