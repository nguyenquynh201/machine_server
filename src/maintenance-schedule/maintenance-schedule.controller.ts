import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Put, Query, Req } from '@nestjs/common';
import { MaintenanceScheduleService } from './maintenance-schedule.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { AuthUser } from 'src/decors/user.decorator';
import { CreateMaintenanceScheduleDto } from './dto/create-maintenance-schedule.dto';
import { ArrayObjectIdValidationPipe } from 'src/commons/pipes/array-object-id-validation.pipe';
import { OkRespone } from 'src/commons/okResponse';
import { CreateNotifyStaff } from './dto/create_notify_staff.dto';
import { UpdateRequestStaffApplyDto } from './dto/update-apply-request.dto';
import { UpdateStatus } from './dto/update_status.dto';
import { Roles } from 'src/decors/roles.decorator';
import { UserRole } from 'src/users/interface/userRoles';
import { MaintenanceScheduleTarget } from './interface/maintenance-schedule-target';
import { MaintenanceStatusEnum } from './interface/maintenance-schedule-status';
import { UpdateMaintenanceScheduleDto } from './dto/update-maintenance-schedule.dto';

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
  @ApiQuery({ name: 'fromDate', required: false, type: Date })
  @ApiQuery({ name: 'toDate', required: false, type: Date })
  @ApiQuery({ name: 'status', required: false, enum: MaintenanceStatusEnum })
  @ApiQuery({ name: 'target', required: false, enum: MaintenanceScheduleTarget })

  findAll(
    @Req() req: Request,
    @AuthUser() authUser: JwtUser,
    @Query('limit', new DefaultValuePipe('0'), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
    @Query('search') search?: string,

  ) {
    return this.maintenanceScheduleService.findAll(authUser, {
      ...req.query,
      limit,
      offset,
      search
    });
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceScheduleService.findOne(id, { throwIfFail: true, lean: true });
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() UpdateMaintenanceScheduleDto: UpdateMaintenanceScheduleDto,
    @AuthUser() authUser: JwtUser) {
    return this.maintenanceScheduleService.update(id, UpdateMaintenanceScheduleDto, authUser);
  }

  @Post('assignStaff/:id')
  assignStaff(@Param('id') id: string,
    @AuthUser() authUser: JwtUser) {
    return this.maintenanceScheduleService.assignStaff(id, authUser);
  }
  @Post(':id/staffs')
  async addRelateStaffs(@Param('id') id: string,
    @Body(ArrayObjectIdValidationPipe) staffIds: string[],
    @AuthUser() authUser: JwtUser
  ) {
    const result = await this.maintenanceScheduleService.addRelateStaffs(id, staffIds, authUser);
    return new OkRespone({ data: result });
  }
  @Post(':id/staffNotification')
  async addNotificationStaff(@Param('id') id: string,
    @Body() staffIds: CreateNotifyStaff,
    @AuthUser() authUser: JwtUser
  ) {
    const result = await this.maintenanceScheduleService.addNotificationStaff(id, staffIds, authUser);
    return new OkRespone({ data: result });
  }

  @Post(':id/updateRequestApply/:idAdmin')
  async updateRequest(@Param('id') id: string,
    @Param('idAdmin') idAdmin: string,
    @Body() receive: UpdateRequestStaffApplyDto,
    @AuthUser() authUser: JwtUser) {
    const result = await this.maintenanceScheduleService.updateRequest(id, idAdmin, receive, authUser);
    return new OkRespone({ data: result });
  }
  @Put(':id/updateStatus')
  @Roles(UserRole.Staff)
  async updateStatus(@Param('id') id: string, @Body() status: UpdateStatus, @AuthUser() authUser: JwtUser) {
    const result = await this.maintenanceScheduleService.updateStatus(id, status, authUser);
    return new OkRespone({ data: result });
  }
}
