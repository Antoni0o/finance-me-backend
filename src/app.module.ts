import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { getEnvPath } from './common/helpers/env.helper';
import { TypeOrmConfigService } from './common/typeorm/typeorm.service';
import { TransactionsModule } from './app/transactions/transactions.module';
import { AmountsModule } from './app/amounts/amounts.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    UsersModule,
    AuthModule,
    TransactionsModule,
    AmountsModule,
  ],
})
export class AppModule {}
