import type { FooterProps } from '@/types/builder';

export default function FooterSection({
  logo,
  tagline,
  columns,
  copyright,
  backgroundColor,
}: FooterProps) {
  return (
    <footer
      style={{ backgroundColor: backgroundColor || '#111827' }}
      className="@container text-gray-400"
    >
      <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-12 @md:py-16">
        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-10 mb-12">
          <div className="@lg:col-span-1">
            <span className="text-xl font-bold text-white">{logo || 'Logo'}</span>
            {tagline && <p className="mt-2 text-sm text-gray-400">{tagline}</p>}
          </div>
          {columns?.map((col) => (
            <div key={col.id}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2">
                {col.links?.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 pt-8 text-sm text-gray-500 text-center">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
