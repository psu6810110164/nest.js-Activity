import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // // เชื่อมต่อ Entity กับ Module
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // // [เพิ่ม] ต้องส่งออก Service นี้ เพื่อให้ AuthModule เรียกใช้งานได้ [cite: 126]
})
export class UsersModule {}