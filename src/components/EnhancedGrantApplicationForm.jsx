'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileText, User, DollarSign } from 'lucide-react';
// Form validation schema
const formSchema = z.object({
    // Personal Information
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    // Project Information
    projectTitle: z.string().min(5, 'Project title must be at least 5 characters'),
    projectDescription: z.string().min(50, 'Project description must be at least 50 characters'),
    projectField: z.string().min(1, 'Project field is required'),
    targetAudience: z.string().min(10, 'Target audience description must be at least 10 characters'),
    // Grant Details
    requestedAmount: z.string().min(1, 'Requested amount is required'),
    projectDuration: z.string().min(1, 'Project duration is required'),
    fundingUse: z.string().min(20, 'Funding use description must be at least 20 characters'),
    expectedImpact: z.string().min(30, 'Expected impact description must be at least 30 characters'),
    // Additional Information
    previousExperience: z.string().min(20, 'Previous experience description must be at least 20 characters'),
    whyDeserving: z.string().min(30, 'Please explain why you deserve this grant (at least 30 characters)'),
});
const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Project Details', icon: FileText },
    { id: 3, title: 'Grant Information', icon: DollarSign },
    { id: 4, title: 'Review & Submit', icon: CheckCircle },
];
export default function EnhancedGrantApplicationForm() {
    const { success, error } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors }, trigger, watch, } = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
    });
    const watchedFields = watch();
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok && result.success) {
                success('Application Submitted', `Your grant application has been submitted successfully! Application ID: ${result.applicationId}`);
                setIsSubmitted(true);
            }
            else {
                throw new Error(result.error || 'Failed to submit application');
            }
        }
        catch (err) {
            console.error('Submission error:', err);
            error('Submission Failed', err instanceof Error ? err.message : 'There was an error submitting your application. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const nextStep = async () => {
        const fieldsToValidate = getFieldsForStep(currentStep);
        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };
    const getFieldsForStep = (step) => {
        switch (step) {
            case 1:
                return ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'country', 'city'];
            case 2:
                return ['projectTitle', 'projectDescription', 'projectField', 'targetAudience'];
            case 3:
                return ['requestedAmount', 'projectDuration', 'fundingUse', 'expectedImpact', 'previousExperience', 'whyDeserving'];
            default:
                return [];
        }
    };
    if (isSubmitted) {
        return (<Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4"/>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Application Submitted Successfully!</h3>
            <p className="text-gray-600">
              Thank you for your grant application. We&apos;ll review your submission and get back to you within 2-3 business days.
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
              Submit Another Application
            </Button>
          </div>
        </CardContent>
      </Card>);
    }
    return (<div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (<div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'}`}>
                  <Icon className="w-5 h-5"/>
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (<div className={`flex-1 h-px mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}/>)}
              </div>);
        })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (<Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Please provide your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" {...register('firstName')} className={errors.firstName ? 'border-red-500' : ''}/>
                  {errors.firstName && (<p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>)}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" {...register('lastName')} className={errors.lastName ? 'border-red-500' : ''}/>
                  {errors.lastName && (<p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>)}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-red-500' : ''}/>
                {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" {...register('phone')} className={errors.phone ? 'border-red-500' : ''}/>
                  {errors.phone && (<p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>)}
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} className={errors.dateOfBirth ? 'border-red-500' : ''}/>
                  {errors.dateOfBirth && (<p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input id="country" {...register('country')} className={errors.country ? 'border-red-500' : ''}/>
                  {errors.country && (<p className="text-red-500 text-sm mt-1">{errors.country.message}</p>)}
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" {...register('city')} className={errors.city ? 'border-red-500' : ''}/>
                  {errors.city && (<p className="text-red-500 text-sm mt-1">{errors.city.message}</p>)}
                </div>
              </div>
            </CardContent>
          </Card>)}

        {/* Step 2: Project Details */}
        {currentStep === 2 && (<Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Tell us about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectTitle">Project Title *</Label>
                <Input id="projectTitle" {...register('projectTitle')} className={errors.projectTitle ? 'border-red-500' : ''}/>
                {errors.projectTitle && (<p className="text-red-500 text-sm mt-1">{errors.projectTitle.message}</p>)}
              </div>

              <div>
                <Label htmlFor="projectDescription">Project Description *</Label>
                <Textarea id="projectDescription" rows={4} {...register('projectDescription')} className={errors.projectDescription ? 'border-red-500' : ''} placeholder="Describe your project in detail..."/>
                {errors.projectDescription && (<p className="text-red-500 text-sm mt-1">{errors.projectDescription.message}</p>)}
              </div>

              <div>
                <Label htmlFor="projectField">Project Field *</Label>
                <Input id="projectField" {...register('projectField')} className={errors.projectField ? 'border-red-500' : ''} placeholder="e.g., Education, Healthcare, Technology"/>
                {errors.projectField && (<p className="text-red-500 text-sm mt-1">{errors.projectField.message}</p>)}
              </div>

              <div>
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Textarea id="targetAudience" rows={3} {...register('targetAudience')} className={errors.targetAudience ? 'border-red-500' : ''} placeholder="Who will benefit from your project?"/>
                {errors.targetAudience && (<p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>)}
              </div>
            </CardContent>
          </Card>)}

        {/* Step 3: Grant Information */}
        {currentStep === 3 && (<Card>
            <CardHeader>
              <CardTitle>Grant Information</CardTitle>
              <CardDescription>Financial details and project impact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="requestedAmount">Requested Amount (USD) *</Label>
                  <Input id="requestedAmount" type="number" {...register('requestedAmount')} className={errors.requestedAmount ? 'border-red-500' : ''} placeholder="e.g., 5000"/>
                  {errors.requestedAmount && (<p className="text-red-500 text-sm mt-1">{errors.requestedAmount.message}</p>)}
                </div>
                <div>
                  <Label htmlFor="projectDuration">Project Duration *</Label>
                  <Input id="projectDuration" {...register('projectDuration')} className={errors.projectDuration ? 'border-red-500' : ''} placeholder="e.g., 6 months"/>
                  {errors.projectDuration && (<p className="text-red-500 text-sm mt-1">{errors.projectDuration.message}</p>)}
                </div>
              </div>

              <div>
                <Label htmlFor="fundingUse">How will you use the funding? *</Label>
                <Textarea id="fundingUse" rows={4} {...register('fundingUse')} className={errors.fundingUse ? 'border-red-500' : ''} placeholder="Provide a detailed breakdown of how the grant money will be used..."/>
                {errors.fundingUse && (<p className="text-red-500 text-sm mt-1">{errors.fundingUse.message}</p>)}
              </div>

              <div>
                <Label htmlFor="expectedImpact">Expected Impact *</Label>
                <Textarea id="expectedImpact" rows={4} {...register('expectedImpact')} className={errors.expectedImpact ? 'border-red-500' : ''} placeholder="What impact do you expect your project to have?"/>
                {errors.expectedImpact && (<p className="text-red-500 text-sm mt-1">{errors.expectedImpact.message}</p>)}
              </div>

              <div>
                <Label htmlFor="previousExperience">Previous Experience *</Label>
                <Textarea id="previousExperience" rows={3} {...register('previousExperience')} className={errors.previousExperience ? 'border-red-500' : ''} placeholder="Describe your relevant experience and qualifications..."/>
                {errors.previousExperience && (<p className="text-red-500 text-sm mt-1">{errors.previousExperience.message}</p>)}
              </div>

              <div>
                <Label htmlFor="whyDeserving">Why do you deserve this grant? *</Label>
                <Textarea id="whyDeserving" rows={4} {...register('whyDeserving')} className={errors.whyDeserving ? 'border-red-500' : ''} placeholder="Explain why you should be chosen for this grant..."/>
                {errors.whyDeserving && (<p className="text-red-500 text-sm mt-1">{errors.whyDeserving.message}</p>)}
              </div>
            </CardContent>
          </Card>)}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (<Card>
            <CardHeader>
              <CardTitle>Review Your Application</CardTitle>
              <CardDescription>Please review your information before submitting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Personal Information Summary */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                  <div className="bg-gray-50 p-4 rounded-md space-y-1">
                    <p><span className="font-medium">Name:</span> {watchedFields.firstName} {watchedFields.lastName}</p>
                    <p><span className="font-medium">Email:</span> {watchedFields.email}</p>
                    <p><span className="font-medium">Phone:</span> {watchedFields.phone}</p>
                    <p><span className="font-medium">Location:</span> {watchedFields.city}, {watchedFields.country}</p>
                  </div>
                </div>

                {/* Project Summary */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Project Summary</h4>
                  <div className="bg-gray-50 p-4 rounded-md space-y-1">
                    <p><span className="font-medium">Title:</span> {watchedFields.projectTitle}</p>
                    <p><span className="font-medium">Field:</span> {watchedFields.projectField}</p>
                    <p><span className="font-medium">Requested Amount:</span> ${watchedFields.requestedAmount}</p>
                    <p><span className="font-medium">Duration:</span> {watchedFields.projectDuration}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>)}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>
          
          {currentStep < steps.length ? (<Button type="button" onClick={nextStep}>
              Next
            </Button>) : (<Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>)}
        </div>
      </form>
    </div>);
}
