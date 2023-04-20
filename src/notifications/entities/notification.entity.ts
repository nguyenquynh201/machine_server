import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITenant } from 'src/commons/mongoosePlugins/tenant';
import { TenantPlugin } from 'src/commons/mongoosePlugins/tenant.plugin';
import { NotificationType } from 'src/commons/enums/notifications/notificationTypeEnum';
import { User } from 'src/users/entities/user.entity';

@Schema({ timestamps: true, toJSON: { versionKey: false } })
export class Notifications implements ITenant {
    @Prop()
    title: string;

    @Prop()
    description?: string;

    @Prop({ default: NotificationType.all })
    type: string | NotificationType;

    @Prop({
        types: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        autopopulate: { select: 'username fullName email avatar email birth' },
    })
    author: string;

    @Prop({ default: false })
    isRead: boolean;

    @Prop({ type: Object })
    object?: Record<string, string>;

    owner?: string;
}

export type NotificationsDocument = Notifications & Document;
export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
NotificationsSchema.plugin(TenantPlugin.addPlugin);
NotificationsSchema.index({
    title: 'text',
    description: 'text',
    author: 'text',
});
