import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONSTANTS } from './constants';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({         // Важно для фронтенда
    origin: CONSTANTS.NETWORK.FRONTEND_URL,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(CONSTANTS.NETWORK.PORT);
}
bootstrap();
