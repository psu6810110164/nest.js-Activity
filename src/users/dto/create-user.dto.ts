import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  // [แก้ไข]: เพิ่ม @IsEmail เพื่อให้ ValidationPipe ยอมรับค่า email
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  email: string;

  // [แก้ไข]: เพิ่ม @IsString และกำหนดความยาวขั้นต่ำ
  @IsString()
  @MinLength(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' })
  password: string;

  // [แก้ไข]: เพิ่ม @IsEnum เพื่อตรวจสอบว่า role ตรงกับที่กำหนดใน Enum หรือไม่
  @IsEnum(UserRole, { message: 'ประเภทผู้ใช้งานไม่ถูกต้อง' })
  @IsOptional() // ใส่เพื่อให้ระบบใช้ค่า Default หาก Client ไม่ส่งมา
  role?: UserRole;
}