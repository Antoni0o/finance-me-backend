import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  app.enableCors();

  const configDocs = new DocumentBuilder()
    .setTitle('FinanceMe API')
    .setDescription('The FinanceMe API Docs')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, configDocs);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(port, () => {
    console.log('[RUNNING]', config.get<string>('BASE_URL'));
  });
}
bootstrap();
