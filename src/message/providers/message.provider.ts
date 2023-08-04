import { Connection } from 'mongoose';
import { MessageSchema } from '../schemas/message.schema';
import CONSTANT from '../../common/constants/constants';

export const MessageProvider = [{
    provide: CONSTANT.MESSAGE_MODEL_TOKEN,
    useFactory: (connection: Connection) => connection.model('messages', MessageSchema),
    inject: [CONSTANT.DATABASE_CONNECTION],
}]