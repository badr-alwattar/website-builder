import type { PricingProps } from '@/types/builder';

export default function PricingSection({ heading, tiers }: PricingProps) {
  return (
    <section className="@container py-16 @md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8">
        {heading && (
          <h2 className="text-3xl @md:text-4xl font-bold text-gray-900 text-center mb-12">
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-8 items-stretch">
          {tiers?.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-2xl p-8 shadow-sm ${
                tier.highlighted
                  ? 'bg-blue-600 text-white ring-4 ring-blue-600 scale-105'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </span>
              )}
              <div className="mb-6">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    tier.highlighted ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  <span
                    className={`text-sm ${tier.highlighted ? 'text-blue-200' : 'text-gray-500'}`}
                  >
                    {tier.period}
                  </span>
                </div>
              </div>
              <ul className="flex-1 space-y-3 mb-8">
                {tier.features?.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                        tier.highlighted ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      ✓
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`block text-center font-semibold px-6 py-3 rounded-lg transition-colors ${
                  tier.highlighted
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {tier.ctaLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
