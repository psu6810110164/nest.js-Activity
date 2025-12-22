import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common'; // [!] เพิ่ม UseGuards
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // [!] นำเข้ายามจากโฟลเดอร์ auth

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. เปิดให้คนทั่วไปเข้าถึงได้ (เพื่อสมัครสมาชิก)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 2. ล็อกประตู: ต้องมี Token เท่านั้นถึงจะดูรายชื่อทั้งหมดได้
  @UseGuards(JwtAuthGuard) 
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 3. ล็อกประตู: ต้องมี Token เท่านั้นถึงจะดูข้อมูลรายคนได้
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // 4. ล็อกประตู: ต้องมี Token เท่านั้นถึงจะลบ User ได้
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}