import { HttpStatus, Injectable } from '@nestjs/common';
import { AppError } from 'src/common/errors/AppError';
import { UsersService } from '../users/users.service';
import { AmountResponseDTO } from './dto/amount-response.dto';

@Injectable()
export class AmountsService {
  constructor(private readonly usersService: UsersService) {}

  async calcAllAmounts(userId: string): Promise<AmountResponseDTO> {
    let expenses = 0;
    let incomes = 0;

    const user = await this.usersService.findOneById(userId);

    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    user.transactions.map((transaction) => {
      if (transaction.type == 'income') {
        incomes += transaction.amount;
      }

      if (transaction.type == 'expense') {
        expenses += transaction.amount;
      }
    });

    const amount = incomes - expenses;

    return new AmountResponseDTO(
      incomes.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      expenses.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    );
  }
}
