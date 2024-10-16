import { inject, Injectable, signal } from '@angular/core';
import { DataMockService, Role } from './data-mock.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly dataMockService = inject(DataMockService);
  readonly rolesSignal = signal<Role[]>([]);

  constructor() {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.rolesSignal.set(this.getRoles());
  }

  private getRoles(): Role[] {
    return this.dataMockService.getRoles();
  }
}
