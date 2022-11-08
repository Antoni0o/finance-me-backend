import { HttpStatus, Injectable } from '@nestjs/common';
import { AppError } from 'src/common/errors/AppError';
import { UsersService } from '../users/users.service';
import { AmountResponseDTO } from './dto/amount-response.dto';

@Injectable()
export class AmountsService {
  constructor(private readonly usersService: UsersService) {}

  async calcAllAmounts(userId: string): Promise<AmountResponseDTO> {
    let expenses: number;
    let incomes: number;
    let amount: number;
    const user = await this.usersService.findOneById(userId);

    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    user.transactions.map((transaction) => {
      if (transaction.type === 'income') {
        incomes += Number(transaction.amount);
      }

      if (transaction.type === 'expense') {
        expenses += Number(transaction.amount);
      }
    });

    amount = incomes - expenses;

    return new AmountResponseDTO(
      String(incomes),
      String(expenses),
      amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    );
  }
}
