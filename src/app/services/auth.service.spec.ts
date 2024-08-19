import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let jwtHelper: jasmine.SpyObj<JwtHelperService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const jwtHelperSpy = jasmine.createSpyObj('JwtHelperService', ['isTokenExpired', 'decodeToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: JwtHelperService, useValue: jwtHelperSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    jwtHelper = TestBed.inject(JwtHelperService) as jasmine.SpyObj<JwtHelperService>;

    jwtHelper.decodeToken.and.returnValue({ sub: 'testUser' });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#register', () => {
    it('should send a POST request to the register endpoint', () => {
      const model = { userName: 'testUser', password: 'testPass' };
      const mockResponse = { success: true };

      service.register(model).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/api/Token/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('#login', () => {
    it('should send a POST request to the login endpoint and return a token', () => {
      const model = { userName: 'testUser', password: 'testPass' };
      const mockResponse = { token: 'test-token' };

      service.login(model).subscribe(response => {
        expect(response.token).toBe('test-token');
        expect(localStorage.getItem('token')).toBe('test-token');
      });

      const req = httpMock.expectOne(`${environment.baseUrl}/api/Token/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('#isAuthenticated', () => {
    it('should return true if the token is present and not expired', () => {
      localStorage.setItem('token', 'test-token');
      jwtHelper.isTokenExpired.and.returnValue(false);

      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false if the token is expired', () => {
      localStorage.setItem('token', 'test-token');
      jwtHelper.isTokenExpired.and.returnValue(true);

      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return false if no token is present', () => {
      localStorage.removeItem('token');

      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('#startLogin', () => {
    it('should navigate to the login page', () => {
      service.startLogin();
      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });
  });

  describe('#logout', () => {
    it('should clear the token and navigate to the login page', () => {
      localStorage.setItem('token', 'test-token');
      service.logout();
      expect(localStorage.getItem('token')).toBe('');
      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });
  });

  describe('#getUserName', () => {
    it('should return the username from the decoded token', () => {
      localStorage.setItem('token', 'test-token');
      expect(service.getUserName()).toBe('testUser');
    });

    it('should return undefined if token is not present', () => {
      localStorage.removeItem('token');
      expect(service.getUserName()).toBeUndefined();
    });
  });

});
