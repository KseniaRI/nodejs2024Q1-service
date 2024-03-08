import { NestFactory } from '@nestjs/core';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as yamljs from 'yamljs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document: OpenAPIObject = yamljs.load('./doc/api.yaml');
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
