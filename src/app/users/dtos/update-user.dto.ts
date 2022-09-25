import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @Length(2, 32)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
