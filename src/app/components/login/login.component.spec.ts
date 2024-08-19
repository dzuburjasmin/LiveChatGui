import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.signupForm).toBeDefined();
  });

  describe('Login Form', () => {
    it('should be invalid if empty', () => {
      component.loginForm.controls['userName'].setValue('');
      component.loginForm.controls['password'].setValue('');
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should call authService.login on valid form submission', () => {
      const mockResponse = { token: 'test-token' };
      authService.login.and.returnValue(of(mockResponse));
      component.loginForm.controls['userName'].setValue('testUser');
      component.loginForm.controls['password'].setValue('Test1234!');
      component.onLogin();
      expect(authService.login).toHaveBeenCalledWith(component.loginForm.value);
      expect(router.navigate).toHaveBeenCalledWith(['chat']);
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('should handle login errors', () => {
      authService.login.and.returnValue(throwError({ error: 'Login failed' }));
      component.loginForm.controls['userName'].setValue('testUser');
      component.loginForm.controls['password'].setValue('Test1234!');
      component.onLogin();
      expect(component.loginErrorMessages).toContain('Login failed');
    });
  });

  describe('Signup Form', () => {
    it('should be invalid if empty', () => {
      component.signupForm.controls['userName'].setValue('');
      component.signupForm.controls['password'].setValue('');
      component.signupForm.controls['name'].setValue('');
      expect(component.signupForm.valid).toBeFalsy();
    });

    it('should call authService.register on valid form submission', () => {
      authService.register.and.returnValue(of({}));
      component.signupForm.controls['userName'].setValue('testUser');
      component.signupForm.controls['password'].setValue('Test1234!');
      component.signupForm.controls['name'].setValue('Test Name');
      component.onRegister();
      expect(authService.register).toHaveBeenCalledWith(component.signupForm.value);
      expect(component.registerSuccessful).toBeTrue();
    });

    it('should handle registration errors', () => {
      authService.register.and.returnValue(throwError({ error: 'Registration failed' }));
      component.signupForm.controls['userName'].setValue('testUser');
      component.signupForm.controls['password'].setValue('Test1234!');
      component.signupForm.controls['name'].setValue('Test Name');
      component.onRegister();
      expect(component.registerErrorMessages).toContain('Registration failed');
    });
  });

  describe('Form Validations', () => {
    it('should validate capital letter and non-alphanumeric in password', () => {
      const validatorFn = component.capitalLetterAndNonAlphanumericValidator();
      const control = component.loginForm.controls['password'];
      control.setValue('test');
      expect(validatorFn(control)).toEqual({ capitalLetterAndNonAlphanumeric: true });
      control.setValue('Test1234!');
      expect(validatorFn(control)).toBeNull();
    });
  });

  describe('Toggle Login/Signup', () => {
    it('should toggle showLogin property', () => {
      component.toggleisLogin(true);
      expect(component.showLogin).toBeTrue();
      component.toggleisLogin(false);
      expect(component.showLogin).toBeFalse();
    });
  });
});
