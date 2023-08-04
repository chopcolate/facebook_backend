import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

require('dotenv').config({path: 'src/.env'});
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRETKEY,
        })
    }
    async validate(payload: any) {
        return {
            username: payload.username,
        }
    }
}