import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';
import PendingNotification from '@/models/PendingNotification';
import { getSettings } from '@/lib/getSettings';

async function sendPayload(payload) {
  const settings = await getSettings();
  const TELEGRAM_BOT_TOKEN = settings?.telegramBotToken;

  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('Telegram bot token not configured, cannot send notification.');
    return false;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
    return resp.ok;
  }
  catch (err) {
    return false;
  }
  finally {
    clearTimeout(timeout);
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    // Find a small batch of pending notifications that are due
    const now = new Date();
    const pending = await PendingNotification.find({ sent: false, nextAttemptAt: { $lte: now } }).limit(20);
    if (pending.length === 0) {
      return NextResponse.json({ success: true, processed: 0, message: 'No pending notifications' });
    }
    let processed = 0;
    for (const p of pending) {
      const ok = await sendPayload(p.payload);
      if (ok) {
        p.sent = true;
        p.sentAt = new Date();
        await p.save();
        processed++;
      }
      else {
        p.attempts = (p.attempts || 0) + 1;
        p.lastError = 'delivery_failed';
        p.nextAttemptAt = new Date(Date.now() + Math.min(1000 * 60 * 60, 1000 * 60 * (p.attempts + 1) * 5));
        await p.save();
      }
    }
    return NextResponse.json({ success: true, processed, total: pending.length });
  }
  catch (error) {
    console.error('Error retrying notifications:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

