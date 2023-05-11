import {
  Controller, Get, Post, Body, Param, Delete, Request,
  Put, Query, DefaultValuePipe, ParseIntPipe
} from '@nestjs/common';
import { JwtUser } from 'src/auth/inteface/jwtUser';
import { AuthUser } from 'src/decors/user.decorator';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BearerJwt } from 'src/decors/bearer-jwt.decorator';
import { Request as ExRequest } from 'express';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationType } from 'src/commons/enums/notifications/notificationTypeEnum';
import { SortOrder } from 'src/commons/dto/sorting';
import { UserRole } from 'src/users/interface/userRoles';

@ApiTags('Notifications')
@Controller('Notifications')
@BearerJwt()
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) { }

  /**
 * Create notification
 */
  @Post()
  create(@Body() createSpeakersDto: CreateNotificationDto, @AuthUser() authUser: JwtUser) {
    return this.notificationService.create(createSpeakersDto, authUser);
  }

  /**
 * Get All notification
 */
  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: NotificationType, isArray: true, })
  @ApiQuery({ name: 'fromDate', required: false, type: Date, example: '2021-09-01T04:11:16.891Z' })
  @ApiQuery({ name: 'toDate', required: false, type: Date, example: '2021-09-01T04:11:16.891Z' })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'roles', required: false, enum: UserRole, type: String })

  findAll(@AuthUser() authUser: JwtUser,
    @Request() req?: ExRequest,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe('0'), ParseIntPipe) offset?: number,
    @Query('roles') roles?: string,
    @Query('search') search?: string) {
    return this.notificationService.findAll(authUser, {
      ...req.query, search,
      limit, offset
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUser() userReq: JwtUser) {
    return this.notificationService.findOne(id, userReq);
  }

  @Get('allNotificationAssignDone/:idMaintenance/:idStaff')
  findAndRemoveNotificationDuplicated(@Param('idMaintenance') id: string, @Param('idStaff') idStaff: string, @AuthUser() userReq: JwtUser) {
    return this.notificationService.findAndRemoveNotificationDuplicated(id, idStaff, userReq);
  }

  /**
   * update readAll notification
   */
  @Put('readAll')
  updateReadAll(@AuthUser() authUser: JwtUser) {
    // return this.notificationService.readAll(authUser);
  }

  /**
   * Update notification
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSpeakerDto: UpdateNotificationDto,
    @AuthUser() authUser: JwtUser) {
    return this.notificationService.update(id, updateSpeakerDto, authUser);
  }

  /**
   * Delete notification
   */
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() userReq: JwtUser) {
    return this.notificationService.remove(id, userReq);
  }
}
