
import { connectToDatabase } from '@/lib/mongodb';
import { Setting } from '@/models/Setting';

let cachedSettings = null;

export async function getSettings() {
    if (cachedSettings) {
        return cachedSettings;
    }

    await connectToDatabase();
    const settings = await Setting.findOne({ key: 'admin-settings' });
    cachedSettings = settings;
    return settings;
}
