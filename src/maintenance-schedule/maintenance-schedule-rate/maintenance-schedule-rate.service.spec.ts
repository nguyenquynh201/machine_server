import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceScheduleRateService } from './maintenance-schedule-rate.service';

describe('MaintenanceScheduleRateService', () => {
  let service: MaintenanceScheduleRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintenanceScheduleRateService],
    }).compile();

    service = module.get<MaintenanceScheduleRateService>(MaintenanceScheduleRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
