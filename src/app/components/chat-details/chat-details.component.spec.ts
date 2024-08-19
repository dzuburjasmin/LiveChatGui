import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatDetailsComponent } from './chat-details.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';

describe('ChatDetailsComponent', () => {
  let component: ChatDetailsComponent;
  let fixture: ComponentFixture<ChatDetailsComponent>;
  let chatService: jasmine.SpyObj<ChatService>;
  let authService: jasmine.SpyObj<AuthService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const chatServiceSpy = jasmine.createSpyObj('ChatService', ['createChat', 'sendMessage']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserName']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ChatDetailsComponent],
      imports: [MatDialogModule, BrowserAnimationsModule],
      providers: [
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChatDetailsComponent);
    component = fixture.componentInstance;
    chatService = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    authService.getUserName.and.returnValue('testUser');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set loggedInUsername on init', () => {
    expect(component.loggedInUsername).toBe('testUser');
  });

  it('should call createChat on init', () => {
    expect(chatService.createChat).toHaveBeenCalled();
  });

  it('should send a message and clear the messageText', () => {
    component.messageText = 'Hello World';
    component.sendMessage();
    expect(chatService.sendMessage).toHaveBeenCalledWith('Hello World');
    expect(component.messageText).toBe('');
  });

  it('should open a private chat dialog', () => {
    const receiver = 'receiverUser';
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of('closed') });
    dialog.open.and.returnValue(dialogRefSpy);

    component.openPrivateChat(receiver);

    expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
      width: '500px',
      data: { receiver: receiver }
    });

    expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
  });
});
