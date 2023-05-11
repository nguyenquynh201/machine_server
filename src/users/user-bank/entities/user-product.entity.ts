import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "src/products/entities/product.entity";
import { PRODUCT } from "src/commons/constants/schemaConst";
@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class UserProduct {
  @Prop()
  userId?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId, ref: PRODUCT,
    autopopulate: { select: '' }
  })
  productId?: string | Product;

  // sô lượng
  @Prop()
  lastMaintenanceDate?: Date;

  @Prop()
  nextMaintenanceDate?: Date;
}

export type UserProductDocument = UserProduct & mongoose.Document;
export const UserProductSchema = SchemaFactory.createForClass(UserProduct);
UserProductSchema.index({ userId: 1 });

