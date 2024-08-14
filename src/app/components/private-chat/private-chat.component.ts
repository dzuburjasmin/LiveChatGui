import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  constructor(
    public chatService: ChatService, 
    private route: ActivatedRoute, 
    private authService: AuthService, 
    private dialogRef: MatDialogRef<PrivateChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.loggedInUsername = this.authService.getUserName();
    this.receiver = this.data.receiver;
   }

   ngOnDestroy(): void {
     this.chatService.stopPrivateChat(this.receiver);
   }

   sendMessage(){
    this.chatService.sendPrivateMess(this.receiver, this.messageText);
    this.messageText = "";
   }

   onClose(): void {
    this.dialogRef.close();
  }
}
