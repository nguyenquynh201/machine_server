import mongoose from 'mongoose';
import { UserRole } from "../interface/userRoles";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({
    timestamps: true,
    toJSON: { versionKey: false }
})
export class User {

    @Prop({ required: true, lowercase: true })
    username: string;
    
    @Prop({ select: false })
    password: string;

    @Prop({ default: UserRole.View })
    role?: UserRole;

    @Prop({ lowercase: true })
    email: string;

    @Prop() 
    lastLogin: Date;

    @Prop() 
    fullName: string;

    @Prop() 
    address: string;
  
    @Prop() 
    phone?: string;

    @Prop()
    createdBy?: string;

}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 1 });
UserSchema.index({ fullName: 'text', email: 'text', phone: 'text' });
