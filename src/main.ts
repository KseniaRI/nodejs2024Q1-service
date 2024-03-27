import { NestFactory } from '@nestjs/core';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as yamljs from 'yamljs';
import * as dotenv from 'dotenv';
import { LogsService } from './logs/logs.service';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(LogsService));

  // const app = await NestFactory.create(AppModule);
  // const logger = new LogsService();
  // app.useLogger(logger);

  const document: OpenAPIObject = yamljs.load('./doc/api.yaml');
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
