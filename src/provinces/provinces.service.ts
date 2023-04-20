import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { PROVINCE } from 'src/commons/constants/schemaConst';
import { Paginate } from 'src/commons/dto/paginate.dto';
import { Sorting } from 'src/commons/dto/sorting';
import { QueryProvince } from './dto/query-province.dto';
import { ProvinceDocument } from './entities/province.entity';

@Injectable()
export class ProvincesService {
    constructor(@InjectModel(PROVINCE) private provinceModel: Model<ProvinceDocument>
    ) { }
    async findAll(authUser: JwtUser, query?: Paginate & QueryProvince & Sorting) {

        const filter: FilterQuery<ProvinceDocument> = {};
        if (query.search) {
            filter.$text = { $search: `.*${query.search}.*`, $language: "en" };
        }

        const cmd = this.provinceModel.find({ ...filter })
            .lean();

        if (query.code) {
            cmd.where('code', Number(query.code));
        }
        if (query.limit) {
            cmd.limit(query.limit);
        }
        if (query.offset) {
            cmd.skip(query.offset);
        }
        if (query.sortBy) {
            cmd.sort({ [query.sortBy]: query.sortOrder })
        }

        const totalCmd = this.provinceModel.countDocuments(cmd.getQuery());
        const [data, total] = await Promise.all([cmd.exec(), totalCmd.exec()]);

        return { total, data };
    }

    async findAllProvince(authUser: JwtUser, query?: QueryProvince) {
        const filter: FilterQuery<ProvinceDocument> = {};
        if (query.search) {
            filter.$text = { $search: `.*${query.search}.*`, $language: "en" };
        }
        const cmd = this.provinceModel.find({ ...filter })
            .select('-districts')
            .lean();

        if (query.code) {
            cmd.where('code', Number(query.code));
        }
        const totalCmd = this.provinceModel.countDocuments(cmd.getQuery());
        const [data, total] = await Promise.all([cmd.exec(), totalCmd.exec()]);

        return { total, data };
    }

    findOne(id: string, authUser: JwtUser) {
        return this.provinceModel.findById(id)
            .exec();
    }

    async findAllDistricts(id: string, authUser: JwtUser) {

        const cmd = await this.provinceModel.findById(id)
            .lean()
            .exec();


        return { data: cmd.districts };
    }

}

