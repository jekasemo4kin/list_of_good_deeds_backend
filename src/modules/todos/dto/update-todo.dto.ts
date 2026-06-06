import { IsString, IsOptional, MinLength, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTodoDto {
  @ApiPropertyOptional({ description: 'Новое название дела' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Новое описание дела' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(1)
  description?: string;
}