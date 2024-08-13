import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.css']
})
export class MessageDetailsComponent implements OnInit {
  @Input() messageData: Message = {};
  loggedInUserName: string= "";
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  this.loggedInUserName=this.authService.getUserName();
  }


}
