/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { TenantPlugin } from "src/commons/mongoosePlugins/tenant.plugin";
import mongoose from "mongoose";

@Schema({ timestamps: true, toJSON: { versionKey: false } })
export class ErrorMachineEntity {
    @Prop()
    maintenanceContent: string;

    @Prop({ default: 0 })
    price: number;
}

export type ErrorMachineEntityDocument = ErrorMachineEntity & mongoose.Document;
export const ErrorMachineEntitySchema = SchemaFactory.createForClass(ErrorMachineEntity);
ErrorMachineEntitySchema.plugin(TenantPlugin.addPlugin);
ErrorMachineEntitySchema.index({
    maintenanceContent: 'text',
});