'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutTemplate,
  Sparkles,
  LayoutGrid,
  MessageSquare,
  MousePointerClick,
  Images,
  CreditCard,
  HelpCircle,
  PanelBottom,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useBuilderStore } from '@/store/builder-store';
import type { SectionType } from '@/types/builder';
import { SECTION_REGISTRY, SECTION_TYPES } from '@/lib/section-registry';

const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutTemplate,
  Sparkles,
  LayoutGrid,
  MessageSquare,
  MousePointerClick,
  Images,
  CreditCard,
  HelpCircle,
  PanelBottom,
};

interface Props {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function SectionLibraryPanel({ collapsed = false, onToggle }: Props) {
  const addSection = useBuilderStore((s) => s.addSection);
  const [flashMap, setFlashMap] = useState<Record<string, boolean>>({});

  const handleAdd = useCallback(
    (type: SectionType) => {
      addSection(type);
      setFlashMap((m) => ({ ...m, [type]: true }));
      setTimeout(() => setFlashMap((m) => ({ ...m, [type]: false })), 600);
    },
    [addSection],
  );

  return (
    <aside
      className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden ${
        collapsed ? 'w-14' : 'w-70'
      }`}
      style={{ width: collapsed ? '3.5rem' : '280px' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        {!collapsed && (
          <h2 className="text-sm font-semibold text-gray-800">Sections</h2>
        )}
        <button
          onClick={onToggle}
          className={`text-gray-400 hover:text-gray-600 transition-colors ${collapsed ? 'mx-auto' : ''}`}
          title={collapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {SECTION_TYPES.map((type) => {
          const meta = SECTION_REGISTRY[type];
          const IconComponent = ICON_COMPONENTS[meta.icon] || LayoutTemplate;
          const isFlashing = flashMap[type];

          return (
            <button
              key={type}
              onClick={() => handleAdd(type)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors group relative ${
                collapsed ? 'justify-center px-0' : ''
              }`}
              title={collapsed ? meta.label : undefined}
            >
              <motion.div
                animate={isFlashing ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors"
              >
                <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </motion.div>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                    {meta.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{meta.description}</div>
                </div>
              )}

              <AnimatePresence>
                {isFlashing && !collapsed && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-3 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
                  >
                    Added!
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
