import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceScheduleRateController } from './maintenance-schedule-rate.controller';

describe('MaintenanceScheduleRateController', () => {
  let controller: MaintenanceScheduleRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceScheduleRateController],
    }).compile();

    controller = module.get<MaintenanceScheduleRateController>(MaintenanceScheduleRateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
