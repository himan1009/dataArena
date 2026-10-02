import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

@Injectable()
export class BrevoMailService {
  private readonly logger = new Logger(BrevoMailService.name);

  constructor(private readonly configService: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(
      this.configService.get<string>('BREVO_API_KEY') &&
        this.configService.get<string>('BREVO_SENDER_EMAIL'),
    );
  }

  async sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    const senderEmail = this.configService.get<string>('BREVO_SENDER_EMAIL');
    const senderName =
      this.configService.get<string>('BREVO_SENDER_NAME')?.trim() || 'DataArena';
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    if (!apiKey || !senderEmail) {
      const message =
        'Email service is not configured (BREVO_API_KEY / BREVO_SENDER_EMAIL).';
      this.logger.error(`${message} To: ${to} | ${subject}`);
      if (isProduction) {
        throw new ServiceUnavailableException(
          'Email could not be sent right now. Please try again later or contact support.',
        );
      }
      this.logger.warn('Skipping email send in non-production without Brevo config.');
      return;
    }

    let response: Response;
    try {
      response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
        signal: AbortSignal.timeout(15_000),
      });
    } catch (error) {
      this.logger.error(`Brevo request failed: ${String(error)}`);
      throw new ServiceUnavailableException(
        'Email could not be sent right now. Please try again in a few minutes.',
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.error(
        `Brevo API error ${response.status}: ${body.slice(0, 500)}`,
      );
      throw new InternalServerErrorException(
        'Email provider rejected the message. Check Brevo sender verification.',
      );
    }
  }

  getFrontendUrl(): string {
    return this.configService
      .get<string>('FRONTEND_URL', 'http://localhost:3000')
      .replace(/\/$/, '');
  }
}
