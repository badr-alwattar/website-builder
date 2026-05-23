'use client';

export function HeroCta() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
      <button
        onClick={() =>
          window.dispatchEvent(new CustomEvent('open-auth', { detail: 'register' }))
        }
        className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all shadow-lg shadow-blue-200 text-lg"
      >
        Start building for free
      </button>
      <button
        onClick={() =>
          window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' }))
        }
        className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 border border-gray-200 transition-all text-lg"
      >
        Log in
      </button>
    </div>
  );
}
