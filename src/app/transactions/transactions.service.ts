import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppError } from 'src/common/errors/AppError';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDTO } from './dto/transaction-response.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  @InjectRepository(Transaction)
  private readonly transactionRepository: Repository<Transaction>;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @InjectMapper()
  private readonly transactionMapper: Mapper;

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDTO> {
    try {
      const user = await this.userRepository.findOneBy({
        id: createTransactionDto.userId,
      });
      const transaction: Transaction = new Transaction();

      transaction.user = user;
      Object.assign(transaction, createTransactionDto);

      return await this.transactionMapper.mapAsync(
        await this.transactionRepository.save(transaction),
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
    const transaction = await this.transactionRepository.findOneBy({
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
    const transaction = await this.transactionRepository.findOneBy({
      id,
    });

    if (!transaction) {
      throw new AppError('Transaction Not Found!', HttpStatus.NOT_FOUND);
    }

    await this.transactionRepository.update(id, updateTransactionDto);

    return await this.transactionMapper.mapAsync(
      await this.transactionRepository.findOneBy({
        id,
      }),
      Transaction,
      TransactionResponseDTO,
    );
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.transactionRepository.findOneBy({
      id,
    });

    if (!transaction) {
      throw new AppError('Transaction Not Found!', HttpStatus.NOT_FOUND);
    }

    await this.transactionRepository.delete(id);
  }
}
