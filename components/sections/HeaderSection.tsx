'use client';

import { useState } from 'react';
import type { HeaderProps } from '@/types/builder';

export default function HeaderSection({
  logo,
  navLinks,
  sticky,
  backgroundColor,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      style={{ backgroundColor: backgroundColor || '#ffffff' }}
      className={`@container w-full border-b border-gray-200 ${sticky ? 'sticky top-0 z-40' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-gray-900">{logo || 'Logo'}</span>
          </div>

          <nav className="hidden @md:flex items-center gap-6">
            {navLinks?.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            className="@md:hidden flex flex-col gap-1 w-6 p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <>
                <span className="block h-0.5 bg-gray-700 rotate-45 translate-y-[7px]" />
                <span className="block h-0.5 bg-gray-700 opacity-0" />
                <span className="block h-0.5 bg-gray-700 -rotate-45 -translate-y-[7px]" />
              </>
            ) : (
              <>
                <span className="block h-0.5 bg-gray-700" />
                <span className="block h-0.5 bg-gray-700" />
                <span className="block h-0.5 bg-gray-700" />
              </>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="@md:hidden border-t border-gray-100">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks?.map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
