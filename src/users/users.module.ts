import { databaseModule } from './../common/database/database.module';
import { cloudinaryModule } from './../common/cloudinary/cloudinary.module';
import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './providers/users.providers';
import { postsProvider } from './providers/posts.provider';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [databaseModule, cloudinaryModule, forwardRef(() => MessageModule)],
  providers: [UsersService, ...usersProviders, ...postsProvider],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
