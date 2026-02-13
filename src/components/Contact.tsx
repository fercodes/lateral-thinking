'use client';

import { useRef, useState, type FormEvent } from 'react';
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

/* ── Reveal ─────────────────────────────────────────────── */

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

/* ── Starburst ──────────────────────────────────────────── */

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

/* ── Social icon circles ────────────────────────────────── */

const socials = [
  { label: 'IG', href: '#', title: 'Instagram' },
  { label: 'FB', href: '#', title: 'Facebook' },
  { label: 'TK', href: '#', title: 'TikTok' },
  { label: 'TG', href: '#', title: 'Telegram' },
  { label: 'LI', href: '#', title: 'LinkedIn' },
  { label: 'X', href: '#', title: 'X' },
];

/* ── Contact ────────────────────────────────────────────── */

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const t = useTranslations('Contact');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      style={{ background: '#1B3FAB' }}
    >
      {/* Floating decorative pill — top-right area */}
      <motion.div
        className="absolute hidden md:block pointer-events-none"
        style={{
          top: '10%',
          right: '6%',
          width: 100,
          height: 36,
          borderRadius: 999,
          border: '1.5px solid rgba(237, 224, 196, 0.15)',
        }}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating starburst — bottom-right */}
      <motion.div
        className="absolute hidden lg:block pointer-events-none"
        style={{ bottom: '8%', right: '4%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <Starburst size={44} color="rgba(237, 224, 196, 0.12)" />
      </motion.div>

      <div className="px-5 md:px-10 lg:px-16 py-16 md:py-24">
        {/* ── Header ─────────────────────────────────────── */}
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

          <Reveal delay={0.1} direction="right">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <Starburst size={50} />
            </motion.div>
          </Reveal>
        </div>

        {/* ── Headline ───────────────────────────────────── */}
        <div className="mb-12 md:mb-20">
          <Reveal delay={0.15}>
            <h2
              className={`${archivo.className} uppercase leading-[0.95] tracking-[-0.02em]`}
              style={{
                fontSize: 'clamp(3rem, 8vw, 8rem)',
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
                fontSize: 'clamp(3rem, 8vw, 8rem)',
                color: '#EDE0C4',
              }}
            >
              {t('headline2')}
            </h2>
          </Reveal>
        </div>

        {/* ── Body: Form + Contact Info ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Left: Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <Reveal>
                <div className="flex flex-col items-start gap-6 py-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Starburst size={56} />
                  </motion.div>
                  <h3
                    className={`${archivo.className} uppercase leading-[0.95]`}
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 4rem)',
                      color: '#EDE0C4',
                    }}
                  >
                    {t('successTitle')}
                  </h3>
                  <p
                    className={`${dmSans.className} font-light`}
                    style={{
                      fontSize: '0.95rem',
                      color: 'rgba(237, 224, 196, 0.7)',
                      maxWidth: 440,
                      lineHeight: 1.7,
                    }}
                  >
                    {t('successBody')}
                  </p>
                </div>
              </Reveal>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <Reveal delay={0.3} direction="left">
                    <label
                      className={`${dmSans.className} uppercase font-light block mb-2`}
                      style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.3em',
                        color: 'rgba(237, 224, 196, 0.5)',
                      }}
                    >
                      {t('nameLabel')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className={`${dmSans.className} w-full outline-none transition-shadow duration-300`}
                      style={{
                        background: '#2A2A2A',
                        color: '#EDE0C4',
                        border: '1.5px solid rgba(237, 224, 196, 0.2)',
                        borderRadius: 6,
                        padding: '14px 18px',
                        fontSize: '0.9rem',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#EDE0C4';
                        e.currentTarget.style.boxShadow =
                          '0 0 0 3px rgba(237, 224, 196, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          'rgba(237, 224, 196, 0.2)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </Reveal>

                  <Reveal delay={0.36} direction="left">
                    <label
                      className={`${dmSans.className} uppercase font-light block mb-2`}
                      style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.3em',
                        color: 'rgba(237, 224, 196, 0.5)',
                      }}
                    >
                      {t('emailLabel')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className={`${dmSans.className} w-full outline-none transition-shadow duration-300`}
                      style={{
                        background: '#2A2A2A',
                        color: '#EDE0C4',
                        border: '1.5px solid rgba(237, 224, 196, 0.2)',
                        borderRadius: 6,
                        padding: '14px 18px',
                        fontSize: '0.9rem',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#EDE0C4';
                        e.currentTarget.style.boxShadow =
                          '0 0 0 3px rgba(237, 224, 196, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          'rgba(237, 224, 196, 0.2)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </Reveal>

                  <Reveal delay={0.42} direction="left">
                    <label
                      className={`${dmSans.className} uppercase font-light block mb-2`}
                      style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.3em',
                        color: 'rgba(237, 224, 196, 0.5)',
                      }}
                    >
                      {t('messageLabel')}
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      className={`${dmSans.className} w-full outline-none transition-shadow duration-300 resize-none`}
                      style={{
                        background: '#2A2A2A',
                        color: '#EDE0C4',
                        border: '1.5px solid rgba(237, 224, 196, 0.2)',
                        borderRadius: 6,
                        padding: '14px 18px',
                        fontSize: '0.9rem',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#EDE0C4';
                        e.currentTarget.style.boxShadow =
                          '0 0 0 3px rgba(237, 224, 196, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          'rgba(237, 224, 196, 0.2)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </Reveal>

                  <Reveal delay={0.48} direction="left">
                    <button
                      type="submit"
                      className={`${dmSans.className} uppercase font-medium cursor-pointer transition-all duration-300`}
                      style={{
                        background: '#EDE0C4',
                        color: '#1B3FAB',
                        border: '1.5px solid #EDE0C4',
                        borderRadius: 6,
                        padding: '14px 40px',
                        fontSize: '0.7rem',
                        letterSpacing: '0.25em',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1B3FAB';
                        e.currentTarget.style.color = '#EDE0C4';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#EDE0C4';
                        e.currentTarget.style.color = '#1B3FAB';
                      }}
                    >
                      {t('submit')}
                    </button>
                  </Reveal>
                </div>
              </form>
            )}
          </div>

          {/* Right: Contact info + Socials */}
          <div className="lg:col-span-4 lg:col-start-9">
            {/* Direct contact */}
            <Reveal delay={0.35} direction="right">
              <div className="mb-10">
                <span
                  className={`${dmSans.className} uppercase font-light block mb-5`}
                  style={{
                    fontSize: '0.55rem',
                    letterSpacing: '0.3em',
                    color: 'rgba(237, 224, 196, 0.5)',
                  }}
                >
                  {t('directContact')}
                </span>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group mb-5"
                >
                  <div
                    className="flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: '1.5px solid rgba(237, 224, 196, 0.25)',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#EDE0C4"
                    >
                      <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 6.01L0 24l6.18-1.62A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.26-1.44l-.38-.22-3.67.96.98-3.58-.25-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-1 2.43 0 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 4.93 4.22.69.3 1.23.48 1.65.62.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                    </svg>
                  </div>
                  <div>
                    <span
                      className={`${dmSans.className} font-medium block transition-colors duration-300 group-hover:opacity-80`}
                      style={{ fontSize: '0.85rem', color: '#EDE0C4' }}
                    >
                      {t('whatsapp')}
                    </span>
                    <span
                      className={`${dmSans.className} font-light block`}
                      style={{
                        fontSize: '0.7rem',
                        color: 'rgba(237, 224, 196, 0.4)',
                      }}
                    >
                      {t('whatsappSub')}
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:hello@lateralthinking.com"
                  className="flex items-center gap-4 group"
                >
                  <div
                    className="flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: '1.5px solid rgba(237, 224, 196, 0.25)',
                    }}
                  >
                    <span style={{ fontSize: 18, color: '#EDE0C4' }}>@</span>
                  </div>
                  <div>
                    <span
                      className={`${dmSans.className} font-medium block transition-colors duration-300 group-hover:opacity-80`}
                      style={{ fontSize: '0.85rem', color: '#EDE0C4' }}
                    >
                      {t('email')}
                    </span>
                    <span
                      className={`${dmSans.className} font-light block`}
                      style={{
                        fontSize: '0.7rem',
                        color: 'rgba(237, 224, 196, 0.4)',
                      }}
                    >
                      {t('emailAddress')}
                    </span>
                  </div>
                </a>
              </div>
            </Reveal>

            {/* Divider */}
            <div
              className="mb-8"
              style={{
                height: 1,
                background: 'rgba(237, 224, 196, 0.15)',
              }}
            />

            {/* Social icons */}
            <Reveal delay={0.45} direction="right">
              <span
                className={`${dmSans.className} uppercase font-light block mb-5`}
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.3em',
                  color: 'rgba(237, 224, 196, 0.5)',
                }}
              >
                {t('followUs')}
              </span>
              <div className="flex flex-wrap gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.title}
                    className="flex items-center justify-center transition-all duration-300 hover:bg-[#EDE0C4] group"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: '1.5px solid rgba(237, 224, 196, 0.25)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#EDE0C4';
                      e.currentTarget.style.borderColor = '#EDE0C4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor =
                        'rgba(237, 224, 196, 0.25)';
                    }}
                  >
                    <span
                      className={`${dmSans.className} font-medium transition-colors duration-300`}
                      style={{ fontSize: '0.65rem', color: '#EDE0C4' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#1B3FAB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#EDE0C4';
                      }}
                    >
                      {s.label}
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Bottom row: starburst + arrow ──────────────── */}
        <div className="flex items-end justify-between mt-14 md:mt-20">
          <Reveal delay={0.55}>
            <Starburst size={36} />
          </Reveal>

          <Reveal delay={0.6} direction="right">
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
      </div>
    </section>
  );
}
