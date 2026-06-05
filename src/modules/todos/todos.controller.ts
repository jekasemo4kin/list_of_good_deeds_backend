import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { SearchTodoDto } from './dto/search-todo.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { type Request } from 'express';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  async findAll(@Query() query: SearchTodoDto) {
    return this.todosService.findAll(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: Request, @Body() dto: CreateTodoDto) {
    const user = (req as any).user;
    return this.todosService.create(user.sub, user.username, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Req() req: Request, @Body() dto: UpdateTodoDto) {
    return this.todosService.update(id, (req as any).user.sub, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Req() req: Request) {
    return this.todosService.delete(id, (req as any).user.sub);
  }
}