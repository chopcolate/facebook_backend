import { Body, Req, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { JwtGuard } from './jwt.guard';
import { LocalGuard } from './local.guard';


@Controller('auth') 
export class AuthController {
    constructor(
        private readonly auth_service: AuthService,
    ) {}
    
    @UseGuards(LocalGuard)
    @Post('login')
    async login(@Req() req) {
        return req.user
    }

    @Post('register')
    async register(@Body() data) {
        return this.auth_service.register(data);
    }


}