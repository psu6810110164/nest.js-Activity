import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // ดึง Token จาก Header ที่ชื่อว่า Bearer ...
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ใส่ Secret Key ให้ตรงกับที่คุณใช้ใน AuthModule
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key', 
    });
  }

  // ฟังก์ชันนี้สำคัญมาก! สิ่งที่ return ออกไป จะไปปรากฏใน req.user
  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role // ดึง role ออกมาเพื่อให้ Guard ใช้งานได้
    };
  }
}