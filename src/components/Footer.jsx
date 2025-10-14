import Link from 'next/link';
import Image from 'next/image';
export default function Footer() {
    return (<footer className="relative bg-white border-t border-gray-100">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-purple-500 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-yellow-400 rounded-full"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section - Larger */}
            <div className="lg:col-span-5">
              <div className="mb-8">
                <div className="mb-4">
                  <Image src="/images/logo.png" alt="Impact Grant Solutions" width={300} height={60} className="h-15 w-auto object-contain"/>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                  Empowering individuals and organizations to access funding opportunities
                  that transform communities and drive positive change.
                </p>
              </div>
              
              {/* Contact CTA */}
              <div className="mb-8">
                <p className="text-gray-500 mb-4">Ready to start your grant journey?</p>
                <a href="mailto:info@impactgrantsolutions.org" className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                  Get Started Today
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </a>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Quick Links */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-6">Navigation</h4>
                  <ul className="space-y-3">
                    <li><a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</a></li>
                    <li><a href="#grant-schedule" className="text-gray-600 hover:text-blue-600 transition-colors">Grant Schedule</a></li>
                    <li><a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a></li>
                    <li><Link href="/application" className="text-gray-600 hover:text-blue-600 transition-colors">Apply Now</Link></li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-6">Support</h4>
                  <ul className="space-y-3">
                    <li><a href="mailto:info@impactgrantsolutions.org" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Support</a></li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-6">Contact</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 text-blue-600">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <span className="text-gray-600 text-sm">info@impactgrantsolutions.org</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 text-blue-600">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <span className="text-gray-600 text-sm">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Minimal and Clean */}
        <div className="py-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2024 Impact Grant Solutions. All rights reserved.
            </div>

          </div>
        </div>
      </div>
    </footer>);
}
