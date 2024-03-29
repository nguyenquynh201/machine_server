import {
  Controller, Get, Post, Body, Param, Delete, Put,
  UseInterceptors, UploadedFile, DefaultValuePipe, ParseIntPipe, Res, Req, UploadedFiles,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';
import { ApiBody, ApiConsumes, ApiExcludeEndpoint, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserChangePassword } from './dto/userChangePass.dto';
import { OkRespone } from 'src/commons/okResponse';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { AuthUser } from 'src/decors/user.decorator';
import { Roles } from 'src/decors/roles.decorator';
import { UserRole } from './interface/userRoles';
import { ChangeRoleDto } from './dto/change-role.dto';
import { Query } from '@nestjs/common';
import { OnesignalService } from 'src/onesignal/onesignal.service';
import { UpdateDeviceTokenDto } from './dto/update-deviceToken.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from 'src/commons/dto/file-upload.dto';
import { multerFileFilter, multerStorage } from 'src/configs/multer.cnf';
import { AllowPublic } from 'src/decors/allow-public.decorator';
import { Response } from 'express';
import { FileUploadImageDto } from 'src/commons/enums/typeimgs';


@Controller('users')
@BearerJwt()
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly onsignal: OnesignalService,) { }

  @Post()
  @Roles(UserRole.Admin)
  async create(@Body() createUserDto: CreateUserDto, @AuthUser() authUser: JwtUser) {
    const res = await this.usersService.create(createUserDto, authUser);

    return new OkRespone({ data: { _id: res._id } });
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'createdBy', required: false, type: String, description: 'Username who create user' })
  @ApiQuery({ name: 'roles', required: false, enum: UserRole, type: String })
  findAll(@AuthUser() user: JwtUser,
    @Req() req: Request,
    @Query('limit', new DefaultValuePipe('0'), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
    @Query('search') search?: string,
    @Query('createdBy') createdBy?: string,
    @Query('roles') roles?: string,
  ) {
    return this.usersService.findAll(user, {
      limit, offset, search,
      roles,
      createdBy
    });
  }

  @Get('me')
  async getMe(@AuthUser() user: JwtUser) {
    const userId = user['userId'];

    return this.usersService.findOne(userId, { throwIfFail: true, lean: true });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id, { throwIfFail: true, lean: true });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,
    @AuthUser() userReq: JwtUser) {
    return this.usersService.update(id, updateUserDto, userReq);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  async remove(@Param('id') id: string, @AuthUser() userReq: JwtUser) {
    const result = await this.usersService.remove(id, userReq);
    return new OkRespone();
  }

  @Post(':id/password')
  async changePassword(@Param('id') id: string, @Body() info: UserChangePassword) {
    const result = await this.usersService.changePassword(id, info);
    return new OkRespone();
  }

  @Post('role')
  @Roles(UserRole.Admin)
  async changeRole(@Body() info: ChangeRoleDto, @AuthUser() authUser: JwtUser) {
    const result = await this.usersService.changeRole(info, authUser);
    return new OkRespone({ data: { _id: result._id, role: result.role } });
  }
  @Post('deviceToken')
  async addDeviceToken(@Body() info: UpdateDeviceTokenDto,
    @AuthUser() authUser: JwtUser
  ) {
    const result = await this.usersService.updateDeviceTokens(info.deviceToken, authUser);
    return new OkRespone();
  }

  @Delete('deviceToken')
  async removeDeviceToken(@Body() info: UpdateDeviceTokenDto,
    @AuthUser() authUser: JwtUser
  ) {
    const result = await this.usersService.removeDeviceToken(info.deviceToken, authUser);
    return new OkRespone();
  }
  /** 
   * Upload image for posts category (server)
   */
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file. Support png, jpg, jpeg, webp',
    type: FileUploadImageDto,
  })
  @Post(':id/avatars')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 }
    ],
      {
        fileFilter: multerFileFilter(['png', 'jpg', 'jpeg', 'webp']),
        // uploadFile on server
        storage: multerStorage('users')
      }
    )
  )
  async uploadImgServer(@Param('id') id: string,
    @UploadedFiles() files: { file?: Express.Multer.File[] },
    @AuthUser() authUser: JwtUser,
  ) {
    const result = await this.usersService.uploadImgServer(id, files.file[0], authUser);
    return new OkRespone({ data: result });
  }


  @ApiExcludeEndpoint()
  @Get('avatars/:id/:filename')
  @AllowPublic()
  async getImgServer(
    @Res() res: Response,
    @Param('filename') filename: string
  ) {
    const url = await this.usersService.getImgServer(filename);
    // get file server
    return res.sendFile(url);
  }
}
