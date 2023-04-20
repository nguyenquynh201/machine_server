import { Test, TestingModule } from '@nestjs/testing';
import { ErrorMachineService } from './error-machine.service';

describe('ErrorMachineService', () => {
  let service: ErrorMachineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorMachineService],
    }).compile();

    service = module.get<ErrorMachineService>(ErrorMachineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
