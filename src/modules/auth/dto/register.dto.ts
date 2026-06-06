import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Желаемое имя пользователя' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ description: 'Пароль (мин 1 символов)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  password!: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword!: string;
}