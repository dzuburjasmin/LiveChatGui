import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from 'src/app/models/chat.model';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.css']
})
export class ChatDetailsComponent implements OnInit {

  currentChat: Chat = {
    title: '',
    description: '',
    published: false
  };

  public messages : Array<Message> = [];
  loggedInUsername: string = "";
  messageText: string = "";
  currentDate: string = new Date().toLocaleDateString();
  constructor(
    public chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.loggedInUsername = this.authService.getUserName();
    this.chatService.createChat(); 
      
  }

  sendMessage(){
    this.chatService.sendMessage(this.messageText);
    this.messageText = "";
  }

  openPrivateChat(receiver: string){
    this.router.navigate(['private',this.loggedInUsername, receiver])
  }
  

}
