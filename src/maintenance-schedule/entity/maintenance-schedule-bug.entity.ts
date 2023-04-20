import mongoose from 'mongoose';
import { Prop, SchemaFactory } from "@nestjs/mongoose";

export class MaintenanceScheduleBugEntity {
    @Prop()
    nameBug: string;

    @Prop()
    priceBug: number;

}
export type MaintenanceScheduleBugDocument = MaintenanceScheduleBugEntity & mongoose.Document;
export const MaintenanceScheduleBugSchema = SchemaFactory.createForClass(MaintenanceScheduleBugEntity);