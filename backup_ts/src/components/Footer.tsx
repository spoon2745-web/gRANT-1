import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-gray-100">
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
                  <Image
                    src="/images/logo.png"
                    alt="Impact Grant Solutions"
                    width={300}
                    height={60}
                    className="h-15 w-auto object-contain"
                  />
                </div>
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                  Empowering individuals and organizations to access funding opportunities
                  that transform communities and drive positive change.
                </p>
              </div>
              
              {/* Contact CTA */}
              <div className="mb-8">
                <p className="text-gray-500 mb-4">Ready to start your grant journey?</p>
                <a 
                  href="mailto:info@impactgrantsolutions.org" 
                  className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Get Started Today
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
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
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Success Stories</a></li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-6">Support</h4>
                  <ul className="space-y-3">
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Help Center</a></li>
                    <li><a href="mailto:info@impactgrantsolutions.org" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Support</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Application Guide</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Community Forum</a></li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-6">Contact</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 text-blue-600">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-600 text-sm">info@impactgrantsolutions.org</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 text-blue-600">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
