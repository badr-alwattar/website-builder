'use client';

import React, { memo, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import { useBuilderStore } from '@/store/builder-store';
import { useOrderedSectionIds } from '@/hooks/useOrderedSectionIds';
import { SortableSectionCard } from './SortableSectionCard';

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 px-8 text-center">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mb-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Your canvas is empty</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Click any section type in the left panel to add it to your page.
      </p>
    </div>
  );
}

function BuilderCanvasInner() {
  const sectionIds = useOrderedSectionIds();
  const selectedSectionId = useBuilderStore((s) => s.selectedSectionId);
  const reorderSections = useBuilderStore((s) => s.reorderSections);
  const selectSection = useBuilderStore((s) => s.selectSection);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderSections(String(active.id), String(over.id));
    }
  };

  const sortableItems = useMemo(() => sectionIds, [sectionIds]);

  return (
    <main
      className="flex-1 overflow-y-auto bg-gray-100"
      onClick={(e) => {
        if (e.target === e.currentTarget) selectSection(null);
      }}
    >
      <div className="min-h-full p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortableItems}
            strategy={verticalListSortingStrategy}
          >
            {sectionIds.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {sectionIds.map((sectionId) => (
                    <SortableSectionCard
                      key={sectionId}
                      sectionId={sectionId}
                      isSelected={sectionId === selectedSectionId}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
}

export const BuilderCanvas = memo(BuilderCanvasInner);
