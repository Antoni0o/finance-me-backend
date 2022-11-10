import { IsNotEmpty, IsString } from 'class-validator';

export class AmountResponseDTO {
  @IsString()
  @IsNotEmpty()
  income: string;

  @IsString()
  @IsNotEmpty()
  expense: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  constructor(income: string, expense: string, amount: string) {
    this.income = income;
    this.expense = expense;
    this.amount = amount;
  }
}
