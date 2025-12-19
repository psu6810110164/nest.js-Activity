import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 1.3: สร้าง Admin อัตโนมัติเมื่อเริ่มระบบ
  async onModuleInit() {
    const adminEmail = 'admin@bookstore.com';
    const admin = await this.findOneByEmail(adminEmail);
    if (!admin) {
      console.log('Seeding Admin User...');
      await this.create({
        email: adminEmail,
        password: 'adminpassword',
        role: UserRole.ADMIN
      });
    }
  }

  // 1.3: เข้ารหัสผ่านก่อนบันทึก
  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    
    const user = this.userRepository.create({ 
      ...createUserDto, 
      password: hashedPassword 
    });
    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  // เพิ่ม Method เหล่านี้เพื่อแก้ Error ใน Controller
  async findAll() { return this.userRepository.find(); }
  async findOne(id: string) { return this.userRepository.findOneBy({ id }); }
  async remove(id: string) { return this.userRepository.delete(id); }
}