import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { RegisterComponent } from './pages/register/register.component';
import { TaskDetailsComponent } from './pages/tasks/task-details.component';
import { ProjectDetailsComponent } from './pages/projects/project-details.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { UnauthGuard } from './shared/guards/unauth.guard';

export const routes: Routes = [
  {
    path: 'tasks',
    canActivate: [AuthGuard],
    children: [
      { path: ':id', component: TaskDetailsComponent },
    ],
  },
  {
    path: 'projects',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProjectsComponent },
      { path: ':id', component: ProjectDetailsComponent },
    ],
  },
  { path: 'home', component: HomeComponent, canActivate: [UnauthGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [UnauthGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [UnauthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
