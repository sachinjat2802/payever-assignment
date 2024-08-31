import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MockEmailService {
  private readonly logger = new Logger(MockEmailService.name);

  async sendMail(mailOptions: any): Promise<void> {
    this.logger.debug('Mock email sent:', mailOptions);
    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
