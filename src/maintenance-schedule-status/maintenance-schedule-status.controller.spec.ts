import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceScheduleStatusController } from './maintenance-schedule-status.controller';

describe('MaintenanceScheduleStatusController', () => {
  let controller: MaintenanceScheduleStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceScheduleStatusController],
    }).compile();

    controller = module.get<MaintenanceScheduleStatusController>(MaintenanceScheduleStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
