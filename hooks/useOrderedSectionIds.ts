'use client';

import { useShallow } from 'zustand/react/shallow';
import { useBuilderStore } from '@/store/builder-store';

/** Ordered section ids — re-renders only on add/remove/reorder, not on prop edits. */
export function useOrderedSectionIds(): string[] {
  return useBuilderStore(
    useShallow((s) =>
      [...s.config.sections]
        .sort((a, b) => a.order - b.order)
        .map((sec) => sec.id),
    ),
  );
}
