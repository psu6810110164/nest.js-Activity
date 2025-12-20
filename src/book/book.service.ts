import { Injectable, NotFoundException } from '@nestjs/common'; // นำเข้าเครื่องมือพื้นฐาน //
import { InjectRepository } from '@nestjs/typeorm'; // นำเข้าตัวเชื่อม Repository //
import { Repository } from 'typeorm'; // นำเข้า Repository Type //
import { Book } from './entities/book.entity'; // นำเข้า Entity Book //
import { CreateBookDto } from './dto/create-book.dto'; // นำเข้า DTO สร้าง //
import { UpdateBookDto } from './dto/update-book.dto'; // นำเข้า DTO แก้ไข //

@Injectable() // กำหนดให้เป็น Service //
export class BookService { // เริ่มต้นคลาส //
  constructor( // ฟังก์ชันสร้าง Object //
    @InjectRepository(Book) // ฉีด Repository //
    private readonly bookRepository: Repository<Book>, // สร้างตัวแปรจัดการฐานข้อมูล //
  ) { } // จบ constructor //

  create(createBookDto: CreateBookDto) { // ฟังก์ชันสร้างหนังสือ //
    return this.bookRepository.save(createBookDto); // บันทึกลงฐานข้อมูล //
  } // จบฟังก์ชัน //

  findAll() { // ฟังก์ชันหาทั้งหมด //
    return this.bookRepository.find({ relations: ['category'] }); // หาหนังสือพร้อมหมวดหมู่ //
  } // จบฟังก์ชัน //

  async findOne(id: string) { // ฟังก์ชันหาเล่มเดียว //
    const book = await this.bookRepository.findOne({ where: { id }, relations: ['category'] }); // ค้นหาตาม ID //
    if (!book) throw new NotFoundException('Book not found'); // ถ้าไม่เจอให้ฟ้อง Error //
    return book; // คืนค่าข้อมูล //
  } // จบฟังก์ชัน //

  async update(id: string, updateBookDto: UpdateBookDto) { // ฟังก์ชันแก้ไข //
    await this.findOne(id); // ตรวจสอบก่อนว่ามีของไหม //
    return this.bookRepository.update(id, updateBookDto); // อัปเดตข้อมูล //
  } // จบฟังก์ชัน //

  async remove(id: string) { // ฟังก์ชันลบ //
    await this.findOne(id); // ตรวจสอบก่อนลบ //
    return this.bookRepository.delete(id); // ลบออกจากฐานข้อมูล //
  } // จบฟังก์ชัน //

  async incrementLikes(id: string) { // ฟังก์ชัน Like แบบง่ายสำหรับ Phase 3 //
    const book = await this.findOne(id); // ค้นหาหนังสือที่ต้องการ Like //
    book.likeCount += 1; // เพิ่มตัวเลข Like ขึ้น 1 //
    return this.bookRepository.save(book); // บันทึกผล //
  } // จบฟังก์ชัน //
} // จบคลาส //