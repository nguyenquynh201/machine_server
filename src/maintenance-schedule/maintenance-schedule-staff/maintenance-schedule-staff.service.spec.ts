import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceScheduleStaffService } from './maintenance-schedule-staff.service';

describe('MaintenanceScheduleStaffService', () => {
  let service: MaintenanceScheduleStaffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintenanceScheduleStaffService],
    }).compile();

    service = module.get<MaintenanceScheduleStaffService>(MaintenanceScheduleStaffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
