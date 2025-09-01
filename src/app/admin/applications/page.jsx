'use client';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/contexts/ToastContext';
import AdminLayout from '@/components/AdminLayout';
export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const { success, error } = useToast();
    const fetchApplications = useCallback(async () => {
        try {
            const response = await fetch('/api/applications');
            const data = await response.json();
            if (data.success) {
                setApplications(data.applications);
            }
            else {
                throw new Error(data.error);
            }
        }
        catch (err) {
            console.error('Error fetching applications:', err);
            error('Error', 'Failed to load applications');
        }
        finally {
            setIsLoading(false);
        }
    }, [error]);
    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);
    const filteredApplications = applications.filter(app => {
        if (filter === 'all')
            return true;
        return app.status === filter;
    });
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'under-review': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const formatAmount = (amount) => {
        const num = parseFloat(amount.replace(/[^0-9.-]+/g, ''));
        return isNaN(num) ? amount : `$${num.toLocaleString()}`;
    };
    if (isLoading) {
        return (<AdminLayout title="Grant Applications" description="Review and manage grant applications">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
          </div>
        </div>
      </AdminLayout>);
    }
    return (<AdminLayout title="Grant Applications" description="Review and manage grant applications">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b bg-gray-50/50">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Total: {applications.length}</span>
            <span>•</span>
            <span>Pending: {applications.filter(a => a.status === 'pending').length}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex space-x-1 min-w-max">
            {['all', 'pending', 'under-review', 'approved', 'rejected'].map((status) => (<button key={status} onClick={() => setFilter(status)} className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-colors flex-shrink-0 ${filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}>
                {status} ({status === 'all' ? applications.length : applications.filter(a => a.status === status).length})
              </button>))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Applications List */}
        <div className="lg:col-span-1 border-r">
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">
              Applications ({filteredApplications.length})
            </h2>
            
            {filteredApplications.length === 0 ? (<div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                    </div>
                    <p>No applications found</p>
                  </div>) : (<div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {filteredApplications.map((app) => (<div key={app._id} onClick={() => setSelectedApplication(app)} className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedApplication?._id === app._id
                    ? 'bg-blue-100 border-blue-300 shadow-sm'
                    : 'bg-white hover:bg-gray-50 border border-gray-200'}`}>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-sm font-medium">
                              {app.firstName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 text-sm truncate">
                                {app.firstName} {app.lastName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(app.submittedAt)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(app.status)}`}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-900 font-medium text-sm truncate mb-1">
                          {app.projectTitle}
                        </p>
                        <p className="text-gray-600 text-xs truncate mb-2">
                          {formatAmount(app.requestedAmount)} • {app.projectDuration}
                        </p>
                        
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="truncate">{app.email}</span>
                          <span className="text-blue-600 font-medium">{app.applicationId}</span>
                        </div>
                      </div>))}
                  </div>)}
              </div>
            </div>

            {/* Application Details */}
            <div className="lg:col-span-2">
              {selectedApplication ? (<div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(selectedApplication.status)}`}>
                          {selectedApplication.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {selectedApplication.applicationId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <p className="font-medium">{selectedApplication.firstName} {selectedApplication.lastName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <p className="font-medium break-all">{selectedApplication.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <p className="font-medium">{selectedApplication.phone}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Date of Birth:</span>
                          <p className="font-medium">{selectedApplication.dateOfBirth}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <p className="font-medium">{selectedApplication.city}, {selectedApplication.country}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Submitted:</span>
                          <p className="font-medium">{formatDate(selectedApplication.submittedAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Project Information */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Project Information</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 text-sm">Project Title:</span>
                          <p className="font-medium">{selectedApplication.projectTitle}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Field:</span>
                          <p className="font-medium">{selectedApplication.projectField}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Description:</span>
                          <p className="text-gray-800 whitespace-pre-wrap">{selectedApplication.projectDescription}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Target Audience:</span>
                          <p className="text-gray-800">{selectedApplication.targetAudience}</p>
                        </div>
                      </div>
                    </div>

                    {/* Grant Details */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Grant Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600 text-sm">Requested Amount:</span>
                          <p className="font-medium text-lg">{formatAmount(selectedApplication.requestedAmount)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Project Duration:</span>
                          <p className="font-medium">{selectedApplication.projectDuration}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-600 text-sm">How funds will be used:</span>
                          <p className="text-gray-800 mt-1">{selectedApplication.fundingUse}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-600 text-sm">Expected Impact:</span>
                          <p className="text-gray-800 mt-1">{selectedApplication.expectedImpact}</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 text-sm">Previous Experience:</span>
                          <p className="text-gray-800 mt-1">{selectedApplication.previousExperience}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Why they deserve this grant:</span>
                          <p className="text-gray-800 mt-1">{selectedApplication.whyDeserving}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>) : (<div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p>Select an application to view details</p>
                  </div>
                </div>)}
            </div>
          </div>
    </AdminLayout>);
}
