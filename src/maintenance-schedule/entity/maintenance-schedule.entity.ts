/* eslint-disable no-var */
import { Document, Types } from 'mongoose';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITenant } from 'src/commons/mongoosePlugins/tenant';
import { TenantPlugin } from 'src/commons/mongoosePlugins/tenant.plugin';
import { User } from 'src/users/entities/user.entity';
import { ERROR_MACHINE, MAINTENANCE_SCHEDULE_RATE, MAINTENANCE_SCHEDULE_STAFF, MAINTENANCE_SCHEDULE_STATUS, PRODUCT, USER_ADDRESS } from 'src/commons/constants/schemaConst';
import { MaintenanceScheduleStatus } from 'src/maintenance-schedule-status/entity/maintenance-schedule-status.entity';
import { MaintenanceScheduleBugDocument } from './maintenance-schedule-bug.entity';
import { Product } from 'src/products/entities/product.entity';
import { ErrorMachineEntity } from 'src/error-machine/entity/error-machine.entity';
import { MaintenanceScheduleTarget } from '../interface/maintenance-schedule-target';
import { MaintenanceScheduleStaff } from './maintenance-schedule-staff.entity';
import { MaintenanceStatusEnum } from '../interface/maintenance-schedule-status';
import { UserAddress } from 'src/users/user-address/entity/user-address.entity';
import { MaintenanceScheduleRateEntity } from '../maintenance-schedule-rate/entity/maintenance-schedule-rate.entity';
@Schema({ timestamps: true, toJSON: { versionKey: false } })
export class MaintenanceScheduleEntity implements ITenant {

    @Prop()
    maintenanceContent?: string;
    @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: PRODUCT,
        autopopulate: { select: 'nameMaintenance lastMaintenanceDate nextMaintenanceDate imageMachine serialNumber' }
    })
    products: any | Product;
    @Prop([{
        type: mongoose.Schema.Types.ObjectId, ref: ERROR_MACHINE,
        autopopulate: { select: ' maintenanceContent price' }
    }])
    errorMachine?: string[] | ErrorMachineEntity[];
    @Prop({
        type: String, default: MaintenanceScheduleTarget.Frequent,
        enum: [
            MaintenanceScheduleTarget.Frequent, MaintenanceScheduleTarget.Maintenance,
        ]
    })
    target: string

    @Prop({ default: MaintenanceStatusEnum.Waiting })
    status?: MaintenanceStatusEnum;

    @Prop()
    bugs: MaintenanceScheduleBugDocument[];

    @Prop()
    startDate?: Date;

    @Prop()
    dueDate?: Date;

    @Prop()
    totalMoney?: number;

    @Prop()
    totalBugMoney?: number;

    @Prop()
    note?: string;

    @Prop({ type: String, ref: User.name, autopopulate: { select: 'username phone avatar fullName role ' } })
    createdBy: any;
    @Prop({ type: String, ref: User.name, autopopulate: { select: 'username' } })
    owner?: string;

    @Prop({ default: false })
    isReceive?: boolean;

    @Prop([{
        type: mongoose.Schema.Types.ObjectId, ref: User.name,
        autopopulate: { select: 'username fullName phone avatar birth' }
    }])
    relateStaffs?: Types.Array<User>;

    @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: USER_ADDRESS,
        autopopulate: { select: 'userId nameAddress gender phone addressProvince addressDistrict addressUser' }
    })
    address: any | UserAddress;


    rating: { rating: MaintenanceScheduleRateEntity }
}

export type MaintenanceScheduleDocument = MaintenanceScheduleEntity & Document;
export const MaintenanceScheduleEntitySchema = SchemaFactory.createForClass(MaintenanceScheduleEntity);
MaintenanceScheduleEntitySchema.plugin(TenantPlugin.addPlugin);
MaintenanceScheduleEntitySchema.index({
    maintenanceContent: 'text',
}).index({ status: 1 });

MaintenanceScheduleEntitySchema.virtual('rating', {
    ref: MAINTENANCE_SCHEDULE_RATE,
    justOne: false,
    localField: '_id',
    foreignField: 'maintenanceId'
});

