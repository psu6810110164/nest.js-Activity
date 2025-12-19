import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // รวมกับ prefix จะเป็น /api/auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login') // เส้นทางคือ /api/auth/login
  async signIn(@Body() signInDto: Record<string, any>) {
    // ส่งข้อมูลไปให้ service ตรวจสอบ
    return this.authService.login(signInDto.email, signInDto.password);
  }
}