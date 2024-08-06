import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanLoad, CanActivate, OnDestroy {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(Router) private router: Router) {
    //debugger;

  }
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    return this.isAuthenticated(); //throw new Error('Method not implemented.');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return this.isAuthenticated();
  }
  
  // canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  //     return this.isAuthenticated();
  // }

  isAuthenticated() {
    return this.authService.isAuthenticated$
      .pipe(
        tap(val => {
          if (val == false) {
            this.authService.startLogin();
          }
        })
      );
  }

  ngOnDestroy(): void {
    console.info("LoggedinGuard", "ngOnDestroy");
  }
}
