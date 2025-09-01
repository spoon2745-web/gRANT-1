import { Schema, model, models } from 'mongoose';
const ApplicationSchema = new Schema({
    applicationId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    projectTitle: {
        type: String,
        required: true,
        trim: true
    },
    projectDescription: {
        type: String,
        required: true,
        trim: true
    },
    projectField: {
        type: String,
        required: true,
        trim: true
    },
    targetAudience: {
        type: String,
        required: true,
        trim: true
    },
    requestedAmount: {
        type: String,
        required: true,
        trim: true
    },
    projectDuration: {
        type: String,
        required: true,
        trim: true
    },
    fundingUse: {
        type: String,
        required: true,
        trim: true
    },
    expectedImpact: {
        type: String,
        required: true,
        trim: true
    },
    previousExperience: {
        type: String,
        required: true,
        trim: true
    },
    whyDeserving: {
        type: String,
        required: true,
        trim: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'under-review', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});
// Create index for faster queries
ApplicationSchema.index({ submittedAt: -1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ email: 1 });
export const Application = models.Application || model('Application', ApplicationSchema);
