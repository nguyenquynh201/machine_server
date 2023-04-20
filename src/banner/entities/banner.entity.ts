import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BannerLanguage } from './banner-language.entity';
import { S3File, S3FileSchema } from 'src/storages/s3File.schema';
import { Status } from 'src/commons/enums/status.enum';
import { BannerType } from '../interface/banner-type';

@Schema({ timestamps: true, toJSON: { versionKey: false } })
export class Banner {
    @Prop() 
    bannerLanguage: BannerLanguage[]

    @Prop() 
    link?: string;

    @Prop([S3FileSchema])
    image?: Types.Array<S3File>;
    @Prop() 
    bannerType?: BannerType;

    @Prop({default: Status.Active}) 
    status?: Status;

}

export type BannerDocument = Banner & Document;
export const BannerSchema = SchemaFactory.createForClass(Banner);
