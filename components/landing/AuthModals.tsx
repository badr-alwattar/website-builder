'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

type ModalView = 'login' | 'register' | null;

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

interface Props {
  defaultOpen: string | null;
}

function InputField({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
        }`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function LoginForm({
  onSwitch,
  onSuccess,
}: {
  onSwitch: () => void;
  onSuccess: () => void;
}) {
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginValues) => {
    setApiError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error ?? 'Something went wrong. Please try again.');
        return;
      }
      onSuccess();
    } catch {
      setApiError('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <InputField
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      {apiError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {apiError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Log in
      </button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-blue-600 font-medium hover:underline"
        >
          Register
        </button>
      </p>
    </form>
  );
}

function RegisterForm({
  onSwitch,
  onSuccess,
}: {
  onSwitch: () => void;
  onSuccess: () => void;
}) {
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterValues) => {
    setApiError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error ?? 'Something went wrong. Please try again.');
        return;
      }
      onSuccess();
    } catch {
      setApiError('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label="Name"
        type="text"
        placeholder="Your name"
        error={errors.name?.message}
        {...register('name')}
      />
      <InputField
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <InputField
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        error={errors.password?.message}
        {...register('password')}
      />

      {apiError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {apiError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Create account
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-blue-600 font-medium hover:underline"
        >
          Log in
        </button>
      </p>
    </form>
  );
}

export default function AuthModals({ defaultOpen }: Props) {
  const router = useRouter();
  const [view, setView] = useState<ModalView>(
    defaultOpen === 'login' || defaultOpen === 'register' ? defaultOpen : null,
  );

  const close = useCallback(() => setView(null), []);

  useEffect(() => {
    const handler = (e: Event) => {
      setView((e as CustomEvent<ModalView>).detail);
    };
    window.addEventListener('open-auth', handler);
    return () => window.removeEventListener('open-auth', handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const handleSuccess = () => {
    router.push('/builder');
  };

  return (
    <AnimatePresence>
      {view && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={close}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {view === 'login' ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {view === 'login'
                    ? 'Log in to access your builder'
                    : 'Start building for free'}
                </p>
              </div>
              <button
                onClick={close}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form area with layout animation for height change */}
            <motion.div layout className="px-6 pb-6 pt-4">
              <AnimatePresence mode="wait">
                {view === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <LoginForm
                      onSwitch={() => setView('register')}
                      onSuccess={handleSuccess}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <RegisterForm
                      onSwitch={() => setView('login')}
                      onSuccess={handleSuccess}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
