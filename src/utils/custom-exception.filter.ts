import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LogsService } from 'src/logs/logs.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly logsService: LogsService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const logMessage = `Error occurred: ${exception.message}`;
    this.logsService.error(logMessage, undefined, 'HTTP');

    response.status(status).json();
  }
}
