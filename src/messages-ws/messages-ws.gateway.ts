import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,

    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    // con esto obtenemos el token que nos envia el cliente por socket
    const token = client.handshake.headers.authentication as string;

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // Registrarmos al cliente recién conectado y mandamos la emisión
    // de su conexión
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite unicamente al cliente
    // client.emit('messages-from-server', {
    //   fullName: 'soy yo!',
    //   message: payload.message || 'nothing!',
    // });

    //! Emite a todos MENOS al cliente que lo envió
    // client.broadcast.emit('messages-from-server', {
    //   fullName: 'soy yo!',
    //   message: payload.message || 'nothing!',
    // });

    // Emite a TODOS los clientes
    this.wss.emit('messages-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'nothing!',
    });
  }
}
