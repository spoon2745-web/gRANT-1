import mongoose from 'mongoose';
// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    userInfo: {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 255
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['new', 'reading', 'responded', 'closed'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    sessionId: {
        type: String,
        required: true,
        index: true // Single index definition here
    },
    userAgent: String,
    ipAddress: String,
    responses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChatResponse'
        }],
    // Real-time status tracking
    readBy: [{
            staffId: String,
            staffName: String,
            readAt: { type: Date, default: Date.now }
        }],
    isRead: { type: Boolean, default: false },
    lastActivity: { type: Date, default: Date.now },
    // User presence tracking
    userOnline: { type: Boolean, default: true },
    userLastSeen: { type: Date, default: Date.now },
    // Admin tracking
    assignedTo: {
        staffId: String,
        staffName: String,
        assignedAt: Date
    },
    // Deletion tracking
    deletedForAdmin: { type: Boolean, default: false },
    deletedForUser: { type: Boolean, default: false },
    deletedBy: {
        staffId: String,
        staffName: String,
        deletedAt: Date,
        deleteType: { type: String, enum: ['admin-only', 'both'] }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Add indexes for better query performance
chatMessageSchema.index({ timestamp: -1 });
chatMessageSchema.index({ 'userInfo.email': 1 });
chatMessageSchema.index({ status: 1 });
// sessionId index removed - already defined in schema field
// Chat Response Schema
const chatResponseSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatMessage',
        required: true
    },
    response: {
        type: String,
        required: true,
        trim: true,
        maxlength: 10000
    },
    staffInfo: {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        email: String,
        staffId: String,
        role: { type: String, enum: ['admin', 'support', 'user'], default: 'support' }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    // Read receipts and status tracking
    readBy: [{
            userId: String,
            readAt: { type: Date, default: Date.now }
        }],
    isRead: { type: Boolean, default: false },
    editedAt: Date,
    isEdited: { type: Boolean, default: false },
    isInternal: {
        type: Boolean,
        default: false
    },
    sentToUser: {
        type: Boolean,
        default: false
    },
    sentAt: Date,
    deliveryStatus: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'failed'],
        default: 'pending'
    },
    // Deletion tracking
    deletedForAdmin: { type: Boolean, default: false },
    deletedForUser: { type: Boolean, default: false },
    deletedBy: {
        staffId: String,
        staffName: String,
        deletedAt: Date,
        deleteType: { type: String, enum: ['admin-only', 'both'] }
    }
}, {
    timestamps: true
});
// Add indexes
chatResponseSchema.index({ messageId: 1 });
chatResponseSchema.index({ timestamp: -1 });
chatResponseSchema.index({ 'staffInfo.staffId': 1 });
// User Session Schema for tracking user interactions
const userSessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    userInfo: {
        name: String,
        email: String
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    messageCount: {
        type: Number,
        default: 0
    },
    userAgent: String,
    ipAddress: String,
    source: {
        type: String,
        default: 'website'
    }
}, {
    timestamps: true
});
// Add indexes
// sessionId index removed - already defined in ChatMessage schema
userSessionSchema.index({ 'userInfo.email': 1 });
userSessionSchema.index({ lastActivity: -1 });
// Create models (only if they don't exist)
export const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);
export const ChatResponse = mongoose.models.ChatResponse || mongoose.model('ChatResponse', chatResponseSchema);
export const UserSession = mongoose.models.UserSession || mongoose.model('UserSession', userSessionSchema);
