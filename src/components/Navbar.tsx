'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            <Link href="/" className="hover:text-gray-300">
              Inicio
            </Link>
            <Link href="/about" className="hover:text-gray-300">
              Sobre nosotros
            </Link>
            <Link href="/services" className="hover:text-gray-300">
              Servicios
            </Link>
            <Link href="/projects" className="hover:text-gray-300">
              Proyectos
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
              Contacto
            </Link>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2">
            <Link href="/" className="block hover:text-gray-300">
              Home
            </Link>
            <Link href="/about" className="block hover:text-gray-300">
              About
            </Link>
            <Link href="/services" className="block hover:text-gray-300">
              Services
            </Link>
            <Link href="/projects" className="block hover:text-gray-300">
              Projects
            </Link>
            <Link href="/contact" className="block hover:text-gray-300">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
