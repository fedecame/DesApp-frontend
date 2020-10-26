import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesappLoginComponent } from './desapp-login/desapp-login.component';
import { DesappNavLayoutComponent } from './desapp-nav-layout/desapp-nav-layout.component';
import { DesappPageNotFoundComponent } from './desapp-page-not-found/desapp-page-not-found.component';
import { DesappProfileComponent } from './desapp-profile/desapp-profile.component';
import { DesappProjectDetailComponent } from './desapp-project-detail/desapp-project-detail.component';
import { DesappProjectListsComponent } from './desapp-project-lists/desapp-project-lists.component';
import { DesappRegisterComponent } from './desapp-register/desapp-register.component';

const routes: Routes = [
  {
    path: '',
    component: DesappNavLayoutComponent,
    children: [
      { path: 'home', component: DesappProjectListsComponent },
      { path: 'profile', component: DesappProfileComponent },
      { path: 'projects/:id', component: DesappProjectDetailComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: 'login', component: DesappLoginComponent },
  { path: 'register', component: DesappRegisterComponent },
  { path: '**', component: DesappPageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
