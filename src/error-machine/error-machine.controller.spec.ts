import { Test, TestingModule } from '@nestjs/testing';
import { ErrorMachineController } from './error-machine.controller';

describe('ErrorMachineController', () => {
  let controller: ErrorMachineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErrorMachineController],
    }).compile();

    controller = module.get<ErrorMachineController>(ErrorMachineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
