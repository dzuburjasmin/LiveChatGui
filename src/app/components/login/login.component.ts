import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { user } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userData: user = {};

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit(){
    debugger
    this.authService.login().subscribe((res: any)=>{
      debugger
      alert(res.message);
      if (res.result){
        this.router.navigate(['/chats']);
        localStorage.setItem('token',res.token);
      }
    }
    )
  }
}
