import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe,BadRequestException } from '@nestjs/common';
import { ValidationExceptionFilter } from './invoice/validation-exception.filter';
import { ValidationError } from 'class-validator';

/**
 * The bootstrap function is the entry point of the NestJS application.
 * It creates an instance of the NestJS application using the AppModule
 * and starts listening for incoming HTTP requests on port 3000.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors: ValidationError[]) => {
      return new BadRequestException(errors);
    },
  }));
  app.useGlobalFilters(new ValidationExceptionFilter());
  await app.listen(3000);
}
bootstrap();
