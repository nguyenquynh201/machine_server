import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { AuthUser } from 'src/decors/user.decorator';
import { UserProductService } from './user-product.service';
import { CreateUserProductDto } from './dto/create-user-product.dto';
import { UpdateUserProductDto } from './dto/update-user-product.dto';

@ApiTags('User')
@Controller('users/product')
@BearerJwt()
export class UserProductController {
  constructor(private readonly userProductService: UserProductService) { }

  @Post()
  create(@Body() createUserProductDto: CreateUserProductDto, @AuthUser() authUser: JwtUser) {
    return this.userProductService.create(createUserProductDto, authUser);
  }
  @Get()
  get(@AuthUser() authUser: JwtUser,) {
    return this.userProductService.findAllProductUser(authUser);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserProductDto: UpdateUserProductDto, @AuthUser() authUser: JwtUser) {
    return this.userProductService.update(id, updateUserProductDto, authUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
    return this.userProductService.remove(id, authUser);
  }
}
