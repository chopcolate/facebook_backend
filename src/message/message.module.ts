import { UsersModule } from './../users/users.module';
import { UsersService } from './../users/users.service';
import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { onlineProviders } from './providers/online.providers';
import { databaseModule } from 'src/common/database/database.module';
import { MessageProvider } from './providers/message.provider';

@Module({
  imports: [databaseModule, UsersModule],
  providers: [MessageGateway, MessageService, ...onlineProviders, ...MessageProvider],
  exports: [MessageService]
})
export class MessageModule {}
