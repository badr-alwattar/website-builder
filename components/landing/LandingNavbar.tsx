import { AuthTriggerButtons } from './AuthTriggerButtons';

export default function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">Rekaz</span>
        </div>
        <AuthTriggerButtons />
      </div>
    </header>
  );
}
