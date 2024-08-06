import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const baseUrl = 'http://localhost:5115/api/Message';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedSubject$: BehaviorSubject<boolean>;
  public testReturnObjTrue: any = {
    "result":true,
    "token": "blablabla",
    "message": "Successful"
  };
  public testReturnObjFalse: any = {
    "result":false,
    "token": null,
    "message": "Failed"
  };
  constructor(private http: HttpClient, private router: Router) {
    this.isAuthenticatedSubject$ = new BehaviorSubject<boolean>(true);
    this.isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();
   }

  startLogin(){
    this.router.navigate(['/login']);
  }
  login(): Observable<any>{
    debugger
    //return this.http.get(`${baseUrl}`); ovde ce ic fino metoda na api
    return of(this.testReturnObjTrue);
  }
}
