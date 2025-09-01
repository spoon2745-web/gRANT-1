
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Setting } from '@/models/Setting';

export async function GET() {
    try {
        await connectToDatabase();
        const settings = await Setting.findOne({ key: 'admin-settings' });
        return NextResponse.json({ success: true, settings: settings || {} });
    }
    catch (error) {
        console.error('Error loading settings:', error);
        return NextResponse.json({ success: false, error: 'Failed to load settings' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { settings } = await request.json();

        // Basic validation
        if (!settings.mongodbUri) {
            return NextResponse.json({ success: false, error: 'MongoDB URI is required' }, { status: 400 });
        }

        await connectToDatabase();

        const updatedSettings = await Setting.findOneAndUpdate(
            { key: 'admin-settings' },
            { ...settings, key: 'admin-settings' },
            { new: true, upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Settings saved successfully.',
            settings: updatedSettings
        });
    }
    catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
    }
}

