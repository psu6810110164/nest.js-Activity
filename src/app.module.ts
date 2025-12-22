import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { BookModule } from './book/book.module';
import { Book } from './book/entities/book.entity';
// เปลี่ยนจาก category เป็น book-category ให้ตรงกับโฟลเดอร์ในเครื่องคุณ
import { BookCategory } from './book-category/entities/book-category.entity'; 
import { BookCategoryModule } from './book-category/book-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Book, BookCategory], // ใช้ BookCategory ตรงนี้
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    BookModule,
    BookCategoryModule, // ใช้ BookCategoryModule ตรงนี้
  ],
})
export class AppModule {}