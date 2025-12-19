import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCategoryModule } from './book-category/book-category.module';
import { BookCategory } from './book-category/entities/book-category.entity';
import { BookModule } from './book/book.module';
import { Book } from './book/entities/book.entity';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
    }),


    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],      // บอกว่า Module นี้ต้องใช้ ConfigModule
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'), // ใช้ ConfigService ดึงค่า แทน process.env
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],      // Inject ConfigService เข้ามาใน Factory
    }),
    
    BookCategoryModule,
    BookModule,
    UsersModule,
  ],
})
export class AppModule { }