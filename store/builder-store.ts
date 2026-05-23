'use client';

import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { PageConfig, Section, SectionType, SectionProps } from '@/types/builder';
import { getDefaultProps } from '@/lib/section-defaults';

const MAX_HISTORY = 50;

function createEmptyConfig(): PageConfig {
  return {
    version: '1.0',
    id: nanoid(),
    name: 'My Landing Page',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [],
  };
}

function deepClone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

interface BuilderState {
  config: PageConfig;
  selectedSectionId: string | null;
  past: PageConfig[];
  future: PageConfig[];

  addSection: (type: SectionType) => void;
  removeSection: (id: string) => void;
  updateSectionProps: (
    id: string,
    props: Partial<SectionProps>,
    options?: { recordHistory?: boolean },
  ) => void;
  reorderSections: (activeId: string, overId: string) => void;
  selectSection: (id: string | null) => void;
  updatePageName: (name: string) => void;
  undo: () => void;
  redo: () => void;
  loadConfig: (config: PageConfig) => void;
  resetToEmpty: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  config: createEmptyConfig(),
  selectedSectionId: null,
  past: [],
  future: [],

  addSection: (type) => {
    const { config, past } = get();
    const newSection: Section = {
      id: nanoid(),
      type,
      order: config.sections.length,
      props: getDefaultProps(type),
    };
    const newConfig: PageConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
      sections: [...config.sections, newSection],
    };
    set({
      past: [...past.slice(-MAX_HISTORY + 1), deepClone(config)],
      future: [],
      config: newConfig,
    });
  },

  removeSection: (id) => {
    const { config, past } = get();
    const newConfig: PageConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
      sections: config.sections
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, order: i })),
    };
    set({
      past: [...past.slice(-MAX_HISTORY + 1), deepClone(config)],
      future: [],
      config: newConfig,
      selectedSectionId: get().selectedSectionId === id ? null : get().selectedSectionId,
    });
  },

  updateSectionProps: (id, props, options = {}) => {
    const { recordHistory = true } = options;
    const { config, past } = get();
    const newConfig: PageConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
      sections: config.sections.map((s) =>
        s.id === id ? { ...s, props: { ...s.props, ...props } as SectionProps } : s,
      ),
    };
    set({
      ...(recordHistory
        ? {
            past: [...past.slice(-MAX_HISTORY + 1), deepClone(config)],
            future: [],
          }
        : {}),
      config: newConfig,
    });
  },

  reorderSections: (activeId, overId) => {
    const { config, past } = get();
    const sections = [...config.sections];
    const oldIndex = sections.findIndex((s) => s.id === activeId);
    const newIndex = sections.findIndex((s) => s.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const [moved] = sections.splice(oldIndex, 1);
    sections.splice(newIndex, 0, moved);
    const reordered = sections.map((s, i) => ({ ...s, order: i }));

    const newConfig: PageConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
      sections: reordered,
    };
    set({
      past: [...past.slice(-MAX_HISTORY + 1), deepClone(config)],
      future: [],
      config: newConfig,
    });
  },

  selectSection: (id) => {
    set({ selectedSectionId: id });
  },

  updatePageName: (name) => {
    const { config } = get();
    set({ config: { ...config, name, updatedAt: new Date().toISOString() } });
  },

  undo: () => {
    const { config, past, future } = get();
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    set({
      config: prev,
      past: past.slice(0, -1),
      future: [deepClone(config), ...future],
      selectedSectionId: null,
    });
  },

  redo: () => {
    const { config, past, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      config: next,
      past: [...past, deepClone(config)],
      future: future.slice(1),
      selectedSectionId: null,
    });
  },

  loadConfig: (config) => {
    set({
      config,
      past: [],
      future: [],
      selectedSectionId: null,
    });
  },

  resetToEmpty: () => {
    set({
      config: createEmptyConfig(),
      past: [],
      future: [],
      selectedSectionId: null,
    });
  },
}));
