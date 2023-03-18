import { Controller, Post, Body } from '@nestjs/common';
import { OnesignalService } from './onesignal.service';
@Controller('onesignal')
export class OnesignalController {
    constructor(private readonly oneSignalService: OnesignalService) {}

  @Post()
  async sendNotification(
    @Body('contents') contents: Record<string, string>,
    @Body('playerIds') playerIds: string[],
  ) {
    return this.oneSignalService.sendNotification(contents, playerIds);
  }
}
