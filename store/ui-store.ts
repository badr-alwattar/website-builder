'use client';

import { create } from 'zustand';

export type SavingStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UiState {
  isPreviewMode: boolean;
  isPanelOpen: boolean;
  isSectionsDrawerOpen: boolean;
  isEditDrawerOpen: boolean;
  toasts: Toast[];
  savingStatus: SavingStatus;
  togglePreview: () => void;
  openPreview: () => void;
  closePreview: () => void;
  togglePanel: () => void;
  openSectionsDrawer: () => void;
  closeSectionsDrawer: () => void;
  openEditDrawer: () => void;
  closeEditDrawer: () => void;
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  setSavingStatus: (status: SavingStatus) => void;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastCounter = 0;

export const useUiStore = create<UiState>((set) => ({
  isPreviewMode: false,
  isPanelOpen: true,
  isSectionsDrawerOpen: false,
  isEditDrawerOpen: false,
  toasts: [],
  savingStatus: 'idle',

  togglePreview: () => set((s) => ({ isPreviewMode: !s.isPreviewMode })),
  openPreview: () => set({ isPreviewMode: true }),
  closePreview: () => set({ isPreviewMode: false }),
  togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),
  openSectionsDrawer: () => set({ isSectionsDrawerOpen: true }),
  closeSectionsDrawer: () => set({ isSectionsDrawerOpen: false }),
  openEditDrawer: () => set({ isEditDrawerOpen: true }),
  closeEditDrawer: () => set({ isEditDrawerOpen: false }),

  addToast: (message, type = 'info') => {
    const id = `toast-${++toastCounter}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  removeToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },

  setSavingStatus: (status) => set({ savingStatus: status }),
}));
