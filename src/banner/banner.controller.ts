import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiParam, ApiExcludeEndpoint, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { Response } from 'express';
import { FileUploadImageDto } from 'src/commons/enums/typeimgs';
import { OkRespone } from 'src/commons/okResponse';
import { multerFileFilter, multerStorage } from 'src/configs/multer.cnf';
import { AllowPublic } from 'src/decors/allow-public.decorator';
import { AuthUser } from 'src/decors/user.decorator';
import { BannerService } from './banner.service';
import { Status } from 'src/commons/enums/status.enum';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { BannerType } from './interface/banner-type';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';

@ApiTags('Banner')
@Controller('banner')
@BearerJwt()
export class BannerController {
    constructor(private readonly bannerService: BannerService) { }

    @Post()
    create(@Body() createBannerDto: CreateBannerDto, @AuthUser() authUser: JwtUser) {
        return this.bannerService.create(createBannerDto, authUser);
    }

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'status', required: false, enum: Status })
    @ApiQuery({ name: 'bannerType', required: false, enum: BannerType })
    findAll(@AuthUser() authUser: JwtUser,
        @Query('limit', new DefaultValuePipe('0'), ParseIntPipe) limit?: number,
        @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
        @Query('search') search?: string,
        @Query('status') status?: Status,
        @Query('bannerType') bannerType?: BannerType,
    ) {
        return this.bannerService.findAll(authUser, { limit, offset, search, status, bannerType });
    }

    @Get(':id')
    findOne(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
        return this.bannerService.findOne(id, authUser);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto,
        @AuthUser() authUser: JwtUser) {
        return this.bannerService.update(id, updateBannerDto, authUser);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
        return this.bannerService.remove(id, authUser);
    }

    /** 
     * Upload image for banner (aws3)
     */
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file. Support png, jpg, jpeg, webp',
        type: FileUploadImageDto,
    })
    @Post(':id/imageAws3')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'file', maxCount: 1 },
            { name: 'name', maxCount: 1 },
            { name: 'description', maxCount: 1 },
        ], {
            fileFilter: multerFileFilter(['png', 'jpg', 'jpeg', 'webp']),
        }))
    async uploadImg(@Param('id') id: string,
        @UploadedFiles() files: { file?: Express.Multer.File[] },
        @Body('name') name: string,
        @Body('description') description: string,
        @AuthUser() authUser: JwtUser,
    ) {
        const result = await this.bannerService.uploadImg(id, files.file[0], authUser, name, description);
        return new OkRespone({ data: { _id: result._id, image: result.image } });
    }

    /** 
     * Upload image for banner (server)
     */
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file. Support png, jpg, jpeg, webp',
        type: FileUploadImageDto,
    })
    @Post(':id/imageServer')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'file', maxCount: 1 },
            { name: 'name', maxCount: 1 },
            { name: 'description', maxCount: 1 },
        ],
            {
                fileFilter: multerFileFilter(['png', 'jpg', 'jpeg', 'webp']),
                // uploadFile on server
                storage: multerStorage('banner')
            }
        )
    )
    async uploadImgServer(@Param('id') id: string,
        @UploadedFiles() files: { file?: Express.Multer.File[] },
        @AuthUser() authUser: JwtUser,
        @Body('name') name: string,
        @Body('description') description: string,
    ) {
        const result = await this.bannerService.uploadImgServer(id, files.file[0], authUser, name, description);
        return new OkRespone({ data: { _id: result._id, image: result.image } });
    }

    @Delete(':id/imageServer/:file')
    @ApiParam({ name: 'id', required: true, description: "Id of banner" })
    async deleteImage(
        @AuthUser() userReq: JwtUser,
        @Param('id') id: string,
        @Param('file') fileId: string
    ) {
        const result = await this.bannerService.deleteImage(id, fileId, userReq);
        return new OkRespone({ data: result });
    }

    @ApiExcludeEndpoint()
    @Get('image/:id/:filename')
    @AllowPublic()
    async getImg(
        @Res() res: Response,
        @Param('id') ctgId: string,
        @Param('filename') filename: string
    ) {
        const url = await this.bannerService.getImg(ctgId, filename);
        return res.redirect(url);
    }

    @ApiExcludeEndpoint()
    @Get('imageServer/:id/:filename')
    @AllowPublic()
    async getImgServer(
        @Res() res: Response,
        @Param('filename') filename: string
    ) {
        const url = await this.bannerService.getImgServer(filename);
        // get file server
        return res.sendFile(url);
    }
}
