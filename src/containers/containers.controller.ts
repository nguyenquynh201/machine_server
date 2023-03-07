import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContainersService } from './containers.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { AuthUser } from 'src/decors/user.decorator';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';

@ApiTags('Containers')
@BearerJwt()
@Controller('containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) { }

  @Post()
  create(@Body() dto: CreateContainerDto, @AuthUser() authUser: JwtUser) {
    return this.containersService.create(dto, authUser);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'containerCode', required: false, })
  findAll(
    @AuthUser() authUser: JwtUser,
    @Query('limit', new DefaultValuePipe('0'), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
    @Query('containerCode') containerCode?: string,
  ) {
    return this.containersService.findAll(authUser, {limit, offset, containerCode});
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
    return this.containersService.findOne(id, authUser);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContainerDto, @AuthUser() authUser: JwtUser) {
    return this.containersService.update(id, dto, authUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
    return this.containersService.remove(id, authUser);
  }
}
