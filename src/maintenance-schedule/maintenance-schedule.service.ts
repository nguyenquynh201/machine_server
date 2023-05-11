/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, ForbiddenException, HttpCode, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
// import _ from 'lodash';
const _ = require('lodash');
import { difference } from 'src/commons/utils/difference';
import { MaintenanceScheduleDocument } from './entity/maintenance-schedule.entity';
import { ERROR_MACHINE, MAINTENANCE_SCHEDULE } from 'src/commons/constants/schemaConst';
import { CreateMaintenanceScheduleDto } from './dto/create-maintenance-schedule.dto';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { ErrorMachineService } from 'src/error-machine/error-machine.service';
import { Paginate } from 'src/commons/dto/paginate.dto';
import { filterParams } from 'src/commons/utils/filterParams';
import { QueryProduct } from 'src/products/dto/query-product.dto';
import { ProductDocument } from 'src/products/entities/product.entity';
import { MaintenanceScheduleBugDocument } from './entity/maintenance-schedule-bug.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/commons/enums/notifications/notificationTypeEnum';
import { UserRole } from 'src/users/interface/userRoles';
import { QueryMaintenance } from './dto/query_maintenance.dto';
import { ErrCode } from 'src/commons/constants/errorConstants';
import { MaintenanceScheduleStaffService } from './maintenance-schedule-staff/maintenance-schedule-staff.service';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { CreateNotifyStaff } from './dto/create_notify_staff.dto';
import { MaintenanceScheduleTarget } from './interface/maintenance-schedule-target';
import { ProductsService } from 'src/products/products.service';
import { UpdateRequestStaffApplyDto } from './dto/update-apply-request.dto';
import { UpdateStatus } from './dto/update_status.dto';
import { UserAddressService } from 'src/users/user-address/user-address.service';
import { UserAddress, UserAddressDocument } from 'src/users/user-address/entity/user-address.entity';
import { MaintenanceStatusEnum, StatusHistory } from './interface/maintenance-schedule-status';
import { MaintenanceScheduleHistoryService } from './maintenance-schedule-history/maintenance-schedule-history.service';
import { UpdateMaintenanceScheduleDto } from './dto/update-maintenance-schedule.dto';

