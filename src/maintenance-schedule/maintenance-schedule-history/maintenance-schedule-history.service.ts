import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MAINTENANCE_SCHEDULE_HISTORY } from 'src/commons/constants/schemaConst';
import { MaintenanceScheduleHistoryDocument } from '../entity/maintenance-schedule-history.entity';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { Paginate } from 'src/commons/dto/paginate.dto';
import { Sorting } from 'src/commons/dto/sorting';
import { filterParams } from 'src/commons/utils/filterParams';
import { QueryMaintenanceHistoryDto } from './dto/query-history.dto';
import { CreateMaintenanceHistoryDto } from './dto/create-history.dto';

@Injectable()
export class MaintenanceScheduleHistoryService {
    constructor(@InjectModel(MAINTENANCE_SCHEDULE_HISTORY) private model: Model<MaintenanceScheduleHistoryDocument>
    ) { }
    async getAll(authUser: JwtUser, query: Paginate & QueryMaintenanceHistoryDto & Sorting) {
        console.log();

        const cond = filterParams(query, ['maintenance', 'updatedBy']);

        const cmd = this.model.find(cond)
            .byTenant(authUser.owner)
            .lean({ autopopulate: true })
            .where('maintenance', query.maintenance)

        if (query.limit) {
            cmd.limit(query.limit)
        }
        if (query.offset) {
            cmd.skip(query.offset)
        }
        if (query.sortBy) {
            cmd.sort({ [query.sortBy]: query.sortOrder })
        }

        const totalCmd = this.model.countDocuments(cmd.getQuery());
        const [total, data] = await Promise.all([totalCmd.exec(), cmd.exec()]);
        return { total, data };
    }

    /** get detail of an update */
    getId(id: string, authUser: JwtUser) {
        return this.model.findById(id)
            .byTenant(authUser.owner)
            .lean({ autopopulate: true })
            .exec();
    }

    create(dto: CreateMaintenanceHistoryDto, authUser: JwtUser) {
        return new this.model(dto)
            .withTenant(authUser.owner)
            .save();
    }

    delete(id: string) {
        return this.model.deleteMany({ maintenance: id }).exec();
    }
}
