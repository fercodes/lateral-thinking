'use client';

import { useState } from 'react';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { Archivo_Black, DM_Sans } from 'next/font/google';

const archivo = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Navbar');

  const scrollTo = (id: string) => {
    setIsOpen(false);
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50" style={{ background: 'rgba(27, 63, 171, 0.15)' }}>
      <div className="px-5 md:px-10 lg:px-16">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/">
            <span
              className={`${archivo.className} uppercase`}
              style={{
                fontSize: 'clamp(0.75rem, 1.2vw, 0.95rem)',
                letterSpacing: '0.05em',
                color: '#EDE0C4',
              }}
            >
              {t('brand')}
            </span>
          </Link>

          {/* Desktop links */}
          <div className={`${dmSans.className} hidden md:flex items-center gap-8`}>
            {(['home', 'about', 'services', 'projects', 'contact'] as const).map((key) => (
              <button
                key={key}
                onClick={() => scrollTo(key)}
                className="cursor-pointer uppercase transition-colors duration-300"
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  color: 'rgba(237, 224, 196, 0.7)',
                  background: 'none',
                  border: 'none',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EDE0C4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(237, 224, 196, 0.7)';
                }}
              >
                {t(key)}
              </button>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={t('toggleMenu')}
              style={{ color: '#EDE0C4' }}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            className={`${dmSans.className} md:hidden py-4 space-y-4 flex flex-col items-center`}
            style={{ background: 'rgba(27, 63, 171, 0.95)' }}
          >
            {(['home', 'about', 'services', 'projects', 'contact'] as const).map((key) => (
              <button
                key={key}
                onClick={() => scrollTo(key)}
                className="cursor-pointer uppercase transition-colors duration-300"
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  color: 'rgba(237, 224, 196, 0.7)',
                  background: 'none',
                  border: 'none',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EDE0C4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(237, 224, 196, 0.7)';
                }}
              >
                {t(key)}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
