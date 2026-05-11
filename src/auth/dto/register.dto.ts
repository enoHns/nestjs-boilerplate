import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'John' })
  name?: string;

  @IsEmail()
  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'password123', minLength: 8 })
  password: string;
}
