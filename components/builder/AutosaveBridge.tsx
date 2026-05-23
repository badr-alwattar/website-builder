'use client';

import { useBuilderStore } from '@/store/builder-store';
import { useUiStore } from '@/store/ui-store';
import { useAutosave } from '@/lib/autosave';

/** Isolated autosave subscriber — keeps BuilderShell from re-rendering on config edits. */
export function AutosaveBridge({ siteId }: { siteId: string }) {
  const config = useBuilderStore((s) => s.config);
  const setSavingStatus = useUiStore((s) => s.setSavingStatus);
  useAutosave(config, siteId, setSavingStatus);
  return null;
}
