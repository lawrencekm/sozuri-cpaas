import twilio from 'twilio';
import { VoiceProvider, ProviderResult } from '../types';

export class TwilioVoiceProvider implements VoiceProvider {
  private client: ReturnType<typeof twilio> | null = null;
  private fromDefault: string | undefined;

  constructor() {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    this.fromDefault = process.env.TWILIO_FROM_NUMBER;
    if (sid && token) this.client = twilio(sid, token);
  }

  async makeCall(opts: { from: string; to: string; text?: string; url?: string; messageId?: string }): Promise<ProviderResult> {
    if (!this.client) return { success: false, error: 'Twilio not configured (missing SID/TOKEN)' };

    try {
      // If a TwiML URL is provided, use it; otherwise generate a simple TTS using TwiML bin-like content
      const from = opts.from || this.fromDefault;
      if (!from) return { success: false, error: 'Missing from number for voice call' };

      const call = await this.client.calls.create({
        from,
        to: opts.to,
        url: opts.url || `http://twimlets.com/message?Message%5B0%5D=${encodeURIComponent(opts.text || 'Hello from Sozuri')}`,
        machineDetection: 'Enable',
      });
      return { success: true, externalId: call.sid, raw: call };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Twilio call error' };
    }
  }
}

export default TwilioVoiceProvider;