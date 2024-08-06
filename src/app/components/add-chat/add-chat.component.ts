import { Component, OnInit } from '@angular/core';
import { chat } from 'src/app/models/chat.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-add-chat',
  templateUrl: './add-chat.component.html',
  styleUrls: ['./add-chat.component.css']
})
export class AddChatComponent implements OnInit {

  chat: chat = {
    title: '',
    description: '',
    published: false
  };
  submitted = false;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

  saveChat(): void {
    const data = {
      title: this.chat.title,
      description: this.chat.description
    };

    this.chatService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

  newChat(): void {
    this.submitted = false;
    this.chat = {
      title: '',
      description: '',
      published: false
    };
  }

}
