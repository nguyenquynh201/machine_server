import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CONTAINER } from 'src/commons/constants/schemaConst';
import { filterParams } from 'src/commons/utils/filterParams';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { ContainerDocument } from './entities/container.entity';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { Paginate } from 'src/commons/dto/paginate.dto';
import { UserRole } from 'src/users/interface/userRoles';

@Injectable()
export class ContainersService {
  constructor(
    @InjectModel(CONTAINER) private readonly model: Model<ContainerDocument>,
  ) { }

  create(dto: CreateContainerDto, authUser: JwtUser) {
    if(authUser.role != UserRole.Edit){
      throw new ForbiddenException();
    }
    return this.model.create(dto);
  }

  async findAll(authUser: JwtUser, query: { limit: number , offset: number , containerCode?: string }) {
    const cond = filterParams(query, ['containerCode']);

    const cmd = this.model.find(cond)
    if (query.limit) {
      cmd.limit(query.limit);
    }
    if (query.offset) {
      cmd.skip(query.offset);
    }
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

  update(id: string, dto: UpdateContainerDto, authUser: JwtUser) {
    if(authUser.role != UserRole.Edit){
      throw new ForbiddenException();
    }
    return this.model.findByIdAndUpdate(id, dto)
      .orFail(new NotFoundException())
      .exec();
  }

  remove(id: string, authUser: JwtUser) {
    if(authUser.role != UserRole.Edit){
      throw new ForbiddenException();
    }
    return this.model.findByIdAndDelete(id)
      .orFail(new NotFoundException())
      .exec();
  }
}
