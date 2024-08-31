// src/sales-report-notification/sales-report-notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MockEmailService } from 'src/mock-email.service';

@Injectable()
export class SalesReportNotificationController {
  private readonly logger = new Logger(SalesReportNotificationController.name);

  constructor(private readonly emailService: MockEmailService) {}

  @EventPattern('sales_summary')
  async handleSalesSummary(@Payload() message: any) {
    this.logger.debug('Received sales summary report:', message);
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'recipient-email@gmail.com',
      subject: 'Daily Sales Summary Report',
      text: `Sales Summary Report: ${JSON.stringify(message)}`,
    };

    try {
      await this.emailService.sendMail(mailOptions);
      this.logger.debug('Email sent successfully');
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }
}
