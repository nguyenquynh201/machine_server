import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from './entities/banner.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Banner.name, schema: BannerSchema }
  ]),],
  controllers: [BannerController],
  providers: [BannerService]
})
export class BannerModule { }
