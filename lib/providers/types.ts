// Common provider types and interfaces
export type ProviderResult = {
  success: boolean;
  externalId?: string;
  error?: string;
  raw?: any;
};

export interface SMSProvider {
  sendText(opts: { from: string; to: string; text: string; messageId?: string }): Promise<ProviderResult>;
}

export interface WhatsAppProvider {
  sendText(opts: { fromPhoneId: string; to: string; text: string; messageId?: string }): Promise<ProviderResult>;
  sendTemplate?(opts: { fromPhoneId: string; to: string; template: any; messageId?: string }): Promise<ProviderResult>;
}

export interface EmailProvider {
  sendEmail(opts: { from: string; to: string; subject?: string; text?: string; html?: string; messageId?: string }): Promise<ProviderResult>;
}

export interface VoiceProvider {
  makeCall(opts: { from: string; to: string; text?: string; url?: string; messageId?: string }): Promise<ProviderResult>;
}