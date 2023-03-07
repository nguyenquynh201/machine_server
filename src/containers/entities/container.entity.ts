import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class Container {
    @Prop()
    containerCode: string;

    @Prop()
    containerNumber: string;

    @Prop()
    note: string;
}

export type ContainerDocument = Container & mongoose.Document;

export const ContainerSchema = SchemaFactory.createForClass(Container);
