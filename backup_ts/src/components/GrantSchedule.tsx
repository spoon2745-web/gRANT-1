'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, AlertTriangle, ExternalLink, Clock, Award, Globe2, Sparkles } from 'lucide-react'

interface Region {
  name: string
  applicationPeriod: string
  awardDate: string
  status: 'open' | 'closed' | 'upcoming'
  countries?: string[]
}

const regions: Region[] = [
  {
    name: 'NORTH & SOUTH AMERICA',
    applicationPeriod: 'January 1–31, 2025',
    awardDate: 'June 2025',
    status: 'closed'
  },
  {
    name: 'EUROPE & THE MIDDLE EAST',
    applicationPeriod: 'April 1–30, 2025',
    awardDate: 'June 2025',
    status: 'closed'
  },
  {
    name: 'AFRICA',
    applicationPeriod: 'July 1–31, 2025',
    awardDate: 'November 2025',
    status: 'upcoming',
    countries: ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Democratic Republic of Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'São Tomé and Príncipe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe']
  },
  {
    name: 'ASIA, OCEANIA & THE CARIBBEAN',
    applicationPeriod: 'September 1–30, 2025',
    awardDate: 'November 2025',
    status: 'open'
  }
]

export default function GrantSchedule() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="premium" className="animate-pulse">Open Now</Badge>
      case 'upcoming':
        return <Badge variant="secondary" className="border-amber-200 bg-amber-50 text-amber-700">Opening Soon</Badge>
      case 'closed':
        return <Badge variant="outline" className="opacity-75">Closed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <section className="relative py-24 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-gray-200/50 shadow-lg">
            <Globe2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Regional Application Schedule</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Grant Schedule
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Discover when applications open in your region and plan your submission timeline
          </p>
        </div>

        {/* Grid of regions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {regions.map((region, index) => (
            <Card 
              key={region.name} 
              className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer backdrop-blur-sm ${
                region.status === 'open' 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-emerald-200/50 shadow-emerald-500/20' 
                  : region.status === 'upcoming'
                  ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200/50 shadow-amber-500/20'
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50'
              }`}
              onClick={() => setSelectedRegion(region)}
            >
              {/* Glow effect for open applications */}
              {region.status === 'open' && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              )}
              
              <CardHeader className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      region.status === 'open' ? 'bg-emerald-100' :
                      region.status === 'upcoming' ? 'bg-amber-100' : 'bg-gray-100'
                    }`}>
                      <MapPin className={`w-5 h-5 ${
                        region.status === 'open' ? 'text-emerald-600' :
                        region.status === 'upcoming' ? 'text-amber-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800">
                        {region.name}
                      </CardTitle>
                    </div>
                  </div>
                  {getStatusBadge(region.status)}
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Application Period:</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 ml-7">
                    {region.applicationPeriod}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Award className="w-4 h-4" />
                    <span className="font-medium">Award Date:</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 ml-7">
                    {region.awardDate}
                  </p>
                </div>

                {region.status === 'open' && (
                  <div className="pt-4">
                    <Button asChild variant="premium" size="sm" className="w-full group">
                      <Link href="/application" className="flex items-center justify-center gap-2">
                        Apply Now
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
              
              {/* Floating sparkles for active regions */}
              {region.status === 'open' && (
                <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-6 h-6 text-emerald-500 animate-pulse" />
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Important Notice */}
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
          <div className="absolute top-4 right-4">
            <AlertTriangle className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Important Notice
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Each region has specific application windows throughout the year. Missing your regional deadline means waiting until the next cycle. 
              We recommend preparing your application materials well in advance.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild variant="outline" size="lg">
                <Link href="/application">
                  Start Preparing Application
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/faq">
                  View FAQ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
