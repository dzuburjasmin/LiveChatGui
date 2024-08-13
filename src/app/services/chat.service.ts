import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Chat } from '../models/chat.model';
import { HttpTransportType, HubConnection, HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { Message } from '../models/message.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  getAll() {
    return this.http.get(baseUrl+"/api/Message",{withCredentials:true});
  }

  get(id: any): Observable<Chat> {
    return of({
      "id":1,
      "data":"test"
    })
  }

  createChat(){
    this.hubConnection = new HubConnectionBuilder().configureLogging(LogLevel.Debug).withUrl(baseUrl+"/hubs",{withCredentials:true}).withAutomaticReconnect().build();
    this.hubConnection.start().catch(error=>{console.log(error)});

    this.hubConnection.on("Connected", ()=>{
      console.log("Connected !");
      this.addUserConnectionId();
    });

    this.hubConnection.on("OnlineUsers", (onlineUsers)=>{
      console.log("Online Users !");
      this.onlineUsers = [...onlineUsers];
    });

    this.hubConnection.on("NewMessage", (message: Message)=>{
      console.log("New Message !");
      this.messages = [...this.messages, message]
    });

    this.hubConnection.on("CreatePrivateChat", (message: Message)=>{
      console.log("Open Private Chat !");
      this.privateMessages = [...this.privateMessages, message];
      this.privateChatStarted = true;
      this.router.navigate(["private", message.user+"-"+message.receiver]);
    });

    this.hubConnection.on("ReceivePrivate", (message: Message)=>{
      console.log("Receive private Message !");
      this.privateMessages = [...this.privateMessages, message]
    });

    this.hubConnection.on("RemovePrivateChat", ()=>{
      this.privateChatStarted = false;
      this.privateMessages=[];
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
      dateTime: new Date().toLocaleDateString()
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
      dateTime: new Date().toLocaleDateString(),
      receiver: receiver
    }
    if(this.privateChatStarted==false){
      this.privateChatStarted=true;
    return this.hubConnection?.invoke("CreatePrivateChat",message).then(()=>{
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
}
