import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppError } from '../../common/errors/AppError';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const userResponse: UserResponseDto = {
  id: 'id',
  name: 'name',
  email: 'email',
  createdAt: new Date(1560807962),
  updatedAt: new Date(1560807962),
};

const userResponseArray: Array<UserResponseDto> = [userResponse];

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Create', () => {
    it('should create an user', async () => {
      //given
      const createUserDto: CreateUserDto = {
        name: 'name1',
        email: 'email1',
        password: 'password1',
      };
      jest.spyOn(service, 'create').mockResolvedValue(userResponse);

      //when
      const result = await controller.create(createUserDto);

      //then
      expect(result).toBe(userResponse);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an unknown error', async () => {
      //given
      const createUserDto: CreateUserDto = {
        name: 'name1',
        email: 'email1',
        password: 'password1',
      };
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Unknown Error'));

      try {
        //when
        await controller.create(createUserDto);
      } catch (e) {
        //then
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Internal Server Error');
        expect(service.create).toHaveBeenCalledTimes(1);
      }
    });

    it('should throw a known error', async () => {
      //given
      const createUserDto: CreateUserDto = {
        name: 'name1',
        email: 'email1',
        password: 'password1',
      };
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new AppError('E-mail is Already Used', 400));

      try {
        //when
        await controller.create(createUserDto);
      } catch (e) {
        //then
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('E-mail is Already Used');
        expect(service.create).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Find All', () => {
    it('should find all users', async () => {
      //given
      jest.spyOn(service, 'findAll').mockResolvedValue(userResponseArray);

      //when
      const result = await controller.findAll();

      //then
      expect(result).toBe(userResponseArray);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an unknown error', async () => {
      //given
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new Error('Unknown Error'));

      try {
        //when
        await controller.findAll();
      } catch (e) {
        //then
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Internal Server Error');
        expect(service.findAll).toHaveBeenCalledTimes(1);
      }
    });

    it('should throw a known error', async () => {
      //given
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new AppError('Known Error', 400));

      try {
        //when
        await controller.findAll();
      } catch (e) {
        //then
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Known Error');
        expect(service.findAll).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Find One By Id', () => {
    it('should find an user', async () => {
      //given
      const id = 'id';
      jest.spyOn(service, 'findOneById').mockResolvedValue(userResponse);

      //when
      const result = await controller.findOneById(id);

      //then
      expect(result).toBe(userResponse);
      expect(service.findOneById).toHaveBeenCalledTimes(1);
    });

    it('should throw an unknown error', async () => {
      //given
      const id = 'id';
      jest
      .spyOn(service, 'findOneById')
      .mockRejectedValue(new Error('Unknown Error'));

      try {
        //when
        await controller.findOneById(id);
      } catch (e) {
        //then
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Internal Server Error');
        expect(service.findOneById).toHaveBeenCalledTimes(1);
      }
    });

    it('should throw a known error', async () => {
      //given
      const id = 'id';
      jest
      .spyOn(service, 'findOneById')
      .mockRejectedValue(new AppError('Known Error', 400));

      try {
        //when
        await controller.findOneById(id);
      } catch (e) {
        //then
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Known Error');
        expect(service.findOneById).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Update', () => {
    it('should update an user', async () => {
      //given
      const id = 'id';
      const updateUser: UpdateUserDto = {
        name: 'name',
        password: 'password',
      };
      jest.spyOn(service, 'update').mockResolvedValue(userResponse);

      //when
      const result = await controller.update(id, updateUser);

      //then
      expect(result).toBe(userResponse);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an unknown error', async () => {
      //given
      const id = 'id';
      const updateUser: UpdateUserDto = {
        name: 'name',
        password: 'password',
      };
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Unknown Error'));

      try {
        //when
        await controller.update(id, updateUser);
      } catch (e) {
        //then
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Internal Server Error');
        expect(service.update).toHaveBeenCalledTimes(1);
      }
    });

    it('should throw a known error', async () => {
      //given
      const id = 'id';
      const updateUser: UpdateUserDto = {
        name: 'name',
        password: 'password',
      };
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new AppError('Known Error', 400));

      try {
        //when
        await controller.update(id, updateUser);
      } catch (e) {
        //then
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Known Error');
        expect(service.update).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Remove', () => {
    it('should remove an user', async () => {
      //given
      const id = 'id';

      //when
      const result = await controller.remove(id);

      //then
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw an unknown error', async () => {
      //given
      const id = 'id';
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new Error('Unknown Error'));

      try {
        //when
        await controller.remove(id);
      } catch (e) {
        //then
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Internal Server Error');
        expect(service.remove).toHaveBeenCalledTimes(1);
      }
    });

    it('should throw a known error', async () => {
      //given
      const id = 'id';
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new AppError('Known Error', 400));

      try {
        //when
        await controller.remove(id);
      } catch (e) {
        //then
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Known Error');
        expect(service.remove).toHaveBeenCalledTimes(1);
      }
    });
  });
});
