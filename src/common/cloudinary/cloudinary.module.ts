import { Module } from '@nestjs/common';
import { cloudinaryProviders } from './cloudinary.providers';
import { cloudinaryService } from './cloudinary.service';

@Module({
    providers: [...cloudinaryProviders, cloudinaryService],
    exports: [...cloudinaryProviders, cloudinaryService],
})

export class cloudinaryModule {}