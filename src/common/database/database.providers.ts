

import * as mongoose from 'mongoose';
import CONSTANT from '../constants/constants';

require('dotenv').config({path: 'src/.env'});
export const databaseProviders = [
    {
        provide: CONSTANT.DATABASE_CONNECTION,
        useFactory: (): Promise<typeof mongoose> => {
            const client =  mongoose.connect(process.env.MONGODB_URI, {dbName: 'facebook'})
            return client;
        }

    }
]