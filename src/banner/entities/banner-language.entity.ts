import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export class BannerLanguage {
    @Prop() 
    title: string;
    
    @Prop() 
    description?: string;

    @Prop() 
    codeLanguage: string;
}
export type BannerLanguageDocument = BannerLanguage & mongoose.Document;
export const BannerLanguageSchema = SchemaFactory.createForClass(BannerLanguage);
