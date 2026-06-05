import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { SearchTodoDto } from './dto/search-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: SearchTodoDto) {
    const title = query.title?.trim();
    const name = query.name?.trim();

    return this.prisma.todo.findMany({
      where: {
        AND: [
          title ? { title: { contains: title, mode: 'insensitive' } } : {},
          name ? { name: { contains: name, mode: 'insensitive' } } : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, username: string, dto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        name: username,
        authorId: userId,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateTodoDto) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (todo?.authorId !== userId) throw new ForbiddenException();
    
    return this.prisma.todo.update({
      where: { id },
      data: {
        title: dto.title?.trim(),
        description: dto.description?.trim(),
      },
    });
  }

  async delete(id: string, userId: string) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (todo?.authorId !== userId) throw new ForbiddenException();
    
    return this.prisma.todo.delete({ where: { id } });
  }
}