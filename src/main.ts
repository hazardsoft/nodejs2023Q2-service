import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { generateApiDocs } from './docsGenerator';
import { LoggingService } from './logger/logging.service';
import { RequestInterceptor } from './request.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  });
  SwaggerModule.setup('doc', app, document);

  if (Boolean(process.env.GEN_DOCS) === true) {
    await generateApiDocs(document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const logger = app.get(LoggingService);
  app.useLogger(logger);
  app.useGlobalInterceptors(app.get(RequestInterceptor));

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);

  process.on('uncaughtException', (error: Error, origin: string) => {
    logger.error(
      `Uncaught exception: ${JSON.stringify(error)}, origin: ${origin}`,
      LoggingService.name,
    );
    process.exit(1);
  });
  process.on(
    'unhandledRejection',
    (reason: Error | unknown, promise: Promise<unknown>) => {
      logger.error(
        `Unhandled rejection, promise: ${JSON.stringify(
          promise,
        )}, reason: ${reason}`,
        LoggingService.name,
      );
    },
  );
  process.on('exit', () => {
    logger.warn('application exited!');
  });
}
bootstrap();
