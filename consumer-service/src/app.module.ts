import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SalesReportNotificationController } from './sales-report-notification/sales-report-notification.controller';
import { MockEmailService } from './mock-email.service';
@Module({
  imports: [
    // Import the ConfigModule to load the environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [SalesReportNotificationController],
  providers: [MockEmailService],
})
export class AppModule {}
