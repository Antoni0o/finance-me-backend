import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppError } from 'src/common/errors/AppError';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDTO } from './dto/transaction-response.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  @InjectRepository(Transaction)
  private readonly repository: Repository<Transaction>;

  @InjectMapper()
  private readonly transactionMapper: Mapper;

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDTO> {
    try {
      const transaction: Transaction = new Transaction();

      Object.assign(transaction, createTransactionDto);

      return await this.transactionMapper.mapAsync(
        await this.repository.save(transaction),
        Transaction,
        TransactionResponseDTO,
      );
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new AppError(
          `Error while creating transaction: ${e.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findOne(id: string): Promise<TransactionResponseDTO> {
    const transaction = await this.repository.findOneBy({
      id,
    });

    if (!transaction) {
      throw new AppError('Transaction Not Found!', HttpStatus.NOT_FOUND);
    }

    return await this.transactionMapper.mapAsync(
      transaction,
      Transaction,
      TransactionResponseDTO,
    );
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDTO> {
    const transaction = await this.repository.findOneBy({
      id,
    });

    if (!transaction) {
      throw new AppError('Transaction Not Found!', HttpStatus.NOT_FOUND);
    }

    await this.repository.update(id, updateTransactionDto);

    return await this.transactionMapper.mapAsync(
      await this.repository.findOneBy({
        id,
      }),
      Transaction,
      TransactionResponseDTO,
    );
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.repository.findOneBy({
      id,
    });

    if (!transaction) {
      throw new AppError('Transaction Not Found!', HttpStatus.NOT_FOUND);
    }

    await this.repository.delete(id);
  }
}
