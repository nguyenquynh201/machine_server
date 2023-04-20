import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, UseInterceptors, UploadedFiles, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthUser } from 'src/decors/user.decorator';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';
import { OkRespone } from 'src/commons/okResponse';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody, ApiConsumes, ApiExcludeEndpoint, ApiParam, ApiQuery, ApiTags
} from '@nestjs/swagger';
import { FileUploadDto } from 'src/commons/dto/file-upload.dto';
import { multerFileFilter, multerStorage } from 'src/configs/multer.cnf';
import { UpdateProductTrueDto } from './dto/update-product-true.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { FileUploadImageDto, TypeImg } from 'src/commons/enums/typeimgs';
import { AllowPublic } from 'src/decors/allow-public.decorator';
import { Response } from 'express';
@ApiTags('Products')
@BearerJwt()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() dto: CreateProductDto, @AuthUser() authUser: JwtUser) {
    return this.productsService.create(dto, authUser);
  }
  @Post()
  createProductUser(@Body() dto: CreateProductDto, @AuthUser() authUser: JwtUser) {
    return this.productsService.create(dto, authUser);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'code', required: false, type: String })
  @ApiQuery({ name: 'show', required: false, type: Boolean })
  findAll(
    @AuthUser() authUser: JwtUser,
    @Query('limit', new DefaultValuePipe('0'), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
    @Query('search') search?: string,
    @Query('category') ctg?: string,
    @Query('code') code?: string,
    @Query('show') show?: boolean,
  ) {
    return this.productsService.findAll(authUser, {
      limit,
      offset,
      show,
      search,
      category: ctg,
      code
    });
  }

  @Patch('all-to-false')
  async updateAllFalse(@AuthUser() authUser: JwtUser) {
    const result = await this.productsService.updateAllFalse(authUser);
    return new OkRespone()
  }

  @Patch('update-true')
  async updateTrue(@Body() dto: UpdateProductTrueDto, @AuthUser() authUser: JwtUser) {
    const result = await this.productsService.updateTrue(dto, authUser);
    return new OkRespone()
  }

  @Delete('many-product')
  async deleteProducts(@Body() dto: DeleteProductDto, @AuthUser() authUser: JwtUser) {
    const result = await this.productsService.deleteProducts(dto, authUser);
    return new OkRespone()
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
    return this.productsService.findOne(id, authUser);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @AuthUser() authUser: JwtUser) {
    return this.productsService.update(id, dto, authUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() authUser: JwtUser) {
    return this.productsService.remove(id, authUser);
  }

  /**
   * Upload file
   */
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Support txt',
    type: FileUploadDto,
  })
  @Post('ngang')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
  ], {
    fileFilter: multerFileFilter(['txt']),
  }))
  async getNgang(
    @UploadedFiles() files: { file?: Express.Multer.File[] },
    @AuthUser() userReq: JwtUser,
    @Query('limit', new DefaultValuePipe('0'), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
  ) {
    const result = await this.productsService.getNgang(files.file[0], userReq, limit, offset);
    return result;
  }

  /**
   * Upload file
   */
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Support txt',
    type: FileUploadDto,
  })
  @Post('doc')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
  ], {
    fileFilter: multerFileFilter(['txt']),
  }))
  async getDoc(
    @UploadedFiles() files: { file?: Express.Multer.File[] },
    @AuthUser() userReq: JwtUser,
    @Query('limit', new DefaultValuePipe('0'), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
  ) {
    const result = await this.productsService.getDoc(files.file[0], userReq, limit, offset);
    return result;
  }

  /**
   * Upload file
   */
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Support txt',
    type: FileUploadDto,
  })
  @Post('ngang-doc')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
  ], {
    fileFilter: multerFileFilter(['txt']),
  }))
  async getNgangDoc(
    @UploadedFiles() files: { file?: Express.Multer.File[] },
    @AuthUser() userReq: JwtUser,
    @Query('limit', new DefaultValuePipe('0'), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
  ) {
    const result = await this.productsService.getNgangDoc(files.file[0], userReq, limit, offset);
    return result;
  }

  /** 
   * Upload image for posts category (server)
   */
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file. Support png, jpg, jpeg, webp',
    type: FileUploadImageDto,
  })
  @Post(':id/imageServer')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 }
    ],
      {
        fileFilter: multerFileFilter(['png', 'jpg', 'jpeg', 'webp']),
        // uploadFile on server
        storage: multerStorage('products')
      }
    )
  )
  async uploadImgServer(@Param('id') id: string,
    @UploadedFiles() files: { file?: Express.Multer.File[] },
    @AuthUser() authUser: JwtUser,
  ) {
    const result = await this.productsService.uploadImgServer(id, files.file[0], authUser);
    return new OkRespone({ data: { _id: result._id, image: result.imageMachine } });
  }

  @Delete(':id/imageServer/:file')
  @ApiParam({ name: 'id', required: true, description: "Id of posts" })
  @ApiParam({ name: 'file', required: true, description: "Id of image in posts" })
  async deleteImage(
    @AuthUser() userReq: JwtUser,
    @Param('id') id: string, @Param('file') fileId: string) {
    const result = await this.productsService.deleteImage(id, fileId, userReq);
    return new OkRespone({ data: result });
  }


  @ApiExcludeEndpoint()
  @Get('imageServer/:id/:filename')
  @AllowPublic()
  async getImgServer(
    @Res() res: Response,
    @Param('filename') filename: string
  ) {
    const url = await this.productsService.getImgServer(filename);
    // get file server
    return res.sendFile(url);
  }
}
