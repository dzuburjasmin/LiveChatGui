import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageDetailsComponent } from './message-details.component';
import { AuthService } from 'src/app/services/auth.service';
import { Message } from 'src/app/models/message.model';

describe('MessageDetailsComponent', () => {
  let component: MessageDetailsComponent;
  let fixture: ComponentFixture<MessageDetailsComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserName']);

    await TestBed.configureTestingModule({
      declarations: [MessageDetailsComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageDetailsComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    authService.getUserName.and.returnValue('testUser');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set loggedInUserName on ngOnInit', () => {
    component.ngOnInit();
    expect(component.loggedInUserName).toBe('testUser');
  });

  it('should initialize messageData input correctly', () => {
    const testMessage: Message = { text: 'Hello World', user: 'user1', dateTime: new Date() };
    component.messageData = testMessage;
    fixture.detectChanges();
    expect(component.messageData).toEqual(testMessage);
  });
});