@Injectable()
export class MaintenanceScheduleService {
    constructor(
        @InjectModel(MAINTENANCE_SCHEDULE) private maintenanceScheduleModel: Model<MaintenanceScheduleDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(UserAddress.name) private userAddress: Model<UserAddressDocument>,
        private readonly statusModel: ErrorMachineService,
        private readonly notificationService: NotificationsService,
        private readonly maintenanceScheduleStaff: MaintenanceScheduleStaffService,
        private readonly productService: ProductsService,
        private readonly historyService: MaintenanceScheduleHistoryService,

    ) {

    }
    async create(CreateMaintenanceScheduleDto: CreateMaintenanceScheduleDto, userReq: JwtUser) {
        console.log("nè nè truong nào ", CreateMaintenanceScheduleDto);
        if (userReq.role != UserRole.User) {
            throw new ForbiddenException();
        }

        if (CreateMaintenanceScheduleDto.products !== null) {
            if (CreateMaintenanceScheduleDto.errorMachine?.length == 1) {
                CreateMaintenanceScheduleDto.errorMachine = [...CreateMaintenanceScheduleDto.errorMachine]
            }
            console.log("nè nè ", CreateMaintenanceScheduleDto);
            const product = await this.productService.findOne(CreateMaintenanceScheduleDto.products, userReq)
            if (product) {

                const maintenance_schedule = await new this.maintenanceScheduleModel(CreateMaintenanceScheduleDto)
                    .withTenant(userReq.owner);

                maintenance_schedule.createdBy = userReq.userId;
                maintenance_schedule.owner = userReq.owner;
                if (CreateMaintenanceScheduleDto.address !== null) {
                    const address = await this.userAddress.findById(CreateMaintenanceScheduleDto.address);
                    console.log('====================================');
                    console.log(address);
                    console.log('====================================');
                    if (address) {
                        maintenance_schedule.address = address;
                    }
                }
                console.log(maintenance_schedule);
                if (CreateMaintenanceScheduleDto.target == MaintenanceScheduleTarget.Frequent && CreateMaintenanceScheduleDto.errorMachine?.length > 0) {
                    throw new BadRequestException("lỗi chỉ dành cho dịch vụ sửa chữa");
                } else {
                    let totalErrorMoney = 0;
                    if (CreateMaintenanceScheduleDto.errorMachine?.length > 0) {
                        for (var item in CreateMaintenanceScheduleDto.errorMachine) {
                            console.log(CreateMaintenanceScheduleDto.errorMachine[item]);
                            const error = await this.statusModel.findOneUser(CreateMaintenanceScheduleDto.errorMachine[item]);
                            console.log(error);
                            if (error != null) {
                                totalErrorMoney += error.price;
                            }
                        }
                        console.log(totalErrorMoney);

                    }

                    let totalBugMoney = 0;
                    if (CreateMaintenanceScheduleDto.bugs?.length > 0) {
                        CreateMaintenanceScheduleDto.bugs?.forEach((item) => {
                            totalBugMoney += item.priceBug;
                        })
                    }
                    if (maintenance_schedule.target == MaintenanceScheduleTarget.Frequent) {
                        maintenance_schedule.totalMoney = 250000;
                    } else {
                        maintenance_schedule.totalMoney = totalBugMoney + totalErrorMoney;
                    }
                    console.log(maintenance_schedule.totalBugMoney);
                    const result = maintenance_schedule.save();
                    this.addNotification(maintenance_schedule, userReq);
                    return result;
                }
            }


        } else {
            throw new BadRequestException("Products cannot be empty");
        }
    }
    async update(
        id: string,
        dto: UpdateMaintenanceScheduleDto,
        authUser: JwtUser,
    ) {
        console.log('====================================');
        console.log("dto", dto);
        console.log('====================================');
        const doc = await this.maintenanceScheduleModel.findById(id)
            .byTenant(authUser.owner)
            .orFail(new NotFoundException(ErrCode.E_MAINTENANCE_NOT_FOUND))
            .exec();
        console.log("doc", doc);

        if (doc.status == MaintenanceStatusEnum.Waiting) {
            if (doc.target == MaintenanceScheduleTarget.Maintenance) {
                let totalErrorMoney = 0;
                if (dto.errorMachine?.length > 0) {
                    for (var item in dto.errorMachine) {
                        console.log(dto.errorMachine[item]);
                        const error = await this.statusModel.findOneUser(dto.errorMachine[item]);
                        console.log(error);
                        if (error != null) {
                            totalErrorMoney += error.price;
                        }
                    }
                    console.log("totalErrorMoney", totalErrorMoney);

                }
                doc.totalMoney = totalErrorMoney;

            }
            console.log("docdoc", doc);
            const history = {
                maintenance: doc._id,
                before: doc.toJSON(),
                updatedBy: authUser.userId,
                status: StatusHistory.update
            };
            const result = await doc.set(dto).save();

            const change = _.omit(difference(result.toJSON(), history.before), ['updatedAt']);
            this.historyService.create({ ...history, change }, authUser);
            return result;

        } else {
            throw new BadRequestException(ErrCode.E_STATUS_DONE_NOT_FOUND)
        }


    }
    private addNotification(maintenance: MaintenanceScheduleDocument, userReq: JwtUser) {
        let notify = {
            title: `Khách hàng có số điện thoại ${userReq.username} vừa tạo mới ${maintenance.target == MaintenanceScheduleTarget.Frequent ? "Lịch bảo trì và bảo dưỡng " : "Lịch sửa chữa"}`,
            description: maintenance.target,
            type: NotificationType.maintenanceSchedule,
            author: userReq.userId,
            image: '',
            isRead: false,
            role: UserRole.Admin,
            object: {
                idMaintenance: maintenance._id.toString(),
                startDate: maintenance.startDate.toISOString(),
                status: maintenance.status.toString(),
                target: maintenance.target.toString(),
            },
            owner: userReq.owner
        };
        console.log(notify);

        this.notificationService.create({ ...notify }, userReq, { push: false });
    }
    async findAll(authUser: JwtUser, query?: Paginate & QueryMaintenance) {

        let filter: FilterQuery<MaintenanceScheduleDocument> = {};
        if (query.toDate < query.fromDate) {
            throw new BadRequestException("toDateStart greater than toDateEnd");
        }
        let dayEnd = new Date();
        if (query.fromDate) {
            query.fromDate = new Date(query.fromDate);
            let dayStart = new Date(query.fromDate.toISOString().slice(0, 10));
            dayEnd = new Date(query.fromDate);
            dayEnd.setHours(23, 59, 59);
            filter.dueDate = { $gte: dayStart, $lte: dayEnd };
        }

        if (query.toDate) {
            dayEnd = new Date(query.toDate);
            dayEnd.setHours(24, 0, 0);
            filter.dueDate = { ...filter.dueDate, $lte: dayEnd };
        }
        if (query.search) {
            filter.$text = { $search: query.search };
        }
        console.log(filter);


        const cond = filterParams(query, ['status', 'target']);
        const cmd = this.maintenanceScheduleModel.find({ ...filter, ...cond })
            .lean({ autopopulate: true }).populate({
                path: 'rating',
                select: 'userId maintenanceId rating comment createdAt updatedAt'
            })
        if (query.assignee && query.assignee.length) {
            let assignees;
            if (typeof query.assignee == 'string') {
                assignees = [query.assignee]
            } else {
                assignees = query.assignee;
            }
            cmd.where('assignee').in(assignees);
        }

        //   if (query.idUser) {
        //     // find customer relate
        //     const todoCustomers = await this.relateCustomerService.findAll({ customer: query.idCustomer });
        //     const todoIds = todoCustomers.map(d => d.todo);
        //     cmd.where('_id').in(todoIds);
        //   }

        if (authUser.role == UserRole.Staff) {
            cmd.where('relateStaffs').in([authUser.userId]);
        }
        if (query.limit) {
            cmd.limit(query.limit);
        }
        if (query.offset) {
            cmd.skip(query.offset);
        }
        // console.log("cnd  ::: ", cmd.where('relateStaffs').in([authUser.userId]));

        const totalCmd = this.maintenanceScheduleModel.countDocuments(cmd.getQuery());
        const [data, total] = await Promise.all([cmd.exec(), totalCmd.exec()]);
        // console.log(query);
        // if (query.fromDate || query.toDate) {
        //     const fromDate = new Date(query.fromDate)
        //     const toDate = new Date(query.toDate)

        //     const result = data.filter(x => (x.startDate <= fromDate && x.dueDate >= fromDate)
        //         || (x.startDate <= toDate && x.dueDate >= toDate)
        //         || (x.startDate >= fromDate && x.dueDate <= toDate))
        //     return { total: result.length, data: result }

        // }
        return { total, data };

    }
    async assignStaff(id: string, userReq: JwtUser) {
        const todos = await this.maintenanceScheduleModel.find({ createdBy: userReq?.userId }).exec();
        if (todos && todos.length > 0) {
            todos.forEach(async tod => {
                const todo = await this.maintenanceScheduleModel.findById(tod['id']).exec();
                if (todo) {
                    todo.createdBy = id;
                    await todo.save();
                }
            })
        }
        const notify = {
            title: `${userReq.fullName}`,
            description: `${userReq.fullName} chuyển quyền sở hửu ${todos.length} công việc cho bạn.`,
            type: NotificationType.maintenanceSchedule,
            author: id,
            image: '',
            isRead: false,
            role: UserRole.Staff,
            object: {
                id: id,
                fullName: ``,
                userId: userReq.userId.toString(),
                username: userReq.username,
            },
            owner: userReq.owner
        };

        this.notificationService.create({ ...notify }, userReq, { push: false });
        return { total: todos.length };
    }
    //#region Relate Staff
    async addRelateStaffs(id: string, staffIds: string[], authUser: JwtUser) {
        const doc = await this.maintenanceScheduleModel.findById(id)
            .byTenant(authUser.owner)
            .orFail(new NotFoundException(ErrCode.E_CUSTOMER_NOT_FOUND))
            .exec();
        if (doc.relateStaffs?.length > 0) {
            throw new NotFoundException(ErrCode.E_MAINTENANCE_SCHEDULE_STAFF)
        }
        doc.relateStaffs.addToSet(...staffIds);
        console.log('====================================');
        console.log("doc.relateStaffs", doc.relateStaffs);
        console.log('====================================');
        const result = await doc.save();
        return result;
    }

