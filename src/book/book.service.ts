import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findAll() {
    return await this.bookRepository.find({ relations: ['likedBy'] });
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOne({ 
      where: { id },
      relations: ['likedBy'] 
    });
    if (!book) throw new NotFoundException(`Book #${id} not found`);
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    await this.bookRepository.update(id, updateBookDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const book = await this.findOne(id);
    return await this.bookRepository.remove(book);
  }

  async toggleLike(bookId: string, userId: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['likedBy'], 
    });

    if (!book) throw new NotFoundException(`Book not found`);

    if (!book.likedBy) book.likedBy = [];

    const userIndex = book.likedBy.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
      book.likedBy.splice(userIndex, 1);
    } else {
      book.likedBy.push({ id: userId } as User);
    }

    return await this.bookRepository.save(book);
  }
}