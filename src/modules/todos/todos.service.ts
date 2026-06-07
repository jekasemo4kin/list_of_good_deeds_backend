import { Injectable, ForbiddenException, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { SearchTodoDto } from './dto/search-todo.dto';
import { TodoGateway } from '../gateway/todo.gateway';
import { CONSTANTS } from '../../constants';

@Injectable()
export class TodosService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => TodoGateway))
    private gateway: TodoGateway,
  ) {}

  async findAll(query: SearchTodoDto) {
    return this.prisma.todo.findMany({
      where: {
        title: { contains: query.title, mode: 'insensitive' },
        name: { contains: query.name, mode: 'insensitive' },
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(userId: string, username: string, dto: CreateTodoDto) {
    const todo = await this.prisma.todo.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        name: username,
        authorId: userId,
      },
    });
    this.gateway.notifyTodoUpdated('created', todo);
    return todo;
  }

  async update(id: string, userId: string, dto: UpdateTodoDto) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (todo?.authorId !== userId) throw new ForbiddenException();
    
    const updatedTodo = await this.prisma.todo.update({
      where: { id },
      data: {
        title: dto.title?.trim(),
        description: dto.description?.trim(),
      },
    });
    this.gateway.notifyTodoUpdated('updated', updatedTodo);
    return updatedTodo;
  }

  async delete(id: string, userId: string) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (todo?.authorId !== userId) throw new ForbiddenException();
    
    await this.prisma.todo.delete({ where: { id } });
    this.gateway.notifyTodoUpdated('deleted', { id });
    return { success: true };
  }
}