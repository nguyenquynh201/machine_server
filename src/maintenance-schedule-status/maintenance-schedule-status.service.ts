/* eslint-disable prefer-const */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MAINTENANCE_SCHEDULE_STATUS } from 'src/commons/constants/schemaConst';
import { MaintenanceScheduleDocument } from './entity/maintenance-schedule-status.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { ErrCode } from 'src/commons/constants/errorConstants';
import { CreateMaintenanceScheduleStatusDto } from './dto/create-maintenance-schedule-status.dto';
import { UpdateMaintenanceScheduleStatusDto } from './dto/update-maintenance-schedule-status.dto';

@Injectable()
export class MaintenanceScheduleStatusService {
    constructor(
        @InjectModel(MAINTENANCE_SCHEDULE_STATUS) private statusModel: Model<MaintenanceScheduleDocument>,
    ) { }
    async create(createMaintenanceScheduleStatusDto: CreateMaintenanceScheduleStatusDto, authUser: JwtUser) {
        if (createMaintenanceScheduleStatusDto.color) {
            const checkColor = await this.checkColor(createMaintenanceScheduleStatusDto.color, authUser);
            if (checkColor) {
                throw new BadRequestException(ErrCode.E_COLOR);
            }
        }
        return new this.statusModel(createMaintenanceScheduleStatusDto)
            .withTenant(authUser.owner)
            .save();
    }

    async checkColor(color: string, authUser: JwtUser) {
        let check = await this.statusModel.findOne({ color: color }).byTenant(authUser.owner).exec();
        if (check) {
            return true;
        }
        return false;
    }

    async findAll(authUser: JwtUser) {
        const data = await this.statusModel.find()
            .byTenant(authUser.owner)
            .lean()
            .exec();
        return { data, total: data.length };
    }

    findOne(id: string, authUser: JwtUser) {
        return this.statusModel.findById(id)
            .byTenant(authUser.owner)
            .populateTenant('username')
            .lean()
            .orFail(new NotFoundException(ErrCode.E_MAINTENANCE_SCHEDULE_STATUS_NOT_FOUND))
            .exec();
    }

    async update(id: string, updateMaintenanceScheduleStatusDto: UpdateMaintenanceScheduleStatusDto, authUser: JwtUser) {
        if (updateMaintenanceScheduleStatusDto.color) {
            const status = await this.findOne(id, authUser);
            if (status && status.color != updateMaintenanceScheduleStatusDto.color) {
                const checkColor = await this.checkColor(updateMaintenanceScheduleStatusDto.color, authUser);
                if (checkColor) {
                    throw new BadRequestException(ErrCode.E_COLOR);
                }
            }
        }
        return this.statusModel.findByIdAndUpdate(id, updateMaintenanceScheduleStatusDto, { new: true })
            .byTenant(authUser.owner)
            .orFail(new NotFoundException(ErrCode.E_MAINTENANCE_SCHEDULE_STATUS_NOT_FOUND))
            .exec();
    }

    remove(id: string, authUser: JwtUser) {
        return this.statusModel.findByIdAndDelete(id)
            .byTenant(authUser.owner)
            .orFail(new NotFoundException(ErrCode.E_MAINTENANCE_SCHEDULE_STATUS_NOT_FOUND))
            .exec();
    }
}
