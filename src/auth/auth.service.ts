import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // ตัวนี้จะหายแดงหลังจากรัน npm install

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    // ตรวจสอบรหัสผ่านที่ถูก Hash ไว้
    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = { sub: user.id, email: user.email, role: user.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }
}