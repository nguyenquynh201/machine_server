import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, Req } from '@nestjs/common';
import { MaintenanceScheduleHistoryService } from './maintenance-schedule-history.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { SortOrder } from 'src/commons/dto/sorting';
import { AuthUser } from 'src/decors/user.decorator';
import { Request, Response } from 'express';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';

@ApiTags('Maintenance schedule history')
@Controller('maintenance-schedule-history')
@BearerJwt()
export class MaintenanceScheduleHistoryController {
    constructor(
        private readonly service: MaintenanceScheduleHistoryService,
    ) { }
    @Get(':maintenanceId')
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt' })
    @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder })
    getAllOfMaintenance(
        @AuthUser() authUser: JwtUser,
        @Req() req: Request,
        @Param('maintenanceId') id: string,
        @Query('limit', new DefaultValuePipe('0'), ParseIntPipe) limit?: number,
        @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number) {
        return this.service.getAll(authUser, { ...req.query, maintenance: id, limit, offset });
    }

    @Get('detail/:id')
    getOne(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
        return this.service.getId(id, authUser);
    }
}
