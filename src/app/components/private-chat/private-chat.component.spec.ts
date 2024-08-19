import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivateChatComponent } from './private-chat.component';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('PrivateChatComponent', () => {
  let component: PrivateChatComponent;
  let fixture: ComponentFixture<PrivateChatComponent>;
  let chatService: jasmine.SpyObj<ChatService>;
  let authService: jasmine.SpyObj<AuthService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<PrivateChatComponent>>;

  beforeEach(async () => {
    const chatServiceSpy = jasmine.createSpyObj('ChatService', ['sendPrivateMess', 'stopPrivateChat']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserName']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [PrivateChatComponent],
      providers: [
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { receiver: 'testReceiver' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PrivateChatComponent);
    component = fixture.componentInstance;
    chatService = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<PrivateChatComponent>>;

    authService.getUserName.and.returnValue('testUser');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loggedInUsername and receiver on ngOnInit', () => {
    component.ngOnInit();
    expect(component.loggedInUsername).toBe('testUser');
    expect(component.receiver).toBe('testReceiver');
  });

  it('should call chatService.sendPrivateMess on sendMessage', () => {
    component.messageText = 'Hello!';
    component.sendMessage();
    expect(chatService.sendPrivateMess).toHaveBeenCalledWith('testReceiver', 'Hello!');
    expect(component.messageText).toBe('');
  });

  it('should call chatService.stopPrivateChat on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(chatService.stopPrivateChat).toHaveBeenCalledWith('testReceiver');
  });

  it('should close the dialog on onClose', () => {
    component.onClose();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
