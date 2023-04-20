import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceScheduleStatusService } from './maintenance-schedule-status.service';

describe('MaintenanceScheduleStatusService', () => {
  let service: MaintenanceScheduleStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintenanceScheduleStatusService],
    }).compile();

    service = module.get<MaintenanceScheduleStatusService>(MaintenanceScheduleStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
