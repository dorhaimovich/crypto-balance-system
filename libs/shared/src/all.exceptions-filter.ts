import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggerService } from '../../../libs/shared/src/logger/logger.service';
import { ExceptionsResponseObject } from './interfaces';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new LoggerService();

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseObject: ExceptionsResponseObject = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      response: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      responseObject.statusCode = exception.getStatus();
      responseObject.response = exception.getResponse();
    }

    response.status(responseObject.statusCode).json(responseObject);
    this.logger.error(responseObject.response, exception.name);
    super.catch(exception, host);
  }
}
