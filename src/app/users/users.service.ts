import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppError } from '../../common/errors/AppError';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  @InjectMapper()
  private readonly userMapper: Mapper;

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user: User = new User();

      Object.assign(user, createUserDto);

      return await this.userMapper.mapAsync(
        await this.repository.save(user),
        User,
        UserResponseDto,
      );
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new AppError(
          'The E-mail is Already Used',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(): Promise<Array<UserResponseDto>> {
    const users = await this.repository.find({
      relations: { transactions: true },
    });

    if (!users) {
      throw new AppError('Users Not Found!', HttpStatus.NOT_FOUND);
    }

    return await this.userMapper.mapArrayAsync(users, User, UserResponseDto);
  }

  async findOneById(id: string): Promise<UserResponseDto> {
    const user = await this.repository.findOne({
      where: { id },
      relations: {
        transactions: true,
      },
    });

    if (!user) {
      throw new AppError('User Not Found!', HttpStatus.NOT_FOUND);
    }

    delete user.password;

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { email },
      relations: {
        transactions: true,
      },
    });

    if (!user) {
      throw new AppError('User Not Found!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.repository.findOneBy({
      id,
    });

    if (!user) {
      throw new AppError('User Not Found!', HttpStatus.NOT_FOUND);
    }

    await this.repository.update(id, updateUserDto);

    return await this.userMapper.mapAsync(user, User, UserResponseDto);
  }

  async remove(id: string): Promise<void> {
    const user = await this.repository.findOneBy({
      id,
    });

    if (!user) {
      throw new AppError('User Not Found!', HttpStatus.NOT_FOUND);
    }

    await this.repository.delete(id);
  }
}
