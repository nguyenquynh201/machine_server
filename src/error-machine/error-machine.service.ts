/* eslint-disable prefer-const */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ERROR_MACHINE } from 'src/commons/constants/schemaConst';
import { CreateErrorMachineDto } from './dto/create_error_machine.dto';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { ErrCode } from 'src/commons/constants/errorConstants';
import { UpdateErrorMachineDto } from './dto/update_error_machine.dto';
import { ErrorMachineEntityDocument } from './entity/error-machine.entity';

@Injectable()
export class ErrorMachineService {
    constructor(
        @InjectModel(ERROR_MACHINE) private statusModel: Model<ErrorMachineEntityDocument>,
    ) { }
    async create(createErrorMachineDto: CreateErrorMachineDto, authUser: JwtUser) {
        if (createErrorMachineDto.maintenanceContent) {
            const checkName = await this.checkName(createErrorMachineDto.maintenanceContent, authUser);
            if (checkName) {
                throw new BadRequestException(ErrCode.E_MACHINE_ERROR);
            }
        }
        return new this.statusModel(createErrorMachineDto)
            .withTenant(authUser.owner)
            .save();
    }

    async checkName(maintenanceContent: string, authUser: JwtUser) {
        let check = await this.statusModel.findOne({ maintenanceContent: maintenanceContent }).byTenant(authUser.owner).exec();
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
    findOneUser(id: string) {
        return this.statusModel.findById(id)
            .lean()
            .orFail(new NotFoundException(ErrCode.E_MAINTENANCE_SCHEDULE_STATUS_NOT_FOUND))
            .exec();
    }
    async update(id: string, updateErrorMachineDto: UpdateErrorMachineDto, authUser: JwtUser) {
        if (updateErrorMachineDto.maintenanceContent) {
            const error = await this.findOne(id, authUser);
            if (error && error.maintenanceContent != updateErrorMachineDto.maintenanceContent) {
                const checkName = await this.checkName(updateErrorMachineDto.maintenanceContent, authUser);
                if (checkName) {
                    throw new BadRequestException(ErrCode.E_MACHINE_ERROR);
                }
            }
        }
        return this.statusModel.findByIdAndUpdate(id, updateErrorMachineDto, { new: true })
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
