import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'; // นำเข้าเครื่องมือสร้าง Guard //
import { Reflector } from '@nestjs/core'; // นำเข้า Reflector เพื่ออ่าน Metadata //
import { UserRole } from '../users/entities/user.entity'; // นำเข้าประเภทผู้ใช้งาน //
import { ROLES_KEY } from './roles.decorator'; // นำเข้า KEY เพื่อให้รู้จัก ROLES_KEY //

@Injectable() // กำหนดให้เป็นคลาสที่ฉีดใช้งานได้ //
export class RolesGuard implements CanActivate { // เริ่มต้นคลาส RolesGuard //
  constructor(private reflector: Reflector) {} // ฉีด Reflector เข้ามาใช้งาน //

  canActivate(context: ExecutionContext): boolean { // ฟังก์ชันหลักในการตรวจสิทธิ์ //
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [ // ใช้ ROLES_KEY ที่นำเข้ามาตรวจสอบ //
      context.getHandler(), // ตรวจระดับฟังก์ชัน //
      context.getClass(), // ตรวจระดับคลาส //
    ]); // จบการดึงค่า //

    if (!requiredRoles) { // ถ้าไม่ได้กำหนดสิทธิ์ไว้ //
      return true; // ให้ผ่านได้เลย //
    } // จบเงื่อนไข //

    const { user } = context.switchToHttp().getRequest(); // ดึงข้อมูล user ออกจาก Request //
    return requiredRoles.some((role) => user.role === role); // เช็คว่าสิทธิ์ตรงกันไหม //
  } // จบฟังก์ชัน //
} // จบคลาส //