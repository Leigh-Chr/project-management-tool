import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthController } from '../services/mock/backend/auth.controller';
import { ProjectController } from '../services/mock/backend/project.controller';
import { ProjectMemberController } from '../services/mock/backend/project-member.controller';
import { TaskController } from '../services/mock/backend/task.controller';
import { UserController } from '../services/mock/backend/user.controller';
import { StatusController } from '../services/mock/backend/status.controller';
import { RoleController } from '../services/mock/backend/role.controller';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  // Vérifier si on utilise le mock (URL commence par /api)
  if (!req.url.startsWith('/api')) {
    return next(req);
  }

  const authController = inject(AuthController);
  const projectController = inject(ProjectController);
  const projectMemberController = inject(ProjectMemberController);
  const taskController = inject(TaskController);
  const userController = inject(UserController);
  const statusController = inject(StatusController);
  const roleController = inject(RoleController);

  const url = req.url;
  const method = req.method;

  // Auth endpoints
  if (url.includes('/auth/login')) {
    return from(authController.login(req.body)).pipe(
      map(data => new HttpResponse({ body: data }))
    );
  }
  if (url.includes('/auth/register')) {
    return from(authController.register(req.body)).pipe(
      map(data => new HttpResponse({ body: data }))
    );
  }
  if (url.includes('/auth/logout')) {
    return of(new HttpResponse({ body: { message: 'Logged out successfully' } }));
  }

  // User endpoints
  if (url.includes('/users') && method === 'GET') {
    return userController.getUsers().pipe(
      map(data => new HttpResponse({ body: data }))
    );
  }

  // Project endpoints
  if (url.includes('/projects') && method === 'GET') {
    if (url.includes('/details')) {
      const projectId = parseInt(url.split('/')[3]);
      return projectController.getProjectDetails(projectId).pipe(
        map(data => new HttpResponse({ body: data }))
      );
    }
    if (url.includes('/members')) {
      const projectId = parseInt(url.split('/')[3]);
      return projectMemberController.getProjectMembers(projectId).pipe(
        map(data => new HttpResponse({ body: data }))
      );
    }
    const projectId = parseInt(url.split('/')[3]);
    if (projectId) {
      return projectController.getProject(projectId).pipe(
        map(data => new HttpResponse({ body: data }))
      );
    }
    return projectController.getProjects().pipe(
      map(data => new HttpResponse({ body: data }))
    );
  }
  if (url.includes('/projects') && method === 'POST') {
    return projectController.postProject(req.body).pipe(
      map(data => new HttpResponse({ body: data }))
    );
  }
  if (url.includes('/projects') && method === 'DELETE') {
    const projectId = parseInt(url.split('/')[3]);
    return projectController.deleteProject(projectId).pipe(
      map(data => new HttpResponse({ body: data }))
    );
  }

  // Project members endpoints
  if (url.includes('/projects') && url.includes('/members')) {
    if (method === 'POST') {
      return projectMemberController.postProjectMember(
        req.body.projectId, 
        req.body.userId, 
        req.body.roleId
      ).pipe(
        map(data => new HttpResponse({ body: data }))
      );
    }
    if (method === 'DELETE') {
      const memberId = parseInt(url.split('/')[4]);
      return projectMemberController.deleteProjectMember(memberId).pipe(
        map(data => new HttpResponse({ body: data }))
      );
    }
  }

  // Task endpoints
  if (url.includes('/tasks') && method === 'GET') {
    if (url.includes('/details')) {
      const taskId = parseInt(url.split('/')[3]);
      return taskController.getTaskDetails(taskId).pipe(
        map(data => new HttpResponse({ body: data }))
      );
    }
    const taskId = parseInt(url.split('/')[3]);
    if (taskId) {
      return taskController.getTask(taskId).pipe(
        map(data => new HttpResponse({ body: data }))
      );
    }
    return taskController.getTasks().pipe(
      map(data => new HttpResponse({ body: data }))
    );
  }
  if (url.includes('/tasks') && method === 'POST') {
    return taskController.addTask(req.body).pipe(
      map(data => new HttpResponse({ body: data }))
    );
  }
  if (url.includes('/tasks') && method === 'PATCH') {
    const taskId = parseInt(url.split('/')[3]);
    return taskController.patchTask(taskId, req.body).pipe(
      map(data => new HttpResponse({ body: data }))
    );
  }
  if (url.includes('/tasks') && method === 'DELETE') {
    const taskId = parseInt(url.split('/')[3]);
    return taskController.deleteTask(taskId).pipe(
      map(data => new HttpResponse({ body: data }))
    );
  }

  // Status endpoints
  if (url.includes('/statuses') && method === 'GET') {
    return statusController.getStatuses().pipe(
      map(data => new HttpResponse({ body: data }))
    );
  }

  // Role endpoints
  if (url.includes('/roles') && method === 'GET') {
    return roleController.getRoles().pipe(
      map(data => new HttpResponse({ body: data }))
    );
  }

  // If no mock endpoint matches, continue with the original request
  return next(req);
};
