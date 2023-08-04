import { Connection } from 'mongoose';
import { OnlineSchema } from '../schemas/online.schema';
import CONSTANT from 'src/common/constants/constants';

export const onlineProviders = [{
    provide: CONSTANT.ONLINE_MODEL_TOKEN,
    useFactory: (connection: Connection) => connection.model('online', OnlineSchema),
    inject: [CONSTANT.DATABASE_CONNECTION],
}];