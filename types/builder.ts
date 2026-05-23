export type SectionType =
  | 'header'
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'cta'
  | 'gallery'
  | 'pricing'
  | 'faq'
  | 'footer';

export interface PageConfig {
  version: '1.0';
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
}

export interface Section {
  id: string;
  type: SectionType;
  order: number;
  props: SectionProps;
}

export interface HeaderProps {
  logo: string;
  navLinks: { label: string; href: string }[];
  sticky: boolean;
  backgroundColor: string;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImageUrl: string;
  ctaLabel: string;
  ctaHref: string;
  alignment: 'left' | 'center' | 'right';
  overlay: boolean;
}

export interface FeaturesProps {
  heading: string;
  subheading: string;
  items: {
    id: string;
    icon: string;
    title: string;
    description: string;
  }[];
  columns: 2 | 3 | 4;
}

export interface TestimonialsProps {
  heading: string;
  items: {
    id: string;
    quote: string;
    authorName: string;
    authorRole: string;
    avatarUrl: string;
  }[];
}

export interface CtaProps {
  heading: string;
  subheading: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  backgroundColor: string;
}

export interface GalleryProps {
  heading: string;
  images: { id: string; url: string; alt: string }[];
  columns: 2 | 3 | 4;
}

export interface PricingProps {
  heading: string;
  tiers: {
    id: string;
    name: string;
    price: string;
    period: string;
    features: string[];
    ctaLabel: string;
    highlighted: boolean;
  }[];
}

export interface FaqProps {
  heading: string;
  items: { id: string; question: string; answer: string }[];
}

export interface FooterProps {
  logo: string;
  tagline: string;
  columns: { id: string; heading: string; links: { label: string; href: string }[] }[];
  copyright: string;
  backgroundColor: string;
}

export type SectionProps =
  | HeaderProps
  | HeroProps
  | FeaturesProps
  | TestimonialsProps
  | CtaProps
  | GalleryProps
  | PricingProps
  | FaqProps
  | FooterProps;
