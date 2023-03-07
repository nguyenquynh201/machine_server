import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtConstants } from 'src/commons/constants/envConst';
import { UsersService } from 'src/users/users.service';
import { JwtUser } from './inteface/jwtUser';
import { JwtPayload } from './inteface/jwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JwtConstants.secret,
        });
    }

    async validate(payload: JwtPayload): Promise<JwtUser> {
        const userId = payload.id;
        const user = await this.userService.findOne(userId, { throwIfFail: false, lean: true });
        if (!user) {
            throw new UnauthorizedException();
        }
        const ret = {
            userId: payload.id,
            username: payload.user,
            role: payload.role,
        }
        return ret;
    }
}
