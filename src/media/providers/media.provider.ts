import { Connection } from 'mongoose';
import CONSTANT from '../../common/constants/constants';
import { MediaSchema } from '../schemas/media.schema';

export const MediaProvider = [{
    provide: CONSTANT.MEDIA_MODEL_TOKEN,
    useFactory: (connection: Connection) => connection.model('media', MediaSchema),
    inject: [CONSTANT.DATABASE_CONNECTION]
}]