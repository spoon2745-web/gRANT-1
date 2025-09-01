import EnhancedGrantApplicationForm from '@/components/EnhancedGrantApplicationForm';
export default function ApplicationPage() {
    return (<div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Grant Application
            </h1>
            <p className="text-lg text-gray-600">
              Complete the form below to submit your grant application. 
              Please ensure all fields are filled out completely and accurately.
            </p>
          </div>
          
          <EnhancedGrantApplicationForm />
        </div>
      </div>
    </div>);
}
