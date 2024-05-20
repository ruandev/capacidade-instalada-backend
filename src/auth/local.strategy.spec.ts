import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;

  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });
  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });
  describe('validate', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = { id: '1', username: 'testuser' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await strategy.validate('testuser', 'password');

      expect(result).toEqual(mockUser);
    });
    it('should throw an error if credentials are invalid', async () => {
      jest
        .spyOn(authService, 'validateUser')
        .mockRejectedValue(new Error('Invalid credentials'));
      await expect(
        strategy.validate('testuser', 'invalid_password'),
      ).rejects.toThrowError('Invalid credentials');
    });
  });
});
