import { Component, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/chat.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

  chats?: Chat[];
  currentChat: Chat = {};
  currentIndex = -1;
  title = '';

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.retrieveChats();
  }

  retrieveChats(): void {
    this.chatService.getAll()
      .subscribe(
        data => {
          //this.chats = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrieveChats();
    this.currentChat = {};
    this.currentIndex = -1;
  }

  setActiveChat(chat: Chat, index: number): void {
    this.currentChat = chat;
    this.currentIndex = index;
  }


  // searchTitle(): void {
  //   this.currentChat = {};
  //   this.currentIndex = -1;

  //   this.chatService.findByTitle(this.title)
  //     .subscribe(
  //       data => {
  //         this.chats = data;
  //         console.log(data);
  //       },
  //       error => {
  //         console.log(error);
  //       });
  // }

}
