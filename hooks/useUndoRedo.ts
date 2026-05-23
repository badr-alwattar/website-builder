'use client';

import { useBuilderStore } from '@/store/builder-store';

export function useUndoRedo() {
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const canUndo = useBuilderStore((s) => s.past.length > 0);
  const canRedo = useBuilderStore((s) => s.future.length > 0);

  return { undo, redo, canUndo, canRedo };
}
