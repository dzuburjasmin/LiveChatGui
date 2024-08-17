import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});
  signupForm: FormGroup = new FormGroup({});
  logInSubmitted: boolean = false;
  registerSubmitted: boolean = false;
  loginErrorMessages: string[]=[];
  registerErrorMessages: string[]=[];
  registerSuccessful:boolean = false;
  showLogin: boolean = true;
  userData: User = {  };
  test:any;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForms();
  }
  
  initForms(){
    this.loginForm=this.formBuilder.group({
      userName: ["", [Validators.required, Validators.maxLength(20)]],
      password: ["", [Validators.required, Validators.maxLength(20), Validators.minLength(8), this.capitalLetterAndNonAlphanumericValidator()]],
    });
    this.signupForm=this.formBuilder.group({
      userName: ["", [Validators.required, Validators.maxLength(20)]],
      password: ["", [Validators.required, Validators.maxLength(20), Validators.minLength(8), this.capitalLetterAndNonAlphanumericValidator()]],
      name: ["", [Validators.required, Validators.maxLength(20)]]
    });
    
  }

  onLogin(){

    this.logInSubmitted=true;
    if (this.loginForm.valid){
    this.authService.login(this.loginForm.value).subscribe((res: any)=>{
      if (res.token){
        this.router.navigate(['chat']);
        localStorage.setItem('token',res.token);
      }else{
        this.loginErrorMessages.push("Login unsuccessful!");
        setTimeout(() => {
          this.loginErrorMessages = [];
        }, 3000);
      }
    this.loginForm.reset();
    this.logInSubmitted = false;
    },
    (err:any)=>{
      this.loginErrorMessages.push(err.error);
      setTimeout(() => {
        this.loginErrorMessages = [];
      }, 3000);
    }) 
  }
  }

  onRegister(){

    this.registerSubmitted=true;

    if (this.signupForm.valid){
    this.authService.register(this.signupForm.value).subscribe((res:any)=>{
      this.signupForm.reset();
      this.registerSubmitted=false;
      this.registerSuccessful=true;
      setTimeout(() => {
        this.registerSuccessful = false;
      }, 3000);
    },
    (err:any)=>{
      console.log(err);
      this.registerErrorMessages.push(err.error);
      setTimeout(() => {
        this.registerErrorMessages = [];
      }, 3000);
    })
  }
  }
  capitalLetterAndNonAlphanumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // 
      }  
      const hasCapitalLetter = /[A-Z]/.test(control.value);
      const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(control.value);
  
      if (!hasCapitalLetter || !hasNonAlphanumeric) {
        return { capitalLetterAndNonAlphanumeric: true };
      }
  
      return null;
    };
  }

  toggleisLogin(login: boolean){
    if(login==true){
      this.showLogin = true;
    }else{
      this.showLogin = false;
    }
  }
}
