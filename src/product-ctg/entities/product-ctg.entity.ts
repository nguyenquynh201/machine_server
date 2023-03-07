import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class ProductCtg {
    @Prop()
    name: string;

    @Prop()
    note: string;
}

export const ProductCtgSchema = SchemaFactory.createForClass(ProductCtg);
export type ProductCtgDocument = ProductCtg & mongoose.Document;

ProductCtgSchema.index({ name: 'text'})