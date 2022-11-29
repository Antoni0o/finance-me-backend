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
  HttpCode,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AppError } from '../../common/errors/AppError';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dtos/user-response.dto';
import { BadRequestSwaggerReturn } from '../../common/helpers/bad-request.swagger';
import { InternalServerErrorSwaggerReturn } from '../../common/helpers/internal-server-error.swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create an User',
  })
  @ApiResponse({
    status: 200,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot create User. Invalid Params',
    type: BadRequestSwaggerReturn,
  })
  @ApiResponse({
    status: 500,
    description: 'Cannot create User. Internal Server Error',
    type: InternalServerErrorSwaggerReturn,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
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

  @ApiOperation({
    summary: 'List all Users',
  })
  @ApiResponse({
    status: 200,
    description: 'All Users found successfully',
    type: UserResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Users not found. Internal Server Error',
    type: InternalServerErrorSwaggerReturn,
  })
  @Get()
  async findAll() {
    try {
      return await this.usersService.findAll();
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

  @ApiOperation({
    summary: 'List one User',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User not found. Invalid Param(id)',
    type: BadRequestSwaggerReturn,
  })
  @ApiResponse({
    status: 500,
    description: 'User not found. Internal Server Error',
    type: InternalServerErrorSwaggerReturn,
  })
  @Get(':id')
  async findOneById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.usersService.findOneById(id);
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

  @ApiOperation({
    summary: 'Update an User',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot update user. Invalid Params',
    type: BadRequestSwaggerReturn,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 500,
    description: 'Cannot update user. Internal Server Error',
    type: InternalServerErrorSwaggerReturn,
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.usersService.update(id, updateUserDto);
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

  @ApiOperation({
    summary: 'Delete an User',
  })
  @ApiResponse({ status: 201, description: 'User deleted successfully' })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 500,
    description: 'Cannot delete user. Internal Server Error',
    type: InternalServerErrorSwaggerReturn,
  })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.usersService.remove(id);
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
