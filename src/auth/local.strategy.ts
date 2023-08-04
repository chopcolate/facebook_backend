import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private auth_service: AuthService,
    ) {
        super();
    }

    async validate(username, password) {
        const user = await this.auth_service.validate(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        else {
            return user;
        }
    }
}