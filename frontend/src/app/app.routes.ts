import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectDetailsComponent } from './pages/projects/project-details.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { UnauthGuard } from './shared/guards/unauth.guard';
import { TaskDetailsComponent } from './pages/tasks/task-details.component';
export const routes: Routes = [
  {
    path: 'projects',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProjectsComponent },
      { path: ':id', component: ProjectDetailsComponent },
    ],
  },
  {
    path: 'tasks/:id',
    canActivate: [AuthGuard],
    component: TaskDetailsComponent,
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
