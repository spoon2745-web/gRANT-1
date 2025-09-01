'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, AlertTriangle, ExternalLink } from 'lucide-react';
const regions = [
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
];
export default function GrantSchedule() {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const getStatusBadge = (status) => {
        switch (status) {
            case 'open':
                return <Badge className="bg-green-100 text-green-800 border-green-200">Open</Badge>;
            case 'closed':
                return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Closed</Badge>;
            case 'upcoming':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Upcoming</Badge>;
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };
    return (<section id="grant-schedule" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Grant Application Schedule
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Applications are accepted regionally throughout the year. Check the schedule below 
            to find your application period.
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"/>
            <div>
              <h3 className="text-blue-800 font-semibold mb-1">Important Notice</h3>
              <p className="text-blue-700 text-sm">
                Applications must be submitted during your region&apos;s designated application period. 
                Late applications will not be considered.
              </p>
            </div>
          </div>
        </div>

        {/* Regional Schedule Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {regions.map((region, index) => (<Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {region.name}
                  </CardTitle>
                  {getStatusBadge(region.status)}
                </div>
                <CardDescription>
                  Regional grant application period and award timeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-blue-600"/>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Application Period:</span>
                    <p className="text-gray-600">{region.applicationPeriod}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-green-600"/>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Award Date:</span>
                    <p className="text-gray-600">{region.awardDate}</p>
                  </div>
                </div>

                {region.countries && (<div className="mt-4">
                    <Button variant="outline" size="sm" onClick={() => setSelectedRegion(selectedRegion?.name === region.name ? null : region)} className="w-full">
                      {selectedRegion?.name === region.name ? 'Hide Countries' : 'Show Countries'}
                      <ExternalLink className="w-4 h-4 ml-2"/>
                    </Button>
                  </div>)}

                <div className="pt-4 border-t">
                  {region.status === 'open' ? (<Button asChild className="w-full">
                      <Link href="/application">
                        Apply Now
                      </Link>
                    </Button>) : (<Button disabled variant="outline" className="w-full">
                      Application {region.status === 'upcoming' ? 'Opens Soon' : 'Closed'}
                    </Button>)}
                </div>
              </CardContent>
            </Card>))}
        </div>

        {/* Countries List */}
        {selectedRegion && selectedRegion.countries && (<Card className="mt-6">
            <CardHeader>
              <CardTitle>Countries in {selectedRegion.name}</CardTitle>
              <CardDescription>
                Eligible countries for this regional application period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {selectedRegion.countries.map((country, index) => (<div key={index} className="text-sm text-gray-700 py-1">
                    {country}
                  </div>))}
              </div>
            </CardContent>
          </Card>)}

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Need Help Finding Your Region?
            </h3>
            <p className="text-gray-600 mb-4">
              If you&apos;re unsure which regional application period applies to you, 
              please contact our support team for assistance.
            </p>
            <Button variant="outline" asChild>
              <Link href="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>);
}
