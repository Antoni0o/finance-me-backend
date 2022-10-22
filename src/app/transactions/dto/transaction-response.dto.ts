import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { TransactionType } from "../entities/transaction.entity";

export class TransactionResponseDTO {
  @ApiProperty()
  @AutoMap()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  type: TransactionType;

  @ApiProperty()
  @AutoMap()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

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
}