'use client';

import { useRef, useState } from 'react';
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

const serviceNumbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];

/* 8-point starburst */
function Starburst({ size = 60, color = '#EDE0C4' }: { size?: number; color?: string }) {
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

function SlideReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -70 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -70 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Reveal({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const initialX = direction === 'right' ? 50 : 0;
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
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ServiceRow({
  number,
  index,
}: {
  number: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const t = useTranslations('Services');

  return (
    <SlideReveal delay={0.06 * index}>
      <div
        className="cursor-default transition-colors duration-300"
        style={{
          background: hovered ? '#EDE0C4' : 'transparent',
          borderBottom: '1px solid rgba(237, 224, 196, 0.15)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="px-5 md:px-10 lg:px-16 py-4 md:py-5 flex items-center gap-4 md:gap-10">
          {/* Number */}
          <span
            className={`${archivo.className} flex-shrink-0 transition-colors duration-300`}
            style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
              lineHeight: 1,
              color: hovered
                ? 'rgba(27, 63, 171, 0.4)'
                : 'rgba(237, 224, 196, 0.35)',
            }}
          >
            {number}
          </span>

          {/* Service name */}
          <span
            className={`${archivo.className} uppercase transition-colors duration-300 flex-1 min-w-0`}
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
              lineHeight: 1,
              color: hovered ? '#1B3FAB' : '#EDE0C4',
            }}
          >
            {t(`s${number}Title`)}
          </span>

          {/* Description — visible on lg+ */}
          <span
            className={`${dmSans.className} font-light hidden lg:block max-w-[260px] text-right transition-colors duration-300`}
            style={{
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: hovered
                ? 'rgba(27, 63, 171, 0.7)'
                : 'rgba(237, 224, 196, 0.65)',
            }}
          >
            {t(`s${number}Desc`)}
          </span>

          {/* Arrow */}
          <div
            className="flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: hovered ? '#1B3FAB' : 'transparent',
              border: hovered
                ? '1.5px solid #1B3FAB'
                : '1.5px solid rgba(237, 224, 196, 0.2)',
            }}
          >
            <span
              className="transition-colors duration-300"
              style={{
                fontSize: 16,
                lineHeight: 1,
                color: hovered ? '#EDE0C4' : 'rgba(237, 224, 196, 0.45)',
              }}
            >
              &#8599;
            </span>
          </div>
        </div>
      </div>
    </SlideReveal>
  );
}

export default function Services() {
  const t = useTranslations('Services');

  return (
    <section
      id="services"
      className="relative overflow-hidden"
      style={{ background: '#1B3FAB' }}
    >
      {/* Section header */}
      <div className="px-5 md:px-10 lg:px-16 pt-16 md:pt-24 pb-8 md:pb-14">
        <div className="flex items-start justify-between mb-8 md:mb-14">
          <Reveal delay={0}>
            <span
              className={`${dmSans.className} uppercase font-light block`}
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.35em',
                color: '#EDE0C4',
              }}
            >
              {t('label')}
            </span>
          </Reveal>

          <Reveal delay={0.1} direction="right">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <Starburst size={50} />
            </motion.div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <h2
            className={`${archivo.className} uppercase leading-[0.95] tracking-[-0.02em]`}
            style={{
              fontSize: 'clamp(3rem, 7vw, 7.5rem)',
              color: '#EDE0C4',
            }}
          >
            {t('headline')}
          </h2>
        </Reveal>
      </div>

      {/* Service rows */}
      <div>
        <div
          className="w-full h-px"
          style={{ background: 'rgba(237, 224, 196, 0.15)' }}
        />
        {serviceNumbers.map((num, i) => (
          <ServiceRow key={num} number={num} index={i} />
        ))}
      </div>

      {/* Bottom spacing with decorative elements */}
      <div className="px-5 md:px-10 lg:px-16 py-12 md:py-20 flex items-end justify-between">
        <Reveal delay={0.2}>
          <Starburst size={36} />
        </Reveal>

        <Reveal delay={0.25} direction="right">
          <div
            className="flex items-center justify-center"
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#EDE0C4',
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1, color: '#2A2A2A' }}>
              &#8599;
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
