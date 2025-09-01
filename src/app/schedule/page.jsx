import SimpleGrantSchedule from '@/components/SimpleGrantSchedule';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calendar, Globe, Clock, Info } from 'lucide-react';
export const metadata = {
    title: 'Grant Application Schedule - Impact Grant Solutions',
    description: 'View regional application deadlines and award dates for our grant programs worldwide.',
    keywords: 'grant schedule, application deadlines, regional grants, funding timeline',
};
export default function SchedulePage() {
    return (<div className="min-h-screen bg-gray-50">
      {/* Navigation breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4"/>
                  Back to Home
                </Link>
              </Button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <span>Home</span>
                <span>/</span>
                <span className="font-medium text-gray-900">Schedule</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/application">
                  Apply Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Page header */}
      <div className="relative py-16 bg-gradient-to-r from-blue-600 to-indigo-600">        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border border-white/30 mb-8">
            <Calendar className="w-4 h-4 text-white"/>
            <span className="text-sm font-medium text-white">Application Schedule</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Grant Application Schedule
          </h1>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Plan your application with our comprehensive regional schedule. Each region has specific application windows throughout the year.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="secondary" size="lg">
              <Link href="/application" className="flex items-center gap-2">
                Start Application
                <Calendar className="w-4 h-4"/>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-white border-white/30 hover:bg-white/10">
              <Link href="/support" className="flex items-center gap-2">
                Get Help
                <Info className="w-4 h-4"/>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Key information cards */}
      <div className="relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Globe className="w-5 h-5 text-blue-600"/>
                </div>
                <h3 className="font-semibold text-gray-900">4 Regions</h3>
              </div>
              <p className="text-gray-600">
                Applications are accepted from North & South America, Europe & Middle East, Africa, and Asia, Oceania & Caribbean.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-green-600"/>
                </div>
                <h3 className="font-semibold text-gray-900">Multiple Cycles</h3>
              </div>
              <p className="text-gray-600">
                Each region has specific application windows with award dates in June and November 2025.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <Clock className="w-5 h-5 text-amber-600"/>
                </div>
                <h3 className="font-semibold text-gray-900">Plan Ahead</h3>
              </div>
              <p className="text-gray-600">
                We recommend preparing your application materials well in advance of your regional deadline.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main schedule component */}
      <SimpleGrantSchedule />

      {/* Application tips section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Application Timeline Tips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make the most of your application window with these preparation guidelines
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Research Phase</h3>
              <p className="text-gray-600">
                2-3 months before: Review eligibility criteria and gather required documentation
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Preparation</h3>
              <p className="text-gray-600">
                1-2 months before: Draft your project proposal and budget planning
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-amber-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Review</h3>
              <p className="text-gray-600">
                2-4 weeks before: Final review, proofreading, and gathering references
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Submit</h3>
              <p className="text-gray-600">
                During application window: Submit your complete application before the deadline
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="premium" size="lg">
              <Link href="/application" className="flex items-center gap-2">
                Start Your Application Journey
                <Calendar className="w-4 h-4"/>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>);
}
