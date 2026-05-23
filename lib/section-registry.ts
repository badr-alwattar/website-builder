import type { SectionType } from '@/types/builder';
import type { ComponentType } from 'react';

import HeaderSection from '@/components/sections/HeaderSection';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CtaSection from '@/components/sections/CtaSection';
import GallerySection from '@/components/sections/GallerySection';
import PricingSection from '@/components/sections/PricingSection';
import FaqSection from '@/components/sections/FaqSection';
import FooterSection from '@/components/sections/FooterSection';

export interface SectionMeta {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  label: string;
  description: string;
  icon: string;
}

export const SECTION_REGISTRY: Record<SectionType, SectionMeta> = {
  header: {
    component: HeaderSection,
    label: 'Header',
    description: 'Navigation bar with logo and links',
    icon: 'LayoutTemplate',
  },
  hero: {
    component: HeroSection,
    label: 'Hero',
    description: 'Full-width banner with headline and CTA',
    icon: 'Sparkles',
  },
  features: {
    component: FeaturesSection,
    label: 'Features',
    description: 'Grid of features with icons',
    icon: 'LayoutGrid',
  },
  testimonials: {
    component: TestimonialsSection,
    label: 'Testimonials',
    description: 'Customer quotes and social proof',
    icon: 'MessageSquare',
  },
  cta: {
    component: CtaSection,
    label: 'Call to Action',
    description: 'Compelling action section with buttons',
    icon: 'MousePointerClick',
  },
  gallery: {
    component: GallerySection,
    label: 'Gallery',
    description: 'Image grid showcase',
    icon: 'Images',
  },
  pricing: {
    component: PricingSection,
    label: 'Pricing',
    description: 'Pricing tiers with feature lists',
    icon: 'CreditCard',
  },
  faq: {
    component: FaqSection,
    label: 'FAQ',
    description: 'Frequently asked questions accordion',
    icon: 'HelpCircle',
  },
  footer: {
    component: FooterSection,
    label: 'Footer',
    description: 'Page footer with links and copyright',
    icon: 'PanelBottom',
  },
};

export const SECTION_TYPES = Object.keys(SECTION_REGISTRY) as SectionType[];
