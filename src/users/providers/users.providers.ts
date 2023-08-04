import { Connection } from 'mongoose';
import { UserSchema } from '../schema/users.schema';
import CONSTANT from 'src/common/constants/constants';

export const usersProviders = [
    {
        provide: CONSTANT.USER_MODEL_TOKEN,
        useFactory: (connection: Connection) => connection.model('users', UserSchema),
        inject: [CONSTANT.DATABASE_CONNECTION],
    }
]