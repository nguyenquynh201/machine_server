import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductCtgService } from './product-ctg.service';
import { CreateProductCtgDto } from './dto/create-product-ctg.dto';
import { UpdateProductCtgDto } from './dto/update-product-ctg.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthUser } from 'src/decors/user.decorator';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';

@ApiTags('Product Category')
@BearerJwt()
@Controller('product-ctgs')
export class ProductCtgController {
  constructor(private readonly productCtgService: ProductCtgService) { }

  @Post()
  create(@Body() dto: CreateProductCtgDto, @AuthUser() authUser: JwtUser) {
    return this.productCtgService.create(dto, authUser);
  }

  @ApiQuery({ name: 'search', required: false, type: String })
  @Get()
  findAll(
    @AuthUser() authUser: JwtUser,
    @Query('search') search?: string,
  ) {
    return this.productCtgService.findAll(authUser, { search });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
    return this.productCtgService.findOne(id, authUser);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductCtgDto, @AuthUser() authUser: JwtUser) {
    return this.productCtgService.update(id, dto, authUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
    return this.productCtgService.remove(id, authUser);
  }
}
