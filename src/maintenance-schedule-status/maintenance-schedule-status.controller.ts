import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateMaintenanceScheduleStatusDto } from './dto/create-maintenance-schedule-status.dto';
import { MaintenanceScheduleStatusService } from './maintenance-schedule-status.service';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { AuthUser } from 'src/decors/user.decorator';
import { UpdateMaintenanceScheduleStatusDto } from './dto/update-maintenance-schedule-status.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';

@ApiTags('Maintenance Schedule Status')
@BearerJwt()
@Controller('maintenance-schedule-status')
export class MaintenanceScheduleStatusController {
    constructor(private readonly maintenanceScheduleStatusService: MaintenanceScheduleStatusService) { }

    @Post()
    create(@Body() createMaintenanceScheduleStatusDto: CreateMaintenanceScheduleStatusDto, @AuthUser() authUser: JwtUser) {
        return this.maintenanceScheduleStatusService.create(createMaintenanceScheduleStatusDto, authUser);
    }

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@AuthUser() authUser: JwtUser,
        @Query('limit', new DefaultValuePipe('0'), ParseIntPipe) limit?: number,
        @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
        @Query('search') search?: string,) {
        return this.maintenanceScheduleStatusService.findAll(authUser);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
        return this.maintenanceScheduleStatusService.findOne(id, authUser);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateMaintenanceScheduleStatusDto: UpdateMaintenanceScheduleStatusDto,
        @AuthUser() authUser: JwtUser) {
        return this.maintenanceScheduleStatusService.update(id, updateMaintenanceScheduleStatusDto, authUser);
    }

    @Delete(':id')
    // @Roles(UserRole.Admin, UserRole.Owner, UserRole.Manager)
    remove(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
        return this.maintenanceScheduleStatusService.remove(id, authUser);
    }
}
