'use client';

import { useEffect } from 'react';
import { useBuilderStore } from '@/store/builder-store';
import { useUiStore } from '@/store/ui-store';
import { exportConfig } from '@/lib/export-import';

export function useKeyboardShortcuts() {
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const removeSection = useBuilderStore((s) => s.removeSection);
  const selectedSectionId = useBuilderStore((s) => s.selectedSectionId);
  const selectSection = useBuilderStore((s) => s.selectSection);
  const togglePreview = useUiStore((s) => s.togglePreview);
  const closePreview = useUiStore((s) => s.closePreview);
  const isPreviewMode = useUiStore((s) => s.isPreviewMode);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey;
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isEditing = tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable;

      if (isMeta && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if (isMeta && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
        return;
      }
      if (isMeta && e.key === 'e') {
        e.preventDefault();
        exportConfig(useBuilderStore.getState().config);
        return;
      }
      if (isMeta && e.key === 'p') {
        e.preventDefault();
        togglePreview();
        return;
      }
      if (e.key === 'Escape') {
        if (isPreviewMode) {
          closePreview();
        } else {
          selectSection(null);
        }
        return;
      }
      if (!isEditing && (e.key === 'Delete' || e.key === 'Backspace') && selectedSectionId) {
        e.preventDefault();
        removeSection(selectedSectionId);
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, removeSection, selectedSectionId, selectSection, togglePreview, closePreview, isPreviewMode]);
}
