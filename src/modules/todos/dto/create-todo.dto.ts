import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({ description: 'Название дела' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Описание дела' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  description!: string;
}