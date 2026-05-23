'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Undo2, Redo2, Download, Upload, Eye, EyeOff, RotateCcw,
  ChevronDown, LogOut, Globe, CheckCircle, AlertCircle, Loader2,
  LayoutGrid, Pencil,
} from 'lucide-react';
import { useBuilderStore } from '@/store/builder-store';
import { useUiStore } from '@/store/ui-store';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { exportConfig, importConfig } from '@/lib/export-import';
import { PublishModal } from './PublishModal';

interface ToolbarProps {
  user: { name: string; email: string };
  siteId: string;
  publishedSlug: string | null;
  onPublished: (slug: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function SaveIndicator() {
  const status = useUiStore((s) => s.savingStatus);
  if (status === 'idle') return null;
  return (
    <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
      {status === 'saving' && <><Loader2 className="w-3 h-3 animate-spin" /><span className="hidden sm:inline">Saving…</span></>}
      {status === 'saved' && <><CheckCircle className="w-3 h-3 text-green-500" /><span className="hidden sm:inline">Saved</span></>}
      {status === 'error' && <><AlertCircle className="w-3 h-3 text-red-400" /><span className="hidden sm:inline">Failed</span></>}
    </span>
  );
}

export function Toolbar({ user, siteId, publishedSlug, onPublished }: ToolbarProps) {
  const router = useRouter();
  const pageName = useBuilderStore((s) => s.config.name);
  const updatePageName = useBuilderStore((s) => s.updatePageName);
  const loadConfig = useBuilderStore((s) => s.loadConfig);
  const resetToEmpty = useBuilderStore((s) => s.resetToEmpty);
  const selectedSectionId = useBuilderStore((s) => s.selectedSectionId);

  const isPreviewMode = useUiStore((s) => s.isPreviewMode);
  const togglePreview = useUiStore((s) => s.togglePreview);
  const isSectionsDrawerOpen = useUiStore((s) => s.isSectionsDrawerOpen);
  const openSectionsDrawer = useUiStore((s) => s.openSectionsDrawer);
  const closeSectionsDrawer = useUiStore((s) => s.closeSectionsDrawer);
  const isEditDrawerOpen = useUiStore((s) => s.isEditDrawerOpen);
  const openEditDrawer = useUiStore((s) => s.openEditDrawer);
  const closeEditDrawer = useUiStore((s) => s.closeEditDrawer);
  const addToast = useUiStore((s) => s.addToast);

  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importConfig(file);
      loadConfig(imported);
      addToast('Page imported successfully!', 'success');
    } catch (err) {
      const msg =
        err instanceof Error && err.message === 'Invalid config file'
          ? 'File format not recognised. Make sure it was exported from this builder.'
          : 'Invalid file — could not parse JSON';
      addToast(msg, 'error');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch {
      setLoggingOut(false);
    }
  };

  const btnCls = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors';
  const primaryBtn = `${btnCls} bg-blue-600 text-white hover:bg-blue-700`;
  const ghostBtn = `${btnCls} text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed`;
  const iconBtn = 'w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const initials = getInitials(user.name);

  return (
    <>
      <div className="h-14 border-b border-gray-200 bg-white flex items-center px-3 gap-2 shrink-0 min-w-0">

        {/* Mobile: sections drawer toggle */}
        <button
          onClick={() => isSectionsDrawerOpen ? closeSectionsDrawer() : openSectionsDrawer()}
          className={`md:hidden ${iconBtn} ${isSectionsDrawerOpen ? 'bg-blue-50 text-blue-600' : ''}`}
          title="Sections"
          aria-label="Toggle sections panel"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        {/* Page name + save indicator */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input
            value={pageName}
            onChange={(e) => updatePageName(e.target.value)}
            className="text-sm font-semibold text-gray-800 bg-transparent border-none outline-none focus:bg-gray-50 focus:px-2 rounded-lg transition-all w-full max-w-[8rem] sm:max-w-xs"
            placeholder="Page name"
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
          />
          <SaveIndicator />
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={undo} disabled={!canUndo} className={iconBtn} title="Undo (Ctrl+Z)">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={!canRedo} className={iconBtn} title="Redo (Ctrl+Shift+Z)">
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop-only actions */}
        <div className="hidden md:flex items-center gap-1">
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <button onClick={() => resetToEmpty()} className={ghostBtn} title="Reset page">
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className={ghostBtn} title="Import JSON">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={() => exportConfig(useBuilderStore.getState().config)}
            className={ghostBtn}
            title="Export JSON (Ctrl+E)"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={togglePreview}
            className={isPreviewMode ? primaryBtn : ghostBtn}
            title="Preview (Ctrl+P)"
          >
            {isPreviewMode ? (
              <><EyeOff className="w-4 h-4" /><span className="hidden sm:inline">Edit</span></>
            ) : (
              <><Eye className="w-4 h-4" /><span className="hidden sm:inline">Preview</span></>
            )}
          </button>
        </div>

        {/* Mobile: edit drawer toggle (visible only when a section is selected) */}
        {selectedSectionId && (
          <button
            onClick={() => isEditDrawerOpen ? closeEditDrawer() : openEditDrawer()}
            className={`md:hidden ${iconBtn} ${isEditDrawerOpen ? 'bg-blue-50 text-blue-600' : ''}`}
            title="Edit section"
            aria-label="Toggle edit panel"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}

        <div className="w-px h-6 bg-gray-200 shrink-0" />

        {/* Publish button */}
        <button
          onClick={() => setPublishOpen(true)}
          className={`${btnCls} shrink-0 ${publishedSlug ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'}`}
          title={publishedSlug ? `Published at /p/${publishedSlug}` : 'Publish site'}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{publishedSlug ? 'Published' : 'Publish'}</span>
        </button>

        <div className="w-px h-6 bg-gray-200 hidden sm:block shrink-0" />

        {/* User avatar dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {user.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              {/* Use fixed positioning so the dropdown is never clipped by overflow:hidden parents */}
              <div className="fixed top-14 right-3 z-50 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                {publishedSlug && (
                  <a
                    href={`/p/${publishedSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-green-500" />
                    View published site
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                >
                  <LogOut className="w-4 h-4" />
                  {loggingOut ? 'Logging out…' : 'Log out'}
                </button>
              </div>
            </>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </div>

      <PublishModal
        isOpen={publishOpen}
        siteId={siteId}
        pageName={pageName}
        existingSlug={publishedSlug}
        onClose={() => setPublishOpen(false)}
        onPublished={(slug) => {
          setPublishOpen(false);
          onPublished(slug);
        }}
      />
    </>
  );
}
