import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionMapper } from './mapper/transaction.mapper';
import { User } from '../users/entities/user.entity';
import { JWTUtil } from 'src/common/utils/jwtUtils';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User])],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionMapper, JWTUtil, JwtService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
