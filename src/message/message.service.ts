import { IOnline } from './interfaces/Online.interface';
import { IMessage } from './interfaces/Message.interface';
import { Model } from 'mongoose';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import CONSTANT from 'src/common/constants/constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessageService {
    constructor(
        @Inject(CONSTANT.ONLINE_MODEL_TOKEN) private readonly onlineModel: Model<IOnline>,
        @Inject(CONSTANT.MESSAGE_MODEL_TOKEN) private readonly messageModel: Model<IMessage>,
    ) {}

    async setOnline(username, socketId) {
        await this.onlineModel.find({ username: username }).deleteMany();
        const doc = {
            username: username,
            socketId: socketId,
        }
        return await this.onlineModel.create(doc);
    }

    async getOnline(userList) {
        return await this.onlineModel.find({ username: { $in: userList } });
    }

    async offline(socketId) {
        return await this.onlineModel.deleteMany({ socketId: socketId });
    }

    async pushMessage(message) {
        const members = [message.from, message.to].sort();
        const msg: any = {
            from: message.from,
            content: message.content
        }
        return await this.messageModel.findOneAndUpdate( { members: members }, { $push: { messages: msg } }, { upsert: true } );
    }

    async getMessage(username, partner) {
        const members = [username, partner].sort();
        const msg = await this.messageModel.findOne( { members: members } );
        if (!msg) {
            return await this.messageModel.create( { members: members } )
                    .then(res => res.messages);
        }
        return msg.messages;
    }

}
