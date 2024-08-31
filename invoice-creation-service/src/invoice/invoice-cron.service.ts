import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvoiceService } from './invoice.service';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InvoiceCronService {
  private readonly logger = new Logger(InvoiceCronService.name);
  private client: ClientProxy;

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly configService: ConfigService,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBITMQ_URL')],
        queue: this.configService.get<string>('SALES_REPORT_QUEUE'),
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Running daily sales summary report generation');

    try {
      // Implement the logic to generate the daily sales summary report
      const report = await this.invoiceService.generateDailySalesSummary();
      this.logger.debug('Daily Sales Summary Report:', report);

      // Publish the report to RabbitMQ
      await this.client.emit('sales_summary', report).toPromise();
      this.logger.debug('Published sales summary report to RabbitMQ');
    } catch (error) {
      this.logger.error('Error during daily sales summary report generation or publishing:', error);
    }
  }
}