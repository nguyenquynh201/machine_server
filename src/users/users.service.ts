import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ErrCode } from '../commons/constants/errorConstants';
import { UserChangePassword } from './dto/userChangePass.dto';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { UserRole } from './interface/userRoles';
import { ChangeRoleDto } from './dto/change-role.dto';
import { QueryUser } from './dto/query-user.dto';
import { Paginate } from 'src/commons/dto/paginate.dto';
import { filterParams } from 'src/commons/utils/filterParams';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,

  ) { }

  async create(createUserDto: CreateUserDto, userReq?: JwtUser) {

    if(userReq.role != UserRole.Edit){
      throw new ForbiddenException();
    }

    const username = await this.isUserExist(createUserDto.email);
    if (username) {
      throw new BadRequestException(ErrCode.E_USER_EXISTED);
    }
    const phoneNumber = await this.isPhoneNumberExist(createUserDto.phone);
    if (phoneNumber) {
      throw new BadRequestException(ErrCode.E_USER_PHONE_EXISTED);
    }
    let user = new this.userModel(createUserDto);
    const hashPassword = await bcrypt.hash(user.password, 10);
    user.username = createUserDto.email;
    user.password = hashPassword;
    user.createdBy = userReq == null ? "" : userReq.username;
    return user.save();
  }

  async registerEdit (createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    const hashPassword = await bcrypt.hash(user.password, 10);
    user.username = createUserDto.email;
    user.password = hashPassword;
    return user.save();
  }

  async findAll(authUser: JwtUser, query: Paginate & QueryUser) {
    const cond = filterParams(query, ['createdBy']);
    const cmd = this.userModel.find(cond)
    if (query.search) {
      cmd.find({ $text: { $search: query.search } });
    }
    if (query.roles) {
      cmd.where('role', query.roles);
    }
    if (query.limit) {
      cmd.limit(query.limit);
    }
    if (query.offset) {
      cmd.skip(query.offset);
    }
    const resultCmd = cmd.lean()
    const totalCmd = this.userModel.countDocuments(cmd.getQuery());
    const [data, total] = await Promise.all([resultCmd.exec(), totalCmd.exec()]);
    return { total, data };
  }

  findOne(id: string, options?: { throwIfFail?: boolean, password?: boolean, lean?: boolean }) {
    const cmd = this.userModel.findById(id)
    if (options?.lean) {
      cmd.lean({ autopopulate: true })
    }
    if (options?.password) {
      cmd.select("+password")
    }
    if (options?.throwIfFail)
      cmd.orFail(new NotFoundException(ErrCode.E_USER_NOT_FOUND))

    return cmd.exec()
  }

  async findByUsername(username: string, { password }: { password: boolean }) {
    let cmd = this.userModel.findOne({ username });
    if (password) {
      cmd.select('+password')
    }
    return cmd.exec();
  }

  async isPhoneNumberExist(phone: string) {
    let user = await this.userModel.findOne({phone: phone}).exec();
    if (user) {
      return true; 
    }
    return false;
  }

  async isUserExist(username: string) {
    let user = await this.userModel.findOne({ username: username }).exec();
    if (user) {
      return true;
    }
    return false;
  }

  async update(id: string, updateUserDto: UpdateUserDto, userReq?: JwtUser) {

    if(id != userReq.userId ){
      if(userReq.role != UserRole.Edit){
        throw new ForbiddenException();
      }
    }

    const userC = await this.userModel.findById(id)
      .orFail(new NotFoundException(ErrCode.E_USER_NOT_FOUND))
      .exec();
    if(updateUserDto.phone && updateUserDto.phone != userC.phone) {
      const phoneNumber = await this.isPhoneNumberExist(updateUserDto.phone);
      if (phoneNumber) {
        throw new BadRequestException(ErrCode.E_USER_PHONE_EXISTED);
      }
    }
    const cmd = this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true })
      .orFail(new NotFoundException(ErrCode.E_USER_NOT_FOUND))
    return cmd.exec();
  }

  async remove(id: string, userReq: JwtUser) {

    if(userReq.role != UserRole.Edit){
      throw new ForbiddenException();
    }
    const doc = await this.userModel.findByIdAndDelete(id)
      .orFail(new NotFoundException(ErrCode.E_USER_NOT_FOUND))
      .exec();
    return doc;
  }

  async verifyUserPassword(user: UserDocument, password: string) {
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );
    return validPassword;
  }

  async changePassword(id: string, info: UserChangePassword) {
    const user = await this.userModel.findById(id)
      .select('+password')
      .orFail(new NotFoundException(ErrCode.E_USER_NOT_FOUND))
      .exec();
    const checkPass = await this.verifyUserPassword(user, info.currentPassword);
    if (!checkPass) {
      throw new BadRequestException(ErrCode.E_USER_PASS_NOT_MATCH);
    }
    const hashPassword = await bcrypt.hash(info.newPassword, 10);
    user.password = hashPassword;

    await user.save();
    return true;
  }

  async changeRole(info: ChangeRoleDto, authUser: JwtUser) {
    const user = await this.userModel.findById(info.userId)
      .orFail(new NotFoundException(ErrCode.E_USER_NOT_FOUND))
      .exec();

    if (this.compareRole(authUser.role, info.role) < 0) {
      throw new ForbiddenException(ErrCode.E_NEED_HIGHER_ROLE);
    }

    user.role = info.role;
    return user.save();
  }

  private roleLevel = {
    'edit': 0,
    'view': -1
  }

  /** 
   * Return 1 if A > B, 0 if A == B, Otherwise return -1
   */
  private compareRole(roleA: UserRole, roleB: UserRole) {
    const val = this.roleLevel[roleA] - this.roleLevel[roleB];
    return val > 0 ? 1 : (val < 0 ? -1 : 0);
  }
}
