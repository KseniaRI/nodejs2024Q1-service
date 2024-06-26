import { ArgumentsHost, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogsService } from 'src/logs/logs.service';
import { CustomExceptionFilter } from './custom-exception.filter';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logsService: LogsService,
    private readonly exceptionFilter: CustomExceptionFilter,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, body, query } = request;
    const logMsg =
      `REQUEST: Method: ${method}, URL: ${originalUrl}` +
      `${
        Object.keys(body).length > 0 ? ', Body: ' + JSON.stringify(body) : ''
      }` +
      `${
        Object.keys(query).length > 0 ? ', Query: ' + JSON.stringify(query) : ''
      }`;

    this.logsService.log(logMsg, 'HTTP');

    response.on('finish', () => {
      const { statusCode } = response;
      this.logsService.log(
        `RESPONCE: Method: ${method}, URL: ${originalUrl}, Status: ${statusCode}`,
        'HTTP',
      );
    });

    response.on('error', (error) => {
      const host = {
        switchToHttp: () => ({
          getRequest: () => request,
          getResponse: () => response,
        }),
      } as ArgumentsHost;
      this.exceptionFilter.catch(error, host);
    });

    next();
  }
}
