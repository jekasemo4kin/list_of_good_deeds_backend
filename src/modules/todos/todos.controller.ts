import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { SearchTodoDto } from './dto/search-todo.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { type Request } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @ApiOperation({ summary: 'Получить все дела' })
  @Get()
  async findAll(@Query() query: SearchTodoDto) {
    return this.todosService.findAll(query);
  }

  @ApiOperation({ summary: 'Создать новое дело' })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: Request, @Body() dto: CreateTodoDto) {
    const user = req.user!;
    return this.todosService.create(user.sub, user.username, dto);
  }

  @ApiOperation({ summary: 'Обновить дело' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Req() req: Request, @Body() dto: UpdateTodoDto) {
    return this.todosService.update(id, req.user!.sub, dto);
  }

  @ApiOperation({ summary: 'Удалить дело' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Req() req: Request) {
    return this.todosService.delete(id, req.user!.sub);
  }
}