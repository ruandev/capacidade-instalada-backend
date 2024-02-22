import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-jwt-secret'),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });
  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });
  describe('validate', () => {
    it('should return payload if token is valid', async () => {
      const mockPayload = { sub: '1', username: 'testuser', role: 'user' };
      const result = await jwtStrategy.validate(mockPayload);

      expect(result).toEqual({
        userId: '1',
        username: 'testuser',
        role: 'user',
      });
    });
  });
});
