'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Archivo_Black, DM_Sans } from 'next/font/google';
import { Link } from '@/i18n/navigation';
import { projects } from '@/lib/projects';
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
  const isInView = useInView(ref, { once: true, margin: '-60px' });

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
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const tp = useTranslations('projects');

  return (
    <Reveal delay={0.1 + index * 0.1} direction={index % 2 === 0 ? 'left' : 'right'}>
      <Link href={`/projects/${project.slug}`}>
        <div
          className="relative cursor-pointer transition-colors duration-300 p-6 md:p-8"
          style={{
            background: hovered ? '#EDE0C4' : 'transparent',
            border: '1px solid rgba(237, 224, 196, 0.15)',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Number */}
          <span
            className={`${archivo.className} block transition-colors duration-300`}
            style={{
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              lineHeight: 1,
              color: hovered ? 'rgba(27, 63, 171, 0.2)' : 'rgba(237, 224, 196, 0.15)',
            }}
          >
            {project.number}
          </span>

          {/* Title */}
          <h3
            className={`${archivo.className} uppercase transition-colors duration-300 mt-4`}
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              lineHeight: 1.05,
              color: hovered ? '#1B3FAB' : '#EDE0C4',
            }}
          >
            {tp(`${project.slug}.title`)}
          </h3>

          {/* Category */}
          <span
            className={`${dmSans.className} uppercase font-light block mt-3 transition-colors duration-300`}
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              color: hovered ? 'rgba(27, 63, 171, 0.7)' : 'rgba(237, 224, 196, 0.65)',
            }}
          >
            {tp(`${project.slug}.category`)}
          </span>

          {/* Description */}
          <p
            className={`${dmSans.className} font-light mt-4 transition-colors duration-300`}
            style={{
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: hovered ? 'rgba(27, 63, 171, 0.75)' : 'rgba(237, 224, 196, 0.65)',
            }}
          >
            {tp(`${project.slug}.description`)}
          </p>

          {/* Arrow */}
          <div className="flex justify-end mt-6">
            <div
              className="flex items-center justify-center transition-all duration-300"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: hovered ? '#1B3FAB' : 'transparent',
                border: hovered ? '1.5px solid #1B3FAB' : '1.5px solid rgba(237, 224, 196, 0.2)',
              }}
            >
              <span
                className="transition-colors duration-300"
                style={{
                  fontSize: 14,
                  lineHeight: 1,
                  color: hovered ? '#EDE0C4' : 'rgba(237, 224, 196, 0.45)',
                }}
              >
                &#8599;
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Projects() {
  const featured = projects.slice(0, 3);
  const t = useTranslations('ProjectsSection');

  return (
    <section
      id="projects"
      className="relative overflow-hidden"
      style={{ background: '#1B3FAB' }}
    >
      <div className="px-5 md:px-10 lg:px-16 py-16 md:py-24">
        {/* Top row: label left, starburst right */}
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
              <Starburst size={44} />
            </motion.div>
          </Reveal>
        </div>

        {/* Headline */}
        <Reveal delay={0.15}>
          <h2
            className={`${archivo.className} uppercase leading-[0.95] tracking-[-0.02em] mb-10 md:mb-16`}
            style={{
              fontSize: 'clamp(3rem, 7vw, 7.5rem)',
              color: '#EDE0C4',
            }}
          >
            {t('headline')}
          </h2>
        </Reveal>

        {/* Asymmetric card grid: first card spans wider, next two stack */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          <div className="md:col-span-7">
            <ProjectCard project={featured[0]} index={0} />
          </div>
          <div className="md:col-span-5">
            <ProjectCard project={featured[1]} index={1} />
          </div>
          <div className="md:col-span-5">
            <ProjectCard project={featured[2]} index={2} />
          </div>
          <div className="md:col-span-7 flex items-center justify-center md:justify-end">
            <Reveal delay={0.4} direction="right">
              <Link href="/projects">
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
                      fontSize: '0.75rem',
                      letterSpacing: '0.2em',
                      color: '#2A2A2A',
                    }}
                  >
                    {t('viewAll')}
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
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
