import axios from 'axios';
import { SMSProvider, ProviderResult } from '../types';

// Minimal Safaricom SMS adapter (placeholder endpoints)
export class SafaricomSMSProvider implements SMSProvider {
  private apiKey: string | undefined;
  private apiSecret: string | undefined;
  private baseUrl: string;

  constructor(config?: { baseUrl?: string }) {
    this.apiKey = process.env.SAFARICOM_API_KEY;
    this.apiSecret = process.env.SAFARICOM_API_SECRET;
    this.baseUrl = config?.baseUrl || 'https://api.safaricom.co.ke/sms';
  }

  async sendText(opts: { from: string; to: string; text: string; messageId?: string }): Promise<ProviderResult> {
    if (!this.apiKey || !this.apiSecret) {
      return { success: false, error: 'Safaricom credentials missing' };
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
      const msg = err?.response?.data?.message || err?.message || 'Safaricom SMS error';
      return { success: false, error: msg, raw: err?.response?.data };
    }
  }
}

export default SafaricomSMSProvider;