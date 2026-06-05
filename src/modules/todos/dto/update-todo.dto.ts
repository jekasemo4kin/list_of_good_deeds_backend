import { IsString, IsOptional, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(1)
  description?: string;
}