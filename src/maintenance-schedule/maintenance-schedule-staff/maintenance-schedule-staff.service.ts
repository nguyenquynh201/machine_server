/* eslint-disable prefer-const */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MaintenanceScheduleStaff, MaintenanceScheduleStaffDoc } from '../entity/maintenance-schedule-staff.entity';
import { MAINTENANCE_SCHEDULE_STAFF } from 'src/commons/constants/schemaConst';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';

import { MaintenanceScheduleDocument } from '../entity/maintenance-schedule.entity';
import { CreateMaintenanceScheduleStaffDto } from './dto/create-maintenance-schedule-staff.dto';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { ErrCode } from 'src/commons/constants/errorConstants';

@Injectable()
export class MaintenanceScheduleStaffService {

    constructor(
        @InjectModel(MAINTENANCE_SCHEDULE_STAFF) private model: Model<MaintenanceScheduleStaffDoc>
    ) { }
    async create(dto: CreateMaintenanceScheduleStaffDto) {
        const exists = await this.model.findOne(dto).lean().exec();
        if (exists) {
            return exists;
        }
        return new this.model(dto)
            .save();
    }

    async createAsync(doc: MaintenanceScheduleDocument, idStaffId: string[]) {
        if (idStaffId) {
            idStaffId.forEach(async element => {
                let dto = new CreateMaintenanceScheduleStaffDto();
                dto.maintenanceSchedule = doc._id;
                dto.staff = element;

                const exists = await this.model.findOne(dto).lean().exec();
                console.log('====================================');
                console.log(exists);
                console.log('====================================');
                if (!exists) {
                    await new this.model(dto).save();
                }
            });
        }
    }

    async updateRelateStaff(doc: MaintenanceScheduleDocument, idStaffId: string[]) {
        if (idStaffId) {
            let result = await this.model.deleteMany({ maintenanceSchedule: { $in: doc.id } })
            console.log('====================================');
            console.log(result);
            console.log('====================================');
            if ((result).deletedCount == 1) {
                this.createAsync(doc, idStaffId);
            }
        }
    }

    async delete(ids: string[]) {
        return await this.model.deleteMany({ _id: { $in: ids } })
            .exec();
    }

    remove(maintenanceScheduleId: string, staffIds: string[]) {
        return this.model.deleteMany({ maintenanceSchedule: maintenanceScheduleId, staff: { $in: staffIds } })
            .exec();
    }

    async findAll(query: FilterQuery<MaintenanceScheduleStaff>, options?: { populate?: PopulateOptions }) {
        const cmd = this.model.find(query)
        if (options?.populate) {
            cmd.populate(options.populate);
        }
        return cmd
            .lean()
            .exec();
    }
}
function difference(arg0: any, before: any): any {
    throw new Error('Function not implemented.');
}

