import { Module } from '@nestjs/common';
import { PROVINCE } from 'src/commons/constants/schemaConst';
import { ProvinceSchema } from './entities/province.entity';
import { ProvincesController } from './provinces.controller';
import { ProvincesService } from './provinces.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: PROVINCE,
                useFactory: () => ProvinceSchema,
            }
        ]),
    ],
    controllers: [ProvincesController],
    providers: [ProvincesService],
    exports: [ProvincesService]
})
export class ProvincesModule { }
