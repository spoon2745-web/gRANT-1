export default function Footer() {
    return (<footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">Impact Grant Solutions</h3>
            <p className="text-gray-300 mb-4">
              Empowering individuals and organizations to access funding opportunities
              that transform communities and drive positive change.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/apply" className="hover:text-blue-400 transition-colors">Apply Now</a></li>
              <li><a href="/schedule" className="hover:text-blue-400 transition-colors">Schedule</a></li>
              <li><a href="/faq" className="hover:text-blue-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="text-gray-300 space-y-2">
              <p>Email: info@impactgrantsolutions.org</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Impact Grant Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>);
}
