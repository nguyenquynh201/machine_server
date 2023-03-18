import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PRODUCT_CTG } from 'src/commons/constants/schemaConst';
import { CreateProductCtgDto } from './dto/create-product-ctg.dto';
import { UpdateProductCtgDto } from './dto/update-product-ctg.dto';
import { ProductCtgDocument } from './entities/product-ctg.entity';
import { QueryProductCtg } from './dto/query-product-ctg.dto';
import { filterParams } from 'src/commons/utils/filterParams';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { UserRole } from 'src/users/interface/userRoles';

@Injectable()
export class ProductCtgService {
  /**
   *
   */
  constructor(
    @InjectModel(PRODUCT_CTG)
    private model: Model<ProductCtgDocument>
  ) { }
  create(dto: CreateProductCtgDto, authUser: JwtUser) {
    if (authUser.role != UserRole.Admin) {
      throw new ForbiddenException();
    }
    return this.model.create(dto);
  }

  async findAll(authUser: JwtUser, query?: QueryProductCtg) {

    let filter: FilterQuery<ProductCtgDocument> = {};

    if (query.search) {
      filter.$or = [
        { $text: { $search: `.*${query.search}.*`, $language: "en" } },
      ]
    }

    const cmd = this.model.find({ ...filter })
      .lean({ autopopulate: true })

    const totalCmd = this.model.countDocuments(cmd.getQuery());
    const [data, total] = await Promise.all([cmd.exec(), totalCmd.exec()]);

    return { total, data };

  }

  findOne(id: string, authUser: JwtUser) {
    return this.model.findById(id)
      .lean()
      .orFail(new NotFoundException())
      .exec();
  }

  update(id: string, dto: UpdateProductCtgDto, authUser: JwtUser) {
    if (authUser.role != UserRole.Admin) {
      throw new ForbiddenException();
    }
    return this.model.findByIdAndUpdate(id, dto)
      .orFail(new NotFoundException())
      .exec();
  }

  remove(id: string, authUser: JwtUser) {
    if (authUser.role != UserRole.Admin) {
      throw new ForbiddenException();
    }
    return this.model.findByIdAndDelete(id)
      .orFail(new NotFoundException())
      .exec();
  }
}
