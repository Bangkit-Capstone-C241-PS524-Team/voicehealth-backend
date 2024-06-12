import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  Logger.log(`Application is running on: http://0.0.0.0:${port}`, 'Bootstrap');
}
bootstrap();
