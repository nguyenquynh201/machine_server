import { UserRole } from "../interface/userRoles";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Gender } from "../interface/gender";
// import { Product } from "src/products/entities/product.entity";
import { PRODUCT, USER_ADDRESS, USER_PRODUCT } from "src/commons/constants/schemaConst";
import { UserProduct } from "../user-bank/entities/user-product.entity";
import { UserAddress } from "../user-address/entity/user-address.entity";

@Schema({
    timestamps: true,
    toJSON: { versionKey: false }
})
export class User {

    @Prop({ required: true, lowercase: true })
    username: string;

    @Prop({ select: false })
    password: string;

    @Prop({ default: UserRole.User })
    role?: UserRole;

    @Prop({ default: Gender.Other })
    gender?: Gender;

    @Prop({ lowercase: true, required: true, unique: true })
    email: string;

    @Prop()
    lastLogin: Date;

    @Prop()
    fullName: string;

    @Prop()
    addressProvince?: string;

    @Prop()
    addressDistrict?: string;

    @Prop()
    address?: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    createdBy?: string;

    @Prop([{
        type: String,
    }])
    deviceTokens: mongoose.Types.Array<string>;

    @Prop({ default: false })
    resetPassword?: boolean;

    listProduct: { listProduct: UserProduct }[];

    listAddress: { listAddress: UserAddress }[];
}
export type UserDocument = User & mongoose.Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 1 });
UserSchema.index({ fullName: 'text', email: 'text', phone: 'text' });

UserSchema.virtual('listProduct', {
    ref: USER_PRODUCT,
    justOne: false,
    localField: '_id',
    foreignField: 'userId'
});

UserSchema.virtual('listAddress', {
    ref: USER_ADDRESS,
    justOne: false,
    localField: '_id',
    foreignField: 'userId'
});