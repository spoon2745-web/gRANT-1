'use client';
import { useState } from 'react';
// Predefined positions and animations to avoid hydration mismatch
const floatingElements = [
    { left: 12.5, top: 15.3, delay: 0.5, duration: 3.2 },
    { left: 85.2, top: 25.8, delay: 1.2, duration: 2.8 },
    { left: 45.7, top: 70.1, delay: 0.8, duration: 3.5 },
    { left: 78.3, top: 45.6, delay: 2.1, duration: 2.5 },
    { left: 23.1, top: 85.2, delay: 0.3, duration: 3.8 },
    { left: 92.4, top: 12.7, delay: 1.8, duration: 2.9 },
    { left: 15.8, top: 55.4, delay: 1.0, duration: 3.1 },
    { left: 67.2, top: 78.9, delay: 0.7, duration: 2.7 },
    { left: 38.5, top: 35.2, delay: 1.5, duration: 3.4 },
    { left: 82.1, top: 62.8, delay: 0.2, duration: 2.6 },
    { left: 51.7, top: 18.5, delay: 2.3, duration: 3.7 },
    { left: 29.8, top: 92.1, delay: 1.1, duration: 2.4 },
    { left: 73.6, top: 8.7, delay: 0.9, duration: 3.3 },
    { left: 41.2, top: 68.4, delay: 1.7, duration: 2.8 },
    { left: 88.9, top: 42.3, delay: 0.4, duration: 3.6 }
];
export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitted(true);
        setIsLoading(false);
        setEmail('');
    };
    return (<section className="relative py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-yellow-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {!isSubmitted ? (<div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header Section */}
              <div className="text-center px-8 md:px-12 pt-12 pb-8">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                  Stay Updated
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Get the latest grant opportunities, success stories, and funding tips 
                  delivered directly to your inbox.
                </p>
              </div>

              {/* Form Section */}
              <div className="px-8 md:px-12 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                    <div className="flex-1 relative">
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="w-full px-6 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg" required/>
                    </div>
                    
                    <button type="submit" disabled={isLoading} className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      {isLoading ? (<div className="relative flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Subscribing...
                        </div>) : (<span className="relative flex items-center gap-2 text-lg">
                          Subscribe
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                          </svg>
                        </span>)}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 text-gray-500">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <p className="text-base">We respect your privacy. Unsubscribe at any time.</p>
                  </div>
                </form>
              </div>

              {/* Features Section */}
              <div className="bg-gray-50 px-8 md:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                { icon: '📧', title: 'Weekly Updates', description: 'New grant opportunities every week' },
                { icon: '💡', title: 'Success Tips', description: 'Expert advice from grant winners' },
                { icon: '🎯', title: 'Exclusive Access', description: 'Early access to premium grants' },
            ].map((feature, index) => (<div key={index} className="group text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>))}
                </div>
              </div>
            </div>) : (<div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="text-3xl font-bold gradient-text mb-4">Welcome to the Community! 🎉</h3>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                You&apos;re now part of thousands of women transforming their dreams into reality.
              </p>
              <button onClick={() => setIsSubmitted(false)} className="text-blue-600 hover:text-blue-700 transition-colors underline font-medium">
                Subscribe another email
              </button>
            </div>)}
        </div>
      </div>
    </section>);
}
