import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
  describe('root', () => {
    it('should return "ok"', () => {
      console.log(appController.checkHealth());
      expect(appController.checkHealth()).toEqual({ status: 'ok' });
    });
  });
});
