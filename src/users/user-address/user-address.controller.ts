import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';
import { AuthUser } from 'src/decors/user.decorator';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UserAddressService } from './user-address.service';

@ApiTags('User')
@Controller('users/address')
@BearerJwt()
export class UserAddressController {
    constructor(private readonly userAddressService: UserAddressService) { }
    @Post()
    create(@Body() createUserAddressDto: CreateUserAddressDto, @AuthUser() authUser: JwtUser) {
        console.log(createUserAddressDto);
        return this.userAddressService.create(createUserAddressDto, authUser);
    }
    @Get()
    get(@AuthUser() authUser: JwtUser,) {
        return this.userAddressService.findAllAddressUser(authUser);
    }

    @Get(':id')
    getAddressById(@AuthUser() authUser: JwtUser, @Param('id') id: string) {
        return this.userAddressService.findAddressById(authUser, id);
    }
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserAddressDto: UpdateUserAddressDto, @AuthUser() authUser: JwtUser) {
        return this.userAddressService.update(id, updateUserAddressDto, authUser);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
        return this.userAddressService.remove(id, authUser);
    }
}
