'use client';
import { useState } from 'react';
import Link from 'next/link';
export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (<header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IGS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Impact Grant Solutions</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="#grant-schedule" className="text-gray-600 hover:text-blue-600 transition-colors">
              Timeline
            </Link>
            <Link href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">
              FAQ
            </Link>
            <Link href="/application" className="btn btn-primary">
              Apply Now
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (<div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link href="#about" className="text-gray-600">About</Link>
              <Link href="#grant-schedule" className="text-gray-600">Timeline</Link>
              <Link href="#faq" className="text-gray-600">FAQ</Link>
              <Link href="/application" className="btn btn-primary w-fit">Apply Now</Link>
            </nav>
          </div>)}
      </div>
    </header>);
}
