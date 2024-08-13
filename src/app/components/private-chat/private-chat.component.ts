import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.css']
})
export class PrivateChatComponent implements OnInit, OnDestroy {
    user: string = "";
    receiver: string = "";

  loggedInUsername: string = "";
  messageText: string = "";

  constructor(public chatService: ChatService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedInUsername = this.authService.getUserName();
    var param = this.route.snapshot.paramMap.get('name');
    if(param){
      this.user = param;
    }
    var param = this.route.snapshot.paramMap.get('receiver');
    if(param){
      this.receiver = param;
    }
   }
   ngOnDestroy(): void {
     this.chatService.stopPrivateChat(this.receiver);
   }
   sendMessage(){
    this.chatService.sendPrivateMess(this.receiver, this.messageText);
    this.messageText = "";
   }
}
