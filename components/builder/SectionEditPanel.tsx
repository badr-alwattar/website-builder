'use client';

import React, { memo, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import { useBuilderStore } from '@/store/builder-store';
import { useSelectedSection } from '@/hooks/useSection';
import { useSyncSectionForm } from '@/hooks/useSyncSectionForm';
import type {
  SectionType,
  HeaderProps,
  HeroProps,
  FeaturesProps,
  TestimonialsProps,
  CtaProps,
  GalleryProps,
  PricingProps,
  FaqProps,
  FooterProps,
} from '@/types/builder';
import { nanoid } from 'nanoid';

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';
const checkboxCls = 'w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500';

function HeaderForm({ section }: { section: { id: string; props: HeaderProps } }) {
  const { register, watch, control } = useForm<HeaderProps>({ defaultValues: section.props });
  const { fields, append, remove } = useFieldArray({ control, name: 'navLinks' });
  const { handleBlur } = useSyncSectionForm(section.id, watch);

  return (
    <div className="space-y-4" onBlur={handleBlur}>
      <FormField label="Logo Text">
        <input {...register('logo')} className={inputCls} placeholder="Your Brand" />
      </FormField>
      <FormField label="Background Color">
        <div className="flex gap-2">
          <input type="color" {...register('backgroundColor')} className="w-10 h-9 rounded border border-gray-200 cursor-pointer p-1" />
          <input {...register('backgroundColor')} className={`${inputCls} flex-1`} placeholder="#ffffff" />
        </div>
      </FormField>
      <FormField label="Sticky Header">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('sticky')} className={checkboxCls} />
          <span className="text-sm text-gray-700">Stick to top on scroll</span>
        </label>
      </FormField>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nav Links</span>
          <button
            type="button"
            onClick={() => append({ label: 'New Link', href: '#' })}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input {...register(`navLinks.${i}.label`)} className={`${inputCls} flex-1`} placeholder="Label" />
              <input {...register(`navLinks.${i}.href`)} className={`${inputCls} flex-1`} placeholder="#link" />
              <button type="button" onClick={() => remove(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroForm({ section }: { section: { id: string; props: HeroProps } }) {
  const { register, watch } = useForm<HeroProps>({ defaultValues: section.props });
  const { handleBlur } = useSyncSectionForm(section.id, watch);

  return (
    <div className="space-y-4" onBlur={handleBlur}>
      <FormField label="Title">
        <input {...register('title')} className={inputCls} />
      </FormField>
      <FormField label="Subtitle">
        <textarea {...register('subtitle')} className={`${inputCls} h-20 resize-none`} />
      </FormField>
      <FormField label="Background Image URL">
        <input {...register('backgroundImageUrl')} className={inputCls} placeholder="https://..." />
      </FormField>
      <FormField label="Alignment">
        <select {...register('alignment')} className={inputCls}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </FormField>
      <FormField label="CTA Button Label">
        <input {...register('ctaLabel')} className={inputCls} />
      </FormField>
      <FormField label="CTA Button Link">
        <input {...register('ctaHref')} className={inputCls} placeholder="#" />
      </FormField>
      <FormField label="Dark Overlay">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('overlay')} className={checkboxCls} />
          <span className="text-sm text-gray-700">Enable overlay</span>
        </label>
      </FormField>
    </div>
  );
}

function FeaturesForm({ section }: { section: { id: string; props: FeaturesProps } }) {
  const { register, watch, control } = useForm<FeaturesProps>({ defaultValues: section.props });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const { handleBlur } = useSyncSectionForm(section.id, watch);

  return (
    <div className="space-y-4" onBlur={handleBlur}>
      <FormField label="Heading">
        <input {...register('heading')} className={inputCls} />
      </FormField>
      <FormField label="Subheading">
        <input {...register('subheading')} className={inputCls} />
      </FormField>
      <FormField label="Columns">
        <select {...register('columns', { valueAsNumber: true })} className={inputCls}>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </FormField>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Features</span>
          <button
            type="button"
            onClick={() => append({ id: nanoid(), icon: 'Star', title: 'Feature', description: 'Description' })}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field, i) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Feature {i + 1}</span>
                <button type="button" onClick={() => remove(i)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input {...register(`items.${i}.icon`)} className={inputCls} placeholder="Icon (e.g. Zap)" />
              <input {...register(`items.${i}.title`)} className={inputCls} placeholder="Title" />
              <input {...register(`items.${i}.description`)} className={inputCls} placeholder="Description" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialsForm({ section }: { section: { id: string; props: TestimonialsProps } }) {
  const { register, watch, control } = useForm<TestimonialsProps>({ defaultValues: section.props });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const { handleBlur } = useSyncSectionForm(section.id, watch);

  return (
    <div className="space-y-4" onBlur={handleBlur}>
      <FormField label="Heading">
        <input {...register('heading')} className={inputCls} />
      </FormField>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Testimonials</span>
          <button
            type="button"
            onClick={() => append({ id: nanoid(), quote: 'Great product!', authorName: 'John Doe', authorRole: 'CEO', avatarUrl: '' })}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field, i) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Testimonial {i + 1}</span>
                <button type="button" onClick={() => remove(i)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea {...register(`items.${i}.quote`)} className={`${inputCls} h-16 resize-none`} placeholder="Quote" />
              <input {...register(`items.${i}.authorName`)} className={inputCls} placeholder="Author Name" />
              <input {...register(`items.${i}.authorRole`)} className={inputCls} placeholder="Role / Company" />
              <input {...register(`items.${i}.avatarUrl`)} className={inputCls} placeholder="Avatar URL" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CtaForm({ section }: { section: { id: string; props: CtaProps } }) {
  const { register, watch } = useForm<CtaProps>({ defaultValues: section.props });
  const { handleBlur } = useSyncSectionForm(section.id, watch);

  return (
    <div className="space-y-4" onBlur={handleBlur}>
      <FormField label="Heading">
        <input {...register('heading')} className={inputCls} />
      </FormField>
      <FormField label="Subheading">
        <input {...register('subheading')} className={inputCls} />
      </FormField>
      <FormField label="Background Color">
        <div className="flex gap-2">
          <input type="color" {...register('backgroundColor')} className="w-10 h-9 rounded border border-gray-200 cursor-pointer p-1" />
          <input {...register('backgroundColor')} className={`${inputCls} flex-1`} />
        </div>
      </FormField>
      <FormField label="Primary Button Label">
        <input {...register('primaryLabel')} className={inputCls} />
      </FormField>
      <FormField label="Primary Button Link">
        <input {...register('primaryHref')} className={inputCls} />
      </FormField>
      <FormField label="Secondary Button Label">
        <input {...register('secondaryLabel')} className={inputCls} />
      </FormField>
      <FormField label="Secondary Button Link">
        <input {...register('secondaryHref')} className={inputCls} />
      </FormField>
    </div>
  );
}

function GalleryForm({ section }: { section: { id: string; props: GalleryProps } }) {
  const { register, watch, control } = useForm<GalleryProps>({ defaultValues: section.props });
  const { fields, append, remove } = useFieldArray({ control, name: 'images' });
  const { handleBlur } = useSyncSectionForm(section.id, watch);

  return (
    <div className="space-y-4" onBlur={handleBlur}>
      <FormField label="Heading">
        <input {...register('heading')} className={inputCls} />
      </FormField>
      <FormField label="Columns">
        <select {...register('columns', { valueAsNumber: true })} className={inputCls}>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </FormField>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Images</span>
          <button
            type="button"
            onClick={() => append({ id: nanoid(), url: '', alt: '' })}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field, i) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Image {i + 1}</span>
                <button type="button" onClick={() => remove(i)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input {...register(`images.${i}.url`)} className={inputCls} placeholder="Image URL" />
              <input {...register(`images.${i}.alt`)} className={inputCls} placeholder="Alt text" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingForm({ section }: { section: { id: string; props: PricingProps } }) {
  const { register, watch, control } = useForm<PricingProps>({ defaultValues: section.props });
  const { fields, append, remove } = useFieldArray({ control, name: 'tiers' });
  const { handleBlur } = useSyncSectionForm(section.id, watch);

  return (
    <div className="space-y-4" onBlur={handleBlur}>
      <FormField label="Heading">
        <input {...register('heading')} className={inputCls} />
      </FormField>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pricing Tiers</span>
          <button
            type="button"
            onClick={() => append({ id: nanoid(), name: 'Plan', price: '$0', period: '/mo', features: ['Feature 1'], ctaLabel: 'Get Started', highlighted: false })}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field, i) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Tier {i + 1}</span>
                <button type="button" onClick={() => remove(i)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input {...register(`tiers.${i}.name`)} className={inputCls} placeholder="Plan name" />
              <div className="flex gap-2">
                <input {...register(`tiers.${i}.price`)} className={inputCls} placeholder="$29" />
                <input {...register(`tiers.${i}.period`)} className={inputCls} placeholder="/mo" />
              </div>
              <input {...register(`tiers.${i}.ctaLabel`)} className={inputCls} placeholder="CTA Label" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register(`tiers.${i}.highlighted`)} className={checkboxCls} />
                <span className="text-xs text-gray-600">Highlighted</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqForm({ section }: { section: { id: string; props: FaqProps } }) {
  const { register, watch, control } = useForm<FaqProps>({ defaultValues: section.props });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const { handleBlur } = useSyncSectionForm(section.id, watch);

  return (
    <div className="space-y-4" onBlur={handleBlur}>
      <FormField label="Heading">
        <input {...register('heading')} className={inputCls} />
      </FormField>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Questions</span>
          <button
            type="button"
            onClick={() => append({ id: nanoid(), question: 'New question?', answer: 'Answer here.' })}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field, i) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Q{i + 1}</span>
                <button type="button" onClick={() => remove(i)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input {...register(`items.${i}.question`)} className={inputCls} placeholder="Question" />
              <textarea {...register(`items.${i}.answer`)} className={`${inputCls} h-20 resize-none`} placeholder="Answer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterForm({ section }: { section: { id: string; props: FooterProps } }) {
  const { register, watch } = useForm<FooterProps>({ defaultValues: section.props });
  const { handleBlur } = useSyncSectionForm(section.id, watch);

  return (
    <div className="space-y-4" onBlur={handleBlur}>
      <FormField label="Logo Text">
        <input {...register('logo')} className={inputCls} />
      </FormField>
      <FormField label="Tagline">
        <input {...register('tagline')} className={inputCls} />
      </FormField>
      <FormField label="Background Color">
        <div className="flex gap-2">
          <input type="color" {...register('backgroundColor')} className="w-10 h-9 rounded border border-gray-200 cursor-pointer p-1" />
          <input {...register('backgroundColor')} className={`${inputCls} flex-1`} />
        </div>
      </FormField>
      <FormField label="Copyright">
        <input {...register('copyright')} className={inputCls} />
      </FormField>
    </div>
  );
}

const FORM_MAP: Record<SectionType, React.ComponentType<{ section: { id: string; props: never } }>> = {
  header: HeaderForm as React.ComponentType<{ section: { id: string; props: never } }>,
  hero: HeroForm as React.ComponentType<{ section: { id: string; props: never } }>,
  features: FeaturesForm as React.ComponentType<{ section: { id: string; props: never } }>,
  testimonials: TestimonialsForm as React.ComponentType<{ section: { id: string; props: never } }>,
  cta: CtaForm as React.ComponentType<{ section: { id: string; props: never } }>,
  gallery: GalleryForm as React.ComponentType<{ section: { id: string; props: never } }>,
  pricing: PricingForm as React.ComponentType<{ section: { id: string; props: never } }>,
  faq: FaqForm as React.ComponentType<{ section: { id: string; props: never } }>,
  footer: FooterForm as React.ComponentType<{ section: { id: string; props: never } }>,
};

function SectionEditPanelInner() {
  const selected = useSelectedSection();
  const selectSection = useBuilderStore((s) => s.selectSection);

  const FormComponent = useMemo(
    () => (selected ? FORM_MAP[selected.type] : null),
    [selected],
  );

  return (
    <aside className="w-full md:w-80 h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-800">
          {selected ? `Edit: ${selected.type.charAt(0).toUpperCase() + selected.type.slice(1)}` : 'Properties'}
        </h2>
        {selected && (
          <button
            onClick={() => selectSection(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selected && FormComponent ? (
            <motion.div
              key={selected.id}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              <FormComponent section={selected as never} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full py-16 px-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">Select a section to edit</p>
              <p className="text-xs text-gray-400 mt-1">Click any section in the canvas</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}

export const SectionEditPanel = memo(SectionEditPanelInner);
