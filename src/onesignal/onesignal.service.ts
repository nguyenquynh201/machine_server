import { Injectable } from '@nestjs/common';
import * as OneSignal from 'onesignal-node';

@Injectable()
export class OnesignalService {
  private oneSignalClient: OneSignal.Client;

  constructor() {
    this.oneSignalClient = new OneSignal.Client("7e5a437e-6db5-4645-be8d-877f1b3989c2",
      "NzgyNWU3MjMtYTFiMy00ZDExLWI2ZDktYWU1ZmNiOGMzNTE2")
  }

  async sendNotification(
    contents: Record<string, string>,
    playerIds: string[],
  ): Promise<any> {
    const notification = {
      app_id: "7e5a437e-6db5-4645-be8d-877f1b3989c2",
      contents,
      include_player_ids: ["7e5a437e-6db5-4645-be8d-877f1b3989c2"],
    };
    console.log(notification);
    return await this.oneSignalClient.createNotification(notification);
  }
}
