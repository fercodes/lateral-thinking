'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Archivo_Black, DM_Sans } from 'next/font/google';
import { useTranslations } from 'next-intl';

const archivo = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

function Reveal({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const initialX = direction === 'left' ? -50 : direction === 'right' ? 50 : 0;
  const initialY = direction === 'up' ? 40 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: initialX, y: initialY }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: initialX, y: initialY }
      }
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Starburst / asterisk — 8-point star drawn with SVG */
function Starburst({
  size = 60,
  color = '#EDE0C4',
}: {
  size?: number;
  color?: string;
}) {
  const points = 8;
  const outerR = size / 2;
  const innerR = outerR * 0.35;
  const cx = size / 2;
  const cy = size / 2;

  const path: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  path.push('Z');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path d={path.join(' ')} fill={color} />
    </svg>
  );
}

/* Pill CTA element */
function PillCta({ label = 'Learn More' }: { label?: string }) {
  return (
    <div
      className={`${dmSans.className} inline-flex items-center gap-3`}
      style={{
        background: '#EDE0C4',
        borderRadius: 999,
        padding: '6px 6px 6px 20px',
      }}
    >
      <span
        className="uppercase font-medium"
        style={{
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          color: '#2A2A2A',
        }}
      >
        {label}
      </span>
      <div
        className="flex items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#2A2A2A',
        }}
      >
        <span style={{ fontSize: 14, lineHeight: 1, color: '#EDE0C4' }}>
          &#8599;
        </span>
      </div>
    </div>
  );
}

export default function About() {
  const t = useTranslations('About');

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
    { value: t('stat4Value'), label: t('stat4Label') },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden"
      style={{ background: '#1B3FAB' }}
    >
      <div className="px-5 md:px-10 lg:px-16 py-16 md:py-24">
        {/* Top row: label left, circle arrows right */}
        <div className="flex items-start justify-between mb-8 md:mb-14">
          <Reveal delay={0}>
            <span
              className={`${dmSans.className} uppercase font-light block`}
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.35em',
                color: '#EDE0C4',
              }}
            >
              {t('label')}
            </span>
          </Reveal>
        </div>

        {/* Massive headline — left-aligned, dominant */}
        <div className="max-w-5xl mb-10 md:mb-20">
          <Reveal delay={0.15}>
            <h2
              className={`${archivo.className} uppercase leading-[0.95] tracking-[-0.02em]`}
              style={{
                fontSize: 'clamp(3rem, 8vw, 9rem)',
                color: '#EDE0C4',
              }}
            >
              {t('headline1')}
            </h2>
          </Reveal>
          <Reveal delay={0.25}>
            <h2
              className={`${archivo.className} uppercase leading-[0.95] tracking-[-0.02em]`}
              style={{
                fontSize: 'clamp(3rem, 8vw, 9rem)',
                color: '#EDE0C4',
              }}
            >
              {t('headline2')}
            </h2>
          </Reveal>
        </div>

        {/* Middle zone: body text + floating starburst */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mb-14 md:mb-22">
          {/* Body text — left, small, lightweight */}
          <div className="lg:col-span-5 lg:col-start-1">
            <Reveal delay={0.35} direction="left">
              <p
                className={`${dmSans.className} font-light leading-[1.8]`}
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(237, 224, 196, 0.75)',
                }}
              >
                {t('body1')}
              </p>
            </Reveal>
            <Reveal delay={0.4} direction="left">
              <p
                className={`${dmSans.className} font-light leading-[1.8] mt-5`}
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(237, 224, 196, 0.5)',
                }}
              >
                {t('body2')}
              </p>
            </Reveal>
          </div>

          {/* Starburst — floating center/right area */}
          <div className="lg:col-span-3 lg:col-start-7 flex items-center justify-center lg:justify-start">
            <Reveal delay={0.5}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <Starburst size={60} />
              </motion.div>
            </Reveal>
          </div>

          {/* Stats — right column, clean inline */}
          {/*           
          <div className="lg:col-span-3 lg:col-start-10">
            <Reveal delay={0.45} direction="right">
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <span
                      className={`${archivo.className} block`}
                      style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                        color: '#EDE0C4',
                        lineHeight: 1.1,
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className={`${dmSans.className} uppercase font-light block mt-1`}
                      style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.25em',
                        color: 'rgba(237, 224, 196, 0.5)',
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>*/}
        </div>

        {/* Bottom row: starburst center, pill CTA right */}
        <div className="flex items-end justify-between">
          <Reveal delay={0.6}>
            <Starburst size={40} />
          </Reveal>

          <Reveal delay={0.65} direction="right">
            <PillCta label={t('cta')} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
