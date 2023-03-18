import { OnModuleInit, Injectable } from '@nestjs/common';
import * as OneSignal from 'onesignal-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OneSignalProvider implements OnModuleInit {
  private client: OneSignal.Client;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const appId = this.configService.get<string>('ONESIGNAL_APP_ID');
    const apiKey = this.configService.get<string>('ONESIGNAL_API_KEY');

    if (!appId || !apiKey) {
      throw new Error('Missing OneSignal configuration');
    }

    this.client = new OneSignal.Client(appId, apiKey);
  }

  getClient(): OneSignal.Client {
    return this.client;
  }
}
