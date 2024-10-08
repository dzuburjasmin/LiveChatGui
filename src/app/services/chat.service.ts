import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { Message } from '../models/message.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { PrivateChatComponent } from '../components/private-chat/private-chat.component';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection! : HubConnection;
  onlineUsers : string[]=[];
  messages: Message[]=[];
  privateMessages: Message[]=[];
  privateChatStarted: boolean = false;
  token: any = "";

  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private dialog: MatDialog) {
      this.token = localStorage.getItem('token');
   }
  
  createChat(){
    this.hubConnection = new HubConnectionBuilder().configureLogging(LogLevel.Debug).withUrl(baseUrl+"/hubs",{withCredentials:true,accessTokenFactory: () => this.token }).withAutomaticReconnect().build();
    this.hubConnection.start().catch(error=>{console.log(error)});

    this.hubConnection.on("Connected", ()=>{
      console.log("Connected !");
      this.addUserConnectionId();
    });

    this.hubConnection.on("OnlineUsers", (onlineUsers)=>{
      console.log("Online Users !");
      this.onlineUsers = [...onlineUsers];
    });

    this.hubConnection.on("MessageHistory", (messageHistory)=>{
      console.log("Message History !");
      this.messages = [...messageHistory];
    });

    this.hubConnection.on("NewMessage", (message: Message)=>{
      console.log("New Message !");
      this.messages = [message, ...this.messages]
    });

    this.hubConnection.on("OpenPrivateChat", (message: Message)=>{
      console.log("Open Private !");
      this.privateMessages = [message, ...this.privateMessages];
      this.privateChatStarted = true;
      this.openPrivateChat(message.user);
    });

    this.hubConnection.on("NewPrivateMessage", (message: Message)=>{
      console.log("New private message !");
      this.privateMessages = [message, ...this.privateMessages]
    });

    this.hubConnection.on("ClosePrivateChat", ()=>{
      this.privateChatStarted = false;
      this.privateMessages=[];
    });

    this.hubConnection.on("MessageLimitReached", ()=>{
      alert("Message limit reached, please wait...")
    });
  }

  stopChat(){
    this.hubConnection.stop().catch(error=>{console.log(error)});
  }
  async addUserConnectionId(){
    return this.hubConnection?.invoke("AddUserConnectionId", this.authService.getUserName()).catch(error=>{
      console.log(error);
    })
  }
  async sendMessage(text: string){
    var message: Message = {
      user: this.authService.getUserName(),
      text : text,
      dateTime: new Date()
    }
    return this.hubConnection?.invoke("ReceiveMessage",message).catch(error=>{
      console.log(error);
    })
  }
  async stopPrivateChat(otherUser: string){
    return this.hubConnection?.invoke("RemovePrivateChat", this.authService.getUserName(), otherUser).catch(error=>{
      console.log(error);
    })
  }
  async sendPrivateMess(receiver: string, text: string){
    var message: Message = {
      user: this.authService.getUserName(),
      text : text,
      dateTime: new Date(),
      receiver: receiver
    }
    if(this.privateChatStarted==false){
      this.privateChatStarted=true;
    return this.hubConnection?.invoke("CreatePrivateChat", message).then(()=>{

      this.privateMessages=[...this.privateMessages, message];
    }).catch(error=>{
      console.log(error);
    })
  }else{
    return this.hubConnection?.invoke("ReceivePrivate", message).catch(error=>{
      console.log(error);
    })
  }
  }
  async logoutUser(){
    return this.hubConnection?.invoke("logoutUser").catch(error=>{
      console.log(error);
    })
  }

  openPrivateChat(receiver?: string){
    const dialogRef = this.dialog.open(PrivateChatComponent, {
      width: '500px',
      data :{
        receiver : receiver}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
