'use client';

import { useState } from 'react';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

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
    <nav className="absolute top-0 left-0 w-full z-50 bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="text-xl font-bold">
            <Link href="/">{t('brand')}</Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => scrollTo('home')} className="cursor-pointer hover:text-gray-300">{t('home')}</button>
            <button onClick={() => scrollTo('about')} className="cursor-pointer hover:text-gray-300">{t('about')}</button>
            <button onClick={() => scrollTo('services')} className="cursor-pointer hover:text-gray-300">{t('services')}</button>
            <button onClick={() => scrollTo('projects')} className="cursor-pointer hover:text-gray-300">{t('projects')}</button>
            <button onClick={() => scrollTo('contact')} className="cursor-pointer hover:text-gray-300">{t('contact')}</button>
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button onClick={() => setIsOpen(!isOpen)} aria-label={t('toggleMenu')}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 flex flex-col items-center">
            <button onClick={() => scrollTo('home')} className="cursor-pointer hover:text-gray-300">{t('home')}</button>
            <button onClick={() => scrollTo('about')} className="cursor-pointer hover:text-gray-300">{t('about')}</button>
            <button onClick={() => scrollTo('services')} className="cursor-pointer hover:text-gray-300">{t('services')}</button>
            <button onClick={() => scrollTo('projects')} className="cursor-pointer hover:text-gray-300">{t('projects')}</button>
            <button onClick={() => scrollTo('contact')} className="cursor-pointer hover:text-gray-300">{t('contact')}</button>
          </div>
        )}
      </div>
    </nav>
  );
}
