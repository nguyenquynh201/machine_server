import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceScheduleHistoryController } from './maintenance-schedule-history.controller';

describe('MaintenanceScheduleHistoryController', () => {
  let controller: MaintenanceScheduleHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceScheduleHistoryController],
    }).compile();

    controller = module.get<MaintenanceScheduleHistoryController>(MaintenanceScheduleHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
