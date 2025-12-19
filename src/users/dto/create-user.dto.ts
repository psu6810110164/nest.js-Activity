import { UserRole } from '../entities/user.entity'; // [เชื่อมโยง 1.2] ดึง Enum มาใช้เพื่อให้ข้อมูล role ถูกต้องตาม Schema

export class CreateUserDto {
  // [อัปเดตจาก 1.2]: กำหนดให้รับ email เป็น String เพื่อใช้เป็นค่า Unique ใน Database
  email: string;

  // [อัปเดตจาก 1.2 & 1.3]: รับ Password แบบ Plain text จาก Client 
  // เพื่อส่งต่อไปให้ Service ทำการ Hash ด้วย bcrypt ในขั้นตอน 1.3
  password: string;

  // [อัปเดตจาก 1.2]: กำหนดสิทธิ์ผู้ใช้ โดยใช้ประเภทข้อมูลจาก UserRole Enum
  // ใส่ ? (Optional) เพื่อให้ระบบใช้ค่า Default (USER) หาก Client ไม่ส่งมา
  role?: UserRole;
}