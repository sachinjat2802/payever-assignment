import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceModule } from './invoice/invoice.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // Import the ScheduleModule to enable the scheduling of tasks
    ScheduleModule.forRoot(),
    // Import the ConfigModule to load the environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Import the MongooseModule to connect to the MongoDB database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    // Import the InvoiceModule
    InvoiceModule,
  ],
})
export class AppModule {}
