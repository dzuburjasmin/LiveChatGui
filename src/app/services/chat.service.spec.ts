import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
import { PrivateChatComponent } from '../components/private-chat/private-chat.component';
import { Message } from '../models/message.model';
import { environment } from 'src/environments/environment';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let hubConnection: jasmine.SpyObj<HubConnection>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserName']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const hubConnectionSpy = jasmine.createSpyObj('HubConnection', ['start', 'stop', 'invoke', 'on', 'off']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChatService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: HubConnection, useValue: hubConnectionSpy }
      ]
    });

    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    hubConnection = TestBed.inject(HubConnection) as jasmine.SpyObj<HubConnection>;

    authService.getUserName.and.returnValue('testUser');
    hubConnection.invoke.and.returnValue(Promise.resolve());
    hubConnection.on.and.callFake((event: string, callback: Function) => {
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#createChat', () => {
    it('should initialize the hub connection and set up event handlers', () => {
      const hubConnectionBuilderSpy = jasmine.createSpyObj('HubConnectionBuilder', ['configureLogging', 'withUrl', 'withAutomaticReconnect', 'build']);
      hubConnectionBuilderSpy.build.and.returnValue(hubConnection);

      spyOn((HubConnectionBuilder as any), 'new').and.returnValue(hubConnectionBuilderSpy);

      service.createChat();

      expect(hubConnectionBuilderSpy.configureLogging).toHaveBeenCalledWith(LogLevel.Debug);
      expect(hubConnectionBuilderSpy.withUrl).toHaveBeenCalledWith(`${environment.baseUrl}/hubs`, jasmine.any(Object));
      expect(hubConnectionBuilderSpy.withAutomaticReconnect).toHaveBeenCalled();
      expect(hubConnectionBuilderSpy.build).toHaveBeenCalled();
      expect(hubConnection.start).toHaveBeenCalled();
    });
  });

  describe('#stopChat', () => {
    it('should stop the hub connection', () => {
      service.stopChat();
      expect(hubConnection.stop).toHaveBeenCalled();
    });
  });

  describe('#addUserConnectionId', () => {
    it('should invoke AddUserConnectionId on the hub connection', async () => {
      await service.addUserConnectionId();
      expect(hubConnection.invoke).toHaveBeenCalledWith('AddUserConnectionId', 'testUser');
    });

    it('should handle errors', async () => {
      hubConnection.invoke.and.returnValue(Promise.reject('error'));
      await service.addUserConnectionId();
      expect(hubConnection.invoke).toHaveBeenCalled();
    });
  });

  describe('#sendMessage', () => {
    it('should invoke ReceiveMessage on the hub connection', async () => {
      const message: Message = { user: 'testUser', text: 'Hello', dateTime: new Date() };
      await service.sendMessage('Hello');
      expect(hubConnection.invoke).toHaveBeenCalledWith('ReceiveMessage', message);
    });

    it('should handle errors', async () => {
      hubConnection.invoke.and.returnValue(Promise.reject('error'));
      await service.sendMessage('Hello');
      expect(hubConnection.invoke).toHaveBeenCalled();
    });
  });

  describe('#stopPrivateChat', () => {
    it('should invoke RemovePrivateChat on the hub connection', async () => {
      await service.stopPrivateChat('otherUser');
      expect(hubConnection.invoke).toHaveBeenCalledWith('RemovePrivateChat', 'testUser', 'otherUser');
    });

    it('should handle errors', async () => {
      hubConnection.invoke.and.returnValue(Promise.reject('error'));
      await service.stopPrivateChat('otherUser');
      expect(hubConnection.invoke).toHaveBeenCalled();
    });
  });

  describe('#sendPrivateMess', () => {
    it('should invoke CreatePrivateChat when private chat is not started', async () => {
      service.privateChatStarted = false;
      const message: Message = { user: 'testUser', text: 'Hello', dateTime: new Date(), receiver: 'otherUser' };

      await service.sendPrivateMess('otherUser', 'Hello');
      expect(hubConnection.invoke).toHaveBeenCalledWith('CreatePrivateChat', message);
    });

    it('should invoke ReceivePrivate when private chat is started', async () => {
      service.privateChatStarted = true;
      const message: Message = { user: 'testUser', text: 'Hello', dateTime: new Date(), receiver: 'otherUser' };

      await service.sendPrivateMess('otherUser', 'Hello');
      expect(hubConnection.invoke).toHaveBeenCalledWith('ReceivePrivate', message);
    });

    it('should handle errors', async () => {
      hubConnection.invoke.and.returnValue(Promise.reject('error'));
      await service.sendPrivateMess('otherUser', 'Hello');
      expect(hubConnection.invoke).toHaveBeenCalled();
    });
  });

  describe('#logoutUser', () => {
    it('should invoke logoutUser on the hub connection', async () => {
      await service.logoutUser();
      expect(hubConnection.invoke).toHaveBeenCalledWith('logoutUser');
    });

    it('should handle errors', async () => {
      hubConnection.invoke.and.returnValue(Promise.reject('error'));
      await service.logoutUser();
      expect(hubConnection.invoke).toHaveBeenCalled();
    });
  });

  describe('#openPrivateChat', () => {
    it('should open PrivateChatComponent dialog', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialog.open.and.returnValue(dialogRefSpy);

      service.openPrivateChat('receiver');
      expect(dialog.open).toHaveBeenCalledWith(PrivateChatComponent, {
        width: '500px',
        data: { receiver: 'receiver' }
      });
    });
  });
});
