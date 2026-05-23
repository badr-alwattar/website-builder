import { HeroCta } from './HeroCta';

export default function LandingHero() {
  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-blue-50/60 to-white">
      {/* Background grid decoration */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(90deg, #1e40af 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-8">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Visual page builder — no code required
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Build beautiful pages,{' '}
          <span className="text-blue-600">visually.</span>
        </h1>

        <p className="mt-6 text-xl sm:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          No code required. Drag, drop, publish. Assemble stunning landing pages
          from pre-made sections in minutes.
        </p>

        <HeroCta />

        <p className="mt-6 text-sm text-gray-400">
          Free forever · No credit card required
        </p>

        {/* Preview mockup */}
        <div className="mt-16 relative mx-auto max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
          <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <div className="flex-1 mx-4 h-4 bg-gray-200 rounded-full" />
          </div>
          <div className="p-6 grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-2">
              {['Header', 'Hero', 'Features', 'CTA', 'Footer'].map((s) => (
                <div
                  key={s}
                  className="h-8 bg-blue-50 border border-blue-100 rounded-lg flex items-center px-3"
                >
                  <span className="text-xs text-blue-600 font-medium">{s}</span>
                </div>
              ))}
            </div>
            <div className="col-span-2 space-y-3">
              <div className="h-12 bg-gray-100 rounded-lg" />
              <div className="h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg" />
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-50 rounded-lg border border-gray-100" />
                ))}
              </div>
              <div className="h-10 bg-blue-600 rounded-lg opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
