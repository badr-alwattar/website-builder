'use client';

export function AuthTriggerButtons() {
  const trigger = (view: 'login' | 'register') => {
    window.dispatchEvent(new CustomEvent('open-auth', { detail: view }));
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => trigger('login')}
        className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        Log in
      </button>
      <button
        onClick={() => trigger('register')}
        className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        Get started
      </button>
    </div>
  );
}
