import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppError } from 'src/common/errors/AppError';
import { AmountsService } from './amounts.service';

@Controller('amounts')
export class AmountsController {
  constructor(private readonly amountsService: AmountsService) {}

  @Get()
  getAllAmounts(@Body() userId: string) {
    try {
      return this.amountsService.calcAllAmounts(userId);
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
