import { MessageModule } from './message/message.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [UsersModule, AuthModule, MessageModule, MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
