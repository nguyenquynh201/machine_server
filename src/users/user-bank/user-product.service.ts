import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { ErrCode } from 'src/commons/constants/errorConstants';
import { USER_PRODUCT } from 'src/commons/constants/schemaConst';
import { UserProductDocument } from './entities/user-product.entity';
import { CreateUserProductDto } from './dto/create-user-product.dto';
import { UpdateUserProductDto } from './dto/update-user-product.dto';

@Injectable()
export class UserProductService {
    constructor(
        @InjectModel(USER_PRODUCT) private model: Model<UserProductDocument>,
    ) { }

    async create(createUserProductDto: CreateUserProductDto, authUser: JwtUser) {
        const doc = await this.model.findOne()
            .where('userId', createUserProductDto.userId)
            .where('productId', createUserProductDto.productId)
            .exec();
        if (doc) {
            throw new BadRequestException(ErrCode.E_PRODUCT_EXISTED);;
        } else {
            return new this.model(createUserProductDto).save();
        }
    }
    async findAllProductUser(authUser: JwtUser) {

        const productUser = this.model.find({ ...authUser })
            .lean({ autopopulate: true });
        console.log("nef nef", productUser);
        const totalCmd = this.model.countDocuments(productUser.getQuery());
        const [data, total] = await Promise.all([productUser.exec(), totalCmd.exec()]);

        return { total, data };
    }
    update(id: string, updateUserProductDto: UpdateUserProductDto, authUser: JwtUser) {
        return this.model.findByIdAndUpdate(id, updateUserProductDto, { new: true })
            .orFail(new NotFoundException())
            .exec();
    }

    remove(id: string, authUser: JwtUser) {
        return this.model.findByIdAndDelete(id)
            .orFail(new NotFoundException())
            .exec();
    }
}
