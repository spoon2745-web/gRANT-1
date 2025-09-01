'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Geometric pattern background inspired by the provided image */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full"></div>
        <div className="absolute top-16 right-20 w-8 h-8 bg-blue-600 rounded-full"></div>
        <div className="absolute top-20 right-32 w-12 h-12 bg-blue-500 rounded-full"></div>
        <div className="absolute top-24 right-44 w-16 h-16 bg-blue-600 rounded-full"></div>
        
        <div className="absolute top-40 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full"></div>
        <div className="absolute top-48 right-12 w-20 h-20 bg-blue-600 rounded-full"></div>
        <div className="absolute top-56 right-24 w-24 h-24 bg-blue-500 rounded-full"></div>
        <div className="absolute top-64 right-36 w-28 h-28 bg-blue-600 rounded-full"></div>
        
        {/* Red dots pattern on the right */}
        <div className="absolute top-0 right-0 w-96 h-screen">
          <div className="grid grid-cols-12 gap-2 h-full items-center">
            {[...Array(144)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full ${
                  i % 3 === 0 ? 'bg-red-500' : i % 3 === 1 ? 'bg-red-400' : 'bg-red-300'
                } opacity-70`}
                style={{
                  animationDelay: `${i * 50}ms`,
                  animation: 'pulse 3s infinite'
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Blue diamond pattern */}
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-blue-600 transform rotate-45 opacity-80"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-blue-500 transform rotate-45 opacity-70"></div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-20 left-20 w-6 h-6 text-amber-400 animate-bounce delay-300" />
        <Star className="absolute top-32 right-32 w-5 h-5 text-blue-500 animate-bounce delay-700" />
        <Sparkles className="absolute bottom-40 left-1/4 w-4 h-4 text-purple-500 animate-bounce delay-1000" />
        <Star className="absolute bottom-20 right-20 w-6 h-6 text-indigo-400 animate-bounce delay-1500" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-gray-200/50 shadow-lg shadow-gray-900/5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">Empowering Dreams Worldwide</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Apply for Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              Grant Today
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Transform your vision into reality with our comprehensive grant application platform. 
            Access premium funding opportunities tailored to your region and project needs.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button asChild variant="premium" size="lg" className="group">
              <Link href="/application" className="flex items-center gap-2">
                Start Application
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/schedule">
                View Schedule
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Trusted by 10,000+ applicants</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
              <span>$75M+ granted annually</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-700"></div>
              <span>95% approval rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
