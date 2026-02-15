'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

const locales = [
  { code: 'en' as const, label: 'EN' },
  { code: 'es' as const, label: 'ES' },
  { code: 'ru' as const, label: 'RU' },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const current = locales.find((l) => l.code === locale) ?? locales[0];
  const others = locales.filter((l) => l.code !== locale);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function switchLocale(code: 'en' | 'es' | 'ru') {
    setOpen(false);
    router.replace(pathname, { locale: code });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`${dmSans.className} font-medium cursor-pointer flex items-center gap-1 transition-colors duration-200 hover:opacity-80`}
        style={{
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          color: '#EDE0C4',
        }}
      >
        {current.label}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L5 5L9 1" stroke="#EDE0C4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 flex flex-col overflow-hidden"
          style={{
            background: '#2A2A2A',
            border: '1px solid rgba(237, 224, 196, 0.2)',
            borderRadius: 6,
            minWidth: 48,
          }}
        >
          {others.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLocale(l.code)}
              className={`${dmSans.className} font-medium cursor-pointer text-center transition-colors duration-200 hover:bg-[#1B3FAB]`}
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                color: '#EDE0C4',
                padding: '8px 14px',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
