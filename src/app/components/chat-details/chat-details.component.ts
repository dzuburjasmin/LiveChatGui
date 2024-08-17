import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PrivateChatComponent } from '../private-chat/private-chat.component';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.css']
})
export class ChatDetailsComponent implements OnInit {

  public messages : Array<Message> = [];
  loggedInUsername: string = "";
  messageText: string = "";
  currentDate: string = new Date().toLocaleDateString();
  constructor(
    public chatService: ChatService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loggedInUsername = this.authService.getUserName();
    this.chatService.createChat(); 
  }

  sendMessage(){
    this.chatService.sendMessage(this.messageText);
    this.messageText = "";
  }

  openPrivateChat(receiver: string){
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
