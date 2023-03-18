import { Module } from '@nestjs/common';
import { OnesignalService } from './onesignal.service';
import { OnesignalController } from './onesignal.controller';
@Module({
    controllers: [OnesignalController],
    providers: [OnesignalService],
    exports: [OnesignalService]
})
export class OnesignalModule { }
