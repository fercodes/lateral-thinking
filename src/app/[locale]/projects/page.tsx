'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
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
  const t = useTranslations('projects');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/projects/${project.slug}`}>
        <div
          className="relative cursor-pointer transition-colors duration-300 p-6 md:p-8 h-full"
          style={{
            background: hovered ? '#EDE0C4' : 'transparent',
            border: '1px solid rgba(237, 224, 196, 0.15)',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span
            className={`${archivo.className} block transition-colors duration-300`}
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1,
              color: hovered ? 'rgba(27, 63, 171, 0.2)' : 'rgba(237, 224, 196, 0.15)',
            }}
          >
            {project.number}
          </span>

          <h3
            className={`${archivo.className} uppercase transition-colors duration-300 mt-4`}
            style={{
              fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
              lineHeight: 1.05,
              color: hovered ? '#1B3FAB' : '#EDE0C4',
            }}
          >
            {t(`${project.slug}.title`)}
          </h3>

          <span
            className={`${dmSans.className} uppercase font-light block mt-3 transition-colors duration-300`}
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              color: hovered ? 'rgba(27, 63, 171, 0.7)' : 'rgba(237, 224, 196, 0.65)',
            }}
          >
            {t(`${project.slug}.category`)} &mdash; {project.year}
          </span>

          <p
            className={`${dmSans.className} font-light mt-4 transition-colors duration-300`}
            style={{
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: hovered ? 'rgba(27, 63, 171, 0.75)' : 'rgba(237, 224, 196, 0.65)',
            }}
          >
            {t(`${project.slug}.description`)}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`${dmSans.className} uppercase font-medium transition-colors duration-300`}
                style={{
                  fontSize: '0.625rem',
                  letterSpacing: '0.15em',
                  padding: '3px 8px',
                  border: hovered
                    ? '1px solid rgba(27, 63, 171, 0.3)'
                    : '1px solid rgba(237, 224, 196, 0.25)',
                  color: hovered ? 'rgba(27, 63, 171, 0.7)' : 'rgba(237, 224, 196, 0.65)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

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
    </motion.div>
  );
}

export default function ProjectsPage() {
  const t = useTranslations('ProjectsPage');

  return (
    <div style={{ background: '#1B3FAB', minHeight: '100vh' }}>
      <div className="px-5 md:px-10 lg:px-16 pt-28 md:pt-36 pb-16 md:pb-24">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 md:mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`${dmSans.className} uppercase font-light block`}
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.35em',
              color: '#EDE0C4',
            }}
          >
            {t('label')}
          </motion.span>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ opacity: { duration: 0.6 }, rotate: { duration: 30, repeat: Infinity, ease: 'linear' } }}
          >
            <Starburst size={44} />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={`${archivo.className} uppercase leading-[0.95] tracking-[-0.02em] mb-12 md:mb-20`}
          style={{
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            color: '#EDE0C4',
          }}
        >
          {t('headline')}
        </motion.h1>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {projects.map((project, i) => {
            const isWide = i % 3 === 0;
            const isRight = i % 3 === 2;
            let colClass = 'md:col-span-5';
            if (isWide) colClass = 'md:col-span-7';
            if (isRight) colClass = 'md:col-span-7';

            return (
              <div key={project.slug} className={colClass}>
                <ProjectCard project={project} index={i} />
              </div>
            );
          })}
        </div>

        {/* Bottom decorative */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-end justify-between mt-12 md:mt-20"
        >
          <Starburst size={32} />
          <div
            className="flex items-center justify-center"
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#EDE0C4',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1, color: '#2A2A2A' }}>
              &#8599;
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
