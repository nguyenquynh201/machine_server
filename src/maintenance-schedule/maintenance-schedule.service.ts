/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { MaintenanceScheduleEntity, MaintenanceScheduleEntityDocument } from './entity/maintenance-schedule.entity';
import { ERROR_MACHINE, MAINTENANCE_SCHEDULE } from 'src/commons/constants/schemaConst';
import { CreateMaintenanceScheduleDto } from './dto/create-maintenance-schedule.dto';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { ErrorMachineService } from 'src/error-machine/error-machine.service';
import { ErrorMachineEntityDocument } from 'src/error-machine/entity/error-machine.entity';
import { Paginate } from 'src/commons/dto/paginate.dto';
import { filterParams } from 'src/commons/utils/filterParams';
import { QueryProduct } from 'src/products/dto/query-product.dto';
import { ProductDocument } from 'src/products/entities/product.entity';
import { QueryMaintenance } from 'src/maintenance-schedule-status/dto/query-maintenance-schedule.dto';

@Injectable()
export class MaintenanceScheduleService {
    constructor(
        @InjectModel(MAINTENANCE_SCHEDULE) private maintenanceScheduleModel: Model<MaintenanceScheduleEntityDocument>,
        private readonly statusModel: ErrorMachineService,
    ) {

    }
    async create(CreateMaintenanceScheduleDto: CreateMaintenanceScheduleDto, userReq: JwtUser) {
        if (CreateMaintenanceScheduleDto.products !== null) {
            const maintenance_schedule = await new this.maintenanceScheduleModel(CreateMaintenanceScheduleDto)
                .withTenant(userReq.owner);
            maintenance_schedule.createdBy = userReq.userId;
            // console.log(maintenance_schedule);
            console.log(CreateMaintenanceScheduleDto);
            let totalErrorMoney = 0;

            if (CreateMaintenanceScheduleDto.errorMachine?.length > 0) {
                for (var item in CreateMaintenanceScheduleDto.errorMachine) {
                    console.log(CreateMaintenanceScheduleDto.errorMachine[item]);
                    const error = await this.statusModel.findOneUser(CreateMaintenanceScheduleDto.errorMachine[item]);
                    console.log(error);
                    if (error != null) {
                        totalErrorMoney += error.price;
                    }
                }
                console.log(totalErrorMoney);

            }

            let totalBugMoney = 0;
            if (CreateMaintenanceScheduleDto.bug?.length > 0) {
                CreateMaintenanceScheduleDto.bug?.forEach((item) => {
                    totalBugMoney += item.priceBug;
                })
            }
            maintenance_schedule.totalBugMoney = totalBugMoney + totalErrorMoney;
            if (maintenance_schedule.totalBugMoney === 0) {
                maintenance_schedule.totalBugMoney = 250000;
            }
            console.log(maintenance_schedule.totalBugMoney);
            return maintenance_schedule.save();
        } else {
            throw new BadRequestException("Products cannot be empty");
        }
    }
    async findAll(authUser: JwtUser, query?: Paginate & QueryMaintenance) {

        let filter: FilterQuery<MaintenanceScheduleEntityDocument> = {};
    
        if (query.search) {
          filter.$or = [
            { $text: { $search: `.*${query.search}.*`, $language: "en" } },
            { code: { $regex: `^${query.search}` } },
            { code: { $regex: `${query.search}$` } },
          ]
        }
    
        const cond = filterParams(query, ['category']);
        const cmd = this.maintenanceScheduleModel.find({ ...filter, ...cond })
          .lean({ autopopulate: true })
    
        if (query.limit) {
          cmd.limit(query.limit);
        }
        if (query.offset) {
          cmd.skip(query.offset);
        }
        const totalCmd = this.maintenanceScheduleModel.countDocuments(cmd.getQuery());
        const [data, total] = await Promise.all([cmd.exec(), totalCmd.exec()]);
    
        return { total, data };
    
      }
}
