import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { PRODUCT_CTG } from "src/commons/constants/schemaConst";
import { S3File, S3FileSchema } from 'src/storages/s3File.schema';
import { User } from 'src/users/entities/user.entity';
import { Types } from 'mongoose';
import { ITenant } from 'src/commons/mongoosePlugins/tenant';
@Schema({
    timestamps: true
})
export class Product {

    @Prop({ required: true })
    nameMaintenance: string;

    @Prop([S3FileSchema])
    imageMachine?: Types.Array<S3File>;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: PRODUCT_CTG,
        autopopulate: { select: 'name' }
    })
    category: string;

    @Prop()
    serialNumber: string;

    @Prop({ required: true })
    manufacturer: string; /// nhà sản xuất

    @Prop({ required: true })
    specifications: string; /// thông số kỹ thuật

    @Prop({ required: true })
    yearOfManufacturer: Date; /// năm sản xuất

    @Prop()
    purchaseDate?: Date; /// năm ngày mua

    @Prop()
    lastMaintenanceDate?: Date; /// năm ngày mua

    @Prop()
    nextMaintenanceDate?: Date; /// năm ngày mua

    @Prop({ type: String, ref: User.name, autopopulate: { select: 'username' } })
    createdBy: string;

    // @Prop({ type: String, ref: User.name, autopopulate: { select: 'username phone avatar fullName role' } })
    // buyer: string;

    @Prop({ default: true })
    show: boolean;

    owner?: string;

}

export type ProductDocument = Product & mongoose.Document;
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ name: 'text' })
    .index({ category: 1 })
    .index({ code: 1 })
