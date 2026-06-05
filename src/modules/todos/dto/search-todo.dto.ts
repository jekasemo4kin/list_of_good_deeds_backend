import { IsString, IsOptional } from 'class-validator';

export class SearchTodoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  name?: string;
}