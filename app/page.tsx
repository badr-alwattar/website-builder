import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import AuthModalsLoader from '@/components/landing/AuthModalsLoader';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string }>;
}) {
  const session = await getSession();
  if (session) redirect('/builder');

  const { auth } = await searchParams;
  const defaultModal = auth ?? null;

  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <AuthModalsLoader defaultOpen={defaultModal} />
    </main>
  );
}
