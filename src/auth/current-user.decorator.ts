import { createParamDecorator, ExecutionContext } from '@nestjs/common'; // นำเข้าเครื่องมือสร้าง Decorator จาก NestJS //

export const CurrentUser = createParamDecorator( // สร้าง Decorator ชื่อ CurrentUser //
  (data: unknown, ctx: ExecutionContext) => { // กำหนดโครงสร้างการทำงานของ Decorator //
    const request = ctx.switchToHttp().getRequest(); // ดึงข้อมูล Request ของ HTTP ออกมา //
    return request.user; // คืนค่าข้อมูล user ที่ถูกเก็บไว้ใน Request (จากขั้นตอนล็อกอิน) //
  }, // ปิดฟังก์ชันการทำงาน //
); // ปิดการสร้าง Decorator //