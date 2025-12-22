import { Injectable, NotFoundException } from '@nestjs/common'; // นำเข้าเครื่องมือพื้นฐาน //
import { InjectRepository } from '@nestjs/typeorm'; // นำเข้าตัวเชื่อม Repository //
import { Repository } from 'typeorm'; // นำเข้า Repository Type //
import { Book } from './entities/book.entity'; // นำเข้า Entity Book //
import { CreateBookDto } from './dto/create-book.dto'; // นำเข้า DTO สร้าง //
import { UpdateBookDto } from './dto/update-book.dto'; // นำเข้า DTO แก้ไข //
import { User } from '../users/entities/user.entity';

@Injectable() // กำหนดให้เป็น Service //
export class BookService { // เริ่มต้นคลาส //
  constructor( // ฟังก์ชันสร้าง Object //
    @InjectRepository(Book) // ฉีด Repository //
    private readonly bookRepository: Repository<Book>, // สร้างตัวแปรจัดการฐานข้อมูล //

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  create(createBookDto: CreateBookDto) { // ฟังก์ชันสร้างหนังสือ //
    return this.bookRepository.save(createBookDto); // บันทึกลงฐานข้อมูล //
  }

  findAll() { // ฟังก์ชันหาทั้งหมด //
    return this.bookRepository.find({ relations: ['category'] }); // หาหนังสือพร้อมหมวดหมู่ //
  }

  async findOne(id: string) { // ฟังก์ชันหาเล่มเดียว //
    const book = await this.bookRepository.findOne({ where: { id }, relations: ['category'] }); // ค้นหาตาม ID //
    if (!book) throw new NotFoundException('Book not found'); // ถ้าไม่เจอให้ฟ้อง Error //
    return book; // คืนค่าข้อมูล //
  }
  async update(id: string, updateBookDto: UpdateBookDto) { // ฟังก์ชันแก้ไข //
    await this.findOne(id); // ตรวจสอบก่อนว่ามีของไหม //
    return this.bookRepository.update(id, updateBookDto); // อัปเดตข้อมูล //
  }

  async remove(id: string) { // ฟังก์ชันลบ //
    await this.findOne(id); // ตรวจสอบก่อนลบ //
    return this.bookRepository.delete(id); // ลบออกจากฐานข้อมูล //
  }

  async toggleLike(bookId: string, userId: string) {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['likedBy'],
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const alreadyLiked = book.likedBy.some(
      (user) => user.id === userId,
    );

    if (alreadyLiked) {
      // 👉 Unlike
      book.likedBy = book.likedBy.filter(
        (user) => user.id !== userId,
      );
    } else {
      // 👉 Like
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      book.likedBy.push(user);
    }

    await this.bookRepository.save(book);

    return {
      bookId: book.id,
      likeCount: book.likedBy.length,
      liked: !alreadyLiked,
    };
  }

}