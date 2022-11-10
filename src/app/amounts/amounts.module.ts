import { Module } from '@nestjs/common';
import { AmountsService } from './amounts.service';
import { AmountsController } from './amounts.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AmountsController],
  providers: [AmountsService],
})
export class AmountsModule {}
