export { SafaricomSMSProvider } from './sms/safaricom';
export { AirtelSMSProvider } from './sms/airtel';
export { MetaWhatsAppProvider } from './whatsapp/meta';
export { SMTPEmailProvider } from './email/smtp';
export { TwilioVoiceProvider } from './voice/twilio';

import { SMSProvider, WhatsAppProvider, EmailProvider, VoiceProvider } from './types';


export async function getSMSProvider(name?: string): Promise<SMSProvider> {
  switch ((name || '').toLowerCase()) {
    case 'airtel': {
      const imported = await import('./sms/airtel');
      return new imported.AirtelSMSProvider();
    }
    case 'safaricom':
    default: {
      const imported = await import('./sms/safaricom');
      return new imported.SafaricomSMSProvider();
    }
  }
}


export async function getWhatsAppProvider(name?: string): Promise<WhatsAppProvider> {
  switch ((name || '').toLowerCase()) {
    case 'meta':
    default: {
      const imported = await import('./whatsapp/meta');
      return new imported.MetaWhatsAppProvider();
    }
  }
}


export async function getEmailProvider(name?: string): Promise<EmailProvider> {
  const imported = await import('./email/smtp');
  return new imported.SMTPEmailProvider();
}


export async function getVoiceProvider(name?: string): Promise<VoiceProvider> {
  switch ((name || '').toLowerCase()) {
    case 'twilio':
    default: {
      const imported = await import('./voice/twilio');
      return new imported.TwilioVoiceProvider();
    }
  }
}