const features = [
  {
    icon: '⊞',
    title: 'Drag & Drop',
    description:
      'Reorder sections effortlessly with a smooth, accessible drag-and-drop interface powered by @dnd-kit.',
  },
  {
    icon: '✦',
    title: 'Live Preview',
    description:
      'See your page exactly as visitors will — full-screen preview at any viewport width, instantly.',
  },
  {
    icon: '↓',
    title: 'Export / Import',
    description:
      'Download your page as a JSON file and restore it any time. Your data, your control.',
  },
  {
    icon: '⊟',
    title: 'Section Library',
    description:
      'Nine production-ready sections: Header, Hero, Features, Testimonials, CTA, Gallery, Pricing, FAQ, and Footer.',
  },
  {
    icon: '↩',
    title: 'Undo / Redo',
    description:
      'Never lose work — navigate up to 50 steps back and forward through your editing history.',
  },
  {
    icon: '☁',
    title: 'Auto-save',
    description:
      'Your progress is saved to local storage automatically every second. Close the tab without worry.',
  },
];

export default function LandingFeatures() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Everything you need to ship
          </h2>
          <p className="mt-4 text-xl text-gray-500 max-w-xl mx-auto">
            A fully-featured visual builder, right in your browser — no install
            required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 text-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
