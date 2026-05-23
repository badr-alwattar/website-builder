'use client';

import React, { memo, useMemo, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useBuilderStore } from '@/store/builder-store';
import { useSection } from '@/hooks/useSection';
import { SECTION_REGISTRY } from '@/lib/section-registry';

interface Props {
  sectionId: string;
  isSelected: boolean;
  isPreview?: boolean;
}

function SortableSectionCardInner({ sectionId, isSelected, isPreview = false }: Props) {
  const section = useSection(sectionId);
  const selectSection = useBuilderStore((s) => s.selectSection);
  const removeSection = useBuilderStore((s) => s.removeSection);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: sectionId });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : undefined,
    }),
    [transform, transition, isDragging],
  );

  const handleDelete = () => {
    if (confirmDelete) {
      removeSection(sectionId);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  if (!section) return null;

  const { component: SectionComponent } = SECTION_REGISTRY[section.type];
  const sectionProps = section.props;

  if (isPreview) {
    return <SectionComponent {...sectionProps} />;
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 shadow-lg shadow-blue-100'
          : 'border-transparent hover:border-gray-200'
      } ${isDragging ? 'shadow-2xl' : ''}`}
      onClick={() => selectSection(sectionId)}
    >
      {/* Overlay toolbar */}
      <div className="absolute top-2 right-2 z-50 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {confirmDelete ? (
          <div className="flex items-center gap-1 bg-red-600 rounded-lg px-2 py-1">
            <span className="text-white text-xs font-medium">Confirm?</span>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              className="text-white hover:text-red-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); selectSection(sectionId); }}
              className="w-7 h-7 flex items-center justify-center bg-white/90 rounded-lg shadow text-gray-600 hover:text-blue-600 hover:bg-white transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              className="w-7 h-7 flex items-center justify-center bg-white/90 rounded-lg shadow text-gray-600 hover:text-red-500 hover:bg-white transition-colors"
              title="Delete (click twice)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-2 left-2 z-10 w-7 h-7 flex items-center justify-center bg-white/90 rounded-lg shadow text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-grab active:cursor-grabbing"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Section type badge */}
      {isSelected && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full capitalize">
          {section.type}
        </div>
      )}

      {/* The actual section content — suppress sticky so header doesn't overlap the toolbar */}
      <div className="pointer-events-none select-none [&_header]:!relative [&_header]:!top-auto">
        <SectionComponent {...sectionProps} />
      </div>
    </motion.div>
  );
}

export const SortableSectionCard = memo(SortableSectionCardInner);
