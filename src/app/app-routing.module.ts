import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatDetailsComponent } from './components/chat-details/chat-details.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthenticatedGuard } from './services/guards/authenticated.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';

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
        path: 'chat', component: ChatDetailsComponent 
      }
    ],
    canActivate: [AuthenticatedGuard]
    ,canActivateChild: [AuthenticatedGuard]
  },
  { 
    path: '**', 
    component: NotFoundComponent 
  },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
