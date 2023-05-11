import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceScheduleHistoryService } from './maintenance-schedule-history.service';

describe('MaintenanceScheduleHistoryService', () => {
  let service: MaintenanceScheduleHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintenanceScheduleHistoryService],
    }).compile();

    service = module.get<MaintenanceScheduleHistoryService>(MaintenanceScheduleHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
