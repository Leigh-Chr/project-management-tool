import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { RegisterComponent } from './pages/register/register.component';
import { TaskComponent } from './pages/tasks/task-details.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ProjectComponent } from './pages/projects/project-details.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { UnauthGuard } from './shared/guards/unauth.guard';

export const routes: Routes = [
  {
    path: 'tasks',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TasksComponent },
      { path: ':id', component: TaskComponent },
    ],
  },
  {
    path: 'projects',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProjectsComponent },
      { path: ':id', component: ProjectComponent },
    ],
  },
  { path: 'home', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [UnauthGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [UnauthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
