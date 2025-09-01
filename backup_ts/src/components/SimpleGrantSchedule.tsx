'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, ExternalLink, Award } from 'lucide-react'

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

export default function SimpleGrantSchedule() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="premium">Open Now</Badge>
      case 'upcoming':
        return <Badge variant="secondary" className="border-amber-200 bg-amber-50 text-amber-700">Opening Soon</Badge>
      case 'closed':
        return <Badge variant="outline" className="opacity-75">Closed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Regional Application Schedule
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover when applications open in your region and plan your submission timeline
          </p>
        </div>

        {/* Grid of regions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {regions.map((region, index) => (
            <Card 
              key={region.name} 
              className={`relative border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                region.status === 'open' 
                  ? 'bg-green-50 border-green-200' 
                  : region.status === 'upcoming'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      region.status === 'open' ? 'bg-green-100' :
                      region.status === 'upcoming' ? 'bg-amber-100' : 'bg-gray-100'
                    }`}>
                      <MapPin className={`w-5 h-5 ${
                        region.status === 'open' ? 'text-green-600' :
                        region.status === 'upcoming' ? 'text-amber-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {region.name}
                      </CardTitle>
                    </div>
                  </div>
                  {getStatusBadge(region.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
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
                    <Button asChild variant="premium" size="sm" className="w-full">
                      <Link href="/application" className="flex items-center justify-center gap-2">
                        Apply Now
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 shadow-lg">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-600">
              Important Notice
            </h3>
            <p className="text-gray-700 text-lg">
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
                <Link href="#faq">
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
