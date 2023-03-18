import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { PRODUCT_CTG } from "src/commons/constants/schemaConst";
import { CONTAINER } from "src/commons/constants/schemaConst";
import { S3File, S3FileSchema } from 'src/storages/s3File.schema';
import { Types } from 'mongoose';
@Schema({
    timestamps: true
})
export class Product {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    brand: string;

    @Prop([S3FileSchema])
    imageMachine?: Types.Array<S3File>;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: PRODUCT_CTG,
        autopopulate: { select: 'name' }
    })
    category: string;

    @Prop()
    type: string;

    @Prop({ default: 0 })
    price: number;

    @Prop({ default: true })
    show: boolean;

    @Prop([{
        type: mongoose.Schema.Types.ObjectId, ref: CONTAINER,
        autopopulate: { select: 'containerCode containerNumber' }
    }])
    containers: string[];
}

export type ProductDocument = Product & mongoose.Document;
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ name: 'text' })
    .index({ category: 1 })
    .index({ code: 1 })
