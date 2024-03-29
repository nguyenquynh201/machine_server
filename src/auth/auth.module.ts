import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/commons/constants/envConst';
import { MailModule } from 'src/mail/mail.module';
import { OnesignalModule } from 'src/onesignal/onesignal.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: JwtConstants.secret,
      signOptions: {
        expiresIn: JwtConstants.accessTokenExpire
      }
    }),
    UsersModule,
    MailModule,
    OnesignalModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
