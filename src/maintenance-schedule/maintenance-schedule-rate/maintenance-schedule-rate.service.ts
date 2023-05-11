import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MAINTENANCE_SCHEDULE, MAINTENANCE_SCHEDULE_RATE } from 'src/commons/constants/schemaConst';
import { MaintenanceScheduleRateEntityDocument } from './entity/maintenance-schedule-rate.entity';
import { CreateMaintenanceSCheduleRateDto } from './dto/create-maintenance-schedule-rate.dto';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { ErrCode } from 'src/commons/constants/errorConstants';
import { MaintenanceScheduleDocument } from '../entity/maintenance-schedule.entity';
import { MaintenanceStatusEnum } from '../interface/maintenance-schedule-status';

@Injectable()
export class MaintenanceScheduleRateService {
    constructor(
        @InjectModel(MAINTENANCE_SCHEDULE_RATE) private model: Model<MaintenanceScheduleRateEntityDocument>,
        @InjectModel(MAINTENANCE_SCHEDULE) private maintenanceScheduleModel: Model<MaintenanceScheduleDocument>,
    ) { }

    async create(createMaintenanceScheduleRateDto: CreateMaintenanceSCheduleRateDto, authUser: JwtUser) {
        const doc = await this.model.findOne()
            .where('userId', createMaintenanceScheduleRateDto.userId)
            .where('maintenanceId', createMaintenanceScheduleRateDto.maintenanceId)
            .exec();
        if (doc) {
            throw new BadRequestException(ErrCode.E_RATING_NOT_FOUND);;
        } {
            const data = await this.maintenanceScheduleModel.findById(createMaintenanceScheduleRateDto.maintenanceId);
            console.log('====================================');
            console.log(data.status);
            console.log('====================================');
            if(data.relateStaffs?.length == 0) {
                throw new BadRequestException(ErrCode.E_NO_STAFF)

            }
            if (data.status === MaintenanceStatusEnum.Done) {
                return new this.model(createMaintenanceScheduleRateDto).save();
            } else {
                throw new BadRequestException(ErrCode.E_STATUS_DONE_NOT_FOUND)
            }

        }
    }
    async findAllRating(authUser: JwtUser) {
        const rating = this.model.find({ userId: authUser.userId })
            .lean({ autopopulate: true });
        console.log("nef nef", rating);
        const totalCmd = this.model.countDocuments(rating.getQuery());
        const [data, total] = await Promise.all([rating.exec(), totalCmd.exec()]);

        return { total, data };
    }
    async findRatingById(authUser: JwtUser, idRating: string) {
        const rating = await this.model.findById(idRating)
            .orFail(new NotFoundException())
            .lean({ autopopulate: true }).exec();
        console.log("nef nef", rating);
        return rating

    }

    remove(id: string, authUser: JwtUser) {
        return this.model.findByIdAndDelete(id)
            .orFail(new NotFoundException())
            .exec();
    }
}
