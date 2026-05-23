'use client';

import { useCallback, useEffect, useRef, type FocusEvent } from 'react';
import type { UseFormWatch } from 'react-hook-form';
import { useBuilderStore } from '@/store/builder-store';
import type { SectionProps } from '@/types/builder';

const SYNC_DEBOUNCE_MS = 300;

/**
 * Debounces store updates while the user types in the edit panel.
 * Form inputs stay instant (react-hook-form local state); only the canvas
 * preview and autosave receive batched updates.
 */
export function useSyncSectionForm<T extends SectionProps>(
  sectionId: string,
  watch: UseFormWatch<T>,
) {
  const updateSectionProps = useBuilderStore((s) => s.updateSectionProps);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latestValuesRef = useRef<T | null>(null);
  const historyRecordedRef = useRef(false);

  const pushToStore = useCallback(
    (values: T, recordHistory: boolean) => {
      updateSectionProps(sectionId, values as Partial<SectionProps>, { recordHistory });
      if (recordHistory) historyRecordedRef.current = true;
    },
    [sectionId, updateSectionProps],
  );

  const flushSync = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    if (!latestValuesRef.current) return;
    pushToStore(latestValuesRef.current, !historyRecordedRef.current);
  }, [pushToStore]);

  useEffect(() => {
    historyRecordedRef.current = false;
    latestValuesRef.current = null;

    const sub = watch((values) => {
      latestValuesRef.current = values as T;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        pushToStore(latestValuesRef.current!, !historyRecordedRef.current);
      }, SYNC_DEBOUNCE_MS);
    });

    return () => {
      sub.unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (latestValuesRef.current) {
        pushToStore(latestValuesRef.current, !historyRecordedRef.current);
      }
    };
  }, [watch, pushToStore, sectionId]);

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        flushSync();
      }
    },
    [flushSync],
  );

  return { handleBlur, flushSync };
}
