import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; 
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'; // [เพิ่ม] เพื่อรองรับระบบ Passport
import { JwtStrategy } from './jwt.strategy'; // [เพิ่ม] นำเข้า Strategy ที่สร้างไว้

@Module({
  imports: [
    UsersModule, 
    PassportModule, // [เพิ่ม] ลงทะเบียนเพื่อให้ Guard ใช้งานได้
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  // [แก้ไข] เพิ่ม JwtStrategy เข้าไปใน providers เพื่อให้ NestJS ใช้งานได้
  providers: [AuthService, JwtStrategy], 
  controllers: [AuthController], 
  exports: [AuthService],
})
export class AuthModule {}