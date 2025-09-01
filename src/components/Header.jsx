'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';
const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Apply Now', href: '/application' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '/contact' },
];
export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (<header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-2xl shadow-gray-900/10 border-b border-gray-200/20'
            : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20 sm:h-22 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group transition-all duration-300 hover:scale-105">
            <div className="relative h-12 sm:h-14 lg:h-16 w-auto">
              <Image src="/images/logo.png" alt="Impact Grant Solutions" width={320} height={64} className="h-12 sm:h-14 lg:h-16 w-auto object-contain" priority/>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (<Link key={item.name} href={item.href} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${isScrolled
                ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'}`}>
                {item.name}
              </Link>))}
          </nav>

          {/* CTA Button and Mobile menu button */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <Button asChild variant={isScrolled ? "premium" : "outline"} size="sm" className="group">
                <Link href="/application" className="flex items-center gap-2">
                  Apply Now
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform"/>
                </Link>
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${isScrolled
            ? 'text-gray-700 hover:bg-gray-100'
            : 'text-white hover:bg-white/10 backdrop-blur-sm'}`}>
              {isMenuOpen ? (<X className="w-6 h-6"/>) : (<Menu className="w-6 h-6"/>)}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-6 space-y-2 bg-white/95 backdrop-blur-xl rounded-2xl mt-4 shadow-2xl border border-gray-200/20">
            {navigation.map((item) => (<Link key={item.name} href={item.href} className="block px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 mx-2 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                {item.name}
              </Link>))}
            <div className="px-4 py-2">
              <Button asChild variant="premium" size="sm" className="w-full">
                <Link href="/application" onClick={() => setIsMenuOpen(false)}>
                  Apply Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>);
}
