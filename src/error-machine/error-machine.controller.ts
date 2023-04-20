import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';
import { ErrorMachineService } from './error-machine.service';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { AuthUser } from 'src/decors/user.decorator';
import { CreateErrorMachineDto } from './dto/create_error_machine.dto';
import { UpdateErrorMachineDto } from './dto/update_error_machine.dto';

@ApiTags('Error Machine')
@Controller('error-machine')
@BearerJwt()
export class ErrorMachineController {
    constructor(private readonly errorMachineService: ErrorMachineService) { }

    @Post()
    create(@Body() createErrorMachine: CreateErrorMachineDto, @AuthUser() authUser: JwtUser) {
        return this.errorMachineService.create(createErrorMachine, authUser);
    }

    @Get()
    findAll(@AuthUser() authUser: JwtUser) {
        return this.errorMachineService.findAll(authUser);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
        return this.errorMachineService.findOne(id, authUser);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateErrorMachineDto: UpdateErrorMachineDto,
        @AuthUser() authUser: JwtUser) {
        return this.errorMachineService.update(id, updateErrorMachineDto, authUser);
    }

    @Delete(':id')
    // @Roles(UserRole.Admin, UserRole.Owner, UserRole.Manager)
    remove(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
        return this.errorMachineService.remove(id, authUser);
    }
}
