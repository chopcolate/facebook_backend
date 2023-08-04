import { JwtGuard } from './../auth/jwt.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
@UseGuards(JwtGuard)
export class MediaController {
    constructor(
        private readonly service: MediaService,
    ) {}
    
    @Get()
    async getMedia() {
        return this.service.getMedia();
    }
}
