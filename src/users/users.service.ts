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
  ) { }

  async onModuleInit() {
    // Auto-create Admin user for testing
    const admin = await this.findOneByEmail('admin@bookstore.com');
    if (!admin) {
      console.log('Seeding Admin User...');
      await this.create({
        email: 'admin@bookstore.com',
        password: 'adminpassword',
        role: UserRole.ADMIN
      } as any);
    }
  }


  async create(createUserDto: CreateUserDto) {
    // Hashing Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword
    });
    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    });
  }



  // เพิ่ม Method เหล่านี้เพื่อแก้ Error ใน Controller
  async findAll() { return this.userRepository.find(); }
  async findOne(id: string) { return this.userRepository.findOneBy({ id }); }
  async remove(id: string) { return this.userRepository.delete(id); }
}