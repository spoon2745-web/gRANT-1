'use client'

export default function GeometricSection() {
  return (
    <section className="relative py-24 bg-gradient-to-r from-blue-50 via-white to-red-50 overflow-hidden">
      {/* Main geometric pattern inspired by the provided image */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-red-600 bg-clip-text text-transparent mb-6">
            Empowering Global Innovation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Our platform connects visionaries worldwide with life-changing opportunities
          </p>
        </div>

        {/* Geometric pattern container */}
        <div className="relative h-96 flex items-center justify-center">
          {/* Large yellow circles */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-2xl animate-float"></div>
          </div>
          <div className="absolute left-32 top-1/4">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-xl animate-float" style={{animationDelay: '1s'}}></div>
          </div>

          {/* Blue circles pattern */}
          <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 space-y-4">
            <div className="flex space-x-4">
              <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-10 h-10 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <div className="flex space-x-4 ml-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
              <div className="w-12 h-12 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
              <div className="w-14 h-14 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            <div className="flex space-x-4 ml-8">
              <div className="w-10 h-10 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
              <div className="w-16 h-16 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1.4s'}}></div>
              <div className="w-18 h-18 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '1.6s'}}></div>
            </div>
          </div>

          {/* Red dots grid on the right */}
          <div className="absolute right-0 top-0 w-64 h-full">
            <div className="grid grid-cols-8 gap-2 h-full items-center justify-items-center">
              {[...Array(64)].map((_, i) => (
                <div 
                  key={i} 
                  className={`rounded-full transition-all duration-500 hover:scale-150 cursor-pointer ${
                    i % 4 === 0 ? 'w-4 h-4 bg-red-500' : 
                    i % 4 === 1 ? 'w-3 h-3 bg-red-400' : 
                    i % 4 === 2 ? 'w-2 h-2 bg-red-300' : 
                    'w-1 h-1 bg-red-200'
                  }`}
                  style={{
                    animationDelay: `${i * 100}ms`,
                    animation: 'pulse 4s infinite'
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Central blue diamond */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 transform rotate-45 shadow-2xl animate-spin-slow"></div>
          </div>

          {/* Stats overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-blue-600 mb-2">100,000+</div>
                <div className="text-gray-700 font-medium">Applications Submitted</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-yellow-600 mb-2">$75M+</div>
                <div className="text-gray-700 font-medium">Grants Distributed</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-red-600 mb-2">95%</div>
                <div className="text-gray-700 font-medium">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
