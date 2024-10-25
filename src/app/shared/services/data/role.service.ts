import { inject, Injectable, signal } from '@angular/core';
import { backendMockService, Role } from '../backend-mock.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly backendMockService = inject(backendMockService);
  readonly rolesSignal = signal<Role[]>([]);

  constructor() {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.rolesSignal.set(this.getRoles());
  }

  private getRoles(): Role[] {
    return this.backendMockService.getRoles();
  }
}
