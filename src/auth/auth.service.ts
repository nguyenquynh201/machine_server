import {
    BadRequestException, Injectable, NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConstants } from 'src/commons/constants/envConst';
import { ErrCode } from 'src/commons/constants/errorConstants';
import { MailService } from 'src/mail/mail.service';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/interface/userRoles';
import { UsersService } from 'src/users/users.service';
import { UserRefreshToken } from './dto/refresh-token.dto';
import { RegisterUserDto } from './dto/register.dto';
import { OnesignalService } from 'src/onesignal/onesignal.service';
@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private mailService: MailService,
        private onsignal: OnesignalService,

    ) { }

    async login(username: string, password: string) {
        const user = await this.userService.findByUsername(username, { password: true });
        if (!user) {
            throw new NotFoundException(ErrCode.E_USER_NOT_FOUND);
        }
        const validPassword = await this.userService.verifyUserPassword(user, password);
        if (!validPassword) throw new UnauthorizedException(ErrCode.E_USER_PASS_NOT_MATCH);
        const accessToken = this.genAccessToken(user);
        const refreshToken = this.genRefreshToken(user);
        user.lastLogin = new Date();
        await user.save();
        return { accessToken, refreshToken };
    }

    private genAccessToken(user: UserDocument) {
        const payload = {
            id: user._id,
            user: user.username,
            role: user.role,
            iss: 'container'
        };
        return this.jwtService.sign(payload);
    }

    private genRefreshToken(user: UserDocument) {
        const payload = {
            id: user._id,
            user: user.username,
            role: user.role,
            iss: 'container',
        };
        return this.jwtService.sign(payload, {
            secret: user.password,
            expiresIn: JwtConstants.refreshTokenExpire
        })
    }

    async refreshToken(userTokens: UserRefreshToken) {
        const payload = this.jwtService.verify(userTokens.accessToken, {
            secret: JwtConstants.secret,
            ignoreExpiration: true
        });
        const id = payload['id'];
        const user = await this.userService.findOne(id, {
            throwIfFail: true,
            password: true,
            lean: false
        });
        const key = user.password;
        const rfTokenDecode = this.jwtService.verify(userTokens.refreshToken, {
            secret: key,
            ignoreExpiration: false
        });
        const expired = rfTokenDecode['exp'];
        const nowInSec = Math.floor(Date.now() / 1000);
        let refreshToken = userTokens.refreshToken;
        // regen refresh token if it will be expired soon
        if (expired - nowInSec < JwtConstants.refresh_token_regen) {
            refreshToken = this.genRefreshToken(user);
        }
        const accessToken = this.genAccessToken(user);
        // update last login time
        user.lastLogin = new Date();
        await user.save();

        return { accessToken, refreshToken };
    }

    async register(dto: RegisterUserDto) {
        const exist = await this.userService.findByUsername(dto.email, { password: false })
        if (exist) {
            throw new BadRequestException(ErrCode.E_USER_EXISTED);
        }
        const phoneNumber = await this.userService.isPhoneNumberExist(dto.phone);
        if (phoneNumber) {
            throw new BadRequestException(ErrCode.E_USER_PHONE_EXISTED);
        }
        const user = await this.userService.registerEdit({ ...dto, role: UserRole.Staff });

        // this.mailService.sendUserConfirmation(user, password)
        // // this.mailService.sendUserForgotPassword(user, password)
        //     .then((res) => {
        //         console.log(`[email] send forgot passwd to ${user.email} done: ${JSON.stringify(res)}`)
        //     })
        //     .catch(error => {

        //         console.log(`[email] send forgot passwd to ${user.email} error`, error.stack)
        //     })

        return user;
    }
    // async forgotPassword(email: string) {
    //     const user = await this.userService.findByUsername(email, { password: false })
    //     if (!user) {
    //         throw new NotFoundException(ErrCode.E_USER_NOT_FOUND);
    //     }
    //     const token = Math.floor(10000 + Math.random() * 90000).toString();
    //     await this.confirmCodeService.create({
    //         userId: user._id,
    //         token,
    //         scope: ConfirmCodeScope.ForgotPass
    //     }, user.email);
    //     this.mailService.sendUserForgotPassword(user, token)
    //         .then((res) => {
    //            console.log(`[email] send forgot passwd to ${user.email} done: ${JSON.stringify(res)}`)
    //         })
    //         .catch(error => {

    //             console.log(`[email] send forgot passwd to ${user.email} error`, error.stack)
    //         })
    //     return user;
    // }

}
