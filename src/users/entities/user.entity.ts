import { UserRole } from "../interface/userRoles";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender } from "../interface/gender";


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
     
    @Prop()
    firebaseToken?: string;



}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 1 });
UserSchema.index({ fullName: 'text', email: 'text', phone: 'text' });
