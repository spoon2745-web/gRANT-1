import mongoose from 'mongoose';

const PendingNotificationSchema = new mongoose.Schema({
  chatMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage', required: false },
  sessionId: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  lastError: { type: String },
  attempts: { type: Number, default: 0 },
  nextAttemptAt: { type: Date, default: () => new Date(Date.now() + 1000 * 60 * 5) }, // 5 minutes
  sent: { type: Boolean, default: false },
  sentAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Avoid model overwrite in dev hot-reload
const modelName = 'PendingNotification';
export default mongoose.models[modelName] || mongoose.model(modelName, PendingNotificationSchema);
