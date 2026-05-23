import { nanoid } from 'nanoid';
import type {
  SectionType,
  SectionProps,
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

export function getDefaultProps(type: SectionType): SectionProps {
  switch (type) {
    case 'header':
      return {
        logo: 'Rekaz',
        navLinks: [
          { label: 'Home', href: '#' },
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Contact', href: '#contact' },
        ],
        sticky: true,
        backgroundColor: '#ffffff',
      } satisfies HeaderProps;

    case 'hero':
      return {
        title: 'Build Beautiful Websites Visually',
        subtitle:
          'Drag, drop, and customize your perfect landing page — no code required. Launch faster than ever.',
        backgroundImageUrl:
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80',
        ctaLabel: 'Get Started Free',
        ctaHref: '#',
        alignment: 'center',
        overlay: true,
      } satisfies HeroProps;

    case 'features':
      return {
        heading: 'Everything You Need',
        subheading: 'Powerful features to help you build and grow your online presence.',
        items: [
          {
            id: nanoid(),
            icon: 'Zap',
            title: 'Blazing Fast',
            description: 'Optimized for performance with lazy loading and smart caching.',
          },
          {
            id: nanoid(),
            icon: 'Shield',
            title: 'Secure by Default',
            description: 'Enterprise-grade security built in from the ground up.',
          },
          {
            id: nanoid(),
            icon: 'Palette',
            title: 'Fully Customizable',
            description: 'Tailor every pixel to match your brand identity.',
          },
          {
            id: nanoid(),
            icon: 'BarChart2',
            title: 'Analytics Ready',
            description: 'Integrated insights to understand your audience.',
          },
          {
            id: nanoid(),
            icon: 'Globe',
            title: 'Global CDN',
            description: 'Deliver content at lightning speed worldwide.',
          },
          {
            id: nanoid(),
            icon: 'Headphones',
            title: '24/7 Support',
            description: 'Our team is always here to help you succeed.',
          },
        ],
        columns: 3,
      } satisfies FeaturesProps;

    case 'testimonials':
      return {
        heading: 'Loved by Thousands',
        items: [
          {
            id: nanoid(),
            quote:
              'Rekaz transformed how we build landing pages. What used to take weeks now takes hours.',
            authorName: 'Sarah Johnson',
            authorRole: 'Head of Marketing, Acme Corp',
            avatarUrl: 'https://i.pravatar.cc/80?img=1',
          },
          {
            id: nanoid(),
            quote:
              'The drag-and-drop interface is incredibly intuitive. My whole team adopted it in a day.',
            authorName: 'Mohammed Al-Rashid',
            authorRole: 'Founder, StartupHub',
            avatarUrl: 'https://i.pravatar.cc/80?img=3',
          },
          {
            id: nanoid(),
            quote:
              'Finally, a website builder that respects my design sensibilities and my time.',
            authorName: 'Emily Chen',
            authorRole: 'Creative Director, Studio Eight',
            avatarUrl: 'https://i.pravatar.cc/80?img=5',
          },
        ],
      } satisfies TestimonialsProps;

    case 'cta':
      return {
        heading: 'Ready to Get Started?',
        subheading: 'Join over 50,000 businesses building with Rekaz today.',
        primaryLabel: 'Start for Free',
        primaryHref: '#',
        secondaryLabel: 'View Demo',
        secondaryHref: '#',
        backgroundColor: '#1d4ed8',
      } satisfies CtaProps;

    case 'gallery':
      return {
        heading: 'Our Work',
        images: [
          {
            id: nanoid(),
            url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80',
            alt: 'Web design project',
          },
          {
            id: nanoid(),
            url: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=600&q=80',
            alt: 'Mobile app design',
          },
          {
            id: nanoid(),
            url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80',
            alt: 'Dashboard UI',
          },
          {
            id: nanoid(),
            url: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=600&q=80',
            alt: 'Brand identity',
          },
          {
            id: nanoid(),
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
            alt: 'Photography project',
          },
          {
            id: nanoid(),
            url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80',
            alt: 'Laptop workspace',
          },
        ],
        columns: 3,
      } satisfies GalleryProps;

    case 'pricing':
      return {
        heading: 'Simple, Transparent Pricing',
        tiers: [
          {
            id: nanoid(),
            name: 'Starter',
            price: '$0',
            period: '/month',
            features: ['3 pages', '5 GB storage', 'Basic analytics', 'Community support'],
            ctaLabel: 'Get Started',
            highlighted: false,
          },
          {
            id: nanoid(),
            name: 'Pro',
            price: '$29',
            period: '/month',
            features: [
              'Unlimited pages',
              '50 GB storage',
              'Advanced analytics',
              'Priority support',
              'Custom domain',
            ],
            ctaLabel: 'Start Free Trial',
            highlighted: true,
          },
          {
            id: nanoid(),
            name: 'Enterprise',
            price: '$99',
            period: '/month',
            features: [
              'Everything in Pro',
              'Unlimited storage',
              'White-label option',
              'Dedicated support',
              'SLA guarantee',
            ],
            ctaLabel: 'Contact Sales',
            highlighted: false,
          },
        ],
      } satisfies PricingProps;

    case 'faq':
      return {
        heading: 'Frequently Asked Questions',
        items: [
          {
            id: nanoid(),
            question: 'Do I need coding skills to use Rekaz?',
            answer:
              'Not at all! Rekaz is designed for everyone. Our visual drag-and-drop editor lets you build professional websites without writing a single line of code.',
          },
          {
            id: nanoid(),
            question: 'Can I export my website?',
            answer:
              'Yes, you can export your page configuration as a JSON file and import it back anytime. Full portability of your data.',
          },
          {
            id: nanoid(),
            question: 'Is there a free plan?',
            answer:
              'Yes! Our Starter plan is completely free and includes everything you need to launch your first website.',
          },
          {
            id: nanoid(),
            question: 'How does autosave work?',
            answer:
              'Your work is automatically saved to your browser\'s local storage every second. You\'ll never lose progress, even if you close the tab.',
          },
        ],
      } satisfies FaqProps;

    case 'footer':
      return {
        logo: 'Rekaz',
        tagline: 'Build beautiful websites, visually.',
        columns: [
          {
            id: nanoid(),
            heading: 'Product',
            links: [
              { label: 'Features', href: '#' },
              { label: 'Pricing', href: '#' },
              { label: 'Changelog', href: '#' },
            ],
          },
          {
            id: nanoid(),
            heading: 'Company',
            links: [
              { label: 'About', href: '#' },
              { label: 'Blog', href: '#' },
              { label: 'Careers', href: '#' },
            ],
          },
          {
            id: nanoid(),
            heading: 'Support',
            links: [
              { label: 'Documentation', href: '#' },
              { label: 'Contact', href: '#' },
              { label: 'Status', href: '#' },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Rekaz. All rights reserved.`,
        backgroundColor: '#111827',
      } satisfies FooterProps;
  }
}
