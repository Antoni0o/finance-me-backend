import { User } from './user.entity';

describe('Entity Funcs', () => {
  it('should hash password', async () => {
    const createUser = new User({
      name: 'name',
      email: 'email',
      password: '123456',
    });

    await createUser.hashPassword();

    expect(createUser.password).not.toBe('123456');
  });

  it('should create uuid', () => {
    const createUser = new User({
      name: 'name',
      email: 'email',
      password: '123456',
    });

    createUser.createUuid();

    expect(createUser.id).toBeDefined();
    expect(createUser.id).toBeTruthy();
    expect(createUser.id).toHaveLength(36);
  });
});
