import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Landing-page building blocks.
 *
 * The page previously repeated the same `initial/whileInView/viewport/variants`
 * quartet on every element, which made each section ~40 lines of animation
 * plumbing around ~5 lines of content. These wrap it once.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before this element animates. Use to stagger siblings. */
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section';
}

/** Fades and lifts its children into view once, respecting reduced motion. */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

interface SectionProps {
  children: ReactNode;
  id?: string;
  /** Alternating band colour. 'raised' is the slightly lighter treatment. */
  tone?: 'base' | 'raised';
  className?: string;
  /** Narrower measure for text-led sections. */
  width?: 'wide' | 'narrow';
}

export function Section({
  children,
  id,
  tone = 'base',
  className = '',
  width = 'wide',
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative z-10 px-6 py-24 md:py-32 ${
        tone === 'raised' ? 'bg-ink-800/60' : ''
      } ${className}`}
    >
      <div className={`mx-auto ${width === 'narrow' ? 'max-w-4xl' : 'max-w-6xl'}`}>
        {children}
      </div>
    </section>
  );
}

/** Small monospaced label that names the section. */
export function Eyebrow({
  children,
  icon: Icon,
  tone = 'emerald',
}: {
  children: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: 'emerald' | 'purple' | 'muted';
}) {
  const colors = {
    emerald: 'text-emerald-400',
    purple: 'text-purple-400',
    muted: 'text-neutral-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] ${colors[tone]}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  /** Centred headings suit full-width bands; left suits two-column layouts. */
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  return (
    <Reveal
      className={`${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'} ${className}`}
    >
      {eyebrow && <div className="mb-4">{eyebrow}</div>}
      <h2 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-neutral-900 md:text-[2.75rem]">
        {title}
      </h2>
      {sub && <p className="mt-5 text-lg leading-relaxed text-neutral-400">{sub}</p>}
    </Reveal>
  );
}

/** Bordered surface used for every card on the page. */
export function Card({
  children,
  className = '',
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-ink-500 bg-ink-700 ${
        interactive
          ? 'transition-colors duration-300 hover:border-emerald-500/40 hover:bg-ink-600'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
