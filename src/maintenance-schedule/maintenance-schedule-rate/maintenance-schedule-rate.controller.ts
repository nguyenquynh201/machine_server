import { Body, Controller, Get, Post } from '@nestjs/common';
import { MaintenanceScheduleRateService } from './maintenance-schedule-rate.service';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { AuthUser } from 'src/decors/user.decorator';
import { CreateMaintenanceSCheduleRateDto } from './dto/create-maintenance-schedule-rate.dto';
import { ApiTags } from '@nestjs/swagger';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';

@ApiTags('Maintenance schedule rate')
@Controller('maintenance-schedule-rate')
@BearerJwt()
export class MaintenanceScheduleRateController {
    constructor(private readonly ratingService: MaintenanceScheduleRateService) { }
    @Post()
    create(@Body() createRatingMaintenance: CreateMaintenanceSCheduleRateDto, @AuthUser() authUser: JwtUser) {
        return this.ratingService.create(createRatingMaintenance, authUser);
    }
    @Get()
    get(@AuthUser() authUser: JwtUser,) {
        return this.ratingService.findAllRating(authUser);
    }

}
