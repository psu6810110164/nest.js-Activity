import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'; // นำเข้าเครื่องมือจัดการ Route และ Guard จาก NestJS //
import { BookService } from './book.service'; // นำเข้า BookService เพื่อเรียกใช้ฟังก์ชันจัดการข้อมูลหนังสือ //
import { CreateBookDto } from './dto/create-book.dto'; // นำเข้า DTO สำหรับการตรวจสอบข้อมูลตอนสร้างหนังสือ //
import { UpdateBookDto } from './dto/update-book.dto'; // นำเข้า DTO สำหรับการตรวจสอบข้อมูลตอนแก้ไขหนังสือ //
import { AuthGuard } from '@nestjs/passport'; // นำเข้ายามสำหรับตรวจสอบ JWT Token (การล็อกอิน) //
import { RolesGuard } from '../auth/roles.guard'; // นำเข้ายามสำหรับตรวจสอบระดับสิทธิ์ (Role) ของผู้ใช้ //
import { Roles } from '../auth/roles.decorator'; // นำเข้า Decorator สำหรับระบุสิทธิ์ที่ต้องการในแต่ละ API //
import { UserRole } from '../users/entities/user.entity'; // นำเข้าค่าคงที่ UserRole (ADMIN/USER) มาใช้งาน //
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('book') // กำหนดเส้นทางหลักของ API นี้เป็น /api/book //
export class BookController { // เริ่มต้นประกาศคลาส BookController //
  constructor(private readonly bookService: BookService) { } // เชื่อมต่อ BookService เข้ามาใช้งานภายในคลาส //

  @UseGuards(AuthGuard('jwt'), RolesGuard) // กำหนดว่าต้องล็อกอินและต้องมีการตรวจสอบสิทธิ์ (Role) //
  @Roles(UserRole.ADMIN) // ระบุว่าเฉพาะผู้ใช้ที่มีสิทธิ์เป็น ADMIN เท่านั้นถึงจะเข้าถึงฟังก์ชันนี้ได้ //
  @Post() // กำหนด Method POST สำหรับการเพิ่มข้อมูลหนังสือใหม่ //
  create(@Body() createBookDto: CreateBookDto) { // ฟังก์ชันรับข้อมูลจาก Body เพื่อสร้างหนังสือ //
    return this.bookService.create(createBookDto); // ส่งข้อมูลไปให้ Service ทำการบันทึกลงฐานข้อมูล //
  } // ปิดฟังก์ชัน create //

  @Get() // ใครก็เข้าถึงได้ (Public) เพื่อดึงรายการหนังสือทั้งหมด //
  findAll() { // ฟังก์ชันดึงข้อมูลหนังสือทั้งหมด //
    return this.bookService.findAll(); // เรียกใช้ Service เพื่อหาหนังสือทุกเล่มในระบบ //
  } // ปิดฟังก์ชัน findAll //

  @Get(':id') // ใครก็เข้าถึงได้ (Public) เพื่อดูรายละเอียดหนังสือรายเล่ม //
  findOne(@Param('id') id: string) { // ฟังก์ชันรับ ID จาก URL เพื่อค้นหาหนังสือ //
    return this.bookService.findOne(id); // เรียกใช้ Service เพื่อค้นหาหนังสือตาม ID ที่ระบุ //
  } // ปิดฟังก์ชัน findOne //

  @UseGuards(AuthGuard('jwt'), RolesGuard) // ต้องมีการล็อกอินและผ่านการตรวจสอบสิทธิ์ //
  @Roles(UserRole.ADMIN) // จำกัดสิทธิ์ให้เฉพาะผู้ดูแลระบบ (ADMIN) เท่านั้นที่แก้ไขข้อมูลได้ //
  @Patch(':id') // กำหนด Method PATCH สำหรับการอัปเดตข้อมูลหนังสือ //
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) { // รับ ID จาก URL และข้อมูลใหม่จาก Body //
    return this.bookService.update(id, updateBookDto); // เรียกใช้ Service เพื่อทำการแก้ไขข้อมูล //
  } // ปิดฟังก์ชัน update //

  @UseGuards(AuthGuard('jwt')) // ต้อง Login ก่อนถึงจะ Like ได้ (ทั้ง Admin/User)
@Patch(':id/like')
async toggleLike(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookService.toggleLike(id, user.userId);
}

  @UseGuards(AuthGuard('jwt'), RolesGuard) // ต้องมีการล็อกอินและตรวจสอบระดับสิทธิ์ก่อนใช้งาน //
  @Roles(UserRole.ADMIN) // บังคับว่าต้องเป็น ADMIN เท่านั้นถึงจะมีสิทธิ์ลบหนังสือออก //
  @Delete(':id') // กำหนด Method DELETE สำหรับการลบข้อมูลหนังสือตาม ID //
  remove(@Param('id') id: string) { // ฟังก์ชันรับ ID ของหนังสือที่ต้องการลบ //
    return this.bookService.remove(id); // เรียกใช้ Service เพื่อลบข้อมูลออกจากฐานข้อมูล //
  } // ปิดฟังก์ชัน remove //
} // ปิดคลาส BookController //