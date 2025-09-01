'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Apply Now', href: '/application' },
    { name: 'About', href: '/about' },
    { name: 'Success Stories', href: '/stories' },
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
    return (<header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className={`text-2xl font-bold transition-colors ${isScrolled ? 'text-blue-600' : 'text-white'}`}>
              Impact Grant Solutions
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (<Link key={item.name} href={item.href} className={`font-medium transition-colors hover:text-blue-600 ${isScrolled ? 'text-gray-700' : 'text-white hover:text-blue-300'}`}>
                {item.name}
              </Link>))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button asChild variant={isScrolled ? 'default' : 'outline'}>
              <Link href="/application">
                Apply Now
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`lg:hidden p-2 rounded-md transition-colors ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
            {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (<div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 animate-fade-up">
            <div className="py-4 space-y-2">
              {navigation.map((item) => (<Link key={item.name} href={item.href} className="block px-4 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>))}
              <div className="px-4 pt-2">
                <Button asChild className="w-full">
                  <Link href="/application" onClick={() => setIsMenuOpen(false)}>
                    Apply Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>)}
      </div>
    </header>);
}
