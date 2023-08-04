import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaProvider } from './providers/media.provider';
import { databaseModule } from 'src/common/database/database.module';

@Module({
  imports: [databaseModule],
  providers: [MediaService, ...MediaProvider],
  controllers: [MediaController]
})
export class MediaModule {}
