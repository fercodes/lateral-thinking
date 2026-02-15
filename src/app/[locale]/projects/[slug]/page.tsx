'use client';

import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Archivo_Black, DM_Sans } from 'next/font/google';
import { Link } from '@/i18n/navigation';
import { getProjectBySlug, getNextProject } from '@/lib/projects';
import { useTranslations } from 'next-intl';
import { projectImages } from '@/data/projectImages';

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={`${dmSans.className} uppercase font-medium block mb-4`}
      style={{
        fontSize: '0.7rem',
        letterSpacing: '0.3em',
        color: 'rgba(237, 224, 196, 0.65)',
      }}
    >
      {children}
    </span>
  );
}

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = getProjectBySlug(slug);
  const td = useTranslations('ProjectDetail');
  const tp = useTranslations('projects');

  if (!project) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ background: '#1B3FAB', minHeight: '100vh' }}
      >
        <div className="text-center px-5">
          <h1
            className={`${archivo.className} uppercase mb-4`}
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#EDE0C4' }}
          >
            {td('notFound')}
          </h1>
          <Link
            href="/projects"
            className={`${dmSans.className} uppercase font-light`}
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: 'rgba(237, 224, 196, 0.75)',
            }}
          >
            &larr; {td('backToProjects')}
          </Link>
        </div>
      </div>
    );
  }

  const nextProject = getNextProject(slug);
  const results = Array.from({ length: project.resultCount }, (_, i) =>
    tp(`${project.slug}.result${i}`),
  );

  return (
    <div style={{ background: '#1B3FAB', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="px-5 md:px-10 lg:px-16 pt-28 md:pt-36 pb-12 md:pb-20">
        <FadeIn>
          <div className="flex items-start justify-between mb-6 md:mb-10">
            <Link
              href="/projects"
              className={`${dmSans.className} uppercase font-light`}
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                color: 'rgba(237, 224, 196, 0.7)',
              }}
            >
              &larr; {td('allProjects')}
            </Link>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <Starburst size={40} />
            </motion.div>
          </div>
        </FadeIn>

        {/* Project number */}
        <FadeIn delay={0.05}>
          <span
            className={`${archivo.className} block`}
            style={{
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              lineHeight: 1,
              color: 'rgba(237, 224, 196, 0.1)',
            }}
          >
            {project.number}
          </span>
        </FadeIn>

        {/* Title */}
        <FadeIn delay={0.1}>
          <h1
            className={`${archivo.className} uppercase leading-[0.95] tracking-[-0.02em] mt-2`}
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 7rem)',
              color: '#EDE0C4',
            }}
          >
            {tp(`${project.slug}.title`)}
          </h1>
        </FadeIn>

        {/* Meta row */}
        <FadeIn delay={0.15}>
          <div className="flex flex-wrap items-center gap-6 mt-6">
            <span
              className={`${dmSans.className} uppercase font-light`}
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                color: 'rgba(237, 224, 196, 0.7)',
              }}
            >
              {tp(`${project.slug}.category`)}
            </span>
            <span
              className={`${dmSans.className} uppercase font-light`}
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                color: 'rgba(237, 224, 196, 0.5)',
              }}
            >
              {project.year}
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`${dmSans.className} uppercase font-medium`}
                  style={{
                    fontSize: '0.625rem',
                    letterSpacing: '0.15em',
                    padding: '3px 8px',
                    border: '1px solid rgba(237, 224, 196, 0.25)',
                    color: 'rgba(237, 224, 196, 0.65)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Thin separator */}
      <div
        className="mx-5 md:mx-10 lg:mx-16 h-px"
        style={{ background: 'rgba(237, 224, 196, 0.1)' }}
      />

      {/* Overview */}
      <div className="px-5 md:px-10 lg:px-16 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <FadeIn delay={0.2}>
              <SectionLabel>{td('overviewLabel')}</SectionLabel>
              <h2
                className={`${archivo.className} uppercase leading-[1]`}
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  color: '#EDE0C4',
                }}
              >
                {td('overviewHeadline')}
              </h2>
            </FadeIn>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FadeIn delay={0.25}>
              <p
                className={`${dmSans.className} font-light leading-[1.8]`}
                style={{
                  fontSize: '0.95rem',
                  color: 'rgba(237, 224, 196, 0.8)',
                }}
              >
                {tp(`${project.slug}.overview`)}
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Challenge */}
      <div
        className="mx-5 md:mx-10 lg:mx-16 h-px"
        style={{ background: 'rgba(237, 224, 196, 0.1)' }}
      />
      <div className="px-5 md:px-10 lg:px-16 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <FadeIn delay={0.1}>
              <SectionLabel>{td('challengeLabel')}</SectionLabel>
              <h2
                className={`${archivo.className} uppercase leading-[1]`}
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  color: '#EDE0C4',
                }}
              >
                {td('challengeHeadline')}
              </h2>
            </FadeIn>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FadeIn delay={0.15}>
              <p
                className={`${dmSans.className} font-light leading-[1.8]`}
                style={{
                  fontSize: '0.95rem',
                  color: 'rgba(237, 224, 196, 0.8)',
                }}
              >
                {tp(`${project.slug}.challenge`)}
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="px-5 md:px-10 lg:px-16 py-8 md:py-12">
        <FadeIn delay={0.1}>
          <SectionLabel>{td('galleryLabel')}</SectionLabel>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            projectImages[project.slug as keyof typeof projectImages] || []
          ).map((src: string, i: number) => (
            <FadeIn key={i} delay={0.15 + i * 0.05}>
              <div
                className="aspect-[16/10] overflow-hidden"
                style={{ border: '1px solid rgba(237, 224, 196, 0.1)' }}
              >
                <img
                  src={src}
                  alt={`${tp(`${project.slug}.title`)} - ${td('image')} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Solution */}
      <div
        className="mx-5 md:mx-10 lg:mx-16 h-px"
        style={{ background: 'rgba(237, 224, 196, 0.1)' }}
      />
      <div className="px-5 md:px-10 lg:px-16 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <FadeIn delay={0.1}>
              <SectionLabel>{td('solutionLabel')}</SectionLabel>
              <h2
                className={`${archivo.className} uppercase leading-[1]`}
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  color: '#EDE0C4',
                }}
              >
                {td('solutionHeadline')}
              </h2>
            </FadeIn>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FadeIn delay={0.15}>
              <p
                className={`${dmSans.className} font-light leading-[1.8]`}
                style={{
                  fontSize: '0.95rem',
                  color: 'rgba(237, 224, 196, 0.8)',
                }}
              >
                {tp(`${project.slug}.solution`)}
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Results */}
      <div
        className="mx-5 md:mx-10 lg:mx-16 h-px"
        style={{ background: 'rgba(237, 224, 196, 0.1)' }}
      />
      <div className="px-5 md:px-10 lg:px-16 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <FadeIn delay={0.1}>
              <SectionLabel>{td('resultsLabel')}</SectionLabel>
              <h2
                className={`${archivo.className} uppercase leading-[1]`}
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  color: '#EDE0C4',
                }}
              >
                {td('resultsHeadline')}
              </h2>
            </FadeIn>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FadeIn delay={0.15}>
              <div className="space-y-4">
                {results.map((result, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 pb-4"
                    style={{
                      borderBottom:
                        i < results.length - 1
                          ? '1px solid rgba(237, 224, 196, 0.08)'
                          : 'none',
                    }}
                  >
                    <span
                      className={`${archivo.className} flex-shrink-0`}
                      style={{
                        fontSize: '0.9rem',
                        color: 'rgba(237, 224, 196, 0.35)',
                        lineHeight: 1.8,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p
                      className={`${dmSans.className} font-light leading-[1.8]`}
                      style={{
                        fontSize: '0.9rem',
                        color: 'rgba(237, 224, 196, 0.7)',
                      }}
                    >
                      {result}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Next project */}
      <div
        className="mx-5 md:mx-10 lg:mx-16 h-px"
        style={{ background: 'rgba(237, 224, 196, 0.1)' }}
      />
      <div className="px-5 md:px-10 lg:px-16 py-12 md:py-20">
        <FadeIn delay={0.1}>
          <SectionLabel>{td('nextProjectLabel')}</SectionLabel>
        </FadeIn>
        <FadeIn delay={0.15}>
          <Link href={`/projects/${nextProject.slug}`}>
            <div className="flex items-center justify-between group">
              <div>
                <span
                  className={`${archivo.className} block`}
                  style={{
                    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                    color: 'rgba(237, 224, 196, 0.35)',
                    lineHeight: 1,
                  }}
                >
                  {nextProject.number}
                </span>
                <h3
                  className={`${archivo.className} uppercase mt-2 group-hover:opacity-70 transition-opacity duration-300`}
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    color: '#EDE0C4',
                    lineHeight: 1,
                  }}
                >
                  {tp(`${nextProject.slug}.title`)}
                </h3>
                <span
                  className={`${dmSans.className} uppercase font-light block mt-3`}
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.25em',
                    color: 'rgba(237, 224, 196, 0.65)',
                  }}
                >
                  {tp(`${nextProject.slug}.category`)}
                </span>
              </div>

              <div
                className="flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
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
            </div>
          </Link>
        </FadeIn>

        {/* Bottom decorative */}
        <div className="flex items-center justify-between mt-12">
          <Starburst size={28} />
          <Starburst size={28} />
        </div>
      </div>
    </div>
  );
}
