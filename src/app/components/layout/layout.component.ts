import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private authService: AuthService, private chatService: ChatService) { }

  ngOnInit(): void {
  }

  onLogout(){
    this.chatService.logoutUser().then(()=>{
      this.authService.logout();
    })
  }

}
