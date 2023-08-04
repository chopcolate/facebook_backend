import { Model } from 'mongoose';
import CONSTANT from 'src/common/constants/constants';
import { Inject, Injectable } from '@nestjs/common';
import { IMedia } from './interfaces/media.interface';
@Injectable()
export class MediaService {
    constructor(
        @Inject(CONSTANT.MEDIA_MODEL_TOKEN) private readonly mediaModel: Model<IMedia>,
    ) {}

    async getMedia() {
        return await this.mediaModel.find();
    }
}
