import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // ตั้งค่า Prefix ให้ทุก API ต้องขึ้นต้นด้วย /api (เช่น /api/users)
  app.setGlobalPrefix('api');

  // ดึง Port จาก .env ถ้าไม่มีให้ใช้ 3000
  const port = configService.get<number>('APP_PORT') || 3000;

  await app.listen(port);
  console.log(`-------------------------------------------------------`);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📊 Database connected to Port: ${configService.get('DB_PORT')}`);
  console.log(`-------------------------------------------------------`);
}
bootstrap();