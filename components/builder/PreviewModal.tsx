'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Tablet, Monitor } from 'lucide-react';
import { useState } from 'react';
import { useBuilderStore } from '@/store/builder-store';
import { useUiStore } from '@/store/ui-store';
import { SECTION_REGISTRY } from '@/lib/section-registry';
import type { Section } from '@/types/builder';

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const viewportWidths: Record<ViewportSize, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '100%',
};

function PreviewContent() {
  const sections = useBuilderStore((s) => s.config.sections);
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const closePreview = useUiStore((s) => s.closePreview);

  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex flex-col"
    >
      {/* Preview toolbar */}
      <div className="h-12 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">Preview</span>
          <div className="flex items-center gap-1 ml-4 bg-gray-800 rounded-lg p-1">
            {(['mobile', 'tablet', 'desktop'] as ViewportSize[]).map((v) => {
              const Icon = v === 'mobile' ? Smartphone : v === 'tablet' ? Tablet : Monitor;
              return (
                <button
                  key={v}
                  onClick={() => setViewport(v)}
                  className={`flex items-center justify-center w-8 h-7 rounded-md transition-colors ${
                    viewport === v
                      ? 'bg-gray-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={v.charAt(0).toUpperCase() + v.slice(1)}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
          <span className="text-gray-500 text-xs ml-2">{viewportWidths[viewport]}</span>
        </div>
        <button
          onClick={closePreview}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <X className="w-4 h-4" />
          Close
        </button>
      </div>

      {/* Preview content — motion.div is the scroll container so sticky headers work */}
      <div className="flex-1 overflow-hidden bg-gray-100 flex justify-center py-4">
        <motion.div
          animate={{ width: viewportWidths[viewport] }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-white shadow-2xl rounded-lg overflow-y-auto"
          style={{ height: '100%' }}
        >
          {sortedSections.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p className="text-sm">No sections added yet.</p>
            </div>
          ) : (
            sortedSections.map((section: Section) => {
              const { component: SectionComponent } = SECTION_REGISTRY[section.type];
              return (
                <div key={section.id} id={section.id}>
                  <SectionComponent {...section.props} />
                </div>
              );
            })
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function PreviewModal() {
  const isPreviewMode = useUiStore((s) => s.isPreviewMode);

  return (
    <AnimatePresence>
      {isPreviewMode && <PreviewContent />}
    </AnimatePresence>
  );
}
