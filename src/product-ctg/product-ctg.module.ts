import { Module } from '@nestjs/common';
import { ProductCtgService } from './product-ctg.service';
import { ProductCtgController } from './product-ctg.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PRODUCT_CTG } from 'src/commons/constants/schemaConst';
import { ProductCtgSchema } from './entities/product-ctg.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: PRODUCT_CTG,
        useFactory: () => ProductCtgSchema,
      }
    ]),
  ],
  controllers: [ProductCtgController],
  providers: [ProductCtgService]
})
export class ProductCtgModule { }
