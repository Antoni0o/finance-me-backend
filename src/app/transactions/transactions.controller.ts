import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AppError } from 'src/common/errors/AppError';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      return this.transactionsService.create(createTransactionDto);
    } catch (e) {
      if (e instanceof AppError) {
        throw new HttpException(e.message, e.statusCode);
      }

      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.transactionsService.findOne(id);
    } catch (e) {
      if (e instanceof AppError) {
        throw new HttpException(e.message, e.statusCode);
      }

      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    try {
      return this.transactionsService.update(id, updateTransactionDto);
    } catch (e) {
      if (e instanceof AppError) {
        throw new HttpException(e.message, e.statusCode);
      }

      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.transactionsService.remove(id);
    } catch (e) {
      if (e instanceof AppError) {
        throw new HttpException(e.message, e.statusCode);
      }

      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
