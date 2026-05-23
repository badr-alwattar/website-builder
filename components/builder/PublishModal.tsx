'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Globe, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { slugify } from '@/lib/site-utils';

interface Props {
  isOpen: boolean;
  siteId: string;
  pageName: string;
  existingSlug: string | null;
  onClose: () => void;
  onPublished: (slug: string) => void;
}

export function PublishModal({
  isOpen,
  siteId,
  pageName,
  existingSlug,
  onClose,
  onPublished,
}: Props) {
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState<string | null>(existingSlug);

  useEffect(() => {
    if (isOpen) {
      setSlug(existingSlug ?? slugify(pageName));
      setError(null);
      setPublished(existingSlug);
    }
  }, [isOpen, pageName, existingSlug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handlePublish = async () => {
    setError(null);
    if (!slug.trim()) { setError('Please enter a URL slug.'); return; }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError('Only lowercase letters, numbers, and hyphens are allowed.');
      return;
    }
    if (slug.length < 3) { setError('Slug must be at least 3 characters.'); return; }

    setIsPublishing(true);
    try {
      const res = await fetch(`/api/sites/${siteId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? 'Failed to publish.'); return; }
      setPublished(json.slug);
      onPublished(json.slug);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const siteUrl = published ? `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${published}` : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Publish site</h2>
                  <p className="text-xs text-gray-500">Make your site publicly accessible</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Published success banner */}
              {published && (
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800">Site is live!</p>
                    <a
                      href={siteUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 underline underline-offset-2 flex items-center gap-1 mt-0.5"
                    >
                      {siteUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Slug input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  {published ? 'Change URL slug' : 'Choose a URL slug'}
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500">
                  <span className="px-3 py-2.5 bg-gray-50 border-r border-gray-200 text-xs text-gray-500 whitespace-nowrap">
                    /p/
                  </span>
                  <input
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                      setError(null);
                    }}
                    placeholder="my-awesome-site"
                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                    onKeyDown={(e) => e.key === 'Enter' && handlePublish()}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Only lowercase letters, numbers, and hyphens. Min 3 characters.
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Info */}
              <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2.5">
                Publishing copies your current draft to the public URL. Any future changes to the draft will not be visible until you publish again.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 pb-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing || !slug}
                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isPublishing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {published ? 'Republish' : 'Publish'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
