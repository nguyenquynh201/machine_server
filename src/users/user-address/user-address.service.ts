import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_ADDRESS } from 'src/commons/constants/schemaConst';
import { UserAddressDocument } from './entity/user-address.entity';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { ErrCode } from 'src/commons/constants/errorConstants';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';

@Injectable()
export class UserAddressService {

    constructor(
        @InjectModel(USER_ADDRESS) private model: Model<UserAddressDocument>,
    ) { }
    async create(createUserAddressDto: CreateUserAddressDto, authUser: JwtUser) {

        return new this.model(createUserAddressDto).save();
    }
    async findAllAddressUser(authUser: JwtUser) {

        const addressUser = this.model.find({ userId: authUser.userId })
            .lean({ autopopulate: true });
        console.log("nef nef", addressUser);
        const totalCmd = this.model.countDocuments(addressUser.getQuery());
        const [data, total] = await Promise.all([addressUser.exec(), totalCmd.exec()]);

        return { total, data };
    }
    async findAddressById(authUser: JwtUser, idAddress: string) {
        const addressUser = await this.model.findById(idAddress)
            .orFail(new NotFoundException())
            .lean({ autopopulate: true }).exec();
        console.log("nef nef", addressUser);
        return addressUser

    }
    update(id: string, updateUserAddressDto: UpdateUserAddressDto, authUser: JwtUser) {
        return this.model.findByIdAndUpdate(id, updateUserAddressDto, { new: true })
            .orFail(new NotFoundException())
            .exec();
    }

    remove(id: string, authUser: JwtUser) {
        return this.model.findByIdAndDelete(id)
            .orFail(new NotFoundException())
            .exec();
    }
}
