import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { Transaction } from 'src/app/transactions/entities/transaction.entity';

export class UserResponseDto {
  @ApiProperty()
  @AutoMap()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @AutoMap()
  @IsString()
  @Length(2, 32)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @AutoMap()
  @IsEmail()
  @Length(6, 255)
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @AutoMap()
  @IsDateString()
  @IsNotEmpty()
  updatedAt: Date;

  @ApiProperty()
  @AutoMap()
  @IsDateString()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty()
  @AutoMap()
  transactions?: Transaction[];
}
