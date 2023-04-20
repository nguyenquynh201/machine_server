/* eslint-disable no-var */
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITenant } from 'src/commons/mongoosePlugins/tenant';
import { TenantPlugin } from 'src/commons/mongoosePlugins/tenant.plugin';
import { User } from 'src/users/entities/user.entity';
import { ERROR_MACHINE, MAINTENANCE_SCHEDULE_STATUS, PRODUCT } from 'src/commons/constants/schemaConst';
import { MaintenanceScheduleStatus } from 'src/maintenance-schedule-status/entity/maintenance-schedule-status.entity';
import { MaintenanceScheduleBugDocument } from './maintenance-schedule-bug.entity';
import { Product } from 'src/products/entities/product.entity';
import { ErrorMachineEntity } from 'src/error-machine/entity/error-machine.entity';
import { MaintenanceScheduleTarget } from '../interface/maintenance-schedule-target';
@Schema({ timestamps: true, toJSON: { versionKey: false } })
export class MaintenanceScheduleEntity implements ITenant {

    @Prop()
    maintenanceContent?: string;
    @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: PRODUCT,
        autopopulate: { select: 'nameMaintenance imageMachine ' }
    })
    products: any | Product;
    @Prop([{
        type: mongoose.Schema.Types.ObjectId, ref: ERROR_MACHINE,
        autopopulate: { select: ' maintenanceContent price' }
    }])
    errorMachine?: any | ErrorMachineEntity[];
    @Prop({
        type: String, default: MaintenanceScheduleTarget.Frequent,
        enum: [
            MaintenanceScheduleTarget.Frequent, MaintenanceScheduleTarget.Maintenance,
        ]
    })
    target: string
    @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: MAINTENANCE_SCHEDULE_STATUS,
        autopopulate: { select: 'name color description' }
    })
    status?: any | MaintenanceScheduleStatus;
    @Prop()
    bugs: MaintenanceScheduleBugDocument[];
    @Prop([{
        type: mongoose.Schema.Types.ObjectId, ref: User.name,
        autopopulate: { select: 'username fullName phone avatar' }
    }])
    relateStaffs: any | User[];

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
}

export type MaintenanceScheduleEntityDocument = MaintenanceScheduleEntity & Document;
export const MaintenanceScheduleEntitySchema = SchemaFactory.createForClass(MaintenanceScheduleEntity);
MaintenanceScheduleEntitySchema.plugin(TenantPlugin.addPlugin);
MaintenanceScheduleEntitySchema.index({
    maintenanceContent: 'text',
}).index({ status: 1 });

