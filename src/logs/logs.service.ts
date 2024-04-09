import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class LogsService implements LoggerService {
  private writeToStream(
    level: string,
    message: any,
    context?: string,
    trace?: string,
  ) {
    const timestamp = new Date().toISOString();
    let logEntry = `${timestamp} [${level}] ${
      context ? `[${context}]` : ''
    } - ${message}`;

    if (trace) {
      logEntry += `\n${trace}`;
    }
    process.stdout.write(logEntry + '\n');
  }

  log(message: any, context?: string) {
    this.writeToStream('LOG', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.writeToStream('ERROR', message, context, trace);
  }

  warn(message: any, context?: string) {
    this.writeToStream('WARN', message, context);
  }
}
