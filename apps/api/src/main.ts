/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AllExceptionsFilter } from './common/helpers/all-exceptions-filter';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
    
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('SplitIt API Documentation')
    .setDescription(
      'The API is designed to manage accounts, owners, transactions, and currencies within a financial application. It follows RESTful principles, providing a clear and efficient way to interact with the underlying database.'
    )
    .setVersion('1.0')
    .addTag(globalPrefix)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
