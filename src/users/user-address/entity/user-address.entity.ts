import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Gender } from "src/commons/define";
@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class UserAddress {
  @Prop()
  userId?: string;

  @Prop({ default: false })
  fixed?: boolean;

  @Prop({ required: true })
  nameAddress: string;

  @Prop({ default: Gender.Female })
  gender: Gender;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  addressProvince: string;

  @Prop({ required: true })
  addressDistrict: string;

  @Prop({ required: true })
  addressUser: string;
}

export type UserAddressDocument = UserAddress & mongoose.Document;
export const UserAddressSchema = SchemaFactory.createForClass(UserAddress);
UserAddressSchema.index({ userId: 1 });

