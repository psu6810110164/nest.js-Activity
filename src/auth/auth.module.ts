import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; 
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy'; // ตรวจสอบ Path ให้ตรงกับที่คุณสร้างไฟล์ไว้

@Module({
  imports: [
    UsersModule, 
    // PassportModule ช่วยให้ @UseGuards(AuthGuard('jwt')) ทำงานได้
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    
    // ตั้งค่า JwtModule แบบ Async เพื่อดึง Secret Key จาก .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallbackSecret', // แนะนำให้ตั้งใน .env
        signOptions: { expiresIn: '1d' }, // Token มีอายุ 1 วัน
      }),
    }),
  ],
  // ต้องใส่ JwtStrategy ใน providers เพื่อให้ NestJS ฉีด (Inject) ไปใช้ในระบบ Guard
  providers: [AuthService, JwtStrategy], 
  controllers: [AuthController], 
  exports: [AuthService, PassportModule, JwtModule], // Export ออกเพื่อให้ Module อื่น (เช่น Book) ใช้งานได้
})
export class AuthModule {}