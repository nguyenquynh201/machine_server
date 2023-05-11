import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/users/entities/user.entity";
import { StatusHistory } from "../interface/maintenance-schedule-status";
import { MAINTENANCE_SCHEDULE } from "src/commons/constants/schemaConst";

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class MaintenanceScheduleHistory {
  @Prop({
    types: mongoose.Schema.Types.ObjectId, ref: MAINTENANCE_SCHEDULE,
    autopopulate: { select: 'target' }
  })
  maintenance: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  before: object;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  after: object;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  change: object;

  @Prop()
  status: string | StatusHistory;

  @Prop({
    types: mongoose.Schema.Types.ObjectId, ref: User.name,
    autopopulate: { select: 'username fullName email avatar' }
  })
  updatedBy: string;
}

export type MaintenanceScheduleHistoryDocument = MaintenanceScheduleHistory & mongoose.Document;
export const MaintenanceScheduleHistorySchema = SchemaFactory.createForClass(MaintenanceScheduleHistory);
MaintenanceScheduleHistorySchema.index({ product: 1 })
