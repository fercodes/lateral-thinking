'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
            <Link href="/">Lateral Thinking</Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-6">
            <button onClick={() => scrollTo('home')} className="cursor-pointer hover:text-gray-300">Home</button>
            <button onClick={() => scrollTo('about')} className="cursor-pointer hover:text-gray-300">About</button>
            <button onClick={() => scrollTo('services')} className="cursor-pointer hover:text-gray-300">Services</button>
            <button onClick={() => scrollTo('projects')} className="cursor-pointer hover:text-gray-300">Projects</button>
            <button onClick={() => scrollTo('contact')} className="cursor-pointer hover:text-gray-300">Contact</button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 flex flex-col items-center">
            <button onClick={() => scrollTo('home')} className="cursor-pointer hover:text-gray-300">Home</button>
            <button onClick={() => scrollTo('about')} className="cursor-pointer hover:text-gray-300">About</button>
            <button onClick={() => scrollTo('services')} className="cursor-pointer hover:text-gray-300">Services</button>
            <button onClick={() => scrollTo('projects')} className="cursor-pointer hover:text-gray-300">Projects</button>
            <button onClick={() => scrollTo('contact')} className="cursor-pointer hover:text-gray-300">Contact</button>
          </div>
        )}
      </div>
    </nav>
  );
}
