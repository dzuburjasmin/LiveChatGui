import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { chat } from 'src/app/models/chat.model';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.css']
})
export class ChatDetailsComponent implements OnInit {

  currentChat: chat = {
    title: '',
    description: '',
    published: false
  };
  message = '';

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getChat(this.route.snapshot.params.id);
  }

  getChat(id: string): void {
    this.chatService.get(id)
      .subscribe(
        data => {
          this.currentChat = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updatePublished(status: boolean): void {
    const data = {
      title: this.currentChat.title,
      description: this.currentChat.description,
      published: status
    };

    this.message = '';

    this.chatService.update(this.currentChat.id, data)
      .subscribe(
        response => {
          this.currentChat.published = status;
          console.log(response);
          this.message = response.message ? response.message : 'The status was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  updateChat(): void {
    this.message = '';

    this.chatService.update(this.currentChat.id, this.currentChat)
      .subscribe(
        response => {
          console.log(response);
          this.message = response.message ? response.message : 'This chat was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  deleteChat(): void {
    this.chatService.delete(this.currentChat.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/chats']);
        },
        error => {
          console.log(error);
        });
  }

}
