import { Body, Controller, HttpCode, Get, Post, Res, Query } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { OkRespone } from 'src/commons/okResponse';
import { AuthService } from './auth.service';
import { UserRefreshToken } from './dto/refresh-token.dto';
import { OnesignalService } from 'src/onesignal/onesignal.service';
import { UserLoginDto } from './dto/userLogin.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private onsignal: OnesignalService
    ) { }

    @Post('login')
    @HttpCode(200)
    async login(@Body() req: UserLoginDto) {
        return this.authService.login(req.username, req.password);
    }

    @Post('refresh_token')
    refreshToken(@Body() req: UserRefreshToken) {
        return this.authService.refreshToken(req);
    }

    @Post('verify_token')
    verifyToken(@Body() req: VerifyTokenDto) {
        return this.authService.verifyToken(req);
    }

    // @Post('register')
    // async register(@Body() info: RegisterUserDto) {
    //     const result = await this.authService.register(info);
    //     return new OkRespone({
    //         data: {
    //             _id: result._id,
    //             username: result.username,
    //             role: result.role,
    //         }
    //     });
    // }

}
