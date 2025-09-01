'use client';
import { useState } from 'react';
import Link from 'next/link';
export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (<header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Impact Grant Solutions
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/apply" className="text-gray-700 hover:text-blue-600 transition-colors">
              Apply
            </Link>
            <Link href="/schedule" className="text-gray-700 hover:text-blue-600 transition-colors">
              Schedule
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-blue-600 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>)}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (<div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/apply" className="text-gray-700 hover:text-blue-600 transition-colors">
                Apply
              </Link>
              <Link href="/schedule" className="text-gray-700 hover:text-blue-600 transition-colors">
                Schedule
              </Link>
              <Link href="/faq" className="text-gray-700 hover:text-blue-600 transition-colors">
                FAQ
              </Link>
            </nav>
          </div>)}
      </div>
    </header>);
}
