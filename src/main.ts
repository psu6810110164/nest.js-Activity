import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.setGlobalPrefix('api');

  // เปิดใช้งาน ValidationPipe เพื่อรองรับ @IsString, @IsNumber ใน DTO
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = configService.get<number>('APP_PORT') || 3000;
  await app.listen(port);
  
  console.log(`-------------------------------------------------------`);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📊 Database connected to Port: ${configService.get('DB_PORT')}`);
  console.log(`✅ ValidationPipe is enabled for Phase 4`);
  console.log(`-------------------------------------------------------`);
}
bootstrap();