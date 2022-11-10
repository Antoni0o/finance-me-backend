import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AppError } from 'src/common/errors/AppError';
import { AuthGuard } from '@nestjs/passport';
import { JWTUtil } from 'src/common/utils/jwtUtils';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly jwtUtil: JWTUtil,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Headers('Authorization') auth: string,
  ) {
    try {
      const authDecoded = this.jwtUtil.decode(auth);

      return this.transactionsService.create(
        createTransactionDto,
        authDecoded.uuid,
      );
    } catch (e) {
      if (e instanceof AppError) {
        throw new HttpException(e.message, e.statusCode);
      }

      throw new HttpException(
        `Internal Server Error. Error: ${e.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    try {
      return this.transactionsService.findOne(id);
    } catch (e) {
      if (e instanceof AppError) {
        throw new HttpException(e.message, e.statusCode);
      }

      throw new HttpException(
        `Internal Server Error. Error: ${e.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    try {
      return this.transactionsService.update(id, updateTransactionDto);
    } catch (e) {
      if (e instanceof AppError) {
        throw new HttpException(e.message, e.statusCode);
      }

      throw new HttpException(
        `Internal Server Error. Error: ${e.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    try {
      return this.transactionsService.remove(id);
    } catch (e) {
      if (e instanceof AppError) {
        throw new HttpException(e.message, e.statusCode);
      }

      throw new HttpException(
        `Internal Server Error. Error: ${e.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
