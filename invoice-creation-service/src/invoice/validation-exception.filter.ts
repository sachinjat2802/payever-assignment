import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    let errorMessages = exceptionResponse.message;
    if (Array.isArray(errorMessages)) {
      errorMessages = errorMessages.map((error: ValidationError) => ({
        property: error.property,
        constraints: error.constraints,
      }));
    }

    this.logger.error(`Validation failed: ${JSON.stringify(errorMessages)}`);

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: 'Bad Request',
        message: errorMessages,
      });
  }
}