import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class MaintenanceScheduleRateEntity {
    @Prop()
    maintenanceId?: string;
    @Prop()
    userId?: string;

    @Prop({ type: Number, required: true, min: 1, max: 5 })
    rating: number;

    @Prop({ type: String, required: true })
    comment: string;
}

export type MaintenanceScheduleRateEntityDocument = MaintenanceScheduleRateEntity & mongoose.Document;
export const MaintenanceScheduleRateEntitySchema = SchemaFactory.createForClass(MaintenanceScheduleRateEntity);
MaintenanceScheduleRateEntitySchema.index({ userId: 1 }).index({ maintenanceId: 1 });

