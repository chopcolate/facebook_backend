

import { v2 } from 'cloudinary';
import CONSTANT from '../constants/constants';

require('dotenv').config({path: 'src/.env'});
export const cloudinaryProviders = [
    {
        provide: CONSTANT.CLOUDINARY,
        useFactory: () => {
            return v2.config({
                cloud_name: process.env.CLOUDINARY_NAME,
                api_key: process.env.CLOUDINARY_API,
                api_secret: process.env.CLOUDINARY_SECRET,
                secure: true
            });
        }

    }
]