    async updateRelateStaffs(id: string, staffIds: string[], authUser: JwtUser) {
        const doc = await this.maintenanceScheduleModel.findById(id)
            .byTenant(authUser.owner)
            .orFail(new NotFoundException(ErrCode.E_CUSTOMER_NOT_FOUND))
            .exec();

        const history = {
            maintenance: doc._id,
            before: doc.toJSON(),
            updatedBy: authUser.userId,
            status: MaintenanceStatusEnum.Waiting
        };
        const result = this.maintenanceScheduleStaff.updateRelateStaff(doc, staffIds);
        const change = _.omit(difference(staffIds.toString(), history.before), ['updatedAt']);
        this.historyService.create({ ...history, change }, authUser);
        if (result) {
            const updateStatus = {
                'status': MaintenanceStatusEnum.Received
            }
            const data = await doc.set(updateStatus).save();

        }
        return result;
    }

    async addNotificationStaff(id: string, staffIds: CreateNotifyStaff, authUser: JwtUser) {
        console.log('====================================');
        console.log(authUser);
        console.log('====================================');
        const doc = await this.maintenanceScheduleModel.findById(id)
            .orFail(new NotFoundException(ErrCode.E_MAINTENANCE_SCHEDULE_NOT_FOUND))
            .exec();
        if (doc.relateStaffs?.length > 0) {
            throw new NotFoundException(ErrCode.E_MAINTENANCE_SCHEDULE_STAFF)
        }

        const users = await this.userModel.findById(staffIds.idStaff)
            .orFail(new NotFoundException(ErrCode.E_USER_NOT_FOUND))
            .lean()
            .exec();
        console.log('====================================');
        console.log("doc", await this.maintenanceScheduleModel.findById(id)
            .orFail(new NotFoundException(ErrCode.E_MAINTENANCE_SCHEDULE_NOT_FOUND))
            .exec());
        console.log('====================================');
        const notify = {
            title: `${authUser.role} đã gửi cho bạn 1 thông báo`,
            description: `Có 1 lịch bảo trì và sửa chữa từ khách hàng ${doc.createdBy.username}`,
            type: NotificationType.maintenanceSchedule,
            author: users._id,
            image: '',
            isRead: false,
            role: UserRole.Staff,
            relateStaff: users._id.toString(),
            object: {
                idMaintenance: doc._id.toString(),
                target: doc.target,
                startDate: doc.startDate.toISOString(),
                idUser: authUser.userId
            },
            owner: authUser.owner
        };
        this.notificationService.create({ ...notify }, authUser, { push: false });


    }
    async updateRequest(id: string, idAdmin: string, receive: UpdateRequestStaffApplyDto, authUser: JwtUser) {
        console.log("nè nè", receive);

        const doc = await this.maintenanceScheduleModel.findById(id)
            .byTenant(authUser.owner)
            .orFail(new NotFoundException(ErrCode.E_ORDER_NOT_FOUND))
            .exec();

        if (doc.isReceive == true) {
            throw new ForbiddenException()
        }
        if (authUser.role !== UserRole.Staff) {
            throw new ForbiddenException()
        }
        const result = await doc.set(receive).save();
        if (result && receive.isReceive) {
            const data = await this.addRelateStaffs(doc._id.toString(), [authUser.userId.toString()], authUser)
            if (data) {
                const status = {
                    "status": MaintenanceStatusEnum.Received
                }
                await this.updateStatus(doc._id.toString(), status, authUser)
            }
        }
        if (receive.isReceive == false) {
            const notify = {
                title: `Nhân viên ${authUser.fullName != undefined ? authUser.fullName : authUser.username} đã phản hồi lại yêu cầu của bạn`,
                description: `Nhân viên ${authUser.fullName != undefined ? authUser.fullName : authUser.username} đã không chấp nhận yêu cầu từ bạn`,
                type: NotificationType.maintenanceSchedule,
                author: idAdmin,
                image: '',
                isRead: false,
                role: UserRole.Staff,
                relateStaff: authUser.userId.toString(),
                object: {
                    idMaintenance: doc._id.toString(),
                    target: doc.target,
                    startDate: doc.startDate.toISOString(),
                    idUser: authUser.userId
                },
                owner: authUser.owner
            }
            this.notificationService.create({ ...notify }, authUser, { push: false })
        } else {
            const notify = {
                title: `Nhân viên ${authUser.fullName != undefined ? authUser.fullName : authUser.username} đã phản hồi lại yêu cầu của bạn`,
                description: `Nhân viên ${authUser.fullName != undefined ? authUser.fullName : authUser.username} đã chấp nhận yêu cầu từ bạn`,
                type: NotificationType.maintenanceSchedule,
                author: idAdmin,
                image: '',
                isRead: false,
                role: UserRole.Staff,
                relateStaff: authUser.userId.toString(),
                object: {
                    idMaintenance: doc._id.toString(),
                    target: doc.target,
                    startDate: doc.startDate.toISOString(),
                    idUser: authUser.userId
                },
                owner: authUser.owner
            }

            this.notificationService.create({ ...notify }, authUser, { push: false })
        }
        await this.notificationService.findAndRemoveNotificationDuplicated(doc._id.toString(), authUser.userId.toString(), authUser)
        return result;
    }
    async updateStatus(id: string, status: UpdateStatus, authUser: JwtUser) {
        if (authUser.role !== UserRole.Staff) {
            throw new ForbiddenException()
        }
        const doc = await this.maintenanceScheduleModel.findById(id)
            .orFail(new NotFoundException(ErrCode.E_ORDER_NOT_FOUND))
            .exec();

        const history = {
            maintenance: doc._id,
            before: doc.toJSON(),
            updatedBy: authUser.userId,
            status: StatusHistory.update
        };
        const data = await doc.set(status).save();
        console.log("data.toJSON(),", data.toJSON(),);

        const change = _.omit(difference(data.toJSON(), history.before), ['updatedAt']);
        this.historyService.create({ ...history, change }, authUser);

        if (data) {
            const notify = {
                title: `Nhân viên ${authUser.fullName != undefined ? authUser.fullName : authUser.username} đã cập nhật trạng thái lịch của bạn`,
                description: `Nhân viên ${authUser.fullName != undefined ? authUser.fullName : authUser.username} đã chấp nhận yêu cầu từ bạn`,
                type: NotificationType.maintenanceSchedule,
                author: doc.createdBy._id.toString(),
                image: '',
                isRead: false,
                role: UserRole.User,
                relateStaff: authUser.userId.toString(),
                object: {
                    idMaintenance: doc._id.toString(),
                    target: doc.target,
                    startDate: doc.startDate.toISOString(),
                    idStaff: authUser.userId,
                    status: status.status
                },

                owner: authUser.owner
            }
            this.notificationService.create({ ...notify }, authUser, { push: false })
        }

        return data;

    }
    async findOne(id: string, options?: { throwIfFail?: boolean, password?: boolean, lean?: boolean }) {

        const cmd = this.maintenanceScheduleModel.findById(id)
            .populate({
                path: 'rating',
            })
        if (options?.lean) {
            cmd.lean({ autopopulate: true })
        }
        if (options?.throwIfFail)
            cmd.orFail(new NotFoundException(ErrCode.E_USER_NOT_FOUND))

        try {
            console.log("cmd", cmd);

            const data = await cmd.exec();
            return data;
        } catch (error) {
            console.log(error);

        }

    }
}
