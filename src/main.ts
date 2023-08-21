import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { generateApiDocs } from './docsGenerator';
import { PrismaExceptionFilter } from './db/filters/prisma.client.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .addServer('/')
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

  const httpAdapter = app.getHttpAdapter();
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));

  await app.listen(port);

  process.on('exit', () => {
    console.warn('application exited!');
  });
}
bootstrap();
