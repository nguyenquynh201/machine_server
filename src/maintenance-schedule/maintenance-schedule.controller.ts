import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { MaintenanceScheduleService } from './maintenance-schedule.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { AuthUser } from 'src/decors/user.decorator';
import { CreateMaintenanceScheduleDto } from './dto/create-maintenance-schedule.dto';

@ApiTags('Maintenance schedule')
@Controller('maintenance-schedule')
@BearerJwt()
export class MaintenanceScheduleController {
  constructor(private readonly maintenanceScheduleService: MaintenanceScheduleService) { }

  @Post()
  create(@Body() createMaintenanceScheduleDto: CreateMaintenanceScheduleDto,
    @AuthUser() userReq: JwtUser) {
    return this.maintenanceScheduleService.create(createMaintenanceScheduleDto, userReq);
  }
  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })

  findAll(
    @AuthUser() authUser: JwtUser,
    @Query('limit', new DefaultValuePipe('0'), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
    @Query('search') search?: string,
  ) {
    return this.maintenanceScheduleService.findAll(authUser, {
      limit,
      offset,
      search,
    });
  }
}
