import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // 1. ดึง Token จาก Header 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 2. [แก้ไข] เติม ! หลังการ get เพื่อยืนยันว่าค่านี้ไม่เป็น undefined แน่นอน
      secretOrKey: configService.get<string>('JWT_SECRET')!, 
    });
  }

  // 3. ข้อมูลที่แกะได้จาก Token จะถูกส่งมาที่นี่เพื่อเก็บไว้ใน request.user
  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role 
    };
  }
}