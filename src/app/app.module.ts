import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatDetailsComponent } from './components/chat-details/chat-details.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MessageDetailsComponent } from './components/message-details/message-details.component';
import { JwtModule } from '@auth0/angular-jwt';
import { UserButtonPipe } from './pipes/userbutton.pipe';
import { PrivateChatComponent } from './components/private-chat/private-chat.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundComponent } from './components/not-found/not-found.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    PrivateChatComponent,
    ChatDetailsComponent,
    MessageDetailsComponent,
    ChatListComponent,
    LoginComponent,
    LayoutComponent,
    NotFoundComponent,
    UserButtonPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    NoopAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:5115'], // koji ce bit?
        disallowedRoutes: []
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
