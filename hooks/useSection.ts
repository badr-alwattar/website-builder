'use client';

import { useCallback } from 'react';
import { useBuilderStore } from '@/store/builder-store';
import type { Section } from '@/types/builder';

/** Subscribe to a single section — re-renders only when that section changes. */
export function useSection(sectionId: string): Section | undefined {
  return useBuilderStore(
    useCallback((s) => s.config.sections.find((sec) => sec.id === sectionId), [sectionId]),
  );
}

/** Subscribe to the currently selected section only. */
export function useSelectedSection(): Section | null {
  const selectedId = useBuilderStore((s) => s.selectedSectionId);
  return useBuilderStore(
    useCallback((s) => {
      if (!selectedId) return null;
      return s.config.sections.find((sec) => sec.id === selectedId) ?? null;
    }, [selectedId]),
  );
}
