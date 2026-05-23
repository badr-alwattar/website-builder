'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/store/builder-store';
import { useUiStore } from '@/store/ui-store';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Toolbar } from './Toolbar';
import { SectionLibraryPanel } from './SectionLibraryPanel';
import { BuilderCanvas } from './BuilderCanvas';
import { SectionEditPanel } from './SectionEditPanel';
import { AutosaveBridge } from './AutosaveBridge';
import { ToastContainer } from '@/components/ui/Toast';
import type { PageConfig } from '@/types/builder';

const PreviewModal = dynamic(
  () => import('./PreviewModal').then((m) => ({ default: m.PreviewModal })),
  { ssr: false },
);

interface BuilderShellProps {
  user: { name: string; email: string };
  siteId: string;
  initialConfig: PageConfig;
  publishedSlug: string | null;
}

function RestoreBanner({ onRestore, onDismiss }: { onRestore: () => void; onDismiss: () => void }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-4 max-w-sm">
      <span>Newer local changes found. Restore?</span>
      <div className="flex gap-2">
        <button
          onClick={onRestore}
          className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded-lg font-medium transition-colors"
        >
          Restore
        </button>
        <button
          onClick={onDismiss}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-lg transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export function BuilderShell({ user, siteId, initialConfig, publishedSlug }: BuilderShellProps) {
  const loadConfig = useBuilderStore((s) => s.loadConfig);
  const selectedSectionId = useBuilderStore((s) => s.selectedSectionId);
  const selectSection = useBuilderStore((s) => s.selectSection);

  const isPanelOpen = useUiStore((s) => s.isPanelOpen);
  const isSectionsDrawerOpen = useUiStore((s) => s.isSectionsDrawerOpen);
  const isEditDrawerOpen = useUiStore((s) => s.isEditDrawerOpen);
  const closeSectionsDrawer = useUiStore((s) => s.closeSectionsDrawer);
  const openEditDrawer = useUiStore((s) => s.openEditDrawer);
  const closeEditDrawer = useUiStore((s) => s.closeEditDrawer);
  const addToast = useUiStore((s) => s.addToast);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const [localBackup, setLocalBackup] = useState<PageConfig | null>(null);
  const [currentPublishedSlug, setCurrentPublishedSlug] = useState<string | null>(publishedSlug);

  useEffect(() => {
    loadConfig(initialConfig);
    try {
      const raw = localStorage.getItem('builder_autosave');
      if (raw) {
        const saved: PageConfig = JSON.parse(raw);
        if (saved?.id === initialConfig.id && saved.updatedAt > initialConfig.updatedAt) {
          setLocalBackup(saved);
          setShowRestoreBanner(true);
        }
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-open/close the edit drawer whenever a section is selected/deselected
  useEffect(() => {
    if (selectedSectionId) {
      openEditDrawer();
    } else {
      closeEditDrawer();
    }
  }, [selectedSectionId, openEditDrawer, closeEditDrawer]);

  const handleRestore = useCallback(() => {
    if (localBackup) {
      loadConfig(localBackup);
      addToast('Local changes restored!', 'success');
    }
    setShowRestoreBanner(false);
  }, [localBackup, loadConfig, addToast]);

  useKeyboardShortcuts();

  const anyDrawerOpen = isSectionsDrawerOpen || isEditDrawerOpen;

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <AutosaveBridge siteId={siteId} />
      <Toolbar
        user={user}
        siteId={siteId}
        publishedSlug={currentPublishedSlug}
        onPublished={(slug) => {
          setCurrentPublishedSlug(slug);
          addToast(`Published at /p/${slug}`, 'success');
        }}
      />

      {/* Desktop layout (md+) */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <SectionLibraryPanel
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />

        <div className="flex-1 overflow-hidden flex">
          <BuilderCanvas />
        </div>

        {isPanelOpen && <SectionEditPanel />}
      </div>

      {/* Mobile layout: full-screen canvas + overlay drawers */}
      <div className="flex md:hidden flex-1 overflow-hidden relative">
        {/* Canvas fills the full area */}
        <BuilderCanvas />

        {/* Backdrop — closes any open drawer */}
        <AnimatePresence>
          {anyDrawerOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 z-40 bg-black/40"
              onClick={() => {
                closeSectionsDrawer();
                selectSection(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Sections drawer — slides in from the left */}
        <AnimatePresence>
          {isSectionsDrawerOpen && (
            <motion.div
              key="sections-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute inset-y-0 left-0 z-50 w-72 shadow-2xl"
            >
              <SectionLibraryPanel collapsed={false} onToggle={closeSectionsDrawer} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit drawer — slides in from the right */}
        <AnimatePresence>
          {isEditDrawerOpen && (
            <motion.div
              key="edit-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute inset-y-0 right-0 z-50 w-80 max-w-[90vw] shadow-2xl"
            >
              <SectionEditPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PreviewModal />
      <ToastContainer />

      {showRestoreBanner && (
        <RestoreBanner
          onRestore={handleRestore}
          onDismiss={() => setShowRestoreBanner(false)}
        />
      )}
    </div>
  );
}
