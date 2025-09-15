import axios from 'axios';
import { SMSProvider, ProviderResult } from '../types';

// Minimal Airtel SMS adapter (placeholder endpoints; replace with actual API)
export class AirtelSMSProvider implements SMSProvider {
  private apiKey: string | undefined;
  private apiSecret: string | undefined;
  private baseUrl: string;

  constructor(config?: { baseUrl?: string }) {
    this.apiKey = process.env.AIRTEL_API_KEY;
    this.apiSecret = process.env.AIRTEL_API_SECRET;
    this.baseUrl = config?.baseUrl || 'https://api.airtel.com/sms';
  }

  async sendText(opts: { from: string; to: string; text: string; messageId?: string }): Promise<ProviderResult> {
    if (!this.apiKey || !this.apiSecret) {
      return { success: false, error: 'Airtel credentials missing' };
    }

    try {
      const res = await axios.post(
        `${this.baseUrl}/send`,
        {
          from: opts.from,
          to: opts.to,
          text: opts.text,
          clientMessageId: opts.messageId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': this.apiKey,
            'X-API-SECRET': this.apiSecret,
          },
          timeout: 15000,
        }
      );

      return {
        success: true,
        externalId: res.data?.messageId || res.data?.id,
        raw: res.data,
      };
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Airtel SMS error';
      return { success: false, error: msg, raw: err?.response?.data };
    }
  }
}

export default AirtelSMSProvider;