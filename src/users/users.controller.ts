import { postDto } from './dto/post.dto';
import { Controller, Get, Post, Put, Delete, Param, Query, Req, Body, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './users.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { MessageService } from 'src/message/message.service';

@Controller('user')
@UseGuards(JwtGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly messageService: MessageService,
    ) {}

    @Get('contacts')
    async getContactsInfo(@User() user) {
        return await this.usersService.getContactsInfo(user.username);
    }

    @Get('requests')
    async getRequestsInfo(@User() user) {
        return await this.usersService.getRequestsInfo(user.username);
    }

    @Get('getUser/:username')
    async getUserByUsername(@Param('username') username: string) {
        return await this.usersService.getUserByUsername(username);
    }

    @Get('message/:partner')
    async getMessage(@Param('partner') partner, @User() user) {
        return await this.messageService.getMessage(user.username, partner);
    }

    @Post('create-post')
    @UseInterceptors(FileInterceptor('image'))
    createPost(@UploadedFile() file, @Body() data) {
        return this.usersService.createPost(file, data);
    }

    @Post('update')
    @UseInterceptors(FileInterceptor('avatar'))
    async update(@User() user, @UploadedFile() avatar, @Body() data) {
        return await this.usersService.update(user.username, avatar, data);
    }

    @Get('search')
    async search(@Query() value ) {
        return await this.usersService.search(value.keyword);
    }

    @Get()
    init(@User() user) {
        return this.usersService.init(user.username);
    }

    @Post('follow/:partnername')
    async follow(@User() user, @Param('partnername') partnername) {
        return await this.usersService.follow(user.username, partnername);
    }

    @Post('comment')
    async comment(@User() user, @Body() data) {
        return await this.usersService.comment(user, data);
    }

    @Post('love-post')
    async lovePost(@User() user, @Body() data) {
        return await this.usersService.lovePost(user, data);
    }
}

