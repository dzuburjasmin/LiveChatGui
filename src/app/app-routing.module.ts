import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatDetailsComponent } from './components/chat-details/chat-details.component';
import { PrivateChatComponent } from './components/private-chat/private-chat.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthenticatedGuard } from './services/guards/authenticated.guard';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: '', 
    redirectTo: 'chat', 
    pathMatch: 
    'full' 
  },
  {
    path : '',
    component: LayoutComponent,
    children:[
      { 
        path: 'chats', component: ChatListComponent 
      },
      // { 
      //   path: 'chat/:id', component: ChatDetailsComponent 
      // },
      { 
        path: 'chat', component: ChatDetailsComponent 
      }
    ],
    canActivate: [AuthenticatedGuard]
    ,canActivateChild: [AuthenticatedGuard]
  },
  { 
    path: '**', 
    component: LayoutComponent 
  },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
