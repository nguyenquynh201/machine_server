import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PRODUCT } from 'src/commons/constants/schemaConst';
import { ProductSchema } from './entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: PRODUCT,
        useFactory: () => ProductSchema,
      }
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
