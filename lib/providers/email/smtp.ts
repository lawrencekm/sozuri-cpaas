import nodemailer from 'nodemailer';
import { EmailProvider, ProviderResult } from '../types';

export class SMTPEmailProvider implements EmailProvider {
  private transporter;
  private fromDefault: string | undefined;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    this.fromDefault = process.env.EMAIL_FROM;

    if (!host || !user || !pass) {
      // Lazy-create a dummy transporter to avoid crashes; actual send will fail with clear error
      this.transporter = null as any;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  async sendEmail(opts: { from: string; to: string; subject?: string; text?: string; html?: string; messageId?: string }): Promise<ProviderResult> {
    if (!this.transporter) return { success: false, error: 'SMTP not configured (missing SMTP_HOST/USER/PASS)' };

    try {
      const info = await this.transporter.sendMail({
        from: opts.from || this.fromDefault,
        to: opts.to,
        subject: opts.subject || '(no subject)',
        text: opts.text,
        html: opts.html,
        headers: opts.messageId ? { 'X-Client-Message-Id': opts.messageId } : undefined,
      });
      return { success: true, externalId: info.messageId, raw: info };
    } catch (err: any) {
      return { success: false, error: err?.message || 'SMTP send error' };
    }
  }
}

export default SMTPEmailProvider;