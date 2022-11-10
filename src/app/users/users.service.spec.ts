import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { getMapperToken } from '@automapper/nestjs';
import { QueryFailedError, Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AppError } from '../../common/errors/AppError';
import { TransactionType } from '../transactions/entities/transaction.entity';

const user: User = new User({
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  createdAt: new Date(1560807962),
  updatedAt: new Date(1560807962),
});

const userResponse: UserResponseDto = {
  id: 'id',
  name: 'name',
  email: 'email',
  createdAt: new Date(1560807962),
  updatedAt: new Date(1560807962),
  transactions: [
    {
      id: 'id',
      description: 'description',
      type: TransactionType.INCOME,
      amount: 1000,
      createdAt: new Date(1560807962),
      updatedAt: new Date(1560807962),
      user: user,
    },
  ],
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getMapperToken(),
          useValue: {
            mapArrayAsync: jest.fn().mockResolvedValue(userResponse),
            mapAsync: jest.fn().mockResolvedValue(userResponse),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('Create', () => {
    it('should create an user successfully', async () => {
      //given
      const createUserDto: CreateUserDto = {
        name: 'name1',
        email: 'email1',
        password: 'password1',
      };
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      //when
      const result = await service.create(createUserDto);

      //then
      expect(result).toBe(userResponse);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error', async () => {
      //given
      const createUserDto: CreateUserDto = {
        name: 'name1',
        email: 'email1',
        password: 'password1',
      };
      jest
        .spyOn(repository, 'save')
        .mockRejectedValueOnce(new QueryFailedError('query', [], 'message'));

      //then
      expect(service.create(createUserDto)).rejects.toThrowError();
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find All', () => {
    it('should find all users', async () => {
      //when
      const result = await service.findAll();

      //then
      expect(result).toBe(userResponse);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error', async () => {
      try {
        //given
        await service.findAll();
      } catch (e) {
        //then
        expect(e).toBeInstanceOf(AppError);
        expect(repository.find).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Find One', () => {
    describe('By Id', () => {
      it('should find an user', async () => {
        //given
        const id = 'id';
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

        //when
        const result = await service.findOneById(id);

        //then
        expect(result).toBe(userResponse);
        expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      });

      it('should throw an error', async () => {
        //given
        const id = 'id';

        try {
          //when
          await service.findOneById(id);
        } catch (e) {
          //then
          expect(e).toBeInstanceOf(AppError);
          expect(repository.findOneBy).toHaveBeenCalledTimes(1);
        }
      });
    });

    describe('By E-mail', () => {
      it('should find an user', async () => {
        //given
        const email = 'email@email.com';
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

        //when
        const result = await service.findOneByEmail(email);

        //then
        expect(result).toBe(user);
        expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      });

      it('should throw an error', async () => {
        //given
        const email = 'email@email.com';

        try {
          //when
          await service.findOneByEmail(email);
        } catch (e) {
          //then
          expect(e).toBeInstanceOf(AppError);
          expect(repository.findOneBy).toHaveBeenCalledTimes(1);
        }
      });
    });
  });

  describe('Update', () => {
    it('should update an user', async () => {
      //given
      const updateUser: UpdateUserDto = {
        name: 'name',
        password: 'password',
      };
      const id = 'id';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(repository, 'update');

      //when
      const result = await service.update(id, updateUser);

      //then
      expect(result).toBe(userResponse);
      expect(repository.findOneBy).toHaveBeenCalledTimes(2);
      expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error', async () => {
      //given
      const updateUser: UpdateUserDto = {
        name: 'name',
        password: 'password',
      };
      const id = 'id';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      try {
        //when
        await service.update(id, updateUser);
      } catch (e) {
        //then
        expect(e).toBeInstanceOf(AppError);
      }
    });
  });

  describe('Remove', () => {
    it('should remove an user', async () => {
      //given
      const id = 'id';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

      //when
      const result = await service.remove(id);

      //then
      expect(result).toBeUndefined();
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error', async () => {
      //given
      const id = 'id';

      try {
        await service.remove(id);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect(repository.findOneBy).toHaveBeenCalledTimes(1);
        expect(repository.delete).toHaveBeenCalledTimes(0);
      }
    });
  });
});
