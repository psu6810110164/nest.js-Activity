import { SetMetadata } from '@nestjs/common'; // นำเข้าฟังก์ชันสำหรับตั้งค่า Metadata ให้กับโค้ด //
import { UserRole } from '../users/entities/user.entity'; // นำเข้า Enum UserRole (ADMIN, USER) มาใช้งาน //

export const ROLES_KEY = 'roles'; // กำหนดชื่อคีย์สำหรับเก็บข้อมูลสิทธิ์ที่จะใช้ตรวจสอบ //
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles); // สร้าง Decorator ชื่อ Roles เพื่อรับรายการสิทธิ์ที่ต้องการ //