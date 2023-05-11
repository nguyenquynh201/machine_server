/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { ErrCode } from 'src/commons/constants/errorConstants';
import { Paginate } from 'src/commons/dto/paginate.dto';
import {
  Notifications,
  NotificationsDocument,
} from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationType } from 'src/commons/enums/notifications/notificationTypeEnum';
import { Sorting, SortOrder } from 'src/commons/dto/sorting';
import { FilterQuery } from 'mongoose';
import { FcmService } from './firebase/fcm.service';
import { UsersService } from 'src/users/users.service';
import { QueryMaintenance } from 'src/maintenance-schedule/dto/query_maintenance.dto';
import { UserRole } from 'src/users/interface/userRoles';

@Injectable()
export class NotificationsService {
  /**
   *
   */
  constructor(
    @InjectModel(Notifications.name)
    private notificationModel: Model<NotificationsDocument>,

    private fcmService: FcmService,
    private userService: UsersService,
  ) { }
  async create(
    createNotificationDto: CreateNotificationDto,
    authUser: JwtUser,
    option?: { push?: boolean },
  ) {
    console.log('====================================');
    console.log(createNotificationDto);
    console.log('====================================');



    const doc = await new this.notificationModel(createNotificationDto).withTenant(
      authUser.owner,
    ).save();

    if (option.push) {
      this.sendPushForNotification(doc);
    }
    console.log('====================================');
    console.log("doc", doc);
    console.log('====================================');
    return doc;
  }

  private async sendPushForNotification(doc: NotificationsDocument) {
    const user = await this.userService.findOne(doc.author, {
      lean: true,
      throwIfFail: false,
    });
    if (user) {
      const tokens = user.deviceTokens || [];

      this.fcmService.sendMessage(
        {
          title: doc.title,
          body: doc.description,
        },
        {
          notifyId: doc._id.toString(),
          type: doc.type,
          ...doc.object,
        },
        tokens,
        (error, result) => {
          if (error) {
            return;
          }

          const badTokens: string[] = [];
          result.response.forEach((res, chIdx) => {
            for (let i = 0; i < res.responses.length; i++) {
              const itemRespone = res.responses[i];

              if (!itemRespone.success) {
                if (result?.singleToken) {
                  badTokens.push(result.singleToken);
                } else {
                  badTokens.push(result.chunks[chIdx][i]);
                }
              }
            }
          });


        },
      );
    }
  }
  async findAndRemoveNotificationDuplicated(idMaintenance: string, idStaff: string, authUser: JwtUser) {
    const cmd = await this.notificationModel
      .find()
      .byTenant(authUser.owner).where('relateStaff', idStaff).where('object.idMaintenance', idMaintenance)
      .lean({ autopopulate: true }).exec();
    if (cmd) {
      await this.notificationModel.deleteMany().byTenant(authUser.owner).where('relateStaff', idStaff).where('object.idMaintenance', idMaintenance)
        .lean({ autopopulate: true }).exec()
    }
  }

  async findAll(authUser: JwtUser, query?: Paginate & QueryMaintenance & Sorting) {
    const filter: FilterQuery<NotificationsDocument> = {};
    console.log('====================================');
    console.log(query.roles);
    console.log('====================================');
    if (query.search) {
      filter.$text = { $search: `.*${query.search}.*`, $language: 'es' };
    }

    if (query.fromDate) {
      filter.createdAt = { $gte: query.fromDate };
    }

    if (query.toDate) {
      filter.createdAt = { ...filter.createdAt, $lte: query.toDate };
    }
    const cmd = this.notificationModel
      .find({ ...filter })
      .byTenant(authUser.owner)
      .lean({ autopopulate: true });

    if (query.type) {
      if (Array.isArray(query.type) && query.type.length > 0) {
        cmd.where('type').in(query.type);
      } else {
        if (query.type !== NotificationType.all) {
          cmd.where('type', query.type);
        }
      }
    }
    if (query.roles) {
      if (query.roles !== UserRole.Admin) {
        cmd.where('author', authUser.userId);
        console.log('====================================');
        console.log(query.roles !== authUser.role);
        console.log('====================================');
        if (query.roles !== authUser.role) {
          cmd.where('role', query.roles);
        } else {
          cmd.where('role', authUser.role);
        }
      }
    } else {
      if (authUser.role !== UserRole.Admin) {
        cmd.where('author', authUser.userId);
        cmd.where('role', authUser.role);
      }
    }

    if (query.limit) {
      cmd.limit(query.limit);
    }
    if (query.offset) {
      cmd.skip(query.offset);
    }
    if (query.sortBy) {
      cmd.sort({ [query.sortBy]: query.sortOrder });
    } else {
      cmd.sort({ ['createdAt']: SortOrder.desc });
    }
    console.log('====================================');
    console.log(cmd.getQuery());
    console.log('====================================');
    const totalCmd = this.notificationModel.countDocuments(cmd.getQuery());

    const [total, data] = await Promise.all([totalCmd.exec(), cmd.exec()]);
    const totalUnread = data.filter(x => !x.isRead).length

    return { total, totalUnread, data };
  }

  findOne(id: string, authUser: JwtUser) {
    return this.notificationModel
      .findById(id)
      .byTenant(authUser.owner)
      .lean({ autopopulate: true })
      .orFail(new NotFoundException(ErrCode.E_SPEAKER_NOT_FOUND))
      .exec();
  }

  async readAll(authUser: JwtUser) {
    const cmd = await this.notificationModel
      .updateMany({}, { $set: { isRead: true } })
      .byTenant(authUser.owner)
      .where('author', authUser.userId)
      .exec();
    // return { total: cmd.nModified, data: cmd };
  }

  update(
    id: string,
    dto: UpdateNotificationDto,
    authUser: JwtUser,
  ) {
    return this.notificationModel
      .findByIdAndUpdate(id, dto, { new: true })
      .byTenant(authUser.owner)
      .orFail(new NotFoundException(ErrCode.E_SPEAKER_NOT_FOUND))
      .exec();
  }

  async remove(id: string, userReq: JwtUser) {
    const speaker = await this.notificationModel
      .findByIdAndDelete(id)
      .byTenant(userReq.owner)
      .orFail(new NotFoundException(ErrCode.E_SPEAKER_NOT_FOUND))
      .exec();
    return speaker;
  }
}
