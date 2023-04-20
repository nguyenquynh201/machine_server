/* eslint-disable prefer-const */
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
import { MailService } from 'src/mail/mail.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
  ) { }

  async create(createUserDto: CreateUserDto, userReq?: JwtUser) {

    if (userReq.role != UserRole.Admin) {
      throw new ForbiddenException();
    }

    const username = await this.isUserExist(createUserDto.email);
    if (username) {
      throw new BadRequestException(ErrCode.E_USER_EXISTED);
    }
    // const phoneNumber = await this.isPhoneNumberExist(createUserDto.phone);
    // if (phoneNumber) {
    //   throw new BadRequestException(ErrCode.E_USER_PHONE_EXISTED);
    // }

    let user = new this.userModel(createUserDto);
    const hashPassword = await bcrypt.hash(user.password, 10);
    user.username = createUserDto.phone;
    user.password = hashPassword;
    user.createdBy = userReq == null ? "" : userReq.username;
    if (user.role == UserRole.User) {
      this.mailService.sendInfoStaff(user, createUserDto.password)
        .then((res) => {
          console.log(`[email] sendInfoStaff to ${user.email} done: ${JSON.stringify(res)}`)
        })
        .catch(error => {
          console.log(`[email] sendInfoStaff to ${user.email} error`, error.stack)
        })
    }

    return user.save();
  }

  async registerEdit(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    const hashPassword = await bcrypt.hash(user.password, 10);
    user.username = createUserDto.phone;
    user.password = hashPassword;
    return user.save();
  }
  async updateDeviceTokens(token: string, authUser: JwtUser) {
    const user = await this.userModel.findById(authUser.userId)
      .orFail(new NotFoundException(ErrCode.E_USER_NOT_FOUND))
      .exec();

    user.deviceTokens.addToSet(token)

    return user.save();
  }

  async removeDeviceToken(token: string, authUser: JwtUser) {
    const user = await this.userModel.findByIdAndUpdate(authUser.userId,
      {
        $pullAll: { tokenFirebase: [token] }
      })
      .orFail(new NotFoundException(ErrCode.E_USER_NOT_FOUND))
      .exec();

    return user;
  }

  updateManyUserTokens(tokens: string[], authUser: JwtUser) {
    if (tokens && tokens?.length > 0) {
      for (let index = 0; index < tokens.length; index++) {
        this.userModel.updateMany(
          { tokenFirebase: { $in: [tokens[index]] } },
          { $pullAll: { tokenFirebase: [tokens[index]] } }
        )
          .byTenant(authUser.owner)
          .exec();
      }
    }
    return true;
  }
  async findAll(authUser: JwtUser, query: Paginate & QueryUser) {
    if (authUser.role != UserRole.Admin) {
      throw new ForbiddenException();
    }
    const cond = filterParams(query, ['createdBy']);
    const cmd = this.userModel.find(cond)
      .populate({
        path: 'listProduct',
        select: ''
      }).populate({
        path: 'listAddress',
      })
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

  async findOne(id: string, options?: { throwIfFail?: boolean, password?: boolean, lean?: boolean }) {
    
    const cmd = this.userModel.findById(id)
      .populate({
        path: 'listProduct',
      }).populate({
        path: 'listAddress',
      })
    if (options?.lean) {
      cmd.lean({ autopopulate: true })
    }
    if (options?.password) {
      cmd.select("+password")
    }
    if (options?.throwIfFail)
      cmd.orFail(new NotFoundException(ErrCode.E_USER_NOT_FOUND))

    try {
      const data = await cmd.exec();
      return data;
    } catch (error) {
      console.log(error);

    }

  }

  async findByUsername(username: string, { password }: { password: boolean }) {
    let cmd = this.userModel.findOne({ username });
    if (password) {
      cmd.select('+password')
    }
    return cmd.exec();
  }

  async isPhoneNumberExist(phone: string) {
    let user = await this.userModel.findOne({ phone: phone }).exec();
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

    if (id != userReq.userId) {
      if (userReq.role != UserRole.Admin) {
        throw new ForbiddenException();
      }
    }

    const userC = await this.userModel.findById(id)
      .orFail(new NotFoundException(ErrCode.E_USER_NOT_FOUND))
      .exec();
    if (updateUserDto.phone && updateUserDto.phone != userC.phone) {
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
    if (userReq.role != UserRole.Admin) {
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
    user.role = info.role;
    return user.save();
  }
}
