import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
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
   register(model: any): Observable<any> {
    return this.http.post(`${baseUrl}/api/Token/register`, model);
  }

  login(model: any): Observable<any> {
    return this.http.post(`${baseUrl}/api/Token/login`, model);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }
  startLogin(){ //after not authorized just redirect - this is not the login method
    this.router.navigate(['login']);
  }
  // login(): Observable<any>{ //TESTNA METODA
  //   debugger
  //   //return this.http.get(`${baseUrl}`); ovde ce ic fino metoda na api
  //   return of(this.testReturnObjTrue);
  // }
  logout(){
    this.isAuthenticatedSubject$.next(false);
    localStorage.setItem("token","")
    this.router.navigate(["login"]);
  }
  getUserName() : string{
    var decoded_token = this.jwtHelper.decodeToken(this.retrieveFromStorage("token"));
    return decoded_token.sub;
  }
  private retrieveFromStorage(key: string): any {
    var item = localStorage.getItem(key);
    if (item && item !== 'undefined') {
        return item;
    }
    return null;
}
}
