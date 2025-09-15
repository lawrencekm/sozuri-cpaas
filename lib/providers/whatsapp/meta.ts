import axios from 'axios';
import { ProviderResult, WhatsAppProvider } from '../types';

// Meta WhatsApp Cloud API minimal adapter
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/
export class MetaWhatsAppProvider implements WhatsAppProvider {
  private token: string | undefined;
  private businessId: string | undefined;

  constructor() {
    this.token = process.env.META_WA_TOKEN;
    this.businessId = process.env.META_WA_BUSINESS_ID;
  }

  private getHeaders() {
    if (!this.token) throw new Error('META_WA_TOKEN missing');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };
  }

  async sendText(opts: { fromPhoneId: string; to: string; text: string; messageId?: string }): Promise<ProviderResult> {
    if (!opts.fromPhoneId) return { success: false, error: 'fromPhoneId required' };

    try {
      const url = `https://graph.facebook.com/v20.0/${opts.fromPhoneId}/messages`;
      const res = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to: opts.to,
          type: 'text',
          text: { body: opts.text },
          client_msg_id: opts.messageId,
        },
        { headers: this.getHeaders(), timeout: 20000 }
      );

      return { success: true, externalId: res.data?.messages?.[0]?.id, raw: res.data };
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || err?.message || 'WhatsApp send error';
      return { success: false, error: msg, raw: err?.response?.data };
    }
  }

  async sendTemplate(opts: { fromPhoneId: string; to: string; template: any; messageId?: string }): Promise<ProviderResult> {
    if (!opts.fromPhoneId) return { success: false, error: 'fromPhoneId required' };

    try {
      const url = `https://graph.facebook.com/v20.0/${opts.fromPhoneId}/messages`;
      const res = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to: opts.to,
          type: 'template',
          template: opts.template,
          client_msg_id: opts.messageId,
        },
        { headers: this.getHeaders(), timeout: 20000 }
      );

      return { success: true, externalId: res.data?.messages?.[0]?.id, raw: res.data };
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || err?.message || 'WhatsApp template error';
      return { success: false, error: msg, raw: err?.response?.data };
    }
  }
}

export default MetaWhatsAppProvider;