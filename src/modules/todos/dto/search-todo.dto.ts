import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchTodoDto {
  @ApiPropertyOptional({ description: 'Фильтр по названию' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Фильтр по имени автора' })
  @IsString()
  @IsOptional()
  name?: string;
}