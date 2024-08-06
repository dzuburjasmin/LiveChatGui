import { Component, OnInit } from '@angular/core';
import { chat } from 'src/app/models/chat.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  chats?: chat[];
  currentChat: chat = {};
  currentIndex = -1;
  title = '';

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

 
}
