'use client';

import dynamic from 'next/dynamic';

const AuthModals = dynamic(() => import('./AuthModals'), { ssr: false });

export default function AuthModalsLoader({
  defaultOpen,
}: {
  defaultOpen: string | null;
}) {
  return <AuthModals defaultOpen={defaultOpen} />;
}
