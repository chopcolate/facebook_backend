import { Connection } from 'mongoose';
import { PostSchema } from '../schema/posts.schema';
import CONSTANT from 'src/common/constants/constants';

export const postsProvider = [
    {
        provide: CONSTANT.POST_MODEL_TOKEN,
        useFactory: (connection: Connection) => connection.model('posts', PostSchema),
        inject: [CONSTANT.DATABASE_CONNECTION],
    }
]