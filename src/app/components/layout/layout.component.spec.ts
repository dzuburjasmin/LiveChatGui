import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let chatService: jasmine.SpyObj<ChatService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const chatServiceSpy = jasmine.createSpyObj('ChatService', ['logoutUser']);

    await TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    chatService = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call chatService.logoutUser and authService.logout on onLogout', async () => {
    chatService.logoutUser.and.returnValue(Promise.resolve());

    await component.onLogout();

    expect(chatService.logoutUser).toHaveBeenCalled();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should not call authService.logout if chatService.logoutUser fails', async () => {
    chatService.logoutUser.and.returnValue(Promise.reject('Logout failed'));

    try {
      await component.onLogout();
    } catch (error) {
      expect(chatService.logoutUser).toHaveBeenCalled();
      expect(authService.logout).not.toHaveBeenCalled();
    }
  });
});
