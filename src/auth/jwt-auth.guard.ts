import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {} // ใช้ Strategy ชื่อ 'jwt' ที่เราสร้างไว้