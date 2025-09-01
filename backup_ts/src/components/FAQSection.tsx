'use client'

import { useState } from 'react'

interface FAQ {
  question: string
  answer: string | React.ReactElement
  category: 'application' | 'eligibility' | 'awards' | 'general'
}

const faqs: FAQ[] = [
  {
    category: 'application',
    question: "How can I submit a grant request?",
    answer: "We ONLY accept online applications that are accessible on this website and submitted online. YOU MUST APPLY ONLINE. CLICK ON THE \"APPLICATION OPEN\" BUTTON FOR YOUR REGION IN THE BOX ABOVE. We DO NOT consider proposals or funding requests received via email. Email requests for partnering will not be considered or evaluated."
  },
  {
    category: 'eligibility',
    question: "Who can apply for a grant?",
    answer: "Women ages 18 and up."
  },
  {
    category: 'application',
    question: "Do I have to own a business to apply?",
    answer: "No. You can use the grant to start a new business, or expand your existing business. You can also use the grant to start or expand a nonprofit, non-governmental organization (NGO), charity, or propose a specific activity or project you would like to implement."
  },
  {
    category: 'eligibility',
    question: "Are the grants limited to a certain geography?",
    answer: "No. You can apply for a grant from any country or state or territory in the world."
  },
  {
    category: 'eligibility',
    question: "Are the grants limited to a specific field (like health)?",
    answer: "Absolutely not. You can propose activities in any field, trade, occupation, or craft. However, your business/organization/idea must focus on women, girls and/or families. And all activities must be LEGAL!"
  },
  {
    category: 'awards',
    question: "What is the duration of the grant?",
    answer: "The grant period is six months."
  },
  {
    category: 'application',
    question: "Can I submit an application in a language other than English?",
    answer: "Yes, grant applications are accepted in any language that can be translated with Google translate."
  },
  {
    category: 'application',
    question: "What is important to emphasize in the grant application?",
    answer: (
      <div className="space-y-3">
        <p>• Make sure you fill out ALL fields of the online application form. An incomplete application will not be considered.</p>
        <p>• Your proposed grant activities MUST have an economic and social benefit to your community and MUST go beyond financial aspects of your business. The more economic and social impact you can illustrate through your idea—the better and the greater your chances of winning the grant.</p>
        <p>• We will NOT support activities related to the purchase of merchandise, stock, advertisements, or marketing for personal use.</p>
        <p>• Be as specific as possible, particularly regarding how you will use the grant funds. For example, if you plan on using the grant for a community event, a training, scholarships, etc. please include a detailed list of the activity you will develop including estimated costs, what the event will include, who is the target audience, and how the event will impact women, girls, and families.</p>
        <p>• Include, as much as possible, qualitative information related to the grant impact (ex. training for 10 women, each women will train an additional 10 women, ultimately impacting 20 families and 50 children in the community).</p>
      </div>
    )
  },
  {
    category: 'general',
    question: "I didn't get a confirmation email after I submitted my application. How do I know it went through?",
    answer: "Once you submit your application online, you will get a message stating that your application was submitted. We do NOT send separate email confirmations. If you do not see a confirmation message, please email info@impactgrantsolutions.org for confirmation."
  },
  {
    category: 'awards',
    question: "How do we score your application?",
    answer: (
      <div className="space-y-2">
        <p>We score your application based on the following four criteria:</p>
        <p>• The degree of alignment with our Mission</p>
        <p>• Your proposed grant activities are innovative, creative and will have a positive economic and social impact on women, their families and communities</p>
        <p>• The effective use of grant funding for your proposed activities</p>
        <p>• The grant impact is clearly outlined, well articulated, and measurable</p>
      </div>
    )
  },
  {
    category: 'awards',
    question: "What happens after I submit the application? How am I shortlisted?",
    answer: (
      <div className="space-y-3">
        <p>• Once you submit your online application, we review the applications for compliance. A representative may reach out to you for additional information and/or to clarify your answers. We may also ask for photos of you and your business/organization.</p>
        <p>• Our staff then evaluate applications based on the following criteria:</p>
        <div className="ml-4 space-y-1">
          <p>○ Proposed grant activities align with our mission</p>
          <p>○ Innovative use of grant funding to achieve activities</p>
          <p>○ Demonstrated grant impact to the applicant, her family, and community (multiplied impact)</p>
        </div>
        <p>• Based on these scoring criteria we will shortlist between 10 applications per grant round.</p>
        <p>• Due to the volume of applications we receive, we can only inform those who are shortlisted.</p>
        <p>• If you DO NOT hear from us, your application is deemed unsuccessful. We apologize in advance.</p>
      </div>
    )
  },
  {
    category: 'awards',
    question: "How do you decide who wins the grant?",
    answer: "Board Members evaluate each shortlisted applicant using the same scoring criteria to identify the initial shortlist. Board members may reach out to individual applicants for additional information and clarification."
  },
  {
    category: 'general',
    question: "Can I apply multiple times for a grant?",
    answer: "Applicants may only apply once per cycle. Once awarded a grant, applicants CANNOT apply again. Applicants who do not receive a grant may apply again in future cycles."
  },
  {
    category: 'awards',
    question: "What happens if I win a grant?",
    answer: (
      <div className="space-y-3">
        <p>• We will notify applicants on an individual basis (via email) if their application was successful. Grants are up to $500.00 (five hundred) USD. The award amount will be determined based on proposed activities and availability of funding.</p>
        <p>• We will organize a meeting with each awardee to discuss the terms and conditions of the grants, and to review the grant agreement, deliverables, and guidelines.</p>
        <p>• Once the grant agreement is signed, grant recipients have up to six months to implement their proposed project.</p>
      </div>
    )
  }
]

const categories = {
  application: { name: 'Application Process', color: 'primary' },
  eligibility: { name: 'Eligibility', color: 'accent' },
  awards: { name: 'Awards & Selection', color: 'secondary' },
  general: { name: 'General Information', color: 'neutral' }
}

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>('application')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const filteredFAQs = faqs.filter(faq => faq.category === activeCategory)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const getCategoryClasses = (category: string) => {
    const isActive = activeCategory === category
    const baseClasses = "px-4 py-2 rounded-xl font-medium transition-all duration-300"
    
    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform -translate-y-0.5`
    }
    return `${baseClasses} text-gray-600 hover:text-blue-600 hover:bg-gray-100`
  }

  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our grant program. 
            If you don&apos;t see your question here, please contact our support team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">{/* removed animate-fade-up */}
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={getCategoryClasses(key)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 group"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center transition-all duration-300 ${openFAQ === index ? 'rotate-180 bg-gradient-to-br from-blue-600 to-purple-600' : ''}`}>
                      <svg 
                        className={`w-4 h-4 transition-colors ${openFAQ === index ? 'text-white' : 'text-blue-600'}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {openFAQ === index && (
                  <div className="px-6 pb-6 animate-scale-in">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>
                    <div className="text-neutral-600 leading-relaxed">
                      {typeof faq.answer === 'string' ? (
                        <p>{faq.answer}</p>
                      ) : (
                        faq.answer
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="card">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl animate-spin-slow opacity-75"></div>
                  <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Still have questions?</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Our support team is here to help you navigate the application process
                </p>
                <a 
                  href="mailto:info@impactgrantsolutions.org" 
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <span>Contact Support</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
