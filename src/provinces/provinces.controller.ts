import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, Req } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';
import { ProvincesService } from './provinces.service';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { SortOrder } from 'src/commons/dto/sorting';
import { AuthUser } from 'src/decors/user.decorator';
import { Request, Response } from 'express';

@ApiTags('province')
@Controller('province')
@BearerJwt()
export class ProvincesController {
    constructor(private readonly provinceService: ProvincesService) { }
    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    @ApiQuery({ name: 'sortBy', required: false, type: String })
    @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'code', required: false, type: Number })
    findAll(@AuthUser() authUser: JwtUser,
        @Req() req: Request,
        @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit?: number,
        @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
        @Query('search') search?: string,
    ) {
        return this.provinceService.findAll(authUser, { ...req.query, limit, offset, search });
    }

    @Get('provinces')
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'code', required: false, type: Number })
    findAllProvince(@AuthUser() authUser: JwtUser,
        @Query('search') search?: string,
        @Query('code') code?: number,
    ) {
        return this.provinceService.findAllProvince(authUser, { search, code });
    }

    @Get(':id')
    findOne(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
        return this.provinceService.findOne(id, authUser);
    }

    @Get(':id/districts')
    findAllDistricts(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
        return this.provinceService.findAllDistricts(id, authUser);
    }
}
