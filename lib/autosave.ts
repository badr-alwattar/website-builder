import { useEffect, useRef } from 'react';
import type { PageConfig } from '@/types/builder';
import type { SavingStatus } from '@/store/ui-store';

export const AUTOSAVE_KEY = 'builder_autosave';

/** Debounced autosave to both DB and localStorage. */
export function useAutosave(
  config: PageConfig,
  siteId: string,
  setSavingStatus: (s: SavingStatus) => void,
) {
  const configRef = useRef(config);
  configRef.current = config;

  // localStorage backup (immediate, 500ms)
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(configRef.current));
    }, 500);
    return () => clearTimeout(t);
  }, [config]);

  // DB autosave (debounced 2s)
  useEffect(() => {
    const t = setTimeout(async () => {
      setSavingStatus('saving');
      try {
        const res = await fetch(`/api/sites/${siteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draftConfig: configRef.current }),
        });
        setSavingStatus(res.ok ? 'saved' : 'error');
      } catch {
        setSavingStatus('error');
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [config, siteId, setSavingStatus]);
}

export function loadAutosave(): PageConfig | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.version || !parsed.id || !Array.isArray(parsed.sections)) return null;
    return parsed as PageConfig;
  } catch {
    return null;
  }
}

export function clearAutosave(): void {
  localStorage.removeItem(AUTOSAVE_KEY);
}
