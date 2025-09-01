'use client'

import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'

interface FormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  country: string
  city: string
  
  // Project Information
  projectTitle: string
  projectDescription: string
  projectField: string
  targetAudience: string
  
  // Grant Details
  requestedAmount: string
  projectDuration: string
  fundingUse: string
  expectedImpact: string
  
  // Qualitative Metrics
  directBeneficiaries: string
  indirectBeneficiaries: string
  communityImpact: string
  
  // Additional Information
  previousExperience: string
  whyDeserving: string
  additionalInfo: string
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  country: '',
  city: '',
  projectTitle: '',
  projectDescription: '',
  projectField: '',
  targetAudience: '',
  requestedAmount: '',
  projectDuration: '',
  fundingUse: '',
  expectedImpact: '',
  directBeneficiaries: '',
  indirectBeneficiaries: '',
  communityImpact: '',
  previousExperience: '',
  whyDeserving: '',
  additionalInfo: ''
}

export default function GrantApplicationForm() {
  const { success } = useToast()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    success('Application Submitted', 'Your grant application has been submitted successfully!')
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="bg-neutral-900/60 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 p-6 border border-neutral-800 max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
          <p className="text-gray-600">
            Thank you for your application. You will see a confirmation message on this page. 
            We do not send separate email confirmations.
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            <strong>Important:</strong> If you did not see this confirmation message, 
            please email info@impactgrantsolutions.org for confirmation that your application was received.
          </p>
        </div>
        
        <button
          onClick={() => {
            setIsSubmitted(false)
            setFormData(initialFormData)
          }}
          className="inline-flex items-center justify-center gap-2 bg-neutral-800 text-white hover:bg-neutral-700 font-semibold py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2"
        >
          Submit Another Application
        </button>
      </div>
    )
  }

  return (
    <div className="bg-neutral-900/60 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 p-6 border border-neutral-800">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City/State *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Project Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Project Information
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                id="projectTitle"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Brief, descriptive title for your project"
              />
            </div>
            
            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Provide a detailed description of your project, including objectives and methodology"
              />
            </div>
            
            <div>
              <label htmlFor="projectField" className="block text-sm font-medium text-gray-700 mb-2">
                Project Field *
              </label>
              <select
                id="projectField"
                name="projectField"
                value={formData.projectField}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a field</option>
                <option value="business">Business Development</option>
                <option value="education">Education & Training</option>
                <option value="health">Health & Wellness</option>
                <option value="technology">Technology & Innovation</option>
                <option value="agriculture">Agriculture & Food Security</option>
                <option value="arts">Arts & Culture</option>
                <option value="environment">Environment & Sustainability</option>
                <option value="community">Community Development</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience *
              </label>
              <textarea
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe who will benefit from your project (women, girls, families, etc.)"
              />
            </div>
          </div>
        </div>

        {/* Grant Details Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Grant Details
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="requestedAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Requested Amount (USD) *
              </label>
              <input
                type="number"
                id="requestedAmount"
                name="requestedAmount"
                value={formData.requestedAmount}
                onChange={handleInputChange}
                required
                max="500"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Maximum $500 USD"
              />
              <p className="text-sm text-gray-500 mt-1">Grants are up to $500.00 USD</p>
            </div>
            
            <div>
              <label htmlFor="projectDuration" className="block text-sm font-medium text-gray-700 mb-2">
                Project Duration *
              </label>
              <select
                id="projectDuration"
                name="projectDuration"
                value={formData.projectDuration}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select duration</option>
                <option value="1-2 months">1-2 months</option>
                <option value="3-4 months">3-4 months</option>
                <option value="5-6 months">5-6 months</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">Grant period is six months maximum</p>
            </div>
            
            <div>
              <label htmlFor="fundingUse" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Funding Use *
              </label>
              <textarea
                id="fundingUse"
                name="fundingUse"
                value={formData.fundingUse}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Provide specific details on how you will use the grant funds, including estimated costs for each activity"
              />
            </div>
            
            <div>
              <label htmlFor="expectedImpact" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Impact *
              </label>
              <textarea
                id="expectedImpact"
                name="expectedImpact"
                value={formData.expectedImpact}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe the economic and social impact your project will have on your community"
              />
            </div>
          </div>
        </div>

        {/* Impact Metrics Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Impact Metrics
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="directBeneficiaries" className="block text-sm font-medium text-gray-700 mb-2">
                Direct Beneficiaries *
              </label>
              <input
                type="text"
                id="directBeneficiaries"
                name="directBeneficiaries"
                value={formData.directBeneficiaries}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 10 women will receive training"
              />
            </div>
            
            <div>
              <label htmlFor="indirectBeneficiaries" className="block text-sm font-medium text-gray-700 mb-2">
                Indirect Beneficiaries *
              </label>
              <input
                type="text"
                id="indirectBeneficiaries"
                name="indirectBeneficiaries"
                value={formData.indirectBeneficiaries}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., each woman will train 10 additional women"
              />
            </div>
            
            <div>
              <label htmlFor="communityImpact" className="block text-sm font-medium text-gray-700 mb-2">
                Community Impact *
              </label>
              <textarea
                id="communityImpact"
                name="communityImpact"
                value={formData.communityImpact}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., ultimately impacting 20 families and 50 children in the community"
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Additional Information
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="previousExperience" className="block text-sm font-medium text-gray-700 mb-2">
                Previous Experience *
              </label>
              <textarea
                id="previousExperience"
                name="previousExperience"
                value={formData.previousExperience}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your relevant experience and qualifications"
              />
            </div>
            
            <div>
              <label htmlFor="whyDeserving" className="block text-sm font-medium text-gray-700 mb-2">
                Why You Deserve This Grant *
              </label>
              <textarea
                id="whyDeserving"
                name="whyDeserving"
                value={formData.whyDeserving}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Explain why you believe you deserve this grant and how it aligns with our mission"
              />
            </div>
            
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Any additional information you would like to share"
              />
            </div>
          </div>
        </div>

        {/* Submission */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Before Submitting:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ensure all required fields are completed</li>
              <li>• Verify your contact information is correct</li>
              <li>• Review your project description for clarity</li>
              <li>• Check that your funding use is specific and detailed</li>
            </ul>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  )
}
