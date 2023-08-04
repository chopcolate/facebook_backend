import { SubscribeMessage, MessageBody, WebSocketGateway, 
  WebSocketServer, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({ cors: true })
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private service: MessageService,
    private user_service: UsersService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit(server: any) {
    this.server = server;
  }
  @SubscribeMessage('sendOnlineList')
  async getOnlineList(@MessageBody() message: any, @ConnectedSocket() client: Socket) {
    const user = await this.user_service.getUserInfo(message);
    const contacts = user.contacts;
    const onlineList = await this.service.getOnline(contacts);
    this.server.to(client.id).emit('receiveOnlineList', onlineList);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() message: any, @ConnectedSocket() client: Socket) {
    const toSocketId = message.toSocketId;
    this.server.to(toSocketId).emit('receiveMessage', message);
    this.server.to(toSocketId).emit('receiveMessageChild', message);
    this.service.pushMessage(message);
  }

  @SubscribeMessage('sendRequestList')
  async getRequestList(@MessageBody() message: any, @ConnectedSocket() client: Socket) {
    const requestList: any = await this.user_service.getRequestList(message);
    this.server.to(client.id).emit('receiveRequestList', requestList);
  }

  @SubscribeMessage('sendNotiList')
  async getNotiList(@MessageBody() message: any, @ConnectedSocket() client: Socket) {
    const notiList: any = await this.user_service.getNotiList(message);
    this.server.to(client.id).emit('receiveNotiList', notiList);
  }

  async handleConnection(client: Socket) {
    const username = client.handshake.query.username;
    const user = await this.user_service.getUserInfo(username);
    const onlineList = await this.service.getOnline(user.contacts);
    this.service.setOnline(username, client.id);
    this.server.to(client.id).emit('receiveOnlineList', onlineList);
    console.log("Connected to Server", client.id)
  }

  handleDisconnect(client: Socket) {
    this.service.offline(client.id);
    console.log("Disconnected from Server", client.id)
  }
}
