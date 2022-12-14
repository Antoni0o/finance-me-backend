import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppError } from 'src/common/errors/AppError';
import { AmountsService } from './amounts.service';

@Controller('amounts')
export class AmountsController {
  constructor(private readonly amountsService: AmountsService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getAllAmounts(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.amountsService.calcAllAmounts(id);
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
