import { PartialType } from '@nestjs/swagger';
import { CreateProductCtgDto } from './create-product-ctg.dto';

export class UpdateProductCtgDto extends PartialType(CreateProductCtgDto) {}
