import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ITenant } from "src/commons/mongoosePlugins/tenant";
import { User } from "src/users/entities/user.entity";
import { TenantPlugin } from 'src/commons/mongoosePlugins/tenant.plugin';

@Schema({ timestamps: true, toJSON: { versionKey: false } })
export class MaintenanceScheduleStatus implements ITenant {
    @Prop() name: string;
    @Prop() description?: string;
    @Prop() color?: string;
    @Prop({ default: false })
    inactiveMaintenanceSchedule: boolean;

    owner?: User | string;
}

export type MaintenanceScheduleDocument = MaintenanceScheduleStatus & mongoose.Document;

export const MaintenanceScheduleSchema = SchemaFactory.createForClass(MaintenanceScheduleStatus);

MaintenanceScheduleSchema.plugin(TenantPlugin.addPlugin);
