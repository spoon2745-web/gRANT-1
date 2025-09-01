
import { Schema, model, models } from 'mongoose';

const SettingSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        default: 'admin-settings'
    },
    telegramBotToken: {
        type: String,
        trim: true
    },
    telegramSupportChatId: {
        type: String,
        trim: true
    },
    mongodbUri: {
        type: String,
        trim: true
    },
    baseUrl: {
        type: String,
        trim: true
    },
    supportPassword: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export const Setting = models.Setting || model('Setting', SettingSchema);
