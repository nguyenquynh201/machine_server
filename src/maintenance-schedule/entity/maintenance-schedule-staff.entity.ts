import mongoose from "mongoose";
import { MaintenanceScheduleEntity } from "./maintenance-schedule.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MAINTENANCE_SCHEDULE } from "src/commons/constants/schemaConst";
import { User } from "src/users/entities/user.entity";
import { TenantPlugin } from "src/commons/mongoosePlugins/tenant.plugin";

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class MaintenanceScheduleStaff {
    @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: MAINTENANCE_SCHEDULE,
      })
      maintenanceSchedule: string | MaintenanceScheduleEntity;

      @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: User.name,
      })
      staff: string | User;

      @Prop() note?: string;

}
export type MaintenanceScheduleStaffDoc = MaintenanceScheduleStaff & mongoose.Document;

export const MaintenanceScheduleStaffSchema = SchemaFactory.createForClass(MaintenanceScheduleStaff)

MaintenanceScheduleStaffSchema.plugin(TenantPlugin.addPlugin)
  .index({ maintenanceSchedule: 1 })
  .virtual('object', {
    ref: User.name,
    justOne: false,
    localField: 'staff',
    foreignField: '_id'
  });